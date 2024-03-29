'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExists = require(`../middleware/article-exists`);
const routeParamsValidator = require(`../middleware/route-params-vallidator`);

const getValidator = require(`../middleware/get-validator`);
const articleSchema = require(`../middleware/model-schemas/article`);
const commentSchema = require(`../middleware/model-schemas/comment`);

const articleValidator = getValidator(articleSchema);
const commentsValidator = getValidator(commentSchema);

const {handleAsync} = require(`../../utils`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, handleAsync(async (req, res) => {
    const {offset, limit, categoryId, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset, categoryId});
    } else {
      result = await articleService.findAll({comments});
    }
    return res.status(HttpCode.OK).json(result);
  }));

  route.get(`/popular`, handleAsync(async (req, res) => {
    const articles = await articleService.findMostCommented();
    return res.status(HttpCode.OK)
      .json(articles);
  }));

  route.get(`/comments`, handleAsync(async (req, res) => {
    const comments = await commentService.findAll();
    return res.status(HttpCode.OK)
      .json(comments);
  }));


  route.get(`/:articleId`, handleAsync(async (req, res) => {
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

  route.put(`/:articleId`, articleValidator, handleAsync(async (req, res) => {
    const {articleId} = req.params;
    const oldArticle = await articleService.findOne(articleId);

    if (!oldArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article with ID ${articleId} wasn't found`);
    }

    const edition = req.body;

    if (!edition.picture) {
      edition.picture = oldArticle.picture;
    }
    const isUpdated = articleService.update(articleId, edition);

    if (!isUpdated) {
      return res.status(HttpCode.NOT_FOUND).send(`Article with id ${articleId} wasn't found`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  }));

  route.delete(`/:articleId`, handleAsync(async (req, res) => {
    const {articleId} = req.params;
    const isDeleted = await articleService.drop(articleId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  }));

  route.get(`/:articleId/comments`, articleExists(articleService), handleAsync(async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    return res.status(HttpCode.OK)
      .json(comments);
  }));

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), handleAsync(async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.drop(commentId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const [comments, popularArticles] = await Promise.all([
      commentService.findAll(),
      articleService.findMostCommented()
    ]);

    return res.status(HttpCode.OK)
      .json({
        comments,
        popularArticles
      });
  }));

  route.post(`/:articleId/comments`, [
    routeParamsValidator,
    articleExists(articleService),
    commentsValidator
  ], handleAsync(async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    const [newComment, popularArticles] = await Promise.all([
      commentService.findOne(comment.id),
      articleService.findMostCommented()
    ]);

    return res.status(HttpCode.CREATED)
      .json({
        newComment,
        popularArticles
      });
  }));
};
