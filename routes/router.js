const express = require('express');

const router = express.Router();

const userRoute = require('../controller/user');

const expenseRoute = require('../controller/expense');

const middlewareRoute = require('../middleware/authenticate');

router.post('/user/signup', userRoute.signUp);

router.post('/user/login', userRoute.login);

router.post('/expense/add-expenses', middlewareRoute.authenticateUser, expenseRoute.addExpense);

router.get('/expense/get-expenses', middlewareRoute.authenticateUser, expenseRoute.getExpense);

router.delete('/expense/delete-expenses/:id', middlewareRoute.authenticateUser, expenseRoute.deleteExpense);

module.exports = router;