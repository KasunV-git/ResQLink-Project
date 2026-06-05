const express = require('express');
const bcrypt  = require('bcryptjs');
const router  = express.Router();
const db      = require('../config/db');

/* ── helpers ── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fetch a user by ID — returns safe object (no password)
async function getUserById(id) {
  const [rows] = await db.query(
    'SELECT id, first_name, last_name, email, phone, role, is_available FROM users WHERE id = ?',
    [id]
  );
  if (rows.length === 0) return null;
  const u = rows[0];

  const [skillRows] = await db.query(
    `SELECT s.name FROM skills s
     JOIN user_skills us ON s.id = us.skill_id
     WHERE us.user_id = ?`,
    [u.id]
  );

  return {
    id:          u.id,
    firstName:   u.first_name,
    lastName:    u.last_name,
    name:        `${u.first_name} ${u.last_name}`,   // combined for display
    email:       u.email,
    phone:       u.phone || '',
    role:        u.role,
    isAvailable: Boolean(u.is_available),
    skills:      skillRows.map(r => r.name),
  };
}

/* ══ POST /api/auth/register ══ */
router.post('/register', async (req, res) => {
  const firstName = (req.body.firstName || '').trim();
  const lastName  = (req.body.lastName  || '').trim();
  const email     = (req.body.email     || '').trim().toLowerCase();
  const password  = (req.body.password  || '');
  const phone     = (req.body.phone     || '').trim();
  const role      = req.body.role === 'Citizen' ? 'Citizen' : 'Volunteer';

  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'First name, last name, email, and password are required.' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  if (firstName.length > 100 || lastName.length > 100) {
    return res.status(400).json({ message: 'Name is too long.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, phone, role, is_available, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone || null, role, 1, hashedPassword]
    );

    const newUser = await getUserById(result.insertId);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

/* ══ POST /api/auth/login ══ */
router.post('/login', async (req, res) => {
  const email    = (req.body.email    || '').trim().toLowerCase();
  const password = (req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT id, password FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email. Please register first.' });
    }

    const passwordMatch = await bcrypt.compare(password, rows[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const user = await getUserById(rows[0].id);
    return res.json(user);
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

/* ══ GET /api/auth/profile/:id ══ */
router.get('/profile/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID.' });

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

/* ══ PUT /api/auth/profile/:id ══ */
router.put('/profile/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID.' });

  const { firstName, lastName, phone, isAvailable } = req.body;
  const updates = [];
  const params  = [];

  if (firstName !== undefined) {
    const trimmed = firstName.trim();
    if (!trimmed) return res.status(400).json({ message: 'First name cannot be empty.' });
    updates.push('first_name = ?');
    params.push(trimmed);
  }
  if (lastName !== undefined) {
    const trimmed = lastName.trim();
    if (!trimmed) return res.status(400).json({ message: 'Last name cannot be empty.' });
    updates.push('last_name = ?');
    params.push(trimmed);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    params.push(phone.trim() || null);
  }
  if (isAvailable !== undefined) {
    updates.push('is_available = ?');
    params.push(isAvailable ? 1 : 0);
  }

  try {
    if (updates.length > 0) {
      params.push(userId);
      await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(user);
  } catch (error) {
    console.error('Profile update error:', error.message);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;
