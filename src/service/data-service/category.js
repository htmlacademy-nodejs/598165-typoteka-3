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
    if (withCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    }
    return await this._Category.findAll({raw: true});
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

  create(name) {
    return this._Category.create({name});
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    let category = await this._Category.findOne({
      where: {id},
      attributes: [
        `id`,
        `name`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)), `count`]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticleCategory,
        as: Alias.ARTICLE_CATEGORIES,
        attributes: []
      }]
    });

    if (!category) {
      return false;
    }

    category = category.get();
    if (+category.count) {
      return false;
    }

    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
