'use strict';

const crypto = require(`crypto`);

class ArticleService {

  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign({
      id: crypto.randomUUID(),
      comments: []
    }, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const foundArticle = this._articles.find((article) => article.id === id);

    if (!foundArticle) {
      return null;
    }

    this._articles = this._articles.filter((article) => article.id !== id);
    return foundArticle;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);
    const updatedArticle = Object.assign(oldArticle, article);
    this._articles = this._articles.filter((item) => item.id !== id);
    this._articles.push(updatedArticle);

    return updatedArticle;
  }
}

module.exports = ArticleService;

