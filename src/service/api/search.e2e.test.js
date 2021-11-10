"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = require(`../../../test-mocks.json`);


const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns an article based on the search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки. История деревьев`
      });
  });

  test(`The status code is 200`, () => expect(response.statusCode)
    .toBe(HttpCode.OK));
  test(`Two offers were found`, () => expect(response.body.length)
    .toBe(2));
  test(`The offer has a correct id`, () => expect(response.body[0].id)
    .toBe(`Mvn4TY`));
});


test(`API returns the 400 status when the query string is absent`, () => request(app)
  .get(`/search`)
  .expect(HttpCode.BAD_REQUEST));

test(`API returns the 404 code when nothing is found`, () => request(app)
  .get(`/search`)
  .query({
    query: `An article that doesn't exist`
  }));
