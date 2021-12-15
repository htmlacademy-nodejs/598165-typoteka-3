'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const articleExists = require(`../middleware/article-exists`);
const commentsValidator = require(`../middleware/comments-validator`);
const routeParamsValidator = require(`../middleware/route-params-vallidator`);

const {asyncHandler: ash} = require(`../../utils`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, ash(async (req, res) => {
    const {offset, limit, categoryId, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset, categoryId});
    } else {
      result = await articleService.findAll({comments});
    }
    return res.status(HttpCode.OK).json(result);
  }));

  route.get(`/:articleId`, ash(async (req, res) => {
    const {comments} = req.query;
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article with ID ${articleId} wasn't found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  }));

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, ash(async (req, res) => {
    const {articleId} = req.params;
    const oldArticle = await articleService.findOne(articleId);

    if (!oldArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article with ID ${articleId} wasn't found`);
    }

    const isUpdated = articleService.update(articleId, req.body);

    if (!isUpdated) {
      return res.status(HttpCode.NOT_FOUND).send(`Article with id ${articleId} wasn't found`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  }));

  route.delete(`/:articleId`, ash(async (req, res) => {
    const {articleId} = req.params;
    const isDeleted = await articleService.drop(articleId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  }));

  route.get(`/:articleId/comments`, articleExists(articleService), ash(async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    return res.status(HttpCode.OK)
      .json(comments);
  }));

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), ash(async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.drop(commentId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  }));

  route.post(`/:articleId/comments`, [
    routeParamsValidator,
    articleExists(articleService),
    commentsValidator
  ], ash(async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  }));
};
