"use strict";

const Sequelize = require(`sequelize`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const getSequelize = () => {

  const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT]
    .some((it) => it === undefined);

  if (somethingIsNotDefined) {
    throw new Error(`One or more environmental variables are not defined `);
  }

  return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    logging: false,
    dialect: `postgres`,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 10000
    }
  });
};

module.exports = {
  getSequelize
};
