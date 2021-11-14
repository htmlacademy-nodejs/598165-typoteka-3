'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`category-articles`));
articlesRouter.get(`/add`, (req, res) =>
  res.render(`articles/new-article`));
articlesRouter.get(`/edit/:id`, (req, res) =>
  res.render(`articles/edit-article`));
articlesRouter.get(`/:id`, (req, res) =>
  res.render(`articles/article`));

module.exports = articlesRouter;
