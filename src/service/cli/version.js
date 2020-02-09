'use strict';

const chalk = require(`chalk`);

const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(packageJsonFile.version));
  }
};
