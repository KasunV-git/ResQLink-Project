// backend/src/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Force load .env from backend root folder
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME || 'resqlink_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully');
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };