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
};
