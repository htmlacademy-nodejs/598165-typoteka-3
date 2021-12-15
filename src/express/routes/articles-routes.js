'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getApi();
const {upload} = require(`../upload`);
const {ensureArray, asyncHandler: ash} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:categoryId`, ash(async (req, res) => {
  const {categoryId} = req.params;

  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [categories, {category, count, articlesInCategory}] = await Promise.all([
    api.getCategories(true),
    api.getArticlesInCategory({categoryId, limit, offset}),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`category-articles`, {
    categories,
    count,
    currentCategory: category,
    articlesInCategory,
    page,
    totalPages,
  });
}));

articlesRouter.get(`/add`, ash(async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new-article`, {categories});
}));

articlesRouter.post(`/add`, upload.single(`picture`), ash(async (req, res) => {
  const {body, file} = req;
  const [day, month, year] = body[`created-date`].split(`.`);
  const articleData = {
    title: body.title,
    createdDate: new Date(year, month - 1, day),
    announce: body.announce,
    fullText: body[`full-text`],
    category: body.categories ? ensureArray(body.categories) : [],
    picture: file ? file.filename : ``
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
}));

articlesRouter.get(`/edit/:id`, ash(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  const categories = await api.getCategories();
  res.render(`articles/edit-article`, {article, categories});
}));

articlesRouter.get(`/:id`, ash(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`articles/article`, {article});
}));

module.exports = articlesRouter;
