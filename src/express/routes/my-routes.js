'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getApi();
const {asyncHandler: ash} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const authorOnly = require(`../middlewares/author-only`);
const saveAuthor = require(`../middlewares/save-author`);

const myRouter = new Router();

myRouter.get(`/`, auth, saveAuthor, authorOnly, ash(async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles(true);
  res.render(`my-articles`, {articles, user});
}));

myRouter.get(`/comments`, auth, saveAuthor, authorOnly, ash(async (req, res) => {
  const {user} = req.session;

  const comments = await api.getComments();
  res.render(`comments`, {comments, user});
}));

module.exports = myRouter;
