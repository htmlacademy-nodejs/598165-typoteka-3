'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {
  article, category, search, user,
  ArticleService, CommentService, CategoryService, SearchService, UserService,
  defineModels
} = require(`../api`);

const {getLogger} = require(`../lib/logger`);
const {getSequelize} = require(`../lib/sequelize`);

const {HttpCode, API_PREFIX, ExitCode} = require(`../../constants`);
const DEFAULT_PORT = process.env.PORT || 3000;

const app = express();
const logger = getLogger({name: `api`});
const routes = new Router();

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
    const sequelize = getSequelize();
    defineModels(sequelize);

    article(routes, new ArticleService(sequelize), new CommentService(sequelize));
    category(routes, new CategoryService(sequelize));
    search(routes, new SearchService(sequelize));
    user(routes, new UserService(sequelize));

    try {
      logger.info(`Trying to connect to the database...`);
      await sequelize.authenticate();
    } catch (error) {
      logger.error(`An error occurred: ${error.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`A connection to the database established`);

    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;
    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message()}`);
        }
        return logger.info(`Listening to connections on port ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred : ${err.message()}`);
      process.exit(ExitCode.error);
    }
  }
};

