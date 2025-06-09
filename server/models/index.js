

const sequelize = require('../db');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Post belongs to a User (Author)
Post.belongsTo(User, {
  foreignKey: 'post_user_id',
  onDelete: 'CASCADE',
  as: 'author'
});
User.hasMany(Post, {
  foreignKey: 'post_user_id',
  sourceKey: 'USER_ID',
  onDelete: 'CASCADE'
});

// Comment belongs to a Post
Comment.belongsTo(Post, {
  foreignKey: 'comment_post_id',
  onDelete: 'CASCADE'
});
Post.hasMany(Comment, {
  foreignKey: 'comment_post_id',
  onDelete: 'CASCADE'
});

// Comment belongs to a User (Commenter)
Comment.belongsTo(User, {
  foreignKey: 'comment_user_id',
  as: 'commenter',
  onDelete: 'CASCADE'
});
User.hasMany(Comment, {
  foreignKey: 'comment_user_id',
  onDelete: 'CASCADE'
});

// Export models and Sequelize instance
const db = {
  sequelize,
  User,
  Post,
  Comment
};

module.exports = db;



