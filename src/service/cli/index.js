'use strict';
const generate = require(`./genarate`);
const help = require(`./help`);
const server = require(`./server.js`);
const version = require(`./version`);


const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [server.name]: server,
  [version.name]: version,
};

module.exports = {
  Cli,
};
