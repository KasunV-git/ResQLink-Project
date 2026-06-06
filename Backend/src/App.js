const path = require('path');

// Load .env from Backend/.env — MUST be first before any other require
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const initDb       = require('./database/initDb');
const runMigrations = require('./database/migrate');
const app          = require('./Server');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDb();          // create DB + tables + seed data
    await runMigrations();   // safely apply schema improvements
    app.listen(PORT, () => {
      console.log(`✅ ResQLink Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
