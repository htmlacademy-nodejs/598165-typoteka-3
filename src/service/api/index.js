'use strict';

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

module.exports = {
  article,
  category,
  search,
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  getMockData,
};
