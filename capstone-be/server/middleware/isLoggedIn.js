// middleware/isLoggedIn.js
const { findUserByToken } = require("../db/authentication");

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isLoggedIn;
