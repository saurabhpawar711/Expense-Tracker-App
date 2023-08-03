
exports.premiumStatus = async (req, res, next) => {
    try {
        const premiumUser = req.user.isPremiumUser;
        if(premiumUser) {
            next();
        }
        else {
            throw new Error('Premium membership required');
        }
    }
    catch(err) {
        console.log(err);
        if (err.message === 'Premium membership required') {
            res.status(403).json({ success: false, error: err.message });
        }
    }
}