'use strict';

const http = require(`http`);

const DEFAULT_PORT = 3000;
const HTTP_SUCCESS_CODE = 200;
const HTTP_NOT_FOUND_CODE = 404;

const onClientConnect = (request, response) => {

  const returnNotFound = (res) => {
    res.writeHead(HTTP_NOT_FOUND_CODE, {
      'Content-type': `text/plain; charset=UTF-8`,
    });
    res.end(`Not found`);
  };

  switch (request.url) {
    case `/`:
      let data;
      try {
        data = require(`../../../mocks.json`);
      } catch (e) {
        data = null;
      }
      if (data) {
        response.writeHead(HTTP_SUCCESS_CODE, {
          'Content-type': `text/html, charset=UTF-8`,
        });
        response.end(getResponseText(data));
      } else {
        returnNotFound(response);
      }
      break;
    default:
      returnNotFound(response);
  }
};

const getResponseText = (array) => {
  const list = array.map((item) => `<li>${item.title}</li>`).join(`\n`);
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Typoteka</title>
      </head>
      <body>
        <ul>
          ${list}
        </ul>
      </body>
    </html>`;
};

module.exports = {
  name: `--server`,
  run(args) {
    const [portArg] = args;
    const port = parseInt(portArg, 10) || DEFAULT_PORT;
    const httpServer = http.createServer(onClientConnect);

    httpServer.listen(port, (error) => {
      if (error) {
        return console.error(`Ошибка при создании http-сервера: `, error);
      } else {
        return console.log(`Принимаю подключения на порт ${port}`);
      }
    });
  }
};
