"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);

const {HttpCode} = require(`../../constants`);

const {
  mockCategories,
  mockArticles,
  mockUsers,
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
  user(app, new DataService(mockDb));
  return app;
};

describe(`API creates a user if the data is valid`, () => {
  const validUserData = {
    firstName: `Сидор`,
    lastName: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`
  };

  let response;

  beforeAll(async () => {
    let app = await createApi();
    response = await request(app)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code is 201`, () => expect(response.statusCode)
    .toBe((HttpCode.CREATED)));
});

describe(`API doesn't create a user if the data is invalid`, () => {
  const validUserData = {
    firstName: `Сидор`,
    lastName: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
  };

  let app;

  beforeAll(async () => {
    app = await createApi();
  });

  test(`Without any required property the response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When a field type is wrong the response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When a field value is wrong the response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When a password and a passwordRepeated are not equal, the code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When a email is already in use the status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

});
describe(`API authenticates a user if credentials are valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`,
  };

  let response;

  beforeAll(async () => {
    const app = await createApi();
    response = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`The status code is 200`, () => expect(response.statusCode)
    .toBe(HttpCode.OK));

  test(`The user's last name is Иванов`, () => expect(response.body.lastName)
    .toBe(`Иванов`));
});

describe(`API doesn't authenticate a user if credentials are invalid`, () => {
  let app;
  beforeAll(async () => {
    app = await createApi();
  });

  test(`If an email is incorrect then the status is 401`, async () => {
    const badAuthData = {
      email: `notexist@example.com`,
      password: `petrov`
    };

    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If the password doesn't match then the status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});
