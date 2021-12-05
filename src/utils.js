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

const ensureArray = (arg) => Array.isArray(arg) ? arg : [arg];

const checkFileType = (file) => {
  const fileExtension = path.extname(file.originalname);
  const allowedTypes = /jpeg|jpg|png/;

  return allowedTypes.test(fileExtension.toLowerCase());
};

const asyncHandler = (callback) => {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next);
  };
};

module.exports = {
  getRandomInt,
  shuffle,
  ensureArray,
  checkFileType,
  asyncHandler,
};

