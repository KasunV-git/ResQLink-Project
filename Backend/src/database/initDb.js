const mysql   = require('mysql2/promise');
const bcrypt  = require('bcryptjs');
const fs      = require('fs');
const path    = require('path');

// dotenv already loaded in App.js
const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME     = process.env.DB_NAME     || 'resqlink';

async function initDb() {
  console.log('🔄 Initializing database...');

  const connection = await mysql.createConnection({
    host:     DB_HOST,
    user:     DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // 1. Create database if missing
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Database "${DB_NAME}" ready.`);

    // 2. Create tables from schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      await connection.query(stmt);
    }
    console.log('✅ Tables created/verified.');

    // 3. Seed demo volunteer
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?', ['volunteer@resqlink.com']
    );

    let volunteerId;
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const [insertUser] = await connection.query(
        `INSERT INTO users (name, email, phone, role, is_available, password)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['Demo Volunteer', 'volunteer@resqlink.com', '+1 234 567 8901', 'Volunteer', 1, hashedPassword]
      );
      volunteerId = insertUser.insertId;
      console.log('✅ Demo volunteer seeded.');
    } else {
      volunteerId = existingUsers[0].id;
      console.log('ℹ️  Demo volunteer already exists, skipping seed.');
    }

    // 4. Seed skills
    const skillsToSeed = [
      'First Aid', 'Search & Rescue', 'Communication', 'Medical',
      'Logistics', 'Translation', 'IT Support', 'Data Entry',
      'Shelter Management', 'Cooking', 'Driving', 'Construction',
      'Electrical', 'Plumbing',
    ];
    for (const skill of skillsToSeed) {
      await connection.query('INSERT IGNORE INTO skills (name) VALUES (?)', [skill]);
    }
    console.log('✅ Skills seeded.');

    // 5. Associate initial skills with demo volunteer
    const initialSkills = ['First Aid', 'Search & Rescue', 'Communication'];
    for (const skillName of initialSkills) {
      const [skillRows] = await connection.query('SELECT id FROM skills WHERE name = ?', [skillName]);
      if (skillRows.length > 0) {
        await connection.query(
          'INSERT IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)',
          [volunteerId, skillRows[0].id]
        );
      }
    }
    console.log('✅ Initial skills assigned.');

    // 6. Seed alerts
    const [existingAlerts] = await connection.query('SELECT id FROM alerts LIMIT 1');
    if (existingAlerts.length === 0) {
      const alertsToSeed = [
        { priority: 'high',   message: 'Flash flood warning in Downtown area. Evacuate immediately.',  source: 'Emergency Services',  time: 'Apr 3, 03:00 PM', target: 'For Volunteers' },
        { priority: 'medium', message: 'Power outage reported in North District. Crews dispatched.',   source: 'Infrastructure Team', time: 'Apr 3, 01:45 PM', target: 'For Volunteers' },
        { priority: 'low',    message: 'Weather advisory: Heavy rain expected tonight.',                source: 'Weather Service',     time: 'Apr 3, 12:30 PM', target: 'For Volunteers' },
        { priority: 'high',   message: 'Volunteers needed urgently at Central Shelter.',               source: 'Coordination Center', time: 'Apr 3, 03:30 PM', target: 'For Volunteers' },
      ];
      for (const a of alertsToSeed) {
        await connection.query(
          'INSERT INTO alerts (priority, message, source, time, target) VALUES (?, ?, ?, ?, ?)',
          [a.priority, a.message, a.source, a.time, a.target]
        );
      }
      console.log('✅ Alerts seeded.');
    } else {
      console.log('ℹ️  Alerts already seeded.');
    }

    // 7. Seed assignments (use proper DATE format YYYY-MM-DD)
    const [existingAssignments] = await connection.query('SELECT id FROM assignments LIMIT 1');
    if (existingAssignments.length === 0) {
      const assignmentsToSeed = [
        { disaster: 'Downtown Flood',           task: 'Distribute emergency supplies', location: 'Central Shelter',     status: 'in-progress', assigned_date: '2026-04-03', completed_date: null },
        { disaster: 'East District Earthquake', task: 'Assist evacuation',             location: 'East District',       status: 'assigned',    assigned_date: '2026-04-03', completed_date: null },
        { disaster: 'North District Power Outage', task: 'Community support',          location: 'North Community Center', status: 'completed', assigned_date: '2026-04-02', completed_date: '2026-04-02' },
      ];
      for (const a of assignmentsToSeed) {
        await connection.query(
          `INSERT INTO assignments (user_id, disaster, task, location, status, assigned_date, completed_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [volunteerId, a.disaster, a.task, a.location, a.status, a.assigned_date, a.completed_date]
        );
      }
      console.log('✅ Assignments seeded.');
    } else {
      console.log('ℹ️  Assignments already seeded.');
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  initDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initDb;
