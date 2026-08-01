'use strict';

const mysql = require('mysql2/promise');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME     = process.env.DB_NAME     || 'resqlink';

async function resetDb() {
  console.log(`\n🧹 ResQLink — Resetting database "${DB_NAME}" and clearing all previous data...\n`);

  const connection = await mysql.createConnection({
    host:     DB_HOST,
    user:     DB_USER,
    password: DB_PASSWORD,
  });

  try {
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    console.log(`✅ Previous database "${DB_NAME}" dropped successfully.`);
  } catch (err) {
    console.error('⚠️ Could not drop database:', err.message);
  } finally {
    await connection.end();
  }

  // 1. Initialize fresh schema and seed users/skills/alerts
  const initDb = require('./initDb');
  await initDb();

  // 2. Run migrations
  const runMigrations = require('./migrate');
  if (typeof runMigrations === 'function') {
    await runMigrations();
  }

  // 3. Seed fresh Sri Lankan data
  const seedLK = require('./seedLK');
  await seedLK();

  console.log('\n✨ Database reset complete! System is completely fresh.\n');
}

if (require.main === module) {
  resetDb().then(() => process.exit(0)).catch((err) => {
    console.error('❌ Reset error:', err);
    process.exit(1);
  });
}

module.exports = resetDb;
