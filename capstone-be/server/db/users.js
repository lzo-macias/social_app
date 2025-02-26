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
  });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const SQL = `
      INSERT INTO users(id,is_admin, username, password, name, email, dob, visibility,profile_picture,
  bio, location, status, created_at  )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuid.v4(),
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
      created_at,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

// **UPDATE User by ID**
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
    
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const SQL = `UPDATE users 
                   SET 
                     is_admin = $1, 
                     username = $2, 
                     password = $3, 
                     email = $4, 
                     dob = $5,
                     visibility = $6, 
                     profile_picture = $7, 
                     bio = $8, 
                     location = $9,
                     status = $10
                   WHERE id = $11
                   RETURNING *;`;

    const queryParams = [
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
    ];

    const { rows } = await pool.query(SQL, queryParams);
    return rows[0]; 
  } catch (err) {
    console.error("Error updating user:", err);
    throw err; 
  }
};

const deleteUser= async (id) => {
  try {
      const SQL = `DELETE FROM users WHERE id = $1;`
      await pool.query(SQL, [id]);
      return true;
  } catch(err) {
      console.error(err);
  }
}

module.exports = {
  fetchUsers,
  updateUser,
  createUser,
  deleteUser
};
