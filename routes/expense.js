const express = require('express');

const router = express.Router();

const expenseRoute = require('../controller/expense');

const middlewareRoute = require('../middleware/authenticate');

router.post('/expense/add-expenses', middlewareRoute.authenticateUser, expenseRoute.addExpense);

router.get('/expense/get-expenses', middlewareRoute.authenticateUser, expenseRoute.getExpense);

router.delete('/expense/delete-expenses/:id', middlewareRoute.authenticateUser, expenseRoute.deleteExpense);

module.exports = router;