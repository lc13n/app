const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const usersRouter = require('./routes/users');
const challengesRouter = require('./routes/challenges');
const submissionsRouter = require('./routes/submissions');

app.use('/api', usersRouter);
app.use('/api', challengesRouter);
app.use('/api', submissionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});