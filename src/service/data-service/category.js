'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(withCount) {
    console.log(`count`, withCount);
    if (withCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, `*`), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId);
  }

  async findPage(categoryId, limit, offset) {
    const articlesIdsByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesIds = articlesIdsByCategory.map((articleCategory) => articleCategory.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit, offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesIds
      },
      distinct: true
    });

    return {count, articlesInCategory: rows};
  }
}

module.exports = CategoryService;
