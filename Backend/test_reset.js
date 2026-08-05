require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkResetCode() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });
  
  const [rows] = await connection.execute('SELECT id, email, reset_code FROM users WHERE email = ?', ['vinod.kasun23@gmail.com']);
  console.log('User reset status:', rows);
  
  await connection.end();
}
checkResetCode();
