// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { errorResponse } = require('../utils/responseHandler');

// Protect routes - verify JWT token
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Not authorized. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        return errorResponse(res, 'Token is invalid or expired.', 401);
    }
};

module.exports = { protect };