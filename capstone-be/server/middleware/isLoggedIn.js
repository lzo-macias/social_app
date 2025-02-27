// middleware/isLoggedIn.js
const { findUserByToken } = require("../db/authentication");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    req.user = await findUserByToken(token);

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = isLoggedIn;
