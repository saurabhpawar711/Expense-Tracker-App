const User = require('../models/user');
const sequelize = require('../util/database')

exports.getLeaderboardDetails = async (req, res) => {
    try {
        const limit = 10;
        const page = req.params.page;
        const offset = (page - 1) * limit;

        const totalNoofUsers = await User.count();
        const totalPage = Math.ceil(totalNoofUsers / limit);

        const users = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            offset: offset,
            limit: limit,
            order: [[sequelize.col('totalExpense'), 'DESC']]
        })
        const currentPage = parseInt(page, 10); 
        const nextPage = currentPage + 1;

        const otherData = {
            currentPage: page,
            hasNextPage: limit * page < totalNoofUsers,
            nextPage: nextPage,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: totalPage
        };
        res.status(201).json({ users: users, data: otherData });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({error: "Something went wrong during showing expenses"});
    }
}