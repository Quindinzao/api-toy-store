const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, primaryKey: true },
  birthDate: { type: DataTypes.DATEONLY, allowNull: false }
});

module.exports = Client;