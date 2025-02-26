const { pool } = require("./index"); 
const bcrypt = require("bcrypt");
const uuid = require("uuid");


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
  is_admin,
  username,
  password,
  email,
  dob,
  visibility,
  profile_picture,
  bio,
  location,
  status,
  created_at,
}) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const SQL = `
      INSERT INTO users(id,is_admin, username, password, email, dob, visibility,profile_picture,
  bio, location, status, created_at  )
      VALUES($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12) RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuid.v4(),
      is_admin,
      username,
      hashedPassword,
      email,
      dob,
      visibility,
  profile_picture,
  bio,
  location,
  status,
  created_at,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

// **Get User by ID**
const updateUser = async (profileInformation) => {
  const {
    userId,
    is_admin,
    username,
    password,
    email,
    dob,
    visibility,
    profile_picture,
    bio,
    location,
    status,
  } = profileInformation;
  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const SQL = `UPDATE users 
                   SET is_admin = $1, username = $2, password = $3, email = $4, dob = $5,visibility = $6, profile_picture = $7, bio = $8, location = $9 ,status = $10
                   WHERE id = $11
                   RETURNING *;`;
    const { rows } = await client.query(SQL, [
      is_admin,
      username,
      hashedPassword,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status,
      userId,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
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
  updateUser,
  isLoggedIn,
  createUser,
};
