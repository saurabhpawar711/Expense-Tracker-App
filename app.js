const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');


require('dotenv').config();

app.use(express.static(path.join(__dirname, 'views')));

const sequelize = require('./util/database');
const User = require('./models/user');
const Expenses = require('./models/expenses')
const Order = require('./models/orders');
const ResetPassword = require('./models/resetPasswordModel');
const bodyParser = require('body-parser');

app.use(cors());
// app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json({ extended: false }));

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const orderRoute = require('./routes/order');
const leaderboardRoute = require('./routes/leaderboardRoute');
const passwordRoute = require('./routes/resetPassword');
const reportsRoute = require('./routes/reportsRoute');
const isPremium = require('./routes/checkIfPremium');

app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(leaderboardRoute);
app.use(passwordRoute);
app.use(reportsRoute);
app.use(isPremium);

app.use((req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, 'views',`${req.url}`))
})

User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
ResetPassword.belongsTo(User);

const port = process.env.PORT || 4000;
sequelize.sync()
    .then(result => {
        app.listen(port);
    })
    .catch(err => console.log(err));