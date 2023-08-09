const Razorpay = require('razorpay');
const Order = require('../models/orders');
const sequelize = require('../util/database');

exports.buyPremium = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });
        const amount = 19900;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(err);
            }
            req.user
                .createOrder({ orderId: order.id, status: 'PENDING' }, {transaction: t})
                .then(() => {
                    t.commit();
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }
    catch (err) {
        await t.rollback();
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.updateStatus = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { payment_id, order_id, status } = req.body;
        const order = Order.findOne({ where: { orderId: order_id }, transaction: t });
        if (order) {
            if (status === "FAILED") {
                await Order.update({ status: status }, { where: { orderId: order_id }, transaction: t });
            }
            else if (status === "SUCCESSFUL") {
                const promise1 = Order.update({ paymentId: payment_id, status: status }, { where: { orderId: order_id }, transaction: t });
                const promise2 = req.user.update({ isPremiumUser: true }, {transaction: t});

                await Promise.all([promise1, promise2]);
                await t.commit();
                return res.status(202).json({ message: "Payment Successful", success: true });
            }
        }
    }
    catch (err) {
        await t.rollback();
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.premiumStatus = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const premiumUser = req.user.isPremiumUser;
        await t.commit();
        return res.json({ premiumUser });
    }
    catch (err) {
        await t.rollback();
        return res.status(500).json({ error: err });
    }
}