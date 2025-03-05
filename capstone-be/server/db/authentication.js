const { pool } = require("./index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "shh"; // ✅ Correct secret variable

// Authenticate user by checking credentials in the database
const authenticate = async ({ username, password }) => {
  try {
    const SQL = `SELECT id, username, email, password FROM users WHERE username = $1`;
    const response = await pool.query(SQL, [username]);

    if (!response.rows.length) {
      console.log("❌ No user found with username:", username);
      return null; // ✅ Return null instead of throwing an error
    }

    const user = response.rows[0];
    console.log("✅ User found:", user);

    // ✅ Compare password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("❌ Password mismatch for user:", username);
      return null; // ✅ Return null instead of throwing an error
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" } // ✅ Token expires in 7 days
    );

    console.log("✅ JWT Token Generated:", token);

    return { token, user }; // ✅ Return both token & user data
  } catch (err) {
    console.error("❌ Authentication Error:", err);
    throw err;
  }
};

const findUserByUsername = async (username) => {
  try {
    // Log the username for debugging purposes
    console.log("Requested Username:", username);

    // Query the database to find the user by the username
    const SQL = `
      SELECT id, username, email, profile_picture, bio, name 
      FROM users
      WHERE username = $1
    `;
    const response = await pool.query(SQL, [username]);

    if (!response.rows.length) {
      // If no user is found, throw an unauthorized error
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Return the user object
    return response.rows[0];
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error in findUserByUsername:", err);

    // Throw an error indicating user not found
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};


// Find user by token
const findUserByToken = async (token) => {
  try {
    console.log("🔍 Authorization Token Received:", token);

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables!");
    }

    // ✅ Extract actual token (if prefixed with "Bearer ")
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", payload);

    // ✅ Fetch user from the database
    const SQL = `SELECT id, username, email FROM users WHERE id = $1`;
    const response = await pool.query(SQL, [payload.id]);

    if (!response.rows.length) {
      console.error("User not found or unauthorized");
    }

    return response.rows[0]; // ✅ Return the user
  } catch (err) {
    console.error("❌ Error in findUserByToken:", err);
    console.error("Unauthorized: Invalid or expired token");
  }
};


module.exports = { authenticate, findUserByToken, findUserByUsername };
