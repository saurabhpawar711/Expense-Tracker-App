const express = require('express');

const app = express();

const cors = require('cors');

const sequelize = require('./util/database');

const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

const mainRoute = require('./routes/router');

app.use(mainRoute);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));