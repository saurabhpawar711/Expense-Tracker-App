const express = require('express');

const router = express.Router();

const passwordRoute = require('../controller/resetPwd');

router.post('/password/forgotpassword', passwordRoute.sendEmail);

module.exports = router;