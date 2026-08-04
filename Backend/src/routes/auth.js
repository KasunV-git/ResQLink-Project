const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const db      = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'resqlink_secret_key_2026';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper: Fetch a user by ID — returns safe user object
async function getUserById(id) {
  const [rows] = await db.query(
    'SELECT id, username, name, first_name, last_name, email, phone, role, is_available, avatar_url FROM users WHERE id = ?',
    [id]
  );
  if (rows.length === 0) return null;
  const u = rows[0];

  let skillRows = [];
  try {
    const [skills] = await db.query(
      `SELECT s.name FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?`,
      [u.id]
    );
    skillRows = skills;
  } catch (e) {
    console.warn('Could not fetch user skills:', e.message);
  }

  const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'User';

  return {
    id:          u.id,
    username:    u.username || u.name || 'user',
    name:        displayName,
    firstName:   u.first_name || (u.name ? u.name.split(' ')[0] : ''),
    lastName:    u.last_name  || (u.name ? u.name.split(' ').slice(1).join(' ') : ''),
    email:       u.email || '',
    phone:       u.phone || '',
    role:        u.role || 'Volunteer',
    isAvailable: Boolean(u.is_available),
    avatarUrl:   u.avatar_url || null,
    skills:      skillRows.map(r => r.name),
  };
}

// Helper: Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/* ══ POST /api/auth/signup & /api/auth/register ══ */
const handleSignup = async (req, res) => {
  const username        = (req.body.username || req.body.name || '').trim();
  const inputEmail      = (req.body.email || '').trim();
  const name            = (req.body.name || username || '').trim();
  const firstName       = (req.body.firstName || (name ? name.split(' ')[0] : '')).trim();
  const lastName        = (req.body.lastName  || (name ? name.split(' ').slice(1).join(' ') : '')).trim();
  const password        = (req.body.password  || '');
  const confirmPassword = req.body.confirmPassword;
  const phone           = (req.body.phone     || '').trim();
  const reqRole         = (req.body.role || '').toLowerCase();

  // Restrict signup to Citizen or Volunteer (Admin accounts cannot be registered publicly)
  const role = reqRole === 'citizen' ? 'Citizen' : 'Volunteer';

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const combinedName   = name || `${firstName} ${lastName}`.trim() || username;
    const emailVal       = inputEmail || (username.includes('@') ? username : `${username.toLowerCase()}@resqlink.com`);

    const [existing] = await db.query(
      'SELECT username, email FROM users WHERE LOWER(username) = ? OR (email IS NOT NULL AND email != "" AND LOWER(email) = ?)',
      [username.toLowerCase(), emailVal.toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, name, first_name, last_name, email, phone, role, is_available, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, combinedName, firstName, lastName, emailVal, phone || null, role, 1, hashedPassword]
    );

    const newUser = await getUserById(result.insertId);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
      ...newUser,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

router.post('/signup', handleSignup);
router.post('/register', handleSignup);

/* ══ POST /api/auth/login ══ */
router.post('/login', async (req, res) => {
  const username = (req.body.username || req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '');

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, password FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? OR LOWER(name) = ? OR LOWER(email) = ?',
      [username, username, username, `${username}@resqlink.com`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid username or password.' });
    }

    const dbPassword = rows[0].password;
    const passwordMatch = (dbPassword === password)
      ? true
      : await bcrypt.compare(password, dbPassword).catch(() => false);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = await getUserById(rows[0].id);
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user,
      ...user,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

/* ══ POST /api/auth/google ══ */
router.post('/google', async (req, res) => {
  const { token, role } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'No Google token provided.' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, name } = payload;

    // Check if user exists by email
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    let userId;
    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      // Create new user with selected role (default to Citizen)
      const userRole = (role && role.toLowerCase() === 'volunteer') ? 'Volunteer' : 'Citizen';
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      
      const [result] = await db.query(
        'INSERT INTO users (username, name, first_name, last_name, email, role, is_available, password, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username, name || '', given_name || (name ? name.split(' ')[0] : ''), family_name || '', email, userRole, 1, hashedPassword, picture]
      );
      userId = result.insertId;
    }

    const user = await getUserById(userId);
    const jwtToken = generateToken(user);

    return res.json({
      success: true,
      token: jwtToken,
      user,
      ...user,
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    return res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
});

/* ══ POST /api/auth/logout ══ */
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/* ══ GET /api/auth/me ══ */
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : (req.headers['x-access-token'] || req.query.token);

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      token,
      user,
      ...user,
    });
  } catch (error) {
    console.error('JWT verify error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

/* ══ GET /api/auth/profile/:id ══ */
router.get('/profile/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID.' });

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({
      success: true,
      user,
      ...user,
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
});

/* ══ PUT /api/auth/profile/:id ══ */
router.put('/profile/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID.' });

  const { name, firstName, lastName, phone, isAvailable, avatarUrl } = req.body;
  const updates = [];
  const params  = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name.trim());
  }
  if (firstName !== undefined) {
    updates.push('first_name = ?');
    params.push(firstName.trim());
  }
  if (lastName !== undefined) {
    updates.push('last_name = ?');
    params.push(lastName.trim());
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    params.push(phone.trim() || null);
  }
  if (isAvailable !== undefined) {
    updates.push('is_available = ?');
    params.push(isAvailable ? 1 : 0);
  }

  if (avatarUrl !== undefined) {
    if (!avatarUrl) {
      updates.push('avatar_url = NULL');
    } else if (avatarUrl.startsWith('data:image/')) {
      try {
        const matches = avatarUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          const uploadsDir = path.join(__dirname, '../uploads/avatars');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const filename = `avatar-${userId}-${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, buffer);

          const publicPath = `/uploads/avatars/${filename}`;
          updates.push('avatar_url = ?');
          params.push(publicPath);
        } else {
          updates.push('avatar_url = ?');
          params.push(avatarUrl);
        }
      } catch (err) {
        console.error('Failed to save avatar image file:', err);
        return res.status(400).json({ success: false, message: 'Failed to process avatar image.' });
      }
    } else {
      updates.push('avatar_url = ?');
      params.push(avatarUrl);
    }
  }

  try {
    if (updates.length > 0) {
      params.push(userId);
      await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({
      success: true,
      user,
      ...user,
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

/* ══ GET /api/auth/volunteers (Admin) ══ */
router.get('/volunteers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.first_name, u.last_name, u.email, u.phone, u.is_available, u.avatar_url,
             (SELECT COUNT(*) FROM assignments a WHERE a.user_id = u.id AND a.status != 'completed') AS active_assignments_count
      FROM users u
      WHERE u.role = 'Volunteer'
      ORDER BY u.id ASC
    `);

    const volunteers = await Promise.all(rows.map(async (v) => {
      let skillsRows = [];
      try {
        const [s] = await db.query(`
          SELECT s.name FROM skills s
          JOIN user_skills us ON s.id = us.skill_id
          WHERE us.user_id = ?
        `, [v.id]);
        skillsRows = s;
      } catch (e) {
        console.warn('Could not fetch skills for volunteer:', v.id);
      }

      return {
        id: v.id,
        name: v.name || `${v.first_name || ''} ${v.last_name || ''}`.trim() || 'Volunteer',
        email: v.email,
        phone: v.phone || '',
        isAvailable: Boolean(v.is_available),
        avatarUrl: v.avatar_url || null,
        activeAssignmentsCount: v.active_assignments_count,
        skills: skillsRows.map(row => row.name)
      };
    }));

    res.json(volunteers);
  } catch (error) {
    console.error('Volunteers list error:', error.message);
    res.status(500).json({ message: 'Failed to fetch volunteers.' });
  }
});

