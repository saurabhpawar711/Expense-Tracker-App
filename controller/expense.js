const Expense = require('../models/expenses');
const User = require('../models/user');


exports.addExpense = async (req, res, next) => {
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const userId = req.user.id;

        const data = await Expense.create({ date: date, amount: amount, description: description, category: category, userId: userId });
        const totalAmount = Number(req.user.totalExpense) + Number(amount);
        await User.update({ 'totalExpense': totalAmount }, { where: { id: userId } });
        res.status(201).json({ expenseDetails: data });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const response = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(202).json({ gotDetails: response });
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const expense = await Expense.findByPk(id)
        const promise1 = User.update({ 'totalExpense': req.user.totalExpense - expense.amount }, { where: { id: userId } });
        const promise2 = Expense.destroy({ where: { id: id, userId: userId } });
        Promise.all([promise1, promise2]);
        res.sendStatus(203);
    }
    catch (err) {
        console.log(err);
    }
}

