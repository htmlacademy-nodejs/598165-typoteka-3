'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getApi();
const {asyncHandler: ash} = require(`../../utils`);


const myRouter = new Router();

myRouter.get(`/`, ash(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles(true);
  res.render(`my-articles`, {articles, user});
}));

myRouter.get(`/comments`, ash(async (req, res) => {
  const {user} = req.session;
  const article = await api.getArticle(1, true);
  const author = `Александр Петров`;
  res.render(`comments`, {article, author, user});
}));

module.exports = myRouter;
