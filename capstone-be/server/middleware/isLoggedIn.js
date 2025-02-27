// middleware/isLoggedIn.js
const { findUserByToken } = require("../db/authentication");

const isLoggedIn = async (req, res, next) => {
  try {
    // Check if the Authorization header exists and contains the Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(" ")[1];

    // Find the user associated with the token
    const user = await findUserByToken(token);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user; // Attach the user to the request
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Error in isLoggedIn middleware:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = isLoggedIn;
