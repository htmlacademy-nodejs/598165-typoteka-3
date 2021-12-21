"use strict";

const {Router} = require(`express`);
const csrf = require(`csurf`);

const api = require(`../api`).getApi();
const auth = require(`../middlewares/auth`);
const authorize = require(`../middlewares/authorize`);
const {asyncHandler: ash} = require(`../../utils`);

const categoriesRouter = new Router();
const csrfProtection = csrf();

const CATEGORY_DELETION_ERROR = `Категория не может быть удалена если ей принадлежит хотя бы одна публикация`;


categoriesRouter.get(`/`, [
  auth,
  authorize,
  csrfProtection
], ash(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  return res.render(`all-categories`, {
    user,
    categories,
    csrfToken: req.csrfToken()
  });
}));

categoriesRouter.post(`/add`, [
  auth,
  authorize,
  csrfProtection
], ash(async (req, res) => {

  const {category} = req.body;
  const {user} = req.session;

  try {
    await api.createCategory({name: category});
    res.redirect(`/categories`);
  } catch (err) {
    const errors = err.response.data;
    const categories = await api.getCategories();
    res.render(`all-categories`, {
      categories,
      user,
      addErrors: errors,
      addSavedValue: category,
      csrfToken: req.csrfToken()
    });
  }
}));

categoriesRouter.post(`/edit/:categoryId`, [
  auth,
  authorize,
  csrfProtection
], ash(async (req, res) => {

  const {category} = req.body;
  const {categoryId} = req.params;
  const {user} = req.session;

  try {
    await api.editCategory(categoryId, {name: category});
    res.redirect(`/categories`);
  } catch (err) {
    const errors = err.response.data;
    const categories = await api.getCategories();

    res.render(`all-categories`, {
      categories,
      user,
      errors,
      savedValue: category,
      editCategoryId: categoryId,
      csrfToken: req.csrfToken()
    });
  }
}));

categoriesRouter.get(`/delete/:categoryId`, [
  auth,
  authorize,
  csrfProtection
], ash(async (req, res) => {

  const {categoryId} = req.params;
  const {user} = req.session;

  try {
    await api.deleteCategory(categoryId);
    res.redirect(`/categories`);
  } catch (err) {
    const errors = {name: CATEGORY_DELETION_ERROR};
    const categories = await api.getCategories();

    res.render(`all-categories`, {
      categories,
      user,
      errors,
      editCategoryId: categoryId,
      csrfToken: req.csrfToken()
    });
  }
}));

module.exports = categoriesRouter;
