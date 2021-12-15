'use strict';

const path = require(`path`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.ceil(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [shuffled[i], shuffled[randomPosition]] = [shuffled[randomPosition], shuffled[i]];
  }

  return shuffled;
};

const ensureArray = (arg) => Array.isArray(arg)
  ? arg.map((it) => +it)
  : [+arg];

const getRandomSubarray = (array) => {
  array = array.slice();
  let count = getRandomInt(1, array.length - 1);
  const result = [];
  while (count--) {
    result.push(...array.splice(getRandomInt(0, array.length - 1), 1));
  }
  return result;
};

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const checkFileType = (file) => {
  const fileExtension = path.extname(file.originalname);
  const allowedTypes = /jpeg|jpg|png/;

  return allowedTypes.test(fileExtension.toLowerCase());
};

const asyncHandler = (callback) => {
  return async function (req, res, next) {
    try {
      return await callback(req, res);
    } catch (err) {
      return next(err);
    }
  };
};

const prepareErrors = (errors) => errors.response.data.split(`\n`);

module.exports = {
  getRandomInt,
  shuffle,
  ensureArray,
  getRandomSubarray,
  getRandomFromArray,
  checkFileType,
  asyncHandler,
  prepareErrors,
};
