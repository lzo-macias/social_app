const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token from Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables!");
      return res.status(500).json({ error: "Server misconfiguration: Missing JWT_SECRET" });
    }

    // ✅ Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach decoded user info to request

    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = isLoggedIn;
