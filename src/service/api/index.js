'use strict';

const {Router} = require(`express`);

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {

  const mockData = await getMockData();

  article(app, new ArticleService(mockData), new CommentService(mockData));
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));

})();

module.exports = app;
