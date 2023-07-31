const express = require('express');

const router = express.Router();

const orderRoute = require('../controller/order');

const middlewareRoute = require('../middleware/authenticate');

router.get('/premium/buy-premium', middlewareRoute.authenticateUser, orderRoute.buyPremium);

router.post('/premium/update-status', middlewareRoute.authenticateUser, orderRoute.updateStatus);

router.get('/premium/premium-status', middlewareRoute.authenticateUser, orderRoute.premiumStatus);

module.exports = router;