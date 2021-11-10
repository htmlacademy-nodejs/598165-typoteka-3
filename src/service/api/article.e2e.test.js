"use strict";

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);


const mockData = require(`../../../test-mocks.json`);

const createApi = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(clonedData), new CommentService());

  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`It returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`The first article's id is 'Mvn4TY'`, () =>
    expect(response.body[0].id).toBe((`Mvn4TY`)));
});

describe(`API returns an article with a given id`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/Mvn4TY`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The article has a title 'Ёлки. История деревьев'`, () =>
    expect(response.body.title).toBe(`Ёлки. История деревьев`));
});

describe(`API create an article when data is valid`, () => {
  const app = createApi();
  let response;
  const newArticle = {
    "title": `Борьба с прокрастинацией`,
    "createdDate": `9/9/2021, 12:06:25 AM`,
    "announce": [`Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`, `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`, `Ёлки — это не просто красивое дерево. Это прочная древесина.`, `Первая большая ёлка была установлена только в 1938 году.`, `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`],
    "fullText": [`Это один из лучших рок-музыкантов.`, `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`, `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`, `Золотое сечение — соотношение двух величин, гармоническая пропорция.`, `Как начать действовать? Для начала просто соберитесь.`, `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`, `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`, `Достичь успеха помогут ежедневные повторения.`, `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`, `Из под его пера вышло 8 платиновых альбомов.`, `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`, `Первая большая ёлка была установлена только в 1938 году.`, `Программировать не настолько сложно, как об этом говорят.`, `Ёлки — это не просто красивое дерево. Это прочная древесина.`, `Простые ежедневные упражнения помогут достичь успеха.`, `Собрать камни бесконечности легко, если вы прирожденный герой.`, `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`, `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`, `Он написал больше 30 хитов.`],
    "category": [`Разное`, `Без рамки`],
    "comments": [{"id": `aSamDG`, "text": `Мне кажется или я уже читал это где-то?`}
    ]
  };


  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`The status code is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`It returns the created article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`The number of articles has changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API doesn't create an article with invalid data`, () => {
  const app = createApi();
  const newArticle = {
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `10/22/2021, 1:39:07 AM`,
    "announce": [`Простые ежедневные упражнения помогут достичь успеха.`, `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`],
    "fullText": [`Золотое сечение — соотношение двух величин, гармоническая пропорция.`, `Достичь успеха помогут ежедневные повторения.`, `Он написал больше 30 хитов.`, `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`, `Первая большая ёлка была установлена только в 1938 году.`, `Как начать действовать? Для начала просто соберитесь.`, `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`],
    "category": [`За жизнь`, `Кино`],
    "comments": [{"id": `mTSacD`, "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты?`}]
  };

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
  const app = createApi();
  let response;
  const newArticle = {
    "title": `Обзор новейшего смартфона`,
    "createdDate": `8/12/2021, 5:29:29 PM`,
    "announce": [`Собрать камни бесконечности легко, если вы прирожденный герой.`, `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`, `Программировать не настолько сложно, как об этом говорят.`, `Из под его пера вышло 8 платиновых альбомов.`],
    "fullText": [`Золотое сечение — соотношение двух величин, гармоническая пропорция.`, `Достичь успеха помогут ежедневные повторения.`, `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`, `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`, `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`, `Первая большая ёлка была установлена только в 1938 году.`, `Программировать не настолько сложно, как об этом говорят.`, `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`, `Из под его пера вышло 8 платиновых альбомов.`, `Он написал больше 30 хитов.`, `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`, `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`, `Простые ежедневные упражнения помогут достичь успеха.`, `Как начать действовать? Для начала просто соберитесь.`, `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`],
    "category": [`Музыка`, `Кино`],
    "comments": [{
      "id": `NjAC25`,
      "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
    }, {"id": `m-Vtdb`, "text": ``}]
  };

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/Mvn4TY`)
      .send(newArticle);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns the changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`The article is really changed`, () =>
    request(app)
      .get(`/articles/Mvn4TY`)
      .expect((res) => expect(res.body.title).toBe(`Обзор новейшего смартфона`)));
});

test(`API returns the 404 status when trying to change a non-existent article`, () => {
  const app = createApi();
  const validOffer = {
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `8/15/2021, 7:24:35 AM`,
    "announce": [`Он написал больше 30 хитов.`, `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`, `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`],
    "fullText": [`Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`, `Из под его пера вышло 8 платиновых альбомов.`, `Ёлки — это не просто красивое дерево. Это прочная древесина.`, `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`, `Собрать камни бесконечности легко, если вы прирожденный герой.`, `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`, `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`, `Как начать действовать? Для начала просто соберитесь.`, `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`, `Программировать не настолько сложно, как об этом говорят.`, `Простые ежедневные упражнения помогут достичь успеха.`, `Достичь успеха помогут ежедневные повторения.`, `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`, `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`],
    "category": [`IT`, `Музыка`, `Кино`],
    "comments": [{"id": `ii3kEL`, "text": `Хочу такую же футболку :-) Плюсую, но слишком много букв!`}, {
      "id": `l9s57b`,
      "text": `Совсем немного... Плюсую, но слишком много букв!`
    }, {
      "id": `FjPIw7`,
      "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Хочу такую же футболку :-)`
    }]
  };

  return request(app)
    .put(`/article/NONEXISTS`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns the 400 status when trying to an article with invalid data`, () => {
  const app = createApi();
  const invalidArticle = {
    "title": `An offer without a creation date property`,
    "announce": [``],
    "fullText": [``],
    "category": [``],
    "comments": [{}]
  };

  return request(app)
    .put(`/articles/NONEXISTS`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/Mvn4TY`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`It returns the deleted article`, () =>
    expect(response.body.id).toBe(`Mvn4TY`));

  test(`The total articles number is now 4`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API doesn't delete a non-existent article`, () => {
  const app = createApi();

  return request(app)
    .delete(`/articles/NONEXISTS`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to a given article`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/Mvn4TY/comments`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`The number of comments is equal to 2`, () =>
    expect(response.body.length).toBe(2));

  test(`The first comment has the id of 'jrCuuX'`, () =>
    expect(response.body[0].id).toBe(`jrCuuX`));
});

describe(`API creates a comment if the data is valid`, () => {
  const app = createApi();
  let response;
  const newComment = {
    text: `Валидный комментарий`,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/Mvn4TY/comments`)
      .send(newComment);
  });

  test(`The response status is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`It returns the created comment`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`The number of comments has been changed`, () =>
    request(app)
      .get(`/articles/Mvn4TY/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API doesn't create a comment to the non-existent article and returns the 404 status`, () => {
  const app = createApi();

  return request(app)
    .post(`/articles/NONEXISTEN/comments`)
    .send({text: `Комментарий`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API doesn't create a comment with the invalid data and returns 400 status`, () => {
  const app = createApi();

  return request(app)
    .post(`/articles/Mvn4TY/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/Mvn4TY/comments/jrCuuX`);
  });

  test(`The status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`It returns the deleted comment`, () =>
    expect(response.body.id).toBe(`jrCuuX`));

  test(`The number of comments is now 1`, () =>
    request(app)
      .get(`/articles/Mvn4TY/comments/`)
      .expect((res) => expect(res.body.length).toBe(1)));
});

test(`API doesn't delete a non-existed comment`, () => {
  const app = createApi();

  return request(app)
    .delete(`/articles/Mvn4TY/comments/NOEXISTS`)
    .expect(HttpCode.NOT_FOUND);
});
