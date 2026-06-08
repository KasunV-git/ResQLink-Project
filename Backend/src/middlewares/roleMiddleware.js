// backend/src/middlewares/roleMiddleware.js
const { errorResponse } = require('../utils/responseHandler');

// Allow only specific roles to access route
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
        }
        next();
    };
};

module.exports = { allowRoles };