/**
 * ResQLink — Sri Lanka Localisation Re-seed Script
 *
 * Use this when the database already has generic seed data and you want to
 * replace it with Sri Lanka–specific content WITHOUT dropping the entire DB.
 *
 * What it does:
 *   1. Updates the demo volunteer's name and phone to Sri Lankan values
 *   2. Clears and re-inserts all alerts with SL institutions and scenarios
 *   3. Clears and re-inserts all assignments with SL districts and locations
 *   4. Adds new SL-relevant skills (Boat Operation, Community Liaison)
 *
 * What it does NOT touch:
 *   - Schema / table structure
 *   - Any users other than volunteer@resqlink.com
 *   - Existing user_skills associations
 *   - Migration tracking table
 *
 * Run:  node src/database/seedLK.js
 *       or:  npm run seed:lk
 */

'use strict';

const path  = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function seedLK() {
  console.log('\n🇱🇰  ResQLink — Sri Lanka localisation re-seed\n');

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'resqlink',
  });

  try {

    // ── 1. Update demo volunteer ────────────────────────────────────────────
    const [userRows] = await conn.query(
      'SELECT id FROM users WHERE email = ?', ['volunteer@resqlink.com']
    );
    if (userRows.length > 0) {
      await conn.query(
        `UPDATE users
            SET first_name = ?, last_name = ?, phone = ?
          WHERE email = ?`,
        ['Kamal', 'Perera', '+94 77 234 5678', 'volunteer@resqlink.com']
      );
      console.log('✅ Demo volunteer updated → Kamal Perera (+94 77 234 5678)');
    } else {
      console.log('⚠️  Demo volunteer not found — run initDb first.');
    }

    // ── 2. Add new SL-relevant skills ───────────────────────────────────────
    const newSkills = ['Boat Operation', 'Community Liaison'];
    for (const skill of newSkills) {
      await conn.query('INSERT IGNORE INTO skills (name) VALUES (?)', [skill]);
    }
    console.log('✅ New skills added: Boat Operation, Community Liaison');

    // ── 3. Re-seed alerts ───────────────────────────────────────────────────
    await conn.query('DELETE FROM alerts');

    const alerts = [
      // HIGH
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
      // MEDIUM
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
      // LOW
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

    for (const a of alerts) {
      await conn.query(
        'INSERT INTO alerts (priority, message, source, alert_time, target) VALUES (?, ?, ?, ?, ?)',
        [a.priority, a.message, a.source, a.alert_time, a.target]
      );
    }
    console.log(`✅ Alerts re-seeded (${alerts.length} Sri Lanka–localised alerts)`);

    // ── 4. Re-seed assignments for demo volunteer ───────────────────────────
    const [userRes] = await conn.query(
      'SELECT id FROM users WHERE email = ?', ['volunteer@resqlink.com']
    );
    if (userRes.length === 0) {
      console.log('⚠️  Demo volunteer not found — skipping assignment re-seed.');
    } else {
      const volunteerId = userRes[0].id;
      await conn.query('DELETE FROM assignments WHERE user_id = ?', [volunteerId]);

      const assignments = [
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

      for (const a of assignments) {
        await conn.query(
          `INSERT INTO assignments
             (user_id, disaster, task, location, status, assigned_date, completed_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [volunteerId, a.disaster, a.task, a.location,
           a.status, a.assigned_date, a.completed_date]
        );
      }
      console.log(`✅ Assignments re-seeded (${assignments.length} Sri Lanka–localised tasks)`);
    }

    console.log('\n🎉 Sri Lanka localisation re-seed complete.\n');

  } catch (err) {
    console.error('❌ Re-seed failed:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seedLK();
