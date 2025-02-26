// middleware/isLoggedIn.js
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
};

module.exports = isLoggedIn;
