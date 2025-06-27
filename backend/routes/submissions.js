const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.post('/submissions', auth('user'), async (req, res) => {
  const { challenge_id, flag } = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await pool.execute(
      'SELECT * FROM User_Solved_Challenges WHERE user_id = ? AND challenge_id = ?',
      [userId, challenge_id]
    );
    if (existing.length > 0) return res.status(400).json({ message: 'You can only solve this challenge once' });

    const [challenge] = await pool.execute('SELECT flag, points FROM Challenges WHERE challenge_id = ?', [challenge_id]);
    if (!challenge[0]) return res.status(404).json({ message: 'Challenge not found' });

    const correctFlag = challenge[0].flag;
    const isCorrect = flag === correctFlag;
    const points = challenge[0].points;

    const [result] = await pool.execute(
      'INSERT INTO Submissions (user_id, challenge_id, flag, is_correct) VALUES (?, ?, ?, ?)',
      [userId, challenge_id, flag, isCorrect]
    );

    if (isCorrect) {
      await pool.execute(
        'INSERT INTO User_Solved_Challenges (user_id, challenge_id) VALUES (?, ?)',
        [userId, challenge_id]
      );
      await pool.execute(
        'UPDATE Users SET points = points + ? WHERE user_id = ?',
        [points, userId]
      );
      await pool.execute('UPDATE Challenges SET solves = solves + 1 WHERE challenge_id = ?', [challenge_id]);
      await pool.execute(
        'INSERT INTO Challenge_Solves_History (challenge_id, solve_count) VALUES (?, (SELECT solves FROM Challenges WHERE challenge_id = ?))',
        [challenge_id, challenge_id]
      );
    }

    const solvedChallenges = await getSolvedChallenges(userId);
    res.status(201).json({ message: 'Submission recorded', isCorrect, solvedChallenges, pointsEarned: isCorrect ? points : 0 });
  } catch (error) {
    res.status(400).json({ message: 'Submission failed', error });
  }
});

async function getSolvedChallenges(userId) {
  const [results] = await pool.execute(
    'SELECT c.name FROM User_Solved_Challenges usc JOIN Challenges c ON usc.challenge_id = c.challenge_id WHERE usc.user_id = ?',
    [userId]
  );
  return results.map(row => row.name);
}

router.get('/solved-challenges', auth('user'), async (req, res) => {
  try {
    const solvedChallenges = await getSolvedChallenges(req.user.id);
    res.json({ solvedChallenges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/leaderboard', auth('user'), async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT user_id, name, points FROM Users ORDER BY points DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;