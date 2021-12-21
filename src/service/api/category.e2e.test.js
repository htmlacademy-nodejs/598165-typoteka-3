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

const createApi = async () => {
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDb, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers
  });
  const app = express();
  app.use(express.json());
  category(app, new DataService(mockDb));

  return app;
};

describe(`API returns a category list`, () => {
  let response;

  beforeAll(async () => {
    const app = await createApi();
    response = await request(app)
      .get(`/category`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK));

  test(`The category list contains 10 items`, () =>
    expect(response.body.length)
      .toBe(10));

  test(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "IT", "Музыка", "Кино", "Программирование", "Железо", "Empty"`, () =>
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
        `Железо`,
        `Empty`
      ])));
});


describe(`API creates a category if the data is valid`, () => {
  let app;
  let response;
  const newCategory = {
    name: `Категория`,
  };

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .post(`/category`)
      .send(newCategory);
  });

  test(`The response status is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`The number of categories has been changed`, () =>
    request(app)
      .get(`/category`)
      .expect((res) => expect(res.body.length).toBe(11)));
});

test(`API doesn't create a category with the invalid data and returns 400 status`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/category`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API doesn't create a category when name is too short and returns 400 status`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/category`)
    .send({name: `ab`})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API doesn't create a category when name is too long and returns 400 status`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/category`)
    .send({name: Array(31).fill(`a`).join(``)})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a category`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/category/10`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The number of categories is now 9`, () =>
    request(app)
      .get(`/category`)
      .expect((res) => expect(res.body.length).toBe(9)));
});

test(`API doesn't delete a non-existed comment`, async () => {
  const app = await createApi();
  const response = await request(app)
    .delete(`/category/100`);
  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});

test(`API doesn't delete a comment with the articles`, async () => {
  const app = await createApi();
  const response = await request(app)
    .delete(`/category/1`);
  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});

