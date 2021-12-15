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
  const articleData = {
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: ensureArray(body.categories),
    picture: file ? file.filename : ``
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const errors = err.response.data;
    const categories = await getAddArticleData();

    res.render(`articles/new-article`, {
      categories,
      errors,
    });
  }
}));

articlesRouter.get(`/edit/:id`, ash(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`articles/edit-article`, {id, article, categories});
}));

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), ash(async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: ensureArray(body.categories),
    picture: file ? file.filename : ``
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    const errors = err.response.data;
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/edit-article`, {id, article, categories, errors});
  }
}));

articlesRouter.get(`/:id`, ash(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`articles/article`, {article, id});
}));

articlesRouter.post(`/:id/comments`, ash(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const errors = err.response.data;
    const article = await api.getArticle(id, true);
    res.render(`articles/article`, {article, id, errors});
  }

}));

function getAddArticleData() {
  return api.getCategories();
}

async function getEditArticleData(articleId) {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
}

module.exports = articlesRouter;
