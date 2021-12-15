'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
};
const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  })
});


module.exports = (req, res, next) => {
  const comment = req.body;
  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    const errorMessages = error.details
      .reduce((acc, it) => Object.assign(acc, {[it.path]: it.message}), {});
    return res.status(HttpCode.BAD_REQUEST)
      .send(JSON.stringify(errorMessages));
  }

  return next();
};
