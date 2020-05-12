'use strict';

const chalk = require(`chalk`);
const express = require(`express`);

const {HttpCode, API_PREFIX, ExitCode} = require(`../../constants`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;


const app = express();

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));


module.exports = {
  name: `--server`,
  async run(args) {
    const [portArg] = args;
    const port = parseInt(portArg, 10) || DEFAULT_PORT;

    try {
      await getMockData();

      app.listen(port, (err) => {
        if (err) {
          return console.log(`Ошибка создания сервера`, err);
        }
        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
    } catch (err) {
      console.error(`Произошла ошибка: ${err.message}`);
      process.exit(ExitCode.error);
    }

  }
};
