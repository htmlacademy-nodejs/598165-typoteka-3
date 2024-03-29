"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getApi();
const {upload} = require(`../middlewares/upload`);
const saveAuthor = require(`../middlewares/save-author`);
const {handleAsync} = require(`../../utils`);

const {ARTICLES_PER_PAGE} = require(`../../constants`);

mainRouter.get(`/`, saveAuthor, handleAsync(async (req, res) => {
  const {user} = req.session;

  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories, popular, comments] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true),
    api.getMostCommented(),
    api.getComments()
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {
    articles,
    page,
    totalPages,
    categories,
    popular,
    comments: comments.slice(0, 4),
    user,
  });
}));

mainRouter.get(`/register`, (req, res) => res
  .render(`sign-up`, {noPopup: true}));

mainRouter.post(`/register`, upload.single(`avatar`), handleAsync(async (req, res) => {
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

mainRouter.post(`/login`, handleAsync(async (req, res) => {
  try {
    req.session.user = await api
      .auth(req.body[`user-email`], req.body[`user-password`]);
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (err) {
    const errors = err.response.data;
    res.render(`sign-up`, {noPopup: true, login: true, errors});
  }
}));

mainRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/`);
  });
});

mainRouter.get(`/search`, saveAuthor, handleAsync(async (req, res) => {
  const {query} = req.query;
  const {user} = req.session;

  if (!query) {
    return res.render(`search-result`, {results: null, user});
  }
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {results, user});
  } catch (error) {
    return res.render(`search-result`, {results: [], user});
  }
}));

module.exports = mainRouter;
