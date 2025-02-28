const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ✅ Extract token from "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables!");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Missing JWT_SECRET" });
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Authentication Error:", err.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = isLoggedIn;
