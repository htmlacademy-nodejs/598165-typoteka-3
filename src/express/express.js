'use strict';
const path = require(`path`);
const express = require(`express`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRouter = require(`./routes/articles-routes`);
const myRouter = require(`./routes/my-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(404).render(`errors/404`));
app.use((_err, req, res, _next) => res.status(500).render(`errors/500`));

app.listen(DEFAULT_PORT, () => {
  console.log(`Server started at port ${DEFAULT_PORT}`);
});

