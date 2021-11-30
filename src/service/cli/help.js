'use strict';

const chalk = require(`chalk`);

const helpMessage = `Гайд:
  service <command>
Команды:
--version: выводит номер версии
--help: печатает этот текст
--generate <count> формирует файл mocks.json
--fill <count> формирует файл fill-db.sql
--server <port> запускает http-сервер

    `;

module.exports = {
  name: `--help`,
  run() {
    console.log(chalk.gray(helpMessage));
  }
};
