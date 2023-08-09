const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        User.findByPk(user.userId)
        .then(user => {
            req.user = user;
            next();
        })
    }
    catch (err) {
        return res.status(401).json({success: false, error: 'error while authenticating user'});
    }
}