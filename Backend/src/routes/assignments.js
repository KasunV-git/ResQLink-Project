'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

/* ── helpers ──────────────────────────────────────────────── */

function formatAssignment(row) {
  return {
    id:            row.id,
    disaster:      row.disaster,
    task:          row.task,
    location:      row.location,
    status:        row.status,
    assignedDate:  row.assigned_date  ? formatDate(row.assigned_date)  : null,
    completedDate: row.completed_date ? formatDate(row.completed_date) : null,
  };
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/* ══ GET /api/assignments/:userId ══════════════════════════════
 *  Returns two separate arrays for Dashboard compatibility.
 */
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM assignments
        WHERE user_id = ?
        ORDER BY
          FIELD(status, 'in-progress', 'assigned', 'completed') ASC,
          assigned_date DESC`,
      [userId]
    );

    const activeAssignments    = [];
    const completedAssignments = [];

    for (const row of rows) {
      const formatted = formatAssignment(row);
      if (row.status === 'completed') {
        completedAssignments.push(formatted);
      } else {
        activeAssignments.push(formatted);
      }
    }

    return res.json({ activeAssignments, completedAssignments });
  } catch (error) {
    console.error('Assignments fetch error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch assignments.' });
  }
});

/* ══ POST /api/assignments/:id/start ══════════════════════════
 *  Transition: assigned → in-progress
 *  Guards: must currently be 'assigned'
 */
router.post('/:id/start', async (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, status FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    const { status } = rows[0];

    if (status === 'in-progress') {
      return res.status(400).json({ message: 'Task is already in progress.' });
    }
    if (status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot be restarted.' });
    }
    if (status !== 'assigned') {
      return res.status(400).json({ message: 'Only assigned tasks can be started.' });
    }

    await db.query(
      "UPDATE assignments SET status = 'in-progress' WHERE id = ?",
      [assignmentId]
    );

    return res.json({ message: 'Task started successfully.', status: 'in-progress' });
  } catch (error) {
    console.error('Start assignment error:', error.message);
    return res.status(500).json({ message: 'Failed to start assignment.' });
  }
});

/* ══ POST /api/assignments/:id/complete ═══════════════════════
 *  Transition: in-progress → completed
 *  Guards: must currently be 'in-progress' (prevents assigned → completed jump)
 */
router.post('/:id/complete', async (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, status FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    const { status } = rows[0];

    if (status === 'completed') {
      return res.status(400).json({ message: 'Assignment is already completed.' });
    }
    if (status === 'assigned') {
      return res.status(400).json({
        message: 'Task must be started before it can be completed.',
      });
    }
    if (status !== 'in-progress') {
      return res.status(400).json({ message: 'Invalid assignment status.' });
    }

    const dateString = todayString();

    await db.query(
      "UPDATE assignments SET status = 'completed', completed_date = ? WHERE id = ?",
      [dateString, assignmentId]
    );

    return res.json({
      message:       'Assignment completed successfully.',
      status:        'completed',
      completedDate: formatDate(dateString),
    });
  } catch (error) {
    console.error('Complete assignment error:', error.message);
    return res.status(500).json({ message: 'Failed to complete assignment.' });
  }
});

module.exports = router;
