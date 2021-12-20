"use strict";
const {BLOG_OWNER_USER_ID} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;
  if (user) {
    user.isHost = user.id === BLOG_OWNER_USER_ID;
  }
  next();
};
