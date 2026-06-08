// backend/src/utils/generateToken.js
const jwt = require('jsonwebtoken');
const { secret, expire } = require('../config/jwt');

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: expire });
};

module.exports = generateToken;