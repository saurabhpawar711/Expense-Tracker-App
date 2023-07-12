const express = require('express');

const router = express.Router();

const mainRoute = require('../controller/main');

router.post('/user/signup', mainRoute.signUp);

router.post('/user/login', mainRoute.login);

module.exports = router;