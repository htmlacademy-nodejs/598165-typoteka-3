"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getApi();
const {asyncHandler: ash} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;


mainRouter.get(`/`, ash(async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories});
}));

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, ash(async (req, res) => {
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

}));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
