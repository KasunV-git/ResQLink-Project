const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const authRouter        = require('./routes/auth');
const skillsRouter      = require('./routes/skills');
const alertsRouter      = require('./routes/alerts');
const assignmentsRouter = require('./routes/assignments');

const app = express();

// Ensure uploads/avatars directory exists
const uploadsDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Middleware ──
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// ── Health check ──
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ResQLink API', timestamp: new Date().toISOString() });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
