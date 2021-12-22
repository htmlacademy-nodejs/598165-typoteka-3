'use strict';
const Alias = require(`../models/alias`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  findAll(articleId) {
    if (!articleId) {
      return this._Comment.findAll({
        attributes: [`id`, `text`, `createdAt`],
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: [`firstName`, `lastName`, `avatar`]
          },
          {
            model: this._Article,
            as: Alias.ARTICLES,
            attributes: [`title`, `id`]
          }
        ],
        order: [[`createdAt`, `DESC`]],
        raw: true
      });
    }
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  create(articleId, comment) {
    return this._Comment.create(({
      articleId,
      ...comment
    }));
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
