'use strict';

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const HttpCode = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const express = require(`express`);
const fs = require(`fs`).promises;

const app = express();
app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mock = JSON.parse(fileContent);
    res.json(mock);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));


module.exports = {
  name: `--server`,
  run(args) {
    const [portArg] = args;
    const port = parseInt(portArg, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(`Ошибка создания сервера`, err);
      }
      return console.log(`Принимаю подключения на порт ${port}`);
    });
  }
};
