const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const userRole = role === 'Citizen' ? 'Citizen' : 'Volunteer';

    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, role, is_available, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, '', userRole, true, password]
    );

    const userId = result.insertId;

    // If volunteer, seed default skills suggestion list association (empty by default)
    res.status(201).json({
      id: userId,
      name,
      email,
      phone: '',
      role: userRole,
      isAvailable: true,
      skills: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email. Please register first.' });
    }

    const user = rows[0];

    // Verify password against the stored password in database
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
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

module.exports = router;
