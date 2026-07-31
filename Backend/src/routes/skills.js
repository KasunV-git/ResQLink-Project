const express = require('express');
<<<<<<< HEAD
const router  = express.Router();
const db      = require('../config/db');

/* ══ GET /api/skills/:userId ══ */
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const [currentRows] = await db.query(
      `SELECT s.name FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?
       ORDER BY s.name`,
      [userId]
    );
    const currentSkills = currentRows.map(r => r.name);

    const [allRows] = await db.query('SELECT name FROM skills ORDER BY name');
    const suggestedSkills = allRows.map(r => r.name).filter(n => !currentSkills.includes(n));

    return res.json({ currentSkills, suggestedSkills });
  } catch (error) {
    console.error('Skills fetch error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch skills.' });
  }
});

/* ══ POST /api/skills/:userId ══ */
router.post('/:userId', async (req, res) => {
  const userId    = parseInt(req.params.userId, 10);
  const skillName = (req.body.skillName || '').trim();

  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID.' });
  if (!skillName)     return res.status(400).json({ message: 'Skill name is required.' });
  if (skillName.length > 100) return res.status(400).json({ message: 'Skill name is too long.' });

  try {
    // Get or create skill
    let skillId;
    const [existing] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
    if (existing.length === 0) {
      const [inserted] = await db.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
      skillId = inserted.insertId;
    } else {
      skillId = existing[0].id;
    }

    // Associate with user (ignore if already associated)
    await db.query(
      'INSERT IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)',
      [userId, skillId]
    );

    return res.json({ message: 'Skill added successfully.' });
  } catch (error) {
    console.error('Add skill error:', error.message);
    return res.status(500).json({ message: 'Failed to add skill.' });
  }
});

/* ══ DELETE /api/skills/:userId ══ */
router.delete('/:userId', async (req, res) => {
  const userId    = parseInt(req.params.userId, 10);
  const skillName = (req.body.skillName || '').trim();

  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID.' });
  if (!skillName)     return res.status(400).json({ message: 'Skill name is required.' });

  try {
    const [skillRows] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
    if (skillRows.length === 0) {
      return res.status(404).json({ message: 'Skill not found.' });
    }

    await db.query(
      'DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?',
      [userId, skillRows[0].id]
    );

    return res.json({ message: 'Skill removed successfully.' });
  } catch (error) {
    console.error('Remove skill error:', error.message);
    return res.status(500).json({ message: 'Failed to remove skill.' });
  }
});

/* ══ PUT /api/skills/:userId (Save all skills) ══ */
router.put('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  const rawSkills = Array.isArray(req.body.skills) ? req.body.skills : [];
  const skillsList = [
    ...new Set(
      rawSkills
        .map(s => String(s || '').trim())
        .filter(s => s.length > 0 && s.length <= 100)
    )
  ];

  try {
    const skillIds = [];

    for (const skillName of skillsList) {
      let skillId;
      const [existing] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
      if (existing.length === 0) {
        const [inserted] = await db.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
        skillId = inserted.insertId;
      } else {
        skillId = existing[0].id;
      }
      skillIds.push(skillId);
    }

    // Replace user_skills for this user
    await db.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);

    if (skillIds.length > 0) {
      const values = skillIds.map(id => [userId, id]);
      await db.query('INSERT INTO user_skills (user_id, skill_id) VALUES ?', [values]);
    }

    // Fetch updated skills list
    const [currentRows] = await db.query(
      `SELECT s.name FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?
       ORDER BY s.name`,
      [userId]
    );
    const currentSkills = currentRows.map(r => r.name);

    const [allRows] = await db.query('SELECT name FROM skills ORDER BY name');
    const suggestedSkills = allRows.map(r => r.name).filter(n => !currentSkills.includes(n));

    return res.json({
      message: 'Skills saved successfully.',
      currentSkills,
      suggestedSkills,
    });
  } catch (error) {
    console.error('Save skills error:', error.message);
    return res.status(500).json({ message: 'Failed to save skills.' });
=======
const router = express.Router();
const db = require('../config/db');

// Get current and suggested skills for a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // 1. Get current skills
    const [currentRows] = await db.query(
      `SELECT s.id, s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [userId]
    );
    const currentSkills = currentRows.map(row => row.name);

    // 2. Get suggested skills (skills the user doesn't have)
    const [allSkills] = await db.query('SELECT name FROM skills');
    const allSkillsList = allSkills.map(row => row.name);
    
    const suggestedSkills = allSkillsList.filter(skill => !currentSkills.includes(skill));

    res.json({
      currentSkills,
      suggestedSkills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a skill to user
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { skillName } = req.body;

  if (!skillName) {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  try {
    // 1. Verify skill exists in skills table or create it
    let skillId;
    const [skillRows] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
    
    if (skillRows.length === 0) {
      const [insertSkill] = await db.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
      skillId = insertSkill.insertId;
    } else {
      skillId = skillRows[0].id;
    }

    // 2. Associate with user
    await db.query('INSERT IGNORE INTO user_skills (user_id, skill_id) VALUES (?, ?)', [userId, skillId]);

    res.json({ message: 'Skill added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove a skill from user
router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { skillName } = req.body;

  if (!skillName) {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  try {
    const [skillRows] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
    if (skillRows.length > 0) {
      const skillId = skillRows[0].id;
      await db.query('DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?', [userId, skillId]);
      res.json({ message: 'Skill removed successfully' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
>>>>>>> kasuni-development
  }
});

module.exports = router;
<<<<<<< HEAD

=======
>>>>>>> kasuni-development
