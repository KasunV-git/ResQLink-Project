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
    }));

    res.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch alerts.' });
  }
});

module.exports = router;
