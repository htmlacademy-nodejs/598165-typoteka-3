'use strict';

const express = require(`express`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);

const DEFAULT_PORT = 8000;

const app = express();
app.get(`/`, (req, res) => res.send(`/`));
app.get(`/register`, (req, res) => res.send(`/register`));
app.get(`/login`, (req, res) => res.send(`/login`));
app.get(`/search`, (req, res) => res.send(`/search`));
app.get(`/categories`, (req, res) => res.send(`/categories`));

app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);


app.get(`/`, (req, res) => res.send(`Hello, Express.js!`));
app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на ${DEFAULT_PORT} порту`);
});

