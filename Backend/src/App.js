const app = require('./server');
const initDb = require('./database/initDb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize Database
    await initDb();
    
    // Start Listening
    app.listen(PORT, () => {
      console.log(`ResQLink Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start ResQLink server:', error);
    process.exit(1);
  }
}

startServer();
