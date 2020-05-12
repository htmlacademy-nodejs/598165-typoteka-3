'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {

  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
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
    return Object.assign(oldArticle, article);
  }
}

module.exports = ArticleService;

