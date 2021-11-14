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
const PICTURES = [`forest@1x.jpg`, `sea@1x.jpg`, `skyscraper@1x.jpg`, ``];

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getPublications = (count, data) => {
  const {sentences, titles, categories, comments} = data;
  return Array(count)
    .fill({})
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        title: getRandomFromArray(titles),
        createdDate: new Date(getRandomInt(Date.now() - TIME_SPAN, Date.now()))
          .toLocaleString(),
        announce: shuffle(sentences)
          .slice(0, getRandomInt(1, MAX_ANNOUNCES)).join(` `),
        fullText: shuffle(sentences)
          .slice(0, getRandomInt(1, sentences.length - 1)),
        category: shuffle(categories)
          .slice(0, getRandomInt(1, MAX_CATEGORIES)),
        comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
        picture: getRandomFromArray(PICTURES)
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
      createdDate: new Date(getRandomInt(Date.now() - TIME_SPAN, Date.now()))
        .toLocaleString()
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
    const mockData = {
      sentences: await readContent(FILE_SENTENCES_PATH),
      titles: await readContent(FILE_TITLES_PATH),
      categories: await readContent(FILE_CATEGORIES_PATH),
      comments: await readContent(FILE_COMMENTS_PATH),
    };
    const [count] = args;
    const publicationsCount = parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount < MAX_COUNT) {
      const content = JSON.stringify(getPublications(publicationsCount, mockData));
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
