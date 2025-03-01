const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("isLoggedin running")
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
//finduserBytoken
const findUserByToken = async (token) => {
  try {
    // Log the token for debugging purposes
    console.log("Authorization Token:", token);

    // Verify the token using JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Query the database to find the user associated with the token's payload id
    const SQL = `
      SELECT id, username
      FROM users
      WHERE id = $1
    `;
    const response = await pool.query(SQL, [payload.id]);

    if (!response.rows.length) {
      // If no user is found, throw an unauthorized error
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }

    // Return the user object
    console.log(response.rows[0])
    return response.rows[0];
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error in findUserByToken:", err);

    // Throw an error indicating invalid or expired token
    const error = new Error("Not authorized!");
    error.status = 401;
    throw error;
  }
};


module.exports = isLoggedIn;
