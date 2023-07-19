const User = require('../models/user');
const bcrypt = require('bcrypt');
const Expense = require('../models/expenses');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = await User.create({ name: name, email: email, password: hashedPassword });
        res.status(201).json({ userDetails: data });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'User already exists' });
    }
}

function generateToken(id) {
    return jwt.sign({userId: id}, 'secretkey')
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
            res.status(202).json({ success: true, message: "User logged successfully", token: generateToken(user.id) });
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

