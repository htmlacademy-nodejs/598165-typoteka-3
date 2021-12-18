"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const getValidator = require(`../middleware/get-validator`);
const {schema: userSchema} = require(`../middleware/model-schemas/user`);
const emailExistValidator = require(`../middleware/email-exists`);
const passwordUtils = require(`../lib/password`);
const {asyncHandler: ash} = require(`../../utils`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/user`, route);

  const userValidator = getValidator(userSchema);

  route.post(`/`, [
    userValidator,
    emailExistValidator(service),
  ], ash(async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);
    const result = await service.create(data);
    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  }));
};

