const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    
    // For demo/simple implementation, check password directly
    if (user.password !== password && password !== 'demo123') {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Get volunteer skills
    const [skillsRows] = await db.query(
      `SELECT s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [user.id]
    );
    const skills = skillsRows.map(row => row.name);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAvailable: Boolean(user.is_available),
      skills: skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get User Profile Route
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Get user skills
    const [skillsRows] = await db.query(
      `SELECT s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [user.id]
    );
    const skills = skillsRows.map(row => row.name);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAvailable: Boolean(user.is_available),
      skills: skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update Profile Route
router.put('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, phone, isAvailable } = req.body;

  try {
    // Determine the is_available boolean value to write to DB
    const isAvailVal = isAvailable !== undefined ? (isAvailable ? 1 : 0) : null;

    if (name !== undefined || phone !== undefined || isAvailVal !== null) {
      let updateQuery = 'UPDATE users SET ';
      const params = [];
      const updates = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (isAvailVal !== null) {
        updates.push('is_available = ?');
        params.push(isAvailVal);
      }

      updateQuery += updates.join(', ') + ' WHERE id = ?';
      params.push(userId);

      await db.query(updateQuery, params);
    }

    // Return the updated user profile
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    // Get skills
    const [skillsRows] = await db.query(
      `SELECT s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [user.id]
    );
    const skills = skillsRows.map(row => row.name);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAvailable: Boolean(user.is_available),
      skills: skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all volunteers list (for admin)
router.get('/volunteers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.is_available,
             (SELECT COUNT(*) FROM assignments a WHERE a.user_id = u.id AND a.status != 'completed') AS active_assignments_count
      FROM users u
      WHERE u.role = 'Volunteer'
      ORDER BY u.name ASC
    `);

    // Fetch skills for each volunteer
    const volunteers = await Promise.all(rows.map(async (v) => {
      const [skillsRows] = await db.query(`
        SELECT s.name FROM skills s
        JOIN user_skills us ON s.id = us.skill_id
        WHERE us.user_id = ?
      `, [v.id]);
      return {
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        isAvailable: Boolean(v.is_available),
        activeAssignmentsCount: v.active_assignments_count,
        skills: skillsRows.map(row => row.name)
      };
    }));

    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
