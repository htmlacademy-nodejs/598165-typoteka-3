'use strict';

const MOCK_FILE = `mocks.json`;

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const ExitCode = {
  error: 1,
  success: 0,
};
const API_PREFIX = `/api`;
const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ARTICLES_PER_PAGE = 8;

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const BLOG_OWNER_USER_ID = 3;

module.exports = {
  MOCK_FILE,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HttpCode,
  ExitCode,
  API_PREFIX,
  Env,
  ARTICLES_PER_PAGE,
  HttpMethod,
  BLOG_OWNER_USER_ID
};
