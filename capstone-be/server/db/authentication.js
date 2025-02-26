const { pool } = require("./index");

// Authenticate user by checking credentials in the database
const authenticate = async ({ username, password }) => {
  const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
  const { rows } = await pool.query(query, [username, password]);
  if (rows.length === 0) {
    throw new Error("Invalid credentials");
  }
  return rows[0]; // Return the user object if credentials are correct
};

module.exports = { authenticate };
