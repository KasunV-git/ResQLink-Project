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

module.exports = router;
