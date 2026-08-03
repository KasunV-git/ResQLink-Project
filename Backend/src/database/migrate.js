/**
 * ResQLink — Database Migration Script (v1 → v2)
 * Safe to run multiple times (idempotent).
 */

'use strict';

const path  = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

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

function parseAlertTime(timeStr, fallback) {
  if (!timeStr) return fallback;
  try {
    const year = new Date().getFullYear();
    const d = new Date(`${timeStr} ${year}`);
    if (isNaN(d.getTime())) return fallback;
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  } catch {
    return fallback;
  }
}

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

  await conn.query(`
    UPDATE users
       SET role = 'Volunteer'
     WHERE role NOT IN ('Volunteer','Citizen','Administrator','Admin')
  `);
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

  if (!await indexExists(conn, 'user_skills', 'idx_user_skills_user_id')) {
    await conn.query('ALTER TABLE user_skills ADD INDEX idx_user_skills_user_id (user_id)');
  }
  if (!await indexExists(conn, 'user_skills', 'idx_user_skills_skill_id')) {
    await conn.query('ALTER TABLE user_skills ADD INDEX idx_user_skills_skill_id (skill_id)');
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step08_alerts_datetime(conn) {
  const name = '08_alerts_time_varchar_to_datetime';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!await columnExists(conn, 'alerts', 'alert_time')) {
    await conn.query(`
      ALTER TABLE alerts
        ADD COLUMN alert_time DATETIME NULL DEFAULT CURRENT_TIMESTAMP
          AFTER source
    `);
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step09_alerts_priority_enum(conn) {
  const name = '09_alerts_priority_to_enum';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);
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
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step12_assignments_status_enum(conn) {
  const name = '12_assignments_status_to_enum';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step13_assignments_timestamps(conn) {
  const name = '13_assignments_add_timestamps';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step14_assignments_indexes(conn) {
  const name = '14_assignments_add_indexes';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step15_charset_collation(conn) {
  const name = '15_enforce_utf8mb4_collation';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step16_users_avatar_url(conn) {
  const name = '16_users_avatar_url';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!(await columnExists(conn, 'users', 'avatar_url'))) {
    await conn.query(
      `ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL AFTER is_available`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step17_users_ensure_name(conn) {
  const name = '17_users_ensure_name_column';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!(await columnExists(conn, 'users', 'name'))) {
    await conn.query(
      `ALTER TABLE users ADD COLUMN name VARCHAR(255) DEFAULT NULL AFTER id`
    );
    await conn.query(
      `UPDATE users SET name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step18_alerts_ensure_time(conn) {
  const name = '18_alerts_ensure_time_column';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!(await columnExists(conn, 'alerts', 'time'))) {
    await conn.query(
      `ALTER TABLE alerts ADD COLUMN time VARCHAR(100) DEFAULT NULL AFTER source`
    );
    await conn.query(
      `UPDATE alerts SET time = DATE_FORMAT(COALESCE(alert_time, created_at), '%b %d, %h:%i %p')`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step19_disasters_add_landmark_people(conn) {
  const name = '19_disasters_add_landmark_people';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  if (!(await columnExists(conn, 'disasters', 'landmark'))) {
    await conn.query(
      `ALTER TABLE disasters ADD COLUMN landmark VARCHAR(255) DEFAULT NULL AFTER location`
    );
  }
  if (!(await columnExists(conn, 'disasters', 'people_affected'))) {
    await conn.query(
      `ALTER TABLE disasters ADD COLUMN people_affected VARCHAR(255) DEFAULT NULL AFTER landmark`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

async function step20_disasters_change_people_affected_type(conn) {
  const name = '20_disasters_change_people_affected_type';
  if (await migrationDone(conn, name)) return console.log(`  ⏭  ${name}`);

  const colType = await columnType(conn, 'disasters', 'people_affected');
  if (colType && colType.includes('int')) {
    await conn.query(
      `ALTER TABLE disasters MODIFY COLUMN people_affected VARCHAR(255) DEFAULT NULL`
    );
  }
  await recordMigration(conn, name);
  console.log(`  ✅ ${name}`);
}

// ── runner ────────────────────────────────────────────────────────────────────

async function runMigrations() {
  console.log('\n🔄 ResQLink — running database migrations…\n');

  const DB_HOST = process.env.DB_HOST || 'localhost';
  const isTiDB = DB_HOST.includes('tidbcloud');
  const sslConfig = isTiDB ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined;

  const conn = await mysql.createConnection({
    host:     DB_HOST,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'resqlink',
    multipleStatements: false,
    ssl:      sslConfig,
  });

  try {
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
      step16_users_avatar_url,
      step17_users_ensure_name,
      step18_alerts_ensure_time,
      step19_disasters_add_landmark_people,
      step20_disasters_change_people_affected_type,
    ];

    for (const step of steps) {
      try {
        await step(conn);
      } catch (err) {
        console.error(`  ❌ ${step.name} failed:`, err.message);
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
