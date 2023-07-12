const User = require('../models/user');

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({ name: name, email: email, password: password });
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
        if (user.password === password) {
            res.status(202).json({ success: true, message: "User logged successfully" });
        } else {
            throw new Error('Incorrect password');
        }
    } catch (err) {
        if (err.message === 'Invalid user') {
            res.status(404).json({ success: false, error: err.message });
        } else if (err.message === 'Incorrect password') {
            res.status(401).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
};

