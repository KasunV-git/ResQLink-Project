const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get active and completed assignments for a volunteer
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // 1. Get assignments
    const [rows] = await db.query('SELECT * FROM assignments WHERE user_id = ?', [userId]);

    const activeAssignments = [];
    const completedAssignments = [];

    rows.forEach(row => {
      const formatted = {
        id: row.id,
        disaster: row.disaster,
        task: row.task,
        location: row.location,
        status: row.status,
        assignedDate: row.assigned_date,
        completedDate: row.completed_date
      };

      if (row.status === 'completed') {
        completedAssignments.push(formatted);
      } else {
        activeAssignments.push(formatted);
      }
    });

    res.json({
      activeAssignments,
      completedAssignments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Mark assignment as complete
router.post('/:id/complete', async (req, res) => {
  const assignmentId = req.params.id;
  
  // Format current date as M/D/YYYY
  const today = new Date();
  const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  try {
    const [rows] = await db.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await db.query(
      "UPDATE assignments SET status = 'completed', completed_date = ? WHERE id = ?",
      [dateString, assignmentId]
    );

    res.json({ message: 'Assignment marked as completed successfully', completedDate: dateString });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all assignments (for admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.id, a.user_id, u.name as volunteer_name, a.disaster, a.task, a.location, a.status, a.assigned_date, a.completed_date
      FROM assignments a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.id DESC
    `);

    const assignments = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      volunteerName: row.volunteer_name || 'Unknown Volunteer',
      disaster: row.disaster,
      task: row.task,
      location: row.location,
      status: row.status,
      assignedDate: row.assigned_date,
      completedDate: row.completed_date
    }));

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Assign a volunteer to a task (for admin)
router.post('/', async (req, res) => {
  const { userId, disaster, task, location } = req.body;
  if (!userId || !disaster || !task || !location) {
    return res.status(400).json({ message: 'userId, disaster, task, and location are required' });
  }

  // Format current date as M/D/YYYY
  const today = new Date();
  const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  try {
    // Verify user exists and is a volunteer
    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [result] = await db.query(
      `INSERT INTO assignments (user_id, disaster, task, location, status, assigned_date) 
       VALUES (?, ?, ?, ?, 'assigned', ?)`,
      [userId, disaster, task, location, dateString]
    );

    res.status(201).json({
      id: result.insertId,
      userId,
      volunteerName: userRows[0].name,
      disaster,
      task,
      location,
      status: 'assigned',
      assignedDate: dateString,
      completedDate: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Cancel/Delete assignment (for admin)
router.delete('/:id', async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    await db.query('DELETE FROM assignments WHERE id = ?', [assignmentId]);
    res.json({ message: 'Assignment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
