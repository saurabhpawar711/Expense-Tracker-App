const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user');

exports.buyPremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });
        const amount = 19900;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            req.user
                .createOrder({ orderId: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id, status } = req.body;
        const order = Order.findOne({ where: { orderId: order_id } });
        if (order) {
            console.log(status);
            if (status === "FAILED") {
                await Order.update({ status: status }, { where: { orderId: order_id } });
            }
            else if (status === "SUCCESSFUL") {
                const promise1 = Order.update({ paymentId: payment_id, status: status }, { where: { orderId: order_id } });
                const promise2 = req.user.update({ isPremiumUser: true });

                Promise.all([promise1, promise2])
                return await res.status(202).json({ message: "Payment Successful", success: true});
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.premiumStatus = async (req, res, next) => {
    try {
        const premiumUser = req.user.isPremiumUser;
        return res.json({premiumUser});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
}