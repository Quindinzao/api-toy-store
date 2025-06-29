const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./client');

const Sale = sequelize.define('Sale', {
  value: DataTypes.FLOAT,
  date: DataTypes.DATEONLY
});

Client.hasMany(Sale, { foreignKey: 'clientId' });
Sale.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Sale;