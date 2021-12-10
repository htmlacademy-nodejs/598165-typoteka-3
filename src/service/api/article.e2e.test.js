"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDb = require(`../lib/init-db`);
const articles = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

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
  articles(app, new DataService(mockDb), new CommentService(mockDb));

  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createApi();
    response = await request(app).get(`/articles`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`It returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`The first article's title is 'Самый лучший музыкальный альбом этого года'`, () =>
    expect(response.body[0].title)
      .toBe((`Самый лучший музыкальный альбом этого года`)));
});

describe(`API returns an article with a given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createApi();
    response = await request(app).get(`/articles/1`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The article has a title 'Рок — это протест'`, () =>
    expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API create an article when data is valid`, () => {
  const newArticle = {
    "title": `Борьба с прокрастинацией`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2],
    "picture": `picture.jpg`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`The status code is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`The number of articles has changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API doesn't create an article with invalid data`, () => {
  const newArticle = {
    "title": `Борьба с прокрастинацией`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2],
    "picture": `picture.jpg`
  };

  let app;
  beforeAll(async () => {
    app = await createApi();
  });

  test(`It returns the 400 status if the data doesn't contain any required properties`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes an existent article`, () => {
  const newArticle = {
    "title": `Дам погладить котика`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2],
    "picture": `picture.jpg`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The article is really changed`, () =>
    request(app)
      .get(`/articles/1`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns the 404 status when trying to change a non-existent article`, async () => {
  const validOffer = {
    "title": `Борьба с прокрастинацией`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2],
    "picture": `picture.jpg`
  };
  const app = await createApi();

  return request(app)
    .put(`/article/20`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns the 400 status when trying to change an article with invalid data`, async () => {
  const app = await createApi();
  const invalidArticle = {
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2],
    "picture": `picture.jpg`
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The total articles number is now 4`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API doesn't delete a non-existent article`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to a given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createApi();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The number of comments is equal to 1`, () =>
    expect(response.body.length).toBe(1));

  test(`The first comment has the text 'Планируете записать видосик на эту тему?'`, () =>
    expect(response.body[0].text).toBe(`Планируете записать видосик на эту тему?`));
});

describe(`API creates a comment if the data is valid`, () => {
  let app;
  let response;
  const newComment = {
    text: `Валидный комментарий`,
  };

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .post(`/articles/2/comments`)
      .send(newComment);
  });

  test(`The response status is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`The number of comments has been changed`, () =>
    request(app)
      .get(`/articles/2/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API doesn't create a comment to the non-existent article and returns the 404 status`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/articles/20/comments`)
    .send({text: `Комментарий`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API doesn't create a comment with the invalid data and returns 400 status`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/articles/2/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The number of comments is now 0`, () =>
    request(app)
      .get(`/articles/1/comments/`)
      .expect((res) => expect(res.body.length).toBe(0)));
});

test(`API doesn't delete a non-existed comment`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/articles/1/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API doesn't delete a comment to non-existed article`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/articles/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
