'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {asyncHandler: ash} = require(`../../utils`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, ash(async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  }));

  route.get(`/:categoryId`, ash(async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne(categoryId);
    const {count, articlesInCategory} = await service.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesInCategory
      });
  }));
};
