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
  is_admin = false,
  username,
  password,
  email,
  name,
  dob,
  visibility,
  profile_picture,
  bio,
  location,
  status,
  created_at,
}) => {
  console.log("🔍 Debug - Creating user with values:", {
    username,
    password,
    email,
    name,
    dob,
    is_admin,
    created_at,
  });

  try {
    // ✅ Check if username or email already exists
    const checkSQL = `SELECT * FROM users WHERE username = $1 OR email = $2;`;
    const { rows } = await pool.query(checkSQL, [username, email]);

    if (rows.length > 0) {
      throw new Error("User with this username or email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const SQL = `
      INSERT INTO users(id, is_admin, username, password, name, email, dob, visibility, profile_picture, 
      bio, location, status, created_at)
      VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
      RETURNING *;
    `;

    const result = await pool.query(SQL, [
      is_admin,
      username,
      hashedPassword,
      name,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status,
    ]);

    return result.rows[0];
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// **UPDATE User by ID**
const updateUser = async (userId, updateData) => {
  try {
    // ✅ Fetch existing user first to ensure `is_admin` is included
    const existingUserRes = await pool.query(
      `SELECT is_admin FROM users WHERE id = $1`,
      [userId]
    );

    if (existingUserRes.rows.length === 0) {
      return null; // ✅ User not found
    }

    const existingUser = existingUserRes.rows[0];

    // ✅ Ensure `is_admin` is included in the update
    const {
      username,
      email,
      bio,
      location,
      status,
      profile_picture,
      is_admin = existingUser.is_admin, // ✅ Preserve `is_admin`
    } = updateData;

    const SQL = `
      UPDATE users
      SET username = $1, email = $2, bio = $3, location = $4, status = $5, profile_picture = $6, is_admin = $7
      WHERE id = $8
      RETURNING *;
    `;

    const result = await pool.query(SQL, [
      username,
      email,
      bio,
      location,
      status,
      profile_picture,
      is_admin,
      userId, // ✅ Make sure `userId` is passed separately
    ]);

    return result.rows[0];
  } catch (err) {
    console.error("❌ Error updating user:", err);
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    const SQL = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    await pool.query(SQL, [id]);
    return true;
  } catch (err) {
    console.error(err);
  }
};
// const findUserByUsername = async (username) => {
//   try {
//     const SQL = `SELECT id, username, email, name, bio, profile_picture, location, status 
//                  FROM users WHERE username = $1;`;
//     const { rows } = await pool.query(SQL, [username]);

//     if (rows.length === 0) {
//       return null; // No user found
//     }

//     return rows[0]; // Return the found user
//   } catch (err) {
//     console.error("Error fetching user by username:", err);
//     throw err;
//   }
// };
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

module.exports = {
  fetchUsers,
  updateUser,
  createUser,
  deleteUser,
  findUserByUsername
};
