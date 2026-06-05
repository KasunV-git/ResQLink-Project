const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get active emergency alerts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM alerts
      ORDER BY
        CASE priority
          WHEN 'high'   THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low'    THEN 3
          ELSE 4
        END ASC,
        created_at DESC
    `);
    
    // Map db columns to match frontend expectations
    const alerts = rows.map(row => ({
      id: row.id,
      priority: row.priority,
      message: row.message,
      source: row.source,
      time: row.time,
      target: row.target
    }));

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
