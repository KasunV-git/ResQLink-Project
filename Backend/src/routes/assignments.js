const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

/* ── Format a DB row into a clean assignment object ── */
function formatAssignment(row) {
  return {
    id:            row.id,
    disaster:      row.disaster,
    task:          row.task,
    location:      row.location,
    status:        row.status,
    assignedDate:  row.assigned_date   ? formatDate(row.assigned_date)   : null,
    completedDate: row.completed_date  ? formatDate(row.completed_date)  : null,
  };
}

// Format a Date object or string to M/D/YYYY
function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/* ══ GET /api/assignments/:userId ══ */
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM assignments WHERE user_id = ? ORDER BY assigned_date DESC',
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

/* ══ POST /api/assignments/:id/complete ══ */
router.post('/:id/complete', async (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, status FROM assignments WHERE id = ?', [assignmentId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    if (rows[0].status === 'completed') {
      return res.status(400).json({ message: 'Assignment is already completed.' });
    }

    // Store as YYYY-MM-DD (proper DATE format)
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    await db.query(
      "UPDATE assignments SET status = 'completed', completed_date = ? WHERE id = ?",
      [dateString, assignmentId]
    );

    return res.json({
      message:       'Assignment completed successfully.',
      completedDate: formatDate(dateString),
    });
  } catch (error) {
    console.error('Complete assignment error:', error.message);
    return res.status(500).json({ message: 'Failed to complete assignment.' });
  }
});

module.exports = router;
