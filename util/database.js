const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', 'Saurabh@2023' , {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;