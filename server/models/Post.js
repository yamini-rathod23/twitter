
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Post = sequelize.define("Post", {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  post_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post_content: {
    type: DataTypes.STRING(280),
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
  tableName: "posts",
  timestamps: false
});

module.exports = Post;
