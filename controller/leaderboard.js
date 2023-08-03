const User = require('../models/user');
const Expense = require('../models/expenses');


exports.showExpenses = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();

        const userTotalCost = {};
        expenses.forEach((expense) => {
            const amount = expense.amount;
            const userId = expense.userId;

            if (userTotalCost[userId]) {
                userTotalCost[userId] += amount;
            }
            else {
                userTotalCost[userId] = amount;
            }
        })
        const leaderboardData = [];
        const positionNo = [];
        let position = 1;
        users.forEach((user) => {
            leaderboardData.push({ name: user.name, totalAmount: userTotalCost[user.id] || 0 });
        })
        users.forEach((user) => {
            positionNo.push({position: position, name: user.name})
            position++;
        })

        leaderboardData.sort((a, b) => b.totalAmount - a.totalAmount)   
        console.log(leaderboardData);
        res.status(202).json({ userLeaderboardDetails: leaderboardData, userPositionDetails: positionNo });

    }
    catch (err) {
        console.log(err);
    }
}