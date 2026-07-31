<<<<<<< HEAD
'use strict';

const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');

// dotenv is loaded in App.js before this module is required
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

    // ── 3. Seed demo volunteer ──────────────────────────────────────────────
    //      Sri Lankan demo user — Kamal Perera, +94 country code
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['volunteer@resqlink.com']
    );

    let volunteerId;
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const [insertUser]   = await connection.query(
        `INSERT INTO users
           (first_name, last_name, email, phone, role, is_available, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Kamal', 'Perera', 'volunteer@resqlink.com',
         '+94 77 234 5678', 'Volunteer', 1, hashedPassword]
      );
      volunteerId = insertUser.insertId;
      console.log('✅ Demo volunteer seeded.');
    } else {
      volunteerId = existingUsers[0].id;
      console.log('ℹ️  Demo volunteer already exists, skipping.');
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
      'Boat Operation',       // critical for Sri Lanka flood response
      'Community Liaison',    // local community engagement
    ];
    for (const skill of skillsToSeed) {
      await connection.query(
        'INSERT IGNORE INTO skills (name) VALUES (?)', [skill]
      );
    }
    console.log('✅ Skills seeded.');

    // ── 5. Assign initial skills to demo volunteer ──────────────────────────
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

    // ── 6. Seed alerts ──────────────────────────────────────────────────────
    //      Sri Lanka–specific disasters, institutions, and locations.
    //      Sources: DMC, NBRO, CEB, Met Dept, Red Cross Sri Lanka, NDRC.
    const [existingAlerts] = await connection.query('SELECT id FROM alerts LIMIT 1');

    if (existingAlerts.length === 0) {
      const alertsToSeed = [
        // ── HIGH priority ───────────────────────────────────────────────────
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
          priority:   'high',
          message:    'Urgent volunteers needed at Ratnapura District flood relief centre. Over 500 families displaced. Report to Ratnapura Pradeshiya Sabha Office, Outer Circular Road.',
          source:     'National Disaster Relief Centre (NDRC)',
          alert_time: '2026-04-03 15:45:00',
          target:     'For Volunteers',
        },
        // ── MEDIUM priority ─────────────────────────────────────────────────
        {
          priority:   'medium',
          message:    'NBRO issues landslide early warning for Badulla, Nuwara Eliya, and Ratnapura districts. High-risk zones on red alert. Volunteer standby teams to remain on call.',
          source:     'National Building Research Organisation (NBRO)',
          alert_time: '2026-04-03 08:00:00',
          target:     'For Volunteers',
        },
        {
          priority:   'medium',
          message:    'Ceylon Electricity Board reports widespread power outages across the Northern Province following storm damage. Red Cross Sri Lanka volunteer teams dispatched to Jaffna.',
          source:     'Ceylon Electricity Board (CEB)',
          alert_time: '2026-04-03 13:15:00',
          target:     'For Volunteers',
        },
        {
          priority:   'medium',
          message:    'Cyclonic weather conditions developing in the Bay of Bengal. Coastal districts of Trincomalee, Batticaloa, and Ampara to remain on high alert. Fishing communities advised not to venture to sea.',
          source:     'Department of Meteorology Sri Lanka',
          alert_time: '2026-04-02 18:00:00',
          target:     'For Volunteers',
        },
        // ── LOW priority ────────────────────────────────────────────────────
        {
          priority:   'low',
          message:    'Moderate to heavy rainfall forecast for Western and Sabaragamuwa provinces over the next 48 hours. Minor flooding possible in low-lying areas of Colombo and Gampaha.',
          source:     'Department of Meteorology Sri Lanka',
          alert_time: '2026-04-03 06:00:00',
          target:     'For Volunteers',
        },
        {
          priority:   'low',
          message:    'Tsunami preparedness community awareness programme scheduled in Galle, Matara, and Hambantota coastal districts. Volunteer facilitators and translators are required.',
          source:     'Disaster Management Centre (DMC)',
          alert_time: '2026-04-02 09:00:00',
          target:     'For Volunteers',
        },
      ];

      for (const a of alertsToSeed) {
        await connection.query(
          `INSERT INTO alerts (priority, message, source, alert_time, target)
           VALUES (?, ?, ?, ?, ?)`,
          [a.priority, a.message, a.source, a.alert_time, a.target]
        );
      }
      console.log('✅ Alerts seeded (Sri Lanka–localised).');
    } else {
      console.log('ℹ️  Alerts already seeded.');
    }

    // ── 7. Seed assignments ─────────────────────────────────────────────────
    //      Tasks tied to real Sri Lankan districts, locations, and disasters.
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
          disaster:       'Northern Province Power Outage',
          task:           'Provide community support and welfare assistance at shelter',
          location:       'Jaffna Community Centre, Jaffna District',
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
      console.log('✅ Assignments seeded (Sri Lanka–localised).');
    } else {
      console.log('ℹ️  Assignments already seeded.');
    }

    console.log('🎉 Database initialisation complete!');
  } catch (error) {
    console.error('❌ Database initialisation error:', error.message);
=======
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Renu_mysql';
const DB_NAME = process.env.DB_NAME || 'resqlink';

async function initDb() {
  console.log('Initializing database...');
  
  // 1. Establish connection to MySQL server (without database selected)
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });

  try {
    // 2. Create Database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' verified/created.`);
    
    // Switch to resqlink database
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 3. Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema file by semicolon to run statements sequentially
    const sqlStatements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of sqlStatements) {
      await connection.query(stmt);
    }
    console.log('Database tables created successfully.');

    // 4. Seed Initial Data
    
    // A. Seed Users
    const usersToSeed = [
      {
        name: 'Kasun Volunteer',
        email: 'volunteer@resqlink.com',
        phone: '+1 234 567 8901',
        role: 'Volunteer',
        is_available: true,
        password: 'demo123'
      },
      {
        name: 'ResQLink Admin',
        email: 'admin@resqlink.com',
        phone: '+1 000 000 0000',
        role: 'Admin',
        is_available: false,
        password: 'demo123'
      },
      {
        name: 'Jane Citizen',
        email: 'citizen@resqlink.com',
        phone: '+1 555 555 5555',
        role: 'Citizen',
        is_available: false,
        password: 'demo123'
      }
    ];

    let volunteerId;
    for (const u of usersToSeed) {
      const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        const [insert] = await connection.query(
          `INSERT INTO users (name, email, phone, role, is_available, password) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [u.name, u.email, u.phone, u.role, u.is_available, u.password]
        );
        if (u.role === 'Volunteer') {
          volunteerId = insert.insertId;
        }
        console.log(`${u.role} user '${u.name}' seeded successfully.`);
      } else {
        if (u.role === 'Volunteer') {
          volunteerId = existing[0].id;
        }
        console.log(`${u.role} user '${u.name}' already exists.`);
      }
    }

    // B. Seed Skills
    const skillsToSeed = [
      'First Aid', 'Search & Rescue', 'Communication', 'Medical', 
      'Logistics', 'Translation', 'IT Support', 'Data Entry', 
      'Shelter Management', 'Cooking', 'Driving', 'Construction', 
      'Electrical', 'Plumbing'
    ];

    for (const skill of skillsToSeed) {
      await connection.query('INSERT IGNORE INTO skills (name) VALUES (?)', [skill]);
    }
    console.log('Skills list seeded.');

    // C. Associate initial skills with Kasun Volunteer
    const initialSkills = ['First Aid', 'Search & Rescue', 'Communication'];
    for (const skillName of initialSkills) {
      const [skillRows] = await connection.query('SELECT id FROM skills WHERE name = ?', [skillName]);
      if (skillRows.length > 0) {
        const skillId = skillRows[0].id;
        await connection.query(
          'INSERT IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)',
          [volunteerId, skillId]
        );
      }
    }
    console.log('Volunteer initial skills associated.');

    // D. Seed Alerts
    const [existingAlerts] = await connection.query('SELECT * FROM alerts');
    if (existingAlerts.length === 0) {
      const alertsToSeed = [
        {
          priority: 'high',
          message: 'Flash flood warning in Downtown area. Evacuate immediately.',
          source: 'Emergency Services',
          time: 'Apr 3, 03:00 PM',
          target: 'For Volunteers'
        },
        {
          priority: 'medium',
          message: 'Power outage reported in North District. Crews dispatched.',
          source: 'Infrastructure Team',
          time: 'Apr 3, 01:45 PM',
          target: 'For Volunteers'
        },
        {
          priority: 'low',
          message: 'Weather advisory: Heavy rain expected tonight.',
          source: 'Weather Service',
          time: 'Apr 3, 12:30 PM',
          target: 'For Volunteers'
        },
        {
          priority: 'high',
          message: 'Volunteers needed urgently at Central Shelter.',
          source: 'Coordination Center',
          time: 'Apr 3, 03:30 PM',
          target: 'For Volunteers'
        }
      ];

      for (const alert of alertsToSeed) {
        await connection.query(
          `INSERT INTO alerts (priority, message, source, time, target) 
           VALUES (?, ?, ?, ?, ?)`,
          [alert.priority, alert.message, alert.source, alert.time, alert.target]
        );
      }
      console.log('Alerts seeded.');
    } else {
      console.log('Alerts already seeded.');
    }

    // E. Seed Assignments
    const [existingAssignments] = await connection.query('SELECT * FROM assignments');
    if (existingAssignments.length === 0) {
      const assignmentsToSeed = [
        {
          user_id: volunteerId,
          disaster: 'Downtown Flood',
          task: 'Distribute emergency supplies',
          location: 'Central Shelter',
          status: 'in-progress',
          assigned_date: '4/3/2026',
          completed_date: null
        },
        {
          user_id: volunteerId,
          disaster: 'East District Earthquake',
          task: 'Assist evacuation',
          location: 'East District',
          status: 'assigned',
          assigned_date: '4/3/2026',
          completed_date: null
        },
        {
          user_id: volunteerId,
          disaster: 'North District Power Outage',
          task: 'Community support',
          location: 'North Community Center',
          status: 'completed',
          assigned_date: '4/2/2026',
          completed_date: '4/2/2026'
        }
      ];

      for (const assign of assignmentsToSeed) {
        await connection.query(
          `INSERT INTO assignments (user_id, disaster, task, location, status, assigned_date, completed_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            assign.user_id,
            assign.disaster,
            assign.task,
            assign.location,
            assign.status,
            assign.assigned_date,
            assign.completed_date
          ]
        );
      }
      console.log('Assignments seeded.');
    } else {
      console.log('Assignments already seeded.');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
>>>>>>> kasuni-development
    throw error;
  } finally {
    await connection.end();
  }
}

<<<<<<< HEAD
if (require.main === module) {
  initDb().then(() => process.exit(0)).catch(() => process.exit(1));
=======
// Run immediately if executed directly
if (require.main === module) {
  initDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
>>>>>>> kasuni-development
}

module.exports = initDb;
