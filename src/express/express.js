'use strict';
const path = require(`path`);
const express = require(`express`);
const session = require(`express-session`);

const mainRoutes = require(`./routes/main-routes`);
const articlesRouter = require(`./routes/articles-routes`);
const categoriesRouter = require(`./routes/categories-routes`);
const myRouter = require(`./routes/my-routes`);

const {HttpCode} = require(`../constants`);

const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const {getSequelize} = require(`../service/lib/sequelize`);
const sequelize = getSequelize();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const {getLogger} = require(`../service/lib/logger`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environmental variable is not defined`);
}

const app = express();
const logger = getLogger({name: `front-server`});

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((req, res, next) => {
  logger.debug(`A request on the route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`The response's status code is ${res.statusCode}`);
  });
  next();
});

app.use(`/categories`, categoriesRouter);
app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));
app.use((err, req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR)
    .render(`errors/500`);
  logger.error(`An error occurred while processing the request: ${err.message}`);
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Server started at port ${DEFAULT_PORT}`);
});

