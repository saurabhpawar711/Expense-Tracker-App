const express = require('express');

const router = express.Router();

const leaderboardRoute = require('../controller/leaderboard');

const authenticateRoute = require('../middleware/authenticate');

const isPremiumRoute = require('../middleware/isPremium');

router.get('/premium/show-leaderboard', authenticateRoute.authenticateUser, isPremiumRoute.premiumStatus, leaderboardRoute.showExpenses);

module.exports = router;