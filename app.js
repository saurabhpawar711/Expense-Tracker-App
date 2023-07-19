const express = require('express');

const app = express();

const cors = require('cors');

const sequelize = require('./util/database');

const User = require('./models/user');

const Expenses = require('./models/expenses')

const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

const route = require('./routes/router');

app.use(route);

User.hasMany(Expenses);

Expenses.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));