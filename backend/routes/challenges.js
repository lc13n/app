const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/challenges', auth(), async (req, res) => {
  try {
    const [challenges] = await pool.execute('SELECT * FROM Challenges');
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/challenges/:name', auth(), async (req, res) => { 
  try {
    const [challenges] = await pool.execute('SELECT * FROM Challenges WHERE name = ?', [req.params.name]);
    if (challenges.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenges[0]); 
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/challenges', auth('admin'), async (req, res) => {
  const { name, flag, difficulty, tag, release_date, points } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO Challenges (name, flag, difficulty, tag, release_date, creator_id, points) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, flag, difficulty, tag, release_date, req.user.id, points]
    );
    res.status(201).json({ message: 'Challenge created', challengeId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Challenge creation failed', error });
  }
});

router.delete('/challenges/:id', auth('admin'), async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM Challenges WHERE challenge_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/challenges/:id', auth('admin'), async (req, res) => {
  const { name, flag, difficulty, tag, release_date, points } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE Challenges SET name = ?, flag = ?, difficulty = ?, tag = ?, release_date = ?, points = ? WHERE challenge_id = ?',
      [name, flag, difficulty, tag, release_date, points, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge updated' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
});

module.exports = router;