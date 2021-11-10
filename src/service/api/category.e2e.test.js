"use strict";

const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = require(`../../../test-mocks.json`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns a category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK));

  test(`The category list contains 8 items`, () =>
    expect(response.body.length)
      .toBe(8));

  test(`Category names are 'IT', 'Без рамки', 'Музыка', 'Кино', 'За жизнь', 'Программирование', 'Разное', 'Железо'`, () =>
    expect(response.body)
      .toEqual(expect.arrayContaining([`IT`, `Без рамки`, `Музыка`, `Кино`, `За жизнь`, `Программирование`, `Разное`, `Железо`])));
});

