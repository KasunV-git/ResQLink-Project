const express = require('express');
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
    let skillId;
    const [existing] = await db.query('SELECT id FROM skills WHERE name = ?', [skillName]);
    if (existing.length === 0) {
      const [inserted] = await db.query('INSERT INTO skills (name) VALUES (?)', [skillName]);
      skillId = inserted.insertId;
    } else {
      skillId = existing[0].id;
    }

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
  // Deduplicate skills case-insensitively
  const uniqueSkillsMap = new Map();
  rawSkills.forEach(s => {
    const cleaned = String(s || '').trim();
    if (cleaned.length > 0 && cleaned.length <= 100) {
      uniqueSkillsMap.set(cleaned.toLowerCase(), cleaned);
    }
  });
  const skillsList = Array.from(uniqueSkillsMap.values());

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

    await db.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);

    if (skillIds.length > 0) {
      const values = skillIds.map(id => [userId, id]);
      await db.query('INSERT INTO user_skills (user_id, skill_id) VALUES ?', [values]);
    }

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
    return res.status(500).json({ message: 'Failed to save skills.', error: error.message, stack: error.stack });
  }
});

module.exports = router;
