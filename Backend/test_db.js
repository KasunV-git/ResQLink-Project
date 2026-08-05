require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  
  const [rows] = await connection.execute('SELECT id, email, name FROM users WHERE LOWER(email) = ?', ['vinod.kasun23@gmail.com']);
  console.log('User found in DB:', rows);
  
  await connection.end();
}
test();
