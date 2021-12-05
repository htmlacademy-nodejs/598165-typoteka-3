'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getApi();
const {asyncHandler: ash} = require(`../../utils`);


const myRouter = new Router();

myRouter.get(`/`, ash(async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my-articles`, {articles});
}));

myRouter.get(`/comments`, ash(async (req, res) => {
  const articles = await api.getArticles();
  const author = `Александр Петров`;
  const comments = articles
    .reduce((acc, article) => {
      acc = acc.concat(article.comments
        .map((comment) => ({...comment, articleTitle: article.title})));
      return acc;
    }, [])
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  res.render(`comments`, {comments, author});
}));

module.exports = myRouter;
