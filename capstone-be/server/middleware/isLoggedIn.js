const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Make sure to set this in your environment variables

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
