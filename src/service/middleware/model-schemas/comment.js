'use strict';

const Joi = require(`joi`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  TEXT_MAX: `Комментарий не больше 250 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
};
const schema = Joi.object({
  text: Joi.string().min(20).max(255).required().messages({
    'string.min': ErrorCommentMessage.TEXT,
    'string.max': ErrorCommentMessage.TEXT_MAX,
    'string.empty': ErrorCommentMessage.TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base':
    ErrorCommentMessage.USER_ID
  })
});

module.exports = schema;
