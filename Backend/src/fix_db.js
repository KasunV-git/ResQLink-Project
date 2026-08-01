const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function fix() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'resqlink'
    });
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS disasters (
        disaster_id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        lat DECIMAL(10, 7) DEFAULT NULL,
        lng DECIMAL(10, 7) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        status ENUM('active', 'resolved', 'pending') DEFAULT 'pending',
        severity_score DECIMAL(5, 2) DEFAULT 0.00,
        predictor_risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
        reported_by INT DEFAULT NULL,
        media_url VARCHAR(500) DEFAULT NULL,
        verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (disaster_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log("Table 'disasters' created!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fix();
