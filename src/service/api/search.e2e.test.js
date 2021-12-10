"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);
const {
  mockCategories,
  mockArticles,
  mockUsers
} = require(`../../../test-mocks.json`);


const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(app, new DataService(mockDb));
});

describe(`API returns an article based on the search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Рок — это протест`
      });
  });

  test(`The status code is 200`, () => expect(response.statusCode)
    .toBe(HttpCode.OK));
  test(`One offer was found`, () => expect(response.body.length)
    .toBe(1));
  test(`The offer has a correct title`, () => expect(response.body[0].title)
    .toBe(`Рок — это протест`));
});


test(`API returns the 400 status when the query string is absent`, () => request(app)
  .get(`/search`)
  .expect(HttpCode.BAD_REQUEST));

test(`API returns the 404 code when nothing is found`, () => request(app)
  .get(`/search`)
  .query({
    query: `An article that doesn't exist`
  }));