// --- ALERT ZONES ROUTES ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : req.headers['x-access-token'];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

router.get('/zones', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_alert_zones WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    res.json({ success: true, zones: rows });
  } catch (error) {
    console.error('Fetch zones error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch zones' });
  }
});

router.post('/zones', authenticateToken, async (req, res) => {
  const { name, severity = 'LOW', active = true } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Zone name is required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO user_alert_zones (user_id, name, severity, active) VALUES (?, ?, ?, ?)',
      [req.user.id, name, severity, active]
    );
    const [newRows] = await db.query('SELECT * FROM user_alert_zones WHERE id = ?', [result.insertId]);
    res.json({ success: true, zone: newRows[0] });
  } catch (error) {
    console.error('Add zone error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add zone' });
  }
});

router.put('/zones/:id', authenticateToken, async (req, res) => {
  const zoneId = parseInt(req.params.id, 10);
  const { active } = req.body;
  try {
    await db.query('UPDATE user_alert_zones SET active = ? WHERE id = ? AND user_id = ?', [active ? 1 : 0, zoneId, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Update zone error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update zone' });
  }
});

router.delete('/zones/:id', authenticateToken, async (req, res) => {
  const zoneId = parseInt(req.params.id, 10);
  try {
    await db.query('DELETE FROM user_alert_zones WHERE id = ? AND user_id = ?', [zoneId, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete zone error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete zone' });
  }
});

module.exports = router;
