const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes');
const sequelize = require('./config/database');
require('./models/client');
require('./models/sale');
require('./models/user');

app.use(express.json());
app.use(routes);

sequelize.sync();

module.exports = app;
