const express = require('express');

const router = express.Router();

const leaderboardRoute = require('../controller/leaderboard');

const authenticateRoute = require('../middleware/authenticate');

router.get('/premium/show-leaderboard', authenticateRoute.authenticateUser, leaderboardRoute.showExpenses);

module.exports = router;