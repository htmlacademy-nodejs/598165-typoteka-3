'use strict';

const {HttpCode} = require(`../../constants`);

const commentsKeys = [`text`];

module.exports = (req, res, next) => {
  const keys = Object.keys(req.body);
  const keysExists = commentsKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
