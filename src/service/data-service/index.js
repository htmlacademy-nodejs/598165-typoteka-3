'use strict';

const ArticleService = require(`./article`);
const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);


module.exports = {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService,
};
