const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('sequelize');


exports.showExpenses = async (req, res, next) => {
    try {
        const expensesofusers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalAmount']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [[sequelize.col('totalAmount'), 'DESC']]
        });

        const positionNo = [];
        let position = 1;
        expensesofusers.forEach((user) => {
            positionNo.push({ position: position })
            position++;
        })
        res.status(202).json({ userLeaderboardDetails: expensesofusers, userPositionDetails: positionNo });
    }
    catch (err) {
        console.log(err);
    }
}