"use strict";

const {Model} = require(`sequelize`);

const Alias = require(`./alias`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {
    as: Alias.ARTICLES,
    foreignKey: `userId`,
    onDelete: `cascade`
  });
  Article.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(User, {foreignKey: `userId`});

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  class ArticleCategory extends Model {}

  ArticleCategory.init({}, {
    sequelize,
    tableName: `articles_categories`
  });

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES
  });
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;

