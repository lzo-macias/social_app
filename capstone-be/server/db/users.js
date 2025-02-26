const { pool } = require("./index");

// **Fetch Users**
const fetchUsers = async () => {
  const query = "SELECT id, username, email FROM users;"; // Adjust query if needed
  try {
    const { rows } = await pool.query(query); // Execute the query
    return rows; // Return the result rows (users)
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err; // Rethrow error to be handled by the route
  }
};

// Function to create a new user in the database
const createUser = async ({
  username,
  password,
  email,
  name,
  dob,
  is_admin = false,
}) => {
  console.log("🔍 Debug - Creating user with values:", {
    username,
    password,
    email,
    name,
    dob,
    is_admin,
  });
  const query = `
    INSERT INTO users (username, password, email, name, dob, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [username, password, email, name, dob, is_admin];

  try {
    const { rows } = await pool.query(query, values); // Execute the query
    return rows[0]; // Return the newly created user
  } catch (err) {
    throw new Error("Error creating user: " + err.message); // Handle any errors
  }
};

// **Get User by ID**
const getUserById = async (userId) => {
  const query = "SELECT id, username, email FROM users WHERE id = $1;";
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    // Assuming req.user is set after a login
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
};

module.exports = {
  fetchUsers,
  getUserById,
  isLoggedIn,
  createUser,
};
