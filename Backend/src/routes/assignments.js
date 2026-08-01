const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function todayString() {
  const d = new Date();
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* ══ GET /api/assignments (Admin all assignments) ══ */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.id, a.user_id, u.name as volunteer_name, u.first_name, u.last_name, a.disaster, a.task, a.location, a.status, a.assigned_date, a.completed_date
      FROM assignments a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.id DESC
    `);

    const assignments = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      volunteerName: row.volunteer_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Unknown Volunteer',
      disaster: row.disaster,
      task: row.task,
      location: row.location,
      status: row.status,
      assignedDate: formatDate(row.assigned_date) || row.assigned_date,
      completedDate: formatDate(row.completed_date) || row.completed_date
    }));

    return res.json(assignments);
  } catch (error) {
    console.error('Fetch all assignments error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* ══ GET /api/assignments/:userId ══ */
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM assignments WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );

    const activeAssignments    = [];
    const completedAssignments = [];

    for (const row of rows) {
      const formatted = {
        id:            row.id,
        disaster:      row.disaster,
        task:          row.task,
        location:      row.location,
        status:        row.status,
        assignedDate:  formatDate(row.assigned_date) || row.assigned_date,
        completedDate: formatDate(row.completed_date) || row.completed_date,
      };

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

/* ══ POST /api/assignments/:id/start ══ */
router.post('/:id/start', async (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID.' });
  }

  try {
    const [rows] = await db.query('SELECT id, status FROM assignments WHERE id = ?', [assignmentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    await db.query("UPDATE assignments SET status = 'in-progress' WHERE id = ?", [assignmentId]);

    return res.json({ message: 'Task started successfully.', status: 'in-progress' });
  } catch (error) {
    console.error('Start assignment error:', error.message);
    return res.status(500).json({ message: 'Failed to start assignment.' });
  }
});

/* ══ POST /api/assignments/:id/complete ══ */
router.post('/:id/complete', async (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ message: 'Invalid assignment ID.' });
  }

  const dateDb = todayString();
  const dateUi = formatDate(dateDb);

  try {
    const [rows] = await db.query('SELECT id, status FROM assignments WHERE id = ?', [assignmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    await db.query(
      "UPDATE assignments SET status = 'completed', completed_date = ? WHERE id = ?",
      [dateDb, assignmentId]
    );

    return res.json({
      message: 'Assignment completed successfully.',
      status: 'completed',
      completedDate: dateUi,
    });
  } catch (error) {
    console.error('Complete assignment error:', error.message);
    return res.status(500).json({ message: 'Failed to complete assignment.' });
  }
});

/* ══ POST /api/assignments (Admin assign) ══ */
router.post('/', async (req, res) => {
  const { userId, disaster, task, location } = req.body;
  if (userId === undefined || userId === null || userId === '' || !disaster || !task || !location) {
    return res.status(400).json({ message: 'userId, disaster, task, and location are required.' });
  }

  const numericUserId = parseInt(userId, 10);
  if (isNaN(numericUserId)) {
    return res.status(400).json({ message: 'Invalid volunteer ID.' });
  }

  const dateDb = todayString();
  const dateUi = formatDate(dateDb);

  try {
    const [userRows] = await db.query('SELECT id, name, first_name, last_name FROM users WHERE id = ?', [numericUserId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Volunteer user not found in database.' });
    }

    const volunteerName = userRows[0].name || `${userRows[0].first_name || ''} ${userRows[0].last_name || ''}`.trim() || 'Volunteer';

    const [result] = await db.query(
      `INSERT INTO assignments (user_id, disaster, task, location, status, assigned_date) 
       VALUES (?, ?, ?, ?, 'assigned', ?)`,
      [numericUserId, disaster.trim(), task.trim(), location.trim(), dateDb]
    );

    // Automatically ensure volunteer is marked available/active when assigned a task
    await db.query(`UPDATE users SET is_available = 1 WHERE id = ?`, [numericUserId]);

    return res.status(201).json({
      id: result.insertId,
      userId: numericUserId,
      volunteerName,
      disaster: disaster.trim(),
      task: task.trim(),
      location: location.trim(),
      status: 'assigned',
      assignedDate: dateUi,
      completedDate: null
    });
  } catch (error) {
    console.error('Create assignment error:', error.message);
    return res.status(500).json({ message: error.message || 'Failed to create assignment on server.' });
  }
});

/* ══ DELETE /api/assignments/:id (Admin cancel) ══ */
router.delete('/:id', async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const [rows] = await db.query('SELECT id FROM assignments WHERE id = ?', [assignmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    await db.query('DELETE FROM assignments WHERE id = ?', [assignmentId]);
    return res.json({ message: 'Assignment cancelled successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
