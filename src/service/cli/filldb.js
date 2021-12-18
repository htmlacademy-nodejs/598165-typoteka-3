'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  shuffle,
  getRandomFromArray,
  getRandomSubarray
} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const {logger} = require(`../lib/logger`);
const {getSequelize} = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const MAX_ANNOUNCES = 5;
const MAX_COMMENTS = 4;
const PICTURES = [`forest@1x.jpg`, `sea@1x.jpg`, `skyscraper@1x.jpg`, ``];
const USERS = [
  {
    email: `ivanov@example.com`,
    passwordHash: `$2b$10$axs.jCQ/RwuP8C9NV0GzVeIzkuuAV.jmfGpip0ddzeoCbdzCuSdpm`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `$2b$10$vZHZx4H8MCC44.OlVPtRlOY2bEfaMC.62AOltMGMgq1JdXy2rq1jS`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`
  }
];

const generateArticles = (count, data) => {
  const {sentences, titles, categories, comments, users} = data;
  return Array(count)
    .fill({})
    .map(() => {
      return {
        title: getRandomFromArray(titles),
        announce: shuffle(sentences)
          .slice(0, getRandomInt(1, MAX_ANNOUNCES))
          .join(` `)
          .slice(0, 250),
        fullText: shuffle(sentences)
          .slice(0, getRandomInt(1, sentences.length - 1))
          .join(`\n`)
          .slice(0, 1000),
        categories: getRandomSubarray(categories),
        comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
        picture: getRandomFromArray(PICTURES),
        user: getRandomFromArray(users)
      };
    });
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => {
    return {
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `)
        .slice(0, 250),
    };
  });
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--filldb`,

  async run(args) {
    const sequelize = getSequelize();

    try {
      logger.info(`Trying to connect to the database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`A connection to the database has been established`);

    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const articlesCount = parseInt(count, 10) || DEFAULT_COUNT;
    const mockData = {sentences, titles, categories, comments, users: USERS};
    const articles = generateArticles(articlesCount, mockData);
    return initDatabase(sequelize, {articles, categories, users: USERS});
  }
};
