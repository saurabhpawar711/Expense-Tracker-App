const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = await User.create({ name: name, email: email, password: hashedPassword });
        console.log(60);
        res.status(201).json({userDetails: data, success: true});
        console.log(65);
        
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
            console.log(45);
            res.status(202).json({ success: true, message: "User logged successfully", token: generateToken(user.id) });
            console.log(50);
        }
        else {
            throw new Error('Incorrect password');
        }
        console.log(50);
    }
    catch (err) {
        console.log(err);
        if (err.message === 'Invalid user') {
            res.status(404).json({ success: false, error: err.message });
        } else if (err.message === 'Incorrect password') {
            res.status(401).json({ success: false, error: err.message });
        } else {
            console.log(err);
            res.status(500).json({ success: false, error: 'Something went wrong' });
        }
    }
};
