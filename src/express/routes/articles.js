'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`articles/category/:id${req.params.id}`);
});

articlesRouter.get(`/add`, (req, res) => {
  res.send(`articles/add`);
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  res.send(`articles/edit/:id${req.params.id}`);
});

articlesRouter.get(`/:id`, (req, res) => {
  res.send(`articles/:id${req.params.id}`);
});

module.exports = articlesRouter;
