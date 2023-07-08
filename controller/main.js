const User = require('../models/user');

exports.addUser = async (req, res, next) => {
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