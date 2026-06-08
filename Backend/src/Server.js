// backend/src/server.js
const app = require('./App');
const { connectDB, sequelize } = require('./config/db');
require('./models'); // load all models and associations
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        // Connect to MySQL
        await connectDB();

        // Sync all models - creates tables if not exist
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synced');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err.message);
        process.exit(1);
    }
};

start();