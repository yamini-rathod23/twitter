const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  USER_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  USER_NAME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  USER_EMAIL: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  USER_PASSWORD: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  CREATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IS_DELETED: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'USERS',
  timestamps: false
});

module.exports = User;
