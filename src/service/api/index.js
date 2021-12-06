'use strict';

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const defineModels = require(`../models`);

module.exports = {
  article,
  category,
  search,
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  defineModels,
};
