'use strict';

const Alias = require(`../models/alias`);

class ArticleService {

  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
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
    const include = [Alias.CATEGORIES];
    if (withComments) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }

  async findPage({limit, offset, categoryId}) {
    if (categoryId) {
      const category = this._Category.findByPk(categoryId);
      const articles = await category.getArticles({row: true});
      console.log(articles);
      return articles;
    }
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });
    return {count, articles: rows};
  }

  findOne(id, withComments) {
    const include = [Alias.CATEGORIES];
    if (withComments) {
      include.push(Alias.COMMENTS);
    }
    return this._Article.findByPk(id, {include});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
