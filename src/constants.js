'use strict';

const API_PREFIX = `/api`;
const ARTICLES_PER_PAGE = 8;
const BLOG_AUTHOR_USER_ID = 1;
const DEFAULT_COMMAND = `--help`;
const MOCK_FILE = `mocks.json`;
const USER_ARGV_INDEX = 2;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ExitCode = {
  error: 1,
  success: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

module.exports = {
  API_PREFIX,
  ARTICLES_PER_PAGE,
  BLOG_AUTHOR_USER_ID,
  DEFAULT_COMMAND,
  MOCK_FILE,
  USER_ARGV_INDEX,
  Env,
  ExitCode,
  HttpCode,
  HttpMethod,
};
