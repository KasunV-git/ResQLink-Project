// backend/src/middlewares/errorMiddleware.js

// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

// 404 handler
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        data: null,
    });
};

module.exports = { errorHandler, notFound };