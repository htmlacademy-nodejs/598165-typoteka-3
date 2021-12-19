"use strict";

module.exports = (req, res, next) => {
  const {user} = req.session;
  console.log(user);
  if (!user) {
    return res.redirect(`/login`);
  }
  return next();
};
