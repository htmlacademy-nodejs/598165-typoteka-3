'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  TEXT_MAX: `Полный текст не может содержать более 1000 символов`,
  CATEGORIES: `Не выбрана ни одна категория публикации`,
  CATEGORIES_TYPE: `Номер категории должен быть положительным числом`,
  PICTURE: `Тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
    'string.empty': ErrorArticleMessage.ANNOUNCE_MIN,
  }),
  fullText: Joi.string().max(1000).empty(``).messages({
    'string.max': ErrorArticleMessage.TEXT_MAX
  }),
  categories: Joi.array().items(Joi
    .number().integer().positive().messages({
      'number.base': ErrorArticleMessage.CATEGORIES_TYPE,
    })).min(1).required().messages({
    'array.min': ErrorArticleMessage.CATEGORIES,
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  }),
  picture: Joi.string().empty(``),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    const errorMessages = error.details.reduce((acc, it) => Object.assign(acc, {[it.path]: it.message}), {});
    return res.status(HttpCode.BAD_REQUEST)
      .send(JSON.stringify(errorMessages));
  }

  return next();
};
