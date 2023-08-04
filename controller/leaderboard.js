const User = require('../models/user');
const sequelize = require('sequelize');


exports.showExpenses = async (req, res, next) => {
    try {
        const expensesofusers = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        })
        res.status(202).json({ userLeaderboardDetails: expensesofusers });
    }
    catch (err) {
        console.log(err);
    }
}