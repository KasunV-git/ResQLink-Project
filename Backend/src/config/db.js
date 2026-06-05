const mysql = require('mysql2/promise');

// dotenv already loaded in App.js before this module is required
const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'resqlink',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  timezone:         'local',
});

// Test connection on startup
pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected successfully'); conn.release(); })
  .catch(err  => console.error('❌ MySQL connection failed:', err.message));

module.exports = pool;
