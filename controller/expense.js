const Expense = require('../models/expenses');


exports.addExpense = async (req, res, next) => {
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const userId = req.user.id;

        const data = await Expense.create({ date: date, amount: amount, description: description, category: category, userId: userId })
        res.status(201).json({ expenseDetails: data });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const response = await Expense.findAll({where: {userId: req.user.id}});
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
        await Expense.destroy({where: {id: id, userId: userId}});
        res.sendStatus(203);
    }
    catch(err) {
        console.log(err);
    }
}

