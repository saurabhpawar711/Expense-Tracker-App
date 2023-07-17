const User = require('../models/user');
const bcrypt = require('bcrypt');
const Expense = require('../models/expenses');

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(err);
        const data = await User.create({ name: name, email: email, password: hashedPassword });
        res.status(201).json({ userDetails: data });
    }
    catch (err) {
        return res.status(400).json({ error: 'User already exists' });
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const users = await User.findAll({ where: { email } });
        if (users.length === 0) {
            throw new Error('Invalid user');
        }
        const user = users[0];
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (passwordMatched) {
            res.status(202).json({ success: true, message: "User logged successfully", redirect: "file:///C:/Users/saurabh%20pawar/Expense%20Tracker%20Project/views/home.html" });
        }
        else {
            throw new Error('Incorrect password');
        }
    }
    catch (err) {
        if (err.message === 'Invalid user') {
            res.status(404).json({ success: false, error: err.message });
        } else if (err.message === 'Incorrect password') {
            res.status(401).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: 'Something went wrong' });
        }
    }
};

exports.addExpense = async (req, res, next) => {
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({ date: date, amount: amount, description: description, category: category })
        res.status(201).json({ expenseDetails: data });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const response = await Expense.findAll();
        res.status(202).json({ gotDetails: response });
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Expense.destroy({where: {id: id}});
        res.sendStatus(203);
    }
    catch(err) {
        console.log(err);
    }
}
