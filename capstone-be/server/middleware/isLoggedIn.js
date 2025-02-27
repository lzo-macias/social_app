const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Make sure to set this in your environment variables

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("Authorization header:", req.headers.authorization); // Debug log
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Continue with token verification (e.g., jwt verification)
    const user = await findUserByToken(token);
    req.user = user; // Set the user object on req for further use
    next(); // Proceed to the next middleware/route
  } catch (err) {
    console.error("Error in isLoggedIn middleware:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = isLoggedIn;
