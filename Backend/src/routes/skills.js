const express = require('express');
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
  }
});

module.exports = router;
