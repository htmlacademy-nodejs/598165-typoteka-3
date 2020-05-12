'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const articleExist = require(`../middleware/article-exist`);
const commentsValidator = require(`../middleware/comments-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.SUCCESS).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.SUCCESS)
      .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {

    const {articleId} = req.params;
    const articleExists = articleService.findOne(articleId);

    if (!articleExists) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.SUCCESS)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {

    const {articleId} = req.params;
    console.log(articleId);
    const article = articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.SUCCESS)
      .json(article);

  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {

    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HttpCode.SUCCESS)
      .json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {

    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.SUCCESS)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentsValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);

  });

};

