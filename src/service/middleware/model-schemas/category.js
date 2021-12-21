'use strict';

const Joi = require(`joi`);

const ErrorCommentMessage = {
  NAME: `Имя категории должно быть больше 5 символов и меньше 20 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(20).required().messages({
    'string.min': ErrorCommentMessage.NAME,
    'string.max': ErrorCommentMessage.NAME,
    'string.empty': ErrorCommentMessage.NAME,
  })
});

module.exports = schema;
