'use strict';

const chalk = require(`chalk`);

const helpMessage = `Гайд:
  service <command>
Команды:
--version: выводит номер версии
--help: печатает этот текст
--filldb <count> заполняет базу данных
--fill <count> формирует файл fill-db.sql
--server <port> запускает http-сервер
`;

module.exports = {
  name: `--help`,
  run() {
    console.log(chalk.gray(helpMessage));
  }
};
