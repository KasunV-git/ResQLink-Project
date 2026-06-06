/**
 * ResQLink — Database Migration Script (v1 → v2)
 *
 * Safe to run multiple times (idempotent).
 * Each migration step is recorded in _migrations; already-run steps are skipped.
 * Wraps each step in its own try/catch so one failure doesn't block later steps.
 *
 * Run:  node src/database/migrate.js
 */

'use strict';

const path  = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// ── helpers ──────────────────────────────────────────────────────────────────

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = ?
       AND COLUMN_NAME  = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

async function indexExists(conn, table, indexName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = ?
       AND INDEX_NAME   = ?`,
    [table, indexName]
  );
  return rows[0].cnt > 0;
}

async function constraintExists(conn, table, constraintName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA     = DATABASE()
       AND TABLE_NAME        = ?
       AND CONSTRAINT_NAME   = ?`,
    [table, constraintName]
  );
  return rows[0].cnt > 0;
}

async function columnType(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COLUMN_TYPE
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = ?
       AND COLUMN_NAME  = ?`,
    [table, column]
  );
  return rows.length > 0 ? rows[0].COLUMN_TYPE.toLowerCase() : null;
}

async function migrationDone(conn, name) {
  const [rows] = await conn.query(
    'SELECT id FROM _migrations WHERE name = ?', [name]
  );
  return rows.length > 0;
}

async function recordMigration(conn, name) {
  await conn.query(
    'INSERT IGNORE INTO _migrations (name) VALUES (?)', [name]
  );
}

/**
 * Parse alert time strings like "Apr 3, 03:00 PM" into a MySQL DATETIME string.
 * Falls back to the row's created_at when parsing fails.
 */
function parseAlertTime(timeStr, fallback) {
  if (!timeStr) return fallback;
  try {
    // Append current year so JS Date can parse "Apr 3, 03:00 PM"
    const year = new Date().getFullYear();
    const d = new Date(`${timeStr} ${year}`);
    if (isNaN(d.getTime())) return fallback;
    // Return as MySQL DATETIME string YYYY-MM-DD HH:MM:SS
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  } catch {
    return fallback;
  }
}

// ── migration steps ───────────────────────────────────────────────────────────

async function step01_migrations_table(conn) {
  const name = '01_create_migrations_table';
  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id     INT          NOT NULL AUTO_INCREMENT,
      name   VARCHAR(255) NOT NULL,
      run_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_migrations_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step02_users_updated_at(conn) {
  const name = '02_users_add_updated_at';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'users', 'updated_at')) {
    await conn.query(`
      ALTER TABLE users
        ADD COLUMN updated_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          AFTER created_at
    `);
    console.log(`  ✅ ${name}`);
  } else {
    console.log(`  ⏭  ${name} (column already exists)`);
  }
  await recordMigration(conn, name);
}

async function step03_users_role_enum(conn) {
  const name = '03_users_role_to_enum';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  // Sanitize any unexpected values before applying ENUM constraint
  await conn.query(`
    UPDATE users
       SET role = 'Volunteer'
     WHERE role NOT IN ('Volunteer','Citizen','Administrator')
  `);

  const type = await columnType(conn, 'users', 'role');
  if (type && !type.startsWith('enum')) {
    await conn.query(`
      ALTER TABLE users
        MODIFY COLUMN role
          ENUM('Volunteer','Citizen','Administrator')
          NOT NULL DEFAULT 'Volunteer'
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step04_users_indexes(conn) {
  const name = '04_users_add_indexes';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await indexExists(conn, 'users', 'idx_users_role')) {
    await conn.query('ALTER TABLE users ADD INDEX idx_users_role (role)');
  }
  if (!await indexExists(conn, 'users', 'idx_users_avail')) {
    await conn.query('ALTER TABLE users ADD INDEX idx_users_avail (is_available)');
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step05_skills_columns(conn) {
  const name = '05_skills_add_created_at_narrow_name';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'skills', 'created_at')) {
    await conn.query(`
      ALTER TABLE skills
        ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
  }

  // Narrow name column from VARCHAR(255) → VARCHAR(100) only if no existing value exceeds 100 chars
  const [overflow] = await conn.query(
    'SELECT COUNT(*) AS cnt FROM skills WHERE CHAR_LENGTH(name) > 100'
  );
  if (overflow[0].cnt === 0) {
    const type = await columnType(conn, 'skills', 'name');
    if (type && type !== 'varchar(100)') {
      await conn.query(`
        ALTER TABLE skills MODIFY COLUMN name VARCHAR(100) NOT NULL
      `);
    }
  } else {
    console.log(`  ⚠️  ${name}: skipped name narrowing — ${overflow[0].cnt} skill(s) exceed 100 chars`);
  }

  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step06_user_skills_assigned_at(conn) {
  const name = '06_user_skills_add_assigned_at';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'user_skills', 'assigned_at')) {
    await conn.query(`
      ALTER TABLE user_skills
        ADD COLUMN assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step07_user_skills_indexes(conn) {
  const name = '07_user_skills_explicit_indexes';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  // MySQL automatically creates an index for FK columns if one does not exist,
  // but we want named indexes for observability.
  if (!await indexExists(conn, 'user_skills', 'idx_user_skills_user_id')) {
    await conn.query('ALTER TABLE user_skills ADD INDEX idx_user_skills_user_id (user_id)');
  }
  if (!await indexExists(conn, 'user_skills', 'idx_user_skills_skill_id')) {
    await conn.query('ALTER TABLE user_skills ADD INDEX idx_user_skills_skill_id (skill_id)');
  }

  // Add named FK constraints if unnamed defaults exist
  if (!await constraintExists(conn, 'user_skills', 'fk_us_user')) {
    // Drop any anonymous FK on user_id first — MySQL requires a name to drop
    // We detect unnamed FKs by checking REFERENTIAL_CONSTRAINTS
    const [fks] = await conn.query(`
      SELECT CONSTRAINT_NAME
        FROM information_schema.REFERENTIAL_CONSTRAINTS
       WHERE CONSTRAINT_SCHEMA = DATABASE()
         AND TABLE_NAME        = 'user_skills'
         AND REFERENCED_TABLE_NAME = 'users'
    `);
    for (const fk of fks) {
      await conn.query(`ALTER TABLE user_skills DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
    }
    await conn.query(`
      ALTER TABLE user_skills
        ADD CONSTRAINT fk_us_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  if (!await constraintExists(conn, 'user_skills', 'fk_us_skill')) {
    const [fks] = await conn.query(`
      SELECT CONSTRAINT_NAME
        FROM information_schema.REFERENTIAL_CONSTRAINTS
       WHERE CONSTRAINT_SCHEMA = DATABASE()
         AND TABLE_NAME        = 'user_skills'
         AND REFERENCED_TABLE_NAME = 'skills'
    `);
    for (const fk of fks) {
      await conn.query(`ALTER TABLE user_skills DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
    }
    await conn.query(`
      ALTER TABLE user_skills
        ADD CONSTRAINT fk_us_skill
          FOREIGN KEY (skill_id) REFERENCES skills(id)
          ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step08_alerts_datetime(conn) {
  const name = '08_alerts_time_varchar_to_datetime';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  const hasOldCol  = await columnExists(conn, 'alerts', 'time');
  const hasNewCol  = await columnExists(conn, 'alerts', 'alert_time');

  // Add the new DATETIME column if missing
  if (!hasNewCol) {
    await conn.query(`
      ALTER TABLE alerts
        ADD COLUMN alert_time DATETIME NULL
          AFTER source
    `);
  }

  // Backfill alert_time from old VARCHAR `time` column
  if (hasOldCol) {
    const [rows] = await conn.query(
      'SELECT id, time, created_at FROM alerts WHERE alert_time IS NULL'
    );
    for (const row of rows) {
      const fallback = row.created_at
        ? row.created_at.toISOString().replace('T', ' ').slice(0, 19)
        : new Date().toISOString().replace('T', ' ').slice(0, 19);
      const parsed = parseAlertTime(row.time, fallback);
      await conn.query('UPDATE alerts SET alert_time = ? WHERE id = ?', [parsed, row.id]);
    }
    console.log(`  🔄  Backfilled alert_time for ${rows.length} alert(s)`);

    // Drop old VARCHAR column
    await conn.query('ALTER TABLE alerts DROP COLUMN time');
  }

  // Now enforce NOT NULL with a sensible default
  await conn.query(`
    ALTER TABLE alerts
      MODIFY COLUMN alert_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  `);

  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step09_alerts_priority_enum(conn) {
  const name = '09_alerts_priority_to_enum';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  // Sanitize stray values before locking in the ENUM
  await conn.query(`
    UPDATE alerts SET priority = 'medium'
     WHERE priority NOT IN ('high','medium','low')
  `);

  const type = await columnType(conn, 'alerts', 'priority');
  if (type && !type.startsWith('enum')) {
    await conn.query(`
      ALTER TABLE alerts
        MODIFY COLUMN priority
          ENUM('high','medium','low') NOT NULL DEFAULT 'medium'
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step10_alerts_timestamps(conn) {
  const name = '10_alerts_add_updated_at';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'alerts', 'updated_at')) {
    await conn.query(`
      ALTER TABLE alerts
        ADD COLUMN updated_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          AFTER created_at
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step11_alerts_indexes(conn) {
  const name = '11_alerts_add_indexes';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await indexExists(conn, 'alerts', 'idx_alerts_priority')) {
    await conn.query('ALTER TABLE alerts ADD INDEX idx_alerts_priority (priority)');
  }
  if (!await indexExists(conn, 'alerts', 'idx_alerts_alert_time')) {
    await conn.query('ALTER TABLE alerts ADD INDEX idx_alerts_alert_time (alert_time)');
  }
  if (!await indexExists(conn, 'alerts', 'idx_alerts_created_at')) {
    await conn.query('ALTER TABLE alerts ADD INDEX idx_alerts_created_at (created_at)');
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step12_assignments_status_enum(conn) {
  const name = '12_assignments_status_to_enum';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  await conn.query(`
    UPDATE assignments SET status = 'assigned'
     WHERE status NOT IN ('assigned','in-progress','completed')
  `);

  const type = await columnType(conn, 'assignments', 'status');
  if (type && !type.startsWith('enum')) {
    await conn.query(`
      ALTER TABLE assignments
        MODIFY COLUMN status
          ENUM('assigned','in-progress','completed')
          NOT NULL DEFAULT 'assigned'
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step13_assignments_timestamps(conn) {
  const name = '13_assignments_add_timestamps';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'assignments', 'created_at')) {
    await conn.query(`
      ALTER TABLE assignments
        ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
  }
  if (!await columnExists(conn, 'assignments', 'updated_at')) {
    await conn.query(`
      ALTER TABLE assignments
        ADD COLUMN updated_at TIMESTAMP NOT NULL
          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step14_assignments_indexes(conn) {
  const name = '14_assignments_add_indexes';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await indexExists(conn, 'assignments', 'idx_asgn_user_id')) {
    await conn.query('ALTER TABLE assignments ADD INDEX idx_asgn_user_id (user_id)');
  }
  if (!await indexExists(conn, 'assignments', 'idx_asgn_status')) {
    await conn.query('ALTER TABLE assignments ADD INDEX idx_asgn_status (status)');
  }
  if (!await indexExists(conn, 'assignments', 'idx_asgn_assigned_date')) {
    await conn.query('ALTER TABLE assignments ADD INDEX idx_asgn_assigned_date (assigned_date)');
  }

  // Re-add FK with a stable name if missing
  if (!await constraintExists(conn, 'assignments', 'fk_asgn_user')) {
    const [fks] = await conn.query(`
      SELECT CONSTRAINT_NAME
        FROM information_schema.REFERENTIAL_CONSTRAINTS
       WHERE CONSTRAINT_SCHEMA     = DATABASE()
         AND TABLE_NAME            = 'assignments'
         AND REFERENCED_TABLE_NAME = 'users'
    `);
    for (const fk of fks) {
      await conn.query(`ALTER TABLE assignments DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
    }
    await conn.query(`
      ALTER TABLE assignments
        ADD CONSTRAINT fk_asgn_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step15_charset_collation(conn) {
  const name = '15_enforce_utf8mb4_collation';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  // Convert all app tables to utf8mb4 if they aren't already
  const tables = ['users','skills','user_skills','alerts','assignments'];
  for (const t of tables) {
    await conn.query(
      `ALTER TABLE \`${t}\`
         CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

// ── runner ────────────────────────────────────────────────────────────────────

async function runMigrations() {
  console.log('\n🔄 ResQLink — running database migrations…\n');

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'resqlink',
    multipleStatements: false,
  });

  try {
    // Step 01 is special — creates the tracking table; cannot use migrationDone() yet
    await step01_migrations_table(conn);

    const steps = [
      step02_users_updated_at,
      step03_users_role_enum,
      step04_users_indexes,
      step05_skills_columns,
      step06_user_skills_assigned_at,
      step07_user_skills_indexes,
      step08_alerts_datetime,
      step09_alerts_priority_enum,
      step10_alerts_timestamps,
      step11_alerts_indexes,
      step12_assignments_status_enum,
      step13_assignments_timestamps,
      step14_assignments_indexes,
      step15_charset_collation,
    ];

    for (const step of steps) {
      try {
        await step(conn);
      } catch (err) {
        console.error(`  ❌ ${step.name} failed:`, err.message);
        // Continue with remaining steps — partial migration is better than none
      }
    }

    console.log('\n🎉 Migration complete.\n');
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  runMigrations().catch(err => {
    console.error('Fatal migration error:', err.message);
    process.exit(1);
  });
}

module.exports = runMigrations;
