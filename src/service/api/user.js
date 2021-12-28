"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const getValidator = require(`../middleware/get-validator`);
const {schema} = require(`../middleware/model-schemas/user`);
const emailExistValidator = require(`../middleware/email-exists`);
const passwordUtils = require(`../lib/password`);
const {handleAsync} = require(`../../utils`);
const ERROR_AUTH_MESSAGE = `Неверный электронный адрес или пароль`;

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/user`, route);

  const userValidator = getValidator(schema);

  route.post(`/`, [
    userValidator,
    emailExistValidator(service),
  ], handleAsync(async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);
    const result = await service.create(data);
    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  }));

  route.post(`/auth`, handleAsync(async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED)
        .json({auth: ERROR_AUTH_MESSAGE});
    }

    const isPasswordCorrect = await passwordUtils
      .compare(password, user.passwordHash);

    if (isPasswordCorrect) {
      delete user.passwordHash;
      return res.status(HttpCode.OK).json(user);
    }
    return res.status(HttpCode.UNAUTHORIZED)
      .json({auth: ERROR_AUTH_MESSAGE});
  }));
};

