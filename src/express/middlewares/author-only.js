"use strict";
const {BLOG_AUTHOR_USER_ID} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;
  if (user) {
    if (user.id !== BLOG_AUTHOR_USER_ID) {
      return res.redirect(`/login`);
    }
  }
  return next();
};
