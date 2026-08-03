const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const path  = require('path');

// Load .env if not already loaded
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_NAME     = process.env.DB_NAME     || 'resqlink';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_PORT     = process.env.DB_PORT     || 3306;

const isProduction = process.env.NODE_ENV === 'production';
const sslConfig = isProduction ? { rejectUnauthorized: true } : undefined;

// 1. MySQL2 Pool for raw queries
const pool = mysql.createPool({
  host:               DB_HOST,
  port:               DB_PORT,
  user:               DB_USER,
  password:           DB_PASSWORD,
  database:           DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'local',
  ssl:                sslConfig,
});

// 2. Sequelize ORM instance for models
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    ssl: sslConfig
  }
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL pool connected successfully to database:', DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('⚠️ MySQL connection notice:', err.message);
  });

// Attach sequelize to pool so `const { sequelize } = require('../config/db')` works
pool.sequelize = sequelize;

module.exports = pool;
