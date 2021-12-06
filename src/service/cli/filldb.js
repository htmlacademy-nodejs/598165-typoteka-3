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

const Alias = require(`../models/alias`);
const defineModels = require(`../data-service`);
const {logger} = require(`../lib/logger`);
const {getSequelize} = require(`../lib/sequelize`);

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
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const generateArticles = (count, data) => {
  const {sentences, titles, categories, comments} = data;
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

    const {Category, Article, User} = defineModels(sequelize);
    await sequelize.sync({force: true});

    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);
    const categoryModels = await Category.bulkCreate(categories.map((item) => ({name: item})));
    const userModels = await User.bulkCreate(USERS);
    const mockData = {sentences, titles, categories: categoryModels, comments};

    const [count] = args;
    const articlesCount = parseInt(count, 10) || DEFAULT_COUNT;

    const articles = generateArticles(articlesCount, mockData);

    const articlesPromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: Alias.COMMENTS});
      await getRandomFromArray(userModels).addArticle(articleModel);
      await articleModel.addCategories(article.categories);

      const commentModels = await articleModel.getComments();
      for (const commentModel of commentModels) {
        await articleModel.addComment(commentModel);
        await getRandomFromArray(userModels).addComment(commentModel);
      }
    });

    await Promise.all(articlesPromises);
  }
};
