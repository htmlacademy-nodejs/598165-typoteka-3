'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 3;
const FILE_NAME = `fill-db.sql`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const MAX_ANNOUNCES = 5;
const MAX_COMMENTS = 4;
const PICTURES = [`forest@1x.jpg`, `sea@1x.jpg`, `skyscraper@1x.jpg`, ``];

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getArticles = (count, data) => {
  const {sentences, titles, categoriesCount, comments, userCount} = data;
  return Array(count)
    .fill({})
    .map((_, index) => {
      return {
        title: getRandomFromArray(titles),
        announce: shuffle(sentences)
          .slice(0, getRandomInt(1, MAX_ANNOUNCES)).join(` `),
        fullText: shuffle(sentences)
          .slice(0, getRandomInt(1, sentences.length - 1)),
        category: [getRandomInt(1, categoriesCount)],
        comments: generateComments(getRandomInt(2, MAX_COMMENTS), comments, index + 1, userCount),
        picture: getRandomFromArray(PICTURES),
        userId: getRandomInt(1, userCount)
      };
    });
};

const generateComments = (count, comments, articleId, userCount) => {
  return Array(count).fill({}).map(() => {
    return {
      userId: getRandomInt(1, userCount),
      articleId,
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `)
    };
  });
};

const getUsers = () => [
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
  name: `--fill`,

  async run(args) {
    const [sentences, titles, categories, commentsSentences] =
      await Promise.all([
        readContent(FILE_SENTENCES_PATH),
        readContent(FILE_TITLES_PATH),
        readContent(FILE_CATEGORIES_PATH),
        readContent(FILE_COMMENTS_PATH),
      ]);

    const [count] = args;
    const articleCount = parseInt(count, 10) || DEFAULT_COUNT;
    const users = getUsers();

    const articles = getArticles(articleCount, {
      sentences,
      titles,
      categoriesCount: categories.length,
      comments: commentsSentences,
      userCount: users.length,
    });

    const comments = articles.flatMap((article) => article.comments);

    const articlesCategories = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: article.category[0]
    }));

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${email}', '${passwordHash}' , '${firstName}', '${lastName}', '${avatar}')`)
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`);

    const articleValues = articles.map(({title, announce, fullText, picture, userId}) =>
      `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`)
      .join(`,\n`);

    const articlesCategoryValues = articlesCategories.map(({articleId, categoryId}) =>
      `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments.map(({text, userId, articleId}) =>
      `(${articleId}, ${userId}, '${text}')`);

    // language=SQL format=false
    const content = `
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES ${userValues};
    INSERT INTO categories(name) VALUES ${categoryValues};
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, announce, full_text, picture, author_id) VALUES ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;
    ALTER TABLE articles_categories DISABLE TRIGGER ALL;
    INSERT INTO articles_categories(article_id, category_id) VALUES ${articlesCategoryValues};
    ALTER TABLE articles_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO comments(article_id, author_id, text) VALUES ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation is successful, the file is created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to the file`));
      process.exit(ExitCode.error);
    }
  }
};
