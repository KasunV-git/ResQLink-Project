<<<<<<< HEAD
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

/**
 * Format a JS Date (or MySQL DATETIME string) into the human-readable
 * string the frontend already expects, e.g. "Apr 3, 03:00 PM".
 * Keeps the API response shape identical to the old VARCHAR approach
 * while the DB now stores a proper DATETIME.
 */
function formatAlertTime(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);

  const month = d.toLocaleString('en-US', { month: 'short' });  // "Apr"
  const day   = d.getDate();                                     // 3
  let   hours = d.getHours();
  const mins  = String(d.getMinutes()).padStart(2, '0');
  const ampm  = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, '0');

  return `${month} ${day}, ${hh}:${mins} ${ampm}`;             // "Apr 3, 03:00 PM"
}

/* ══ GET /api/alerts ══════════════════════════════════════════
 *
 *  Order: priority ASC using ENUM declaration order
 *         (high=1, medium=2, low=3 — MySQL ENUM sorts by ordinal position),
 *         then most-recent alert_time first.
 *
 *  Replaces the old CASE expression with a clean ENUM sort.
 *  API response shape is unchanged — `time` is still a formatted string.
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, priority, message, source, alert_time, target
        FROM alerts
       ORDER BY priority ASC, alert_time DESC
    `);

    const alerts = rows.map(row => ({
      id:       row.id,
      priority: row.priority,
      message:  row.message,
      source:   row.source,
      time:     formatAlertTime(row.alert_time),  // formatted for the frontend
      target:   row.target,
=======
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
>>>>>>> kasuni-development
    }));

    res.json(alerts);
  } catch (error) {
<<<<<<< HEAD
    console.error('Alerts fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch alerts.' });
=======
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
>>>>>>> kasuni-development
  }
});

module.exports = router;
