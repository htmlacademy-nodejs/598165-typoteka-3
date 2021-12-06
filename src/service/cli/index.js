'use strict';

const help = require(`./help`);
const server = require(`./server.js`);
const version = require(`./version`);
const fill = require(`./fill`);
const filldb = require(`./filldb`);


const Cli = {
  [help.name]: help,
  [server.name]: server,
  [version.name]: version,
  [fill.name]: fill,
  [filldb.name]: filldb,
};

module.exports = {
  Cli,
};
