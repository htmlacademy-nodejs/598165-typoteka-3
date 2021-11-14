"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getApi();


mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  if (!query) {
    return res.render(`search-result`, {results: null});
  }
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {results});
  } catch (error) {
    return res.render(`search-result`, {results: []});
  }

});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
