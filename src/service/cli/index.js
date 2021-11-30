'use strict';
const generate = require(`./genarate`);
const help = require(`./help`);
const server = require(`./server.js`);
const version = require(`./version`);
const fill = require(`./fill`);


const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [server.name]: server,
  [version.name]: version,
  [fill.name]: fill,
};

module.exports = {
  Cli,
};
