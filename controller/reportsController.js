const Expense = require('../models/expenses');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Op = Sequelize.Op;

exports.getDailyReports = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const date = req.body.date;
        const userId = req.user.id;
        const data = await Expense.findAll({
            where: { date: date, userId: userId },
            transaction: t
        });
        await t.commit();
        res.status(200).json({data: data, success: true});
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({error: err});
    }
}

exports.getMonthlyReports = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const month = req.body.month;
        const userId = req.user.id;
        const data = await Expense.findAll({
            where: {
                date: {
                    [Op.like]: `%/${month}/%`
                },
                userId: userId
            },
            transaction: t
        });
        await t.commit();
        res.status(200).json({data: data, success: true});
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({error: err});
    }
}