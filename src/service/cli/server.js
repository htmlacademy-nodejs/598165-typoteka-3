'use strict';

const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const {HttpCode, API_PREFIX, ExitCode} = require(`../../constants`);
const DEFAULT_PORT = 3000;


const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`A request on the route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`The response's status code is ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`The route ${req.url} wasn't found`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred while processing the request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;
    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurrued on server creation: ${err.message()}`);
        }
        return logger.info(`Listening to connections on port ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred : ${err.message()}`);
      process.exit(ExitCode.error);
    }
  }
};
