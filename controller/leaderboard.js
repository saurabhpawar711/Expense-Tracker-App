const User = require('../models/user');
const sequelize = require('../util/database')

exports.showExpenses = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expensesofusers = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        }, {transaction: t});
        await t.commit();
        res.status(202).json({ userLeaderboardDetails: expensesofusers });
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({message: "Something went wrong during showing expenses"});
    }
}