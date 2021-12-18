"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getApi();
const {upload} = require(`../middlewares/upload`);
const {asyncHandler: ash} = require(`../../utils`);

const {ARTICLES_PER_PAGE} = require(`../../constants`);

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

mainRouter.get(`/register`, (req, res) => res
  .render(`sign-up`, {noPopup: true}));

mainRouter.post(`/register`, upload.single(`avatar`), ash(async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    email: body[`user-email`],
    firstName: body[`user-first-name`],
    lastName: body[`user-last-name`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const errors = err.response.data;
    const savedInputs = Object
      .assign({}, userData);
    res.render(`sign-up`, {noPopup: true, errors, savedInputs});
  }
}));

mainRouter.get(`/login`, (req, res) => res
  .render(`sign-up`, {noPopup: true, login: true}));

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
