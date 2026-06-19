// backend/src/utils/responseHandler.js

// Success response
const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// Error response
const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

module.exports = { successResponse, errorResponse };