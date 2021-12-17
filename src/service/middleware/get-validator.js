'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (schema) => (req, res, next) => {
  const body = req.body;
  const {error} = schema.validate(body, {abortEarly: false});

  if (error) {
    const errorMessages = error.details
      .reduce((acc, it) => Object.assign(acc, {[it.path]: it.message}), {});
    return res.status(HttpCode.BAD_REQUEST)
      .send(JSON.stringify(errorMessages));
  }

  return next();
};
