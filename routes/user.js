const express = require('express');

const router = express.Router();

const userRoute = require('../controller/user');

const middlewareRoute = require('../middleware/authenticate');

router.post('/user/signup', userRoute.signUp);

router.post('/user/login', userRoute.login);

module.exports = router;