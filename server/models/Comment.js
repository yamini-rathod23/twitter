// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comment_post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_text: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'COMMENTS',
  timestamps: false,
});

module.exports = Comment;
