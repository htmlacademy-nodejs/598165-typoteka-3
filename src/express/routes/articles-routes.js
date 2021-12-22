'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const api = require(`../api`).getApi();
const {upload} = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const authorize = require(`../middlewares/authorize`);
const {ensureArray, asyncHandler: ash} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const articlesRouter = new Router();
const csrfProtection = csrf();

articlesRouter.get(`/category/:categoryId`, authorize, ash(async (req, res) => {
  const {categoryId} = req.params;
  const {user} = req.session;

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
    user
  });
}));

articlesRouter.get(`/add`, auth, authorize, csrfProtection, ash(async (req, res) => {
  const {user} = req.session;

  const categories = await api.getCategories();
  res.render(`articles/new-article`, {
    categories,
    user,
    csrfToken: req.csrfToken()
  });
}));

articlesRouter.post(`/add`, [
  auth,
  authorize,
  upload.single(`picture`),
  csrfProtection
], ash(async (req, res) => {

  const {body, file} = req;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
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
    const savedInputs = Object
      .assign({}, articleData, {picture: file ? file.originalname : ``});

    res.render(`articles/new-article`, {
      savedInputs,
      categories,
      errors,
      user
    });
  }
}));

articlesRouter.get(`/edit/:articleId`, auth, authorize, csrfProtection, ash(async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;

  const [article, categories] = await getEditArticleData(articleId);
  res.render(`articles/edit-article`, {
    articleId,
    article,
    categories,
    user,
    csrfToken: req.csrfToken()
  });
}));

articlesRouter.post(`/edit/:articleId`, [
  auth,
  authorize,
  upload.single(`avatar`),
  csrfProtection
], ash(async (req, res) => {

  const {body, file} = req;
  const {articleId} = req.params;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
    title: body.title,
    announce: body.announce,
    fullText: body.fulltext,
    categories: ensureArray(body.categories),
    picture: file ? file.filename : ``
  };

  try {
    await api.editArticle(articleId, articleData);
    res.redirect(`/my`);
  } catch (err) {
    const errors = err.response.data;
    const [article, categories] = await getEditArticleData(articleId);
    const savedInputs = Object
      .assign({}, article, articleData, {
        categories: articleData
          .categories.map((id) => ({id}))
      });

    res.render(`articles/edit-article`, {
      articleId,
      article: savedInputs,
      categories,
      errors,
      user
    });
  }
}));

articlesRouter.get(`/:id`, authorize, csrfProtection, ash(async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const categories = await api.getCategories(true);

  const article = await api.getArticle(id, true);
  res.render(`articles/article`, {
    article,
    id,
    user,
    categories,
    showEditButton: user ? user.isHost : null,
    csrfToken: req.csrfToken()
  });
}));

articlesRouter.get(`/delete/:articleId`, auth, authorize, ash(async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;

  try {
    await api.deleteArticle(articleId);
    res.redirect(`/my`);
  } catch (errors) {
    const articles = await api.getArticles(true);
    res.render(`/my`, {articles, user});
  }
}));

articlesRouter.get(`/delete/:articleId/comments/:commentId`, auth, authorize, ash(async (req, res) => {
  const {articleId, commentId} = req.params;
  const {user} = req.session;

  try {
    await api.deleteComment(articleId, commentId);
    res.redirect(`/my/comments`);
  } catch (errors) {
    const comments = await api.getComments();
    res.render(`comments`, {comments, user});
  }
}));

articlesRouter.post(`/:id/comments`, auth, authorize, csrfProtection, ash(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const {user} = req.session;

  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const errors = err.response.data;
    const article = await api.getArticle(id, true);
    res.render(`articles/article`, {article, id, errors, user});
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
