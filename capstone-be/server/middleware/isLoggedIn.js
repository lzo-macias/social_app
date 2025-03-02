const jwt = require("jsonwebtoken");
const { pool } = require("../db/index");

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("✅ isLoggedIn middleware executing...");
    console.log("🔍 Received Headers:", req.headers);

    let token = req.headers.authorization;

    if (!token) {
      console.log("❌ No token provided.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables!");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Missing JWT_SECRET" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("✅ Extracted User ID:", req.user.id);

    // Check if user exists
    const SQL = `SELECT id FROM users WHERE id = $1`;
    const result = await pool.query(SQL, [req.user.id]);

    if (result.rows.length === 0) {
      console.error("❌ User not found in database.");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    console.log("✅ isLoggedIn middleware complete. Proceeding to next...");
    next();
  } catch (err) {
    console.error("❌ Authentication Error:", err.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = isLoggedIn;
