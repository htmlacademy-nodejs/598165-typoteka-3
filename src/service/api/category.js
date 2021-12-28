'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {handleAsync} = require(`../../utils`);

const getValidator = require(`../middleware/get-validator`);
const schema = require(`../middleware/model-schemas/category`);

const categoryValidator = getValidator(schema);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, handleAsync(async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  }));

  route.get(`/:categoryId`, handleAsync(async (req, res) => {
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

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body.name);
    return res.status(HttpCode.CREATED)
      .json(category);
  });

  route.put(`/:id`, categoryValidator, async (req, res) => {
    const {id} = req.params;
    const oldCategory = await service.findOne(id);

    if (!oldCategory) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Category with ID ${id} isn't found`);
    }

    const isUpdated = await service.update(id, req.body);

    if (!isUpdated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Category with ID ${id} isn't found`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:categoryId`, handleAsync(async (req, res) => {
    const {categoryId} = req.params;
    const isDelete = await service.drop(categoryId);

    if (!isDelete) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found or not empty`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  }));
};
