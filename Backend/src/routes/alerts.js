const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get active emergency alerts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alerts ORDER BY id DESC');
    
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

// Create new alert (for admin)
router.post('/', async (req, res) => {
  const { priority, message, source, target } = req.body;
  if (!priority || !message || !source) {
    return res.status(400).json({ message: 'Priority, message, and source are required' });
  }

  // Format current time as: "Month Day, Hour:Minute AM/PM" (e.g. "Apr 3, 03:00 PM")
  const today = new Date();
  const formatTime = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    return `${month} ${day}, ${formattedHours}:${minutes} ${ampm}`;
  };
  const timeString = formatTime(today);

  try {
    const [result] = await db.query(
      `INSERT INTO alerts (priority, message, source, time, target) VALUES (?, ?, ?, ?, ?)`,
      [priority, message, source, timeString, target || 'For Volunteers']
    );

    res.status(201).json({
      id: result.insertId,
      priority,
      message,
      source,
      time: timeString,
      target: target || 'For Volunteers'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete alert (for admin)
router.delete('/:id', async (req, res) => {
  const alertId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM alerts WHERE id = ?', [alertId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await db.query('DELETE FROM alerts WHERE id = ?', [alertId]);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
