const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const authRouter        = require('./routes/auth');
const skillsRouter      = require('./routes/skills');
const alertsRouter      = require('./routes/alerts');
const assignmentsRouter = require('./routes/assignments');
const disasterRouter    = require('./routes/disasterRoutes');

const app = express();

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads/avatars');
const reportsDir = path.join(__dirname, 'uploads/reports');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// ── Middleware ──
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
app.use('/api/auth',        authRouter);
app.use('/api/skills',      skillsRouter);
app.use('/api/alerts',      alertsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/disasters',   disasterRouter);

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: 'ResQLink Backend API is running successfully!', status: 'online' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ResQLink API', timestamp: new Date().toISOString() });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
