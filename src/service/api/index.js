'use strict';

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const user = require(`./user`);


const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service`);

const defineModels = require(`../models`);

module.exports = {
  article,
  category,
  search,
  user,
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
  defineModels,
};
