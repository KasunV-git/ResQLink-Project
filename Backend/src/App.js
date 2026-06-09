// backend/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const disasterRoutes = require('./routes/disasterRoutes');
const alertRoutes = require('./routes/alertRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// Allow frontend to connect
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
    ],
    credentials: true,
}));

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ResQLink API running ✅' });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;