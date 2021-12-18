"use strict";

const {HttpCode} = require(`../../constants`);
const {ErrorRegisterMessage} = require(`./model-schemas/user`);

module.exports = (service) => async (req, res, next) => {
  const userByEmail = await service.findByEmail(req.body.email);
  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({email: ErrorRegisterMessage.EMAIL_EXIST});
  }
  return next();
};
