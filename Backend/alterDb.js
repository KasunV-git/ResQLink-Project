const mysql = require('mysql2/promise');

async function run() {
    try {
        const c = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'shelby500',
            database: 'resqlink'
        });
        
        await c.execute(`
            ALTER TABLE users 
            ADD COLUMN primary_region VARCHAR(255) DEFAULT NULL,
            ADD COLUMN trust_score INT DEFAULT 30,
            ADD COLUMN verified BOOLEAN DEFAULT false,
            ADD COLUMN account_status VARCHAR(50) DEFAULT 'active'
        `);
        console.log('Database altered successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error altering DB:', err.message);
        process.exit(1);
    }
}

run();
