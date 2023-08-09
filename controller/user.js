const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

exports.signUp = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = await User.create({ name: name, email: email, password: hashedPassword }, {transaction: t});
        await t.commit();
        res.status(201).json({userDetails: data, success: true});
        
    }
    catch (err) {
        await t.rollback();
        return res.status(400).json({ error: 'User already exists' });
    }
}

function generateToken(id) {
    return jwt.sign({userId: id}, 'secretkey')
}

exports.login = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const email = req.body.email;
        const password = req.body.password;

        const users = await User.findAll({ where: { email }, transaction: t });
        if (users.length === 0) {
            throw new Error('Invalid user');
        }
        const user = users[0];
        const passwordMatched = await bcrypt.compare(password, user.password)
        
        if (passwordMatched) {
            await t.commit();
            res.status(202).json({ success: true, message: "User logged successfully", token: generateToken(user.id) });
        }
        else {
            throw new Error('Incorrect password');
        }
    }
    catch (err) {
        if (err.message === 'Invalid user') {
            await t.rollback();
            res.status(404).json({ success: false, error: err.message });
        } else if (err.message === 'Incorrect password') {
            await t.rollback();
            res.status(401).json({ success: false, error: err.message });
        } else {
            await t.rollback();
            res.status(500).json({ success: false, error: 'Something went wrong' });
        }
    }
};

