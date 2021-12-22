"use strict";
const {BLOG_AUTHOR_USER_ID} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;
  if (user && user.id === BLOG_AUTHOR_USER_ID) {
    user.isAuthor = true;
  }
  return next();
};
