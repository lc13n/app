const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

async function getSolvedChallenges(userId) {
  const [results] = await pool.execute(
    'SELECT c.name FROM User_Solved_Challenges usc JOIN Challenges c ON usc.challenge_id = c.challenge_id WHERE usc.user_id = ?',
    [userId]
  );
  return results.map(row => row.name);
}

router.post('/register', async (req, res) => {
  const { name, password } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO Users (name, password, role) VALUES (?, ?, ?)',
      [name, password, 'user']
    );
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error });
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const [users] = await pool.execute('SELECT * FROM Users WHERE name = ?', [name]);
    const user = users[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/me', auth(), async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT user_id, name, avatar, role, points FROM Users WHERE user_id = ?', [req.user.id]);
    const solvedChallenges = await getSolvedChallenges(req.user.id);
    res.json({ ...users[0], solvedChallenges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/me', auth('user'), async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE Users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [name, avatar, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
});

router.post('/users', auth('admin'), async (req, res) => {
  const { name, password, role = 'user' } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO Users (name, password, role) VALUES (?, ?, ?)',
      [name, password, role]
    );
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (error) {
    res.status(400).json({ message: 'User creation failed', error });
  }
});

router.delete('/users/:id', auth('admin'), async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM Users WHERE user_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/users/:id', auth('admin'), async (req, res) => {
  const { name, role } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE Users SET name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [name, role, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
});

module.exports = router;