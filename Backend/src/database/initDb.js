'use strict';

const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');

const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME     = process.env.DB_NAME     || 'resqlink';

async function initDb() {
  console.log('🔄 Initialising database…');

  const connection = await mysql.createConnection({
    host:     DB_HOST,
    user:     DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // ── 1. Create database ──────────────────────────────────────────────────
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Database "${DB_NAME}" ready.`);

    // ── 2. Apply schema ─────────────────────────────────────────────────────
    const schemaSql  = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      await connection.query(stmt);
    }
    console.log('✅ Tables created/verified.');

    // ── 3. Seed demo users ──────────────────────────────────────────────────
    const usersToSeed = [
      {
        name: 'Kamal Perera',
        email: 'volunteer@resqlink.com',
        phone: '+94 77 234 5678',
        role: 'Volunteer',
        is_available: true,
        password: 'demo123'
      },
      {
        name: 'ResQLink Admin',
        email: 'admin@resqlink.com',
        phone: '+94 11 000 0000',
        role: 'Admin',
        is_available: false,
        password: 'demo123'
      },
      {
        name: 'Jane Citizen',
        email: 'citizen@resqlink.com',
        phone: '+94 71 555 5555',
        role: 'Citizen',
        is_available: false,
        password: 'demo123'
      }
    ];

    let volunteerId;
    for (const u of usersToSeed) {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const [insert] = await connection.query(
          `INSERT INTO users (name, email, phone, role, is_available, password) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [u.name, u.email, u.phone, u.role, u.is_available ? 1 : 0, hashedPassword]
        );
        if (u.role === 'Volunteer') volunteerId = insert.insertId;
        console.log(`✅ ${u.role} user '${u.name}' seeded.`);
      } else {
        if (u.role === 'Volunteer') volunteerId = existing[0].id;
        console.log(`ℹ️ ${u.role} user '${u.name}' already exists.`);
      }
    }

    // ── 4. Seed master skill catalogue ─────────────────────────────────────
    const skillsToSeed = [
      'First Aid',
      'Search & Rescue',
      'Communication',
      'Medical',
      'Logistics',
      'Translation',
      'IT Support',
      'Data Entry',
      'Shelter Management',
      'Cooking',
      'Driving',
      'Construction',
      'Electrical',
      'Plumbing',
      'Boat Operation',
      'Community Liaison',
    ];
    for (const skill of skillsToSeed) {
      await connection.query(
        'INSERT IGNORE INTO skills (name) VALUES (?)', [skill]
      );
    }
    console.log('✅ Skills seeded.');

    // ── 5. Assign initial skills to demo volunteer ──────────────────────────
    if (volunteerId) {
      const initialSkills = ['First Aid', 'Search & Rescue', 'Communication'];
      for (const skillName of initialSkills) {
        const [skillRows] = await connection.query(
          'SELECT id FROM skills WHERE name = ?', [skillName]
        );
        if (skillRows.length > 0) {
          await connection.query(
            'INSERT IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)',
            [volunteerId, skillRows[0].id]
          );
        }
      }
      console.log('✅ Initial skills assigned.');
    }

    // ── 6. Seed alerts ──────────────────────────────────────────────────────
    const [existingAlerts] = await connection.query('SELECT id FROM alerts LIMIT 1');

    if (existingAlerts.length === 0) {
      const alertsToSeed = [
        {
          priority:   'high',
          message:    'Kelani River water levels rising rapidly. Flash flood warning issued for Kelaniya, Kaduwela, and Biyagama areas. Immediate evacuation of low-lying zones ordered.',
          source:     'Disaster Management Centre (DMC)',
          alert_time: '2026-04-03 14:30:00',
          target:     'For Volunteers',
        },
        {
          priority:   'high',
          message:    'Landslide reported in Aranayake, Kegalle District. Search and rescue operations activated. Volunteers with SAR training must report to Kegalle District Secretariat immediately.',
          source:     'Disaster Management Centre (DMC)',
          alert_time: '2026-04-03 10:00:00',
          target:     'For Volunteers',
        },
        {
          priority:   'medium',
          message:    'NBRO issues landslide early warning for Badulla, Nuwara Eliya, and Ratnapura districts. High-risk zones on red alert. Volunteer standby teams to remain on call.',
          source:     'National Building Research Organisation (NBRO)',
          alert_time: '2026-04-03 08:00:00',
          target:     'For Volunteers',
        },
        {
          priority:   'low',
          message:    'Moderate to heavy rainfall forecast for Western and Sabaragamuwa provinces over the next 48 hours. Minor flooding possible in low-lying areas.',
          source:     'Department of Meteorology Sri Lanka',
          alert_time: '2026-04-03 06:00:00',
          target:     'For Volunteers',
        },
      ];

      for (const a of alertsToSeed) {
        await connection.query(
          `INSERT INTO alerts (priority, message, source, alert_time, time, target)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [a.priority, a.message, a.source, a.alert_time, a.alert_time, a.target]
        );
      }
      console.log('✅ Alerts seeded.');
    }

    // ── 7. Seed assignments ─────────────────────────────────────────────────
    if (volunteerId) {
      const [existingAssignments] = await connection.query('SELECT id FROM assignments LIMIT 1');

      if (existingAssignments.length === 0) {
        const assignmentsToSeed = [
          {
            disaster:       'Kelani River Flood – Kelaniya',
            task:           'Distribute dry rations and drinking water to displaced families',
            location:       'Kelaniya Relief Camp, Gampaha District',
            status:         'in-progress',
            assigned_date:  '2026-04-03',
            completed_date: null,
          },
          {
            disaster:       'Kegalle Landslide – Aranayake',
            task:           'Assist national search and rescue teams in affected zone',
            location:       'Aranayake, Kegalle District',
            status:         'assigned',
            assigned_date:  '2026-04-03',
            completed_date: null,
          },
          {
            disaster:       'Matara Coastal Flooding',
            task:           'Evacuate residents from flood-affected coastal neighbourhoods',
            location:       'Matara Town, Southern Province',
            status:         'completed',
            assigned_date:  '2026-04-02',
            completed_date: '2026-04-02',
          },
        ];

        for (const a of assignmentsToSeed) {
          await connection.query(
            `INSERT INTO assignments
               (user_id, disaster, task, location, status, assigned_date, completed_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [volunteerId, a.disaster, a.task, a.location,
             a.status, a.assigned_date, a.completed_date]
          );
        }
        console.log('✅ Assignments seeded.');
      }
    }

    console.log('🎉 Database initialisation complete!');
  } catch (error) {
    console.error('❌ Database initialisation error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  initDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initDb;
