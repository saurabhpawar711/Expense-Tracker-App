const express = require('express');

const router = express.Router();

const mainRoute = require('../controller/main');

router.post('/user/add-user', mainRoute.addUser);

module.exports = router;