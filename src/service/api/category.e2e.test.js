"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const {
  mockCategories,
  mockArticles,
  mockUsers
} = require(`../../../test-mocks.json`);

const mockDb = new Sequelize(`sqlite::memory`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers
  });
  category(app, new DataService(mockDb));
});


describe(`API returns a category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK));

  test(`The category list contains 9 items`, () =>
    expect(response.body.length)
      .toBe(9));

  test(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "IT", "Музыка", "Кино", "Программирование", "Железо"`, () =>
    expect(response.body.map((it) => it.name))
      .toEqual(expect.arrayContaining([
        `Деревья`,
        `За жизнь`,
        `Без рамки`,
        `Разное`,
        `IT`,
        `Музыка`,
        `Кино`,
        `Программирование`,
        `Железо`
      ])));
});
