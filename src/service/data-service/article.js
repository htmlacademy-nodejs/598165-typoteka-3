'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class ArticleService {

  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(withComments) {
    const include = [Alias.CATEGORIES, {
      model: this._User,
      as: Alias.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];

    if (withComments) {
      include.push({
        model: this._Comment, as: Alias.COMMENTS,
        include: [{
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }

  async findMostCommented() {
    const result = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        `announce`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`Article.id`)), `comments-count`]
      ],
      group: [Sequelize.col(`Article.id`)],
      include: [{
        model: this._Comment,
        as: Alias.COMMENTS,
        attributes: [],
      }],
      order: [
        [Sequelize.col(`comments-count`), `DESC`]
      ],
    });
    return result.map((it) => it.get()).slice(0, 4);
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Alias.CATEGORIES,
        {
          model: this._Comment, as: Alias.COMMENTS,
          include: [{
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }]
        },
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });
    return {count, articles: rows};
  }

  findOne(id, withComments) {
    const options = {
      include: [
        Alias.CATEGORIES,
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      where: [{
        id
      }]
    };

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [{
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
      options.order = [
        [{model: this._Comment, as: Alias.COMMENTS}, `createdAt`, `DESC`]
      ];
    }
    return this._Article.findOne(options);
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
