const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

function formatAlertTime(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);

  const month = d.toLocaleString('en-US', { month: 'short' });
  const day   = d.getDate();
  let   hours = d.getHours();
  const mins  = String(d.getMinutes()).padStart(2, '0');
  const ampm  = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, '0');

  return `${month} ${day}, ${hh}:${mins} ${ampm}`;
}

/* ══ GET /api/alerts ══ */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, priority, message, source, time, alert_time, target
        FROM alerts
       ORDER BY id DESC
    `);

    const alerts = rows.map(row => ({
      id:       row.id,
      priority: row.priority,
      message:  row.message,
      source:   row.source,
      time:     row.time || formatAlertTime(row.alert_time),
      target:   row.target,
    }));

    return res.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch alerts.' });
  }
});

/* ══ POST /api/alerts (Admin create) ══ */
router.post('/', async (req, res) => {
  const { priority, message, source, target } = req.body;
  if (!priority || !message || !source) {
    return res.status(400).json({ message: 'Priority, message, and source are required' });
  }

  const timeString = formatAlertTime(new Date());

  try {
    const [result] = await db.query(
      `INSERT INTO alerts (priority, message, source, time, target) VALUES (?, ?, ?, ?, ?)`,
      [priority, message, source, timeString, target || 'For Volunteers']
    );

    return res.status(201).json({
      id: result.insertId,
      priority,
      message,
      source,
      time: timeString,
      target: target || 'For Volunteers'
    });
  } catch (error) {
    console.error('Create alert error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* ══ DELETE /api/alerts/:id (Admin delete) ══ */
router.delete('/:id', async (req, res) => {
  const alertId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM alerts WHERE id = ?', [alertId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await db.query('DELETE FROM alerts WHERE id = ?', [alertId]);
    return res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
