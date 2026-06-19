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
    throw error;
  } finally {
    await connection.end();
  }
}

// Run immediately if executed directly
if (require.main === module) {
  initDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

module.exports = initDb;
