const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const sequelize = require('./util/database');

const User = require('./models/user');
const Expenses = require('./models/expenses')
const Order = require('./models/orders');

const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const orderRoute = require('./routes/order');
const premiumRoute = require('./routes/premiumRoute');

app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(premiumRoute);

User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(4000);
})
.catch(err => console.log(err));