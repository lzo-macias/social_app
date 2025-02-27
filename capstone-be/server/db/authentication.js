const { pool } = require("./index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "shh";

// Authenticate user by checking credentials in the database
const authenticate = async ({ username, password }) => {
  const SQL = ` SELECT id, password FROM users WHERE username = $1`;
  const response = await pool.query(SQL, [username]);
  if (!response.rows.length) {
    console.log("No user found with username:", username);
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  const user = response.rows[0];
  console.log("User found:", user);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    console.log("Password mismatch for user:", username);
    const error = new Error("Not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, secret);
  console.log(token);
  return { token: token };
};

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
      throw new Error("User not found or unauthorized");
    }

    // Return the user object
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

module.exports = { authenticate, findUserByToken };
