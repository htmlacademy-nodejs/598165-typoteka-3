'use strict';
const generate = require(`./genarate`);
const help = require(`./help`);
const version = require(`./version`);


const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  Cli,
};
