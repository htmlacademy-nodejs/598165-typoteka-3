'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {MAX_ID_LENGTH, MOCK_FILE, ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const MAX_ANNOUNCES = 5;
const MAX_COUNT = 1000;
const MAX_CATEGORIES = 3;
const MAX_COMMENTS = 4;
const TIME_SPAN = 91 * 24 * 60 * 60 * 1000;

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getPublications = (count, sentences, titles, categories, comments) => {
  return Array(count)
    .fill({})
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        title: getRandomFromArray(titles),
        createdDate: new Date(getRandomInt(Date.now() - TIME_SPAN, Date.now()))
          .toLocaleString(),
        announce: shuffle(sentences)
          .slice(0, getRandomInt(0, MAX_ANNOUNCES)),
        fullText: shuffle(sentences)
          .slice(0, getRandomInt(0, sentences.length - 1)),
        category: shuffle(categories)
          .slice(0, getRandomInt(1, MAX_CATEGORIES)),
        comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      };
    });
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => {
    return {
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
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
  name: `--generate`,

  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const publicationsCount = parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount < MAX_COUNT) {
      const content = JSON.stringify(getPublications(publicationsCount, sentences, titles, categories, comments));
      try {
        await fs.writeFile(MOCK_FILE, content);
        console.info(chalk.green(`Operation is successful, the file is created.`));
      } catch (err) {
        console.error(chalk.red(`Can't write data to the file`));
        process.exit(ExitCode.error);
      }
    } else {
      console.error(chalk.red(`No more than ${MAX_COUNT} publications`));
      process.exit(ExitCode.error);
    }
  }
};
