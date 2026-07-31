const mysql = require('mysql2/promise');
const path  = require('path');

// Load .env if not already loaded
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'resqlink',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'local',
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL pool connected successfully to database:', process.env.DB_NAME || 'resqlink');
    conn.release();
  })
  .catch(err => {
    console.error('⚠️ MySQL connection notice:', err.message);
  });

module.exports = pool;
