const express = require('express');

const router = express.Router();

const expenseRoute = require('../controller/expense');

const authenticateRoute = require('../middleware/authenticate');

router.post('/expense/add-expenses', authenticateRoute.authenticateUser, expenseRoute.addExpense);

router.get('/expense/get-expenses', authenticateRoute.authenticateUser, expenseRoute.getExpense);

router.delete('/expense/delete-expenses/:id', authenticateRoute.authenticateUser, expenseRoute.deleteExpense);

module.exports = router;