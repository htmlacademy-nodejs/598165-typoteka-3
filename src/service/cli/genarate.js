'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const MAX_ANNOUNCES = 5;
const MAX_COUNT = 1000;
const MAX_CATEGORIES = 3;
const TIME_SPAN = 91 * 24 * 60 * 60 * 1000;

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getPublications = (count, sentences, titles, categories) => {
  return Array(count)
    .fill({})
    .map((it, i) => {
      return {
        id: i,
        title: getRandomFromArray(titles),
        createdDate: new Date(getRandomInt(Date.now() - TIME_SPAN, Date.now()))
          .toLocaleString(),
        announce: shuffle(sentences)
          .slice(0, getRandomInt(0, MAX_ANNOUNCES)),
        fullText: shuffle(sentences)
          .slice(0, getRandomInt(0, sentences.length - 1)),
        сategory: shuffle(categories)
          .slice(0, getRandomInt(1, MAX_CATEGORIES)),
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
    const [count] = args;
    const publicationsCount = parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount < MAX_COUNT) {
      const content = JSON.stringify(getPublications(publicationsCount, sentences, titles, categories));
      try {
        await fs.writeFile(FILE_NAME, content);
        console.info(chalk.green(`Operation succeeded, file created.`));
      } catch (err) {
        console.error(chalk.error(`Can't write data to file`));
        process.exit(1);
      }
    } else {
      console.error(chalk.red(`No more than ${MAX_COUNT} publications`));
      process.exit(1);
    }
  }
};
