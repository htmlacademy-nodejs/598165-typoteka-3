'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_ANNOUNCES = 5;
const MAX_COUNT = 1000;
const MAX_CATEGORIES = 3;
const TIME_SPAN = 91 * 24 * 60 * 60 * 1000;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getPublications = (count) => {
  return Array(count)
    .fill({})
    .map((it, i) => {
      return {
        id: i,
        title: getRandomFromArray(TITLES),
        createdDate: new Date(getRandomInt(Date.now() - TIME_SPAN, Date.now()))
          .toLocaleString(),
        announce: shuffle(SENTENCES)
          .slice(0, getRandomInt(0, MAX_ANNOUNCES)),
        fullText: shuffle(SENTENCES)
          .slice(0, getRandomInt(0, SENTENCES.length - 1)),
        сategory: shuffle(CATEGORIES)
          .slice(0, getRandomInt(1, MAX_CATEGORIES)),
      };
    });
};

module.exports = {
  name: `--generate`,

  run(args) {
    const [count] = args;
    const publicationsCount = parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount < MAX_COUNT) {
      const content = JSON.stringify(getPublications(publicationsCount));
      fs.writeFile(FILE_NAME, content, (error) => {
        if (error) {
          console.error(`Can't write data to file`);
          process.exit(1);
        }
        return console.info(`Operation succeeded, file created.`);
      });
    } else {
      console.error(`No more than ${MAX_COUNT} publications`);
      process.exit(1);
    }
  }
};


