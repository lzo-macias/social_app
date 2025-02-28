const { pool } = require("./index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "shh";

// Authenticate user by checking credentials in the database
const authenticate = async ({ username, password }) => {
  console.log("authenticating")
  const SQL = `SELECT id, username, email, password FROM users WHERE username = $1`;
  const response = await pool.query(SQL, [username]);

  // Log the entire response to see the structure
  console.log("Database Response:", response);

  if (!response.rows.length) {
    console.log("No user found with username:", username);
    const error = new Error("Not authorized");
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

  // Generate the token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET
  );
  console.log("Generated token:", token);
  console.log("generated: ", user);

  // Return both token and user details
  return { token, user };
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


// Helper function to find user based on the userId
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

module.exports = { authenticate, findUserByUsername, findUserByToken };
