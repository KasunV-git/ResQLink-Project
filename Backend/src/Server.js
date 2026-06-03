<<<<<<< HEAD
const express = require("express");
const sequelize = require("./database/connection");

const app = express();

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
=======
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const skillsRouter = require('./routes/skills');
const alertsRouter = require('./routes/alerts');
const assignmentsRouter = require('./routes/assignments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/assignments', assignmentsRouter);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ResQLink API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
>>>>>>> origin/main
