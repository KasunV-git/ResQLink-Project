// backend/src/config/jwt.js
require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'resqlink_secret',
    expire: process.env.JWT_EXPIRE || '7d',
};