'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.ceil(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomPostion = Math.floor(Math.random() * i);
    [shuffled[i], shuffled[randomPostion]] = [shuffled[randomPostion], shuffled[i]];
  }

  return shuffled;
};

module.exports = {
  getRandomInt,
  shuffle
};
