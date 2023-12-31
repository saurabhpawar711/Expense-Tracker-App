const Expense = require('../models/expenses');
const User = require('../models/user');
const sequelize = require('../util/database');
const S3Services = require('../services/S3service');

exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const userId = req.user.id;

        const data = await Expense.create({ date: date, amount: amount, description: description, category: category, userId: userId }, { transaction: t });
        const totalAmount = Number(req.user.totalExpense) + Number(amount);
        await User.update({ 'totalExpense': totalAmount }, { where: { id: userId }, transaction: t });
        await t.commit();
        res.status(201).json({ expenseDetails: data });
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const response = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(202).json({ gotDetails: response });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const expense = await Expense.findByPk(id)
        const promise1 = User.update({ 'totalExpense': req.user.totalExpense - expense.amount }, { where: { id: userId }, transaction: t });
        const promise2 = Expense.destroy({ where: { id: id, userId: userId }, transaction: t });
        await Promise.all([promise1, promise2]);
        await t.commit();
        res.sendStatus(203);
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.downloadExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, fileName);
        res.status(200).json({ fileUrl, success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err });
    }
}

exports.getExpenseDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.body.expensePerPage, 10);
        const page = req.params.page;
        const offset = (page - 1) * limit;

        const totalNoofExpense = await Expense.count({
            where: { userId: userId }
        });
        const totalPage = Math.ceil(totalNoofExpense / limit);
        const expense = await Expense.findAll({
            where: { userId: userId },
            offset: offset,
            limit: limit
        });
        const currentPage = parseInt(page, 10); 
        const nextPage = currentPage + 1;

        const otherData = {
            currentPage: page,
            hasNextPage: limit * page < totalNoofExpense,
            nextPage: nextPage,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: totalPage
        };

        res.status(201).json({ expense: expense, data: otherData });
    }

    catch (err) {
        res.status(500).json({error: err});
    }
}