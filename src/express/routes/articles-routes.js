'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getApi();
const {upload} = require(`../upload`);
const {ensureArray} = require(`../../utils`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`category-articles`, {articles});
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new-article`, {categories});
});

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const [day, month, year] = body[`created-date`].split(`.`);
  const articleData = {
    title: body.title,
    createdDate: new Date(year, month - 1, day),
    announce: body.announce,
    fullText: body[`full-text`].split(/[\r?\n]+/),
    category: body.categories ? ensureArray(body.categories) : [],
    picture: file ? file.filename : ``
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  const categories = await api.getCategories();
  res.render(`articles/edit-article`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/article`, {article});
});

module.exports = articlesRouter;
