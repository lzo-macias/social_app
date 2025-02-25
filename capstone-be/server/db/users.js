<<<<<<< HEAD
const { Client } = require('pg');
require("dotenv").config();
const client = new Client();

const uuid  = require("uuid");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "shh";


=======
const { client } = require("./db");
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs
>>>>>>> community_branch

const createUser = async ({
  username,
  password,
  email,
  name,
  dob,
  is_admin,
}) => {
  try {
    const SQL = `
      INSERT INTO users(id, username, password, email, dob, is_admin)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      username,
      password,
      email,
      dob,
      is_admin,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const fetchUsers = async () => {
  try {
    const SQL = `SELECT * FROM users;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error(err);
  }
};

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
    const SQL = `UPDATE users 
                   SET is_admin = $1, username = $2, password = $3, email = $4, dob = $5,visibility = $6, profile_picture = $7, bio = $8, location = $9 ,status = $10
                   WHERE id = $11
                   RETURNING *;`;
    const { rows } = await client.query(SQL, [
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
      userId,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const authenticate = async ({ username, password }) => {
  const SQL = ` SELECT id, password FROM users WHERE username =$1`;
  const response = await client.query(SQL, [username]);
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
    const payload = jwt.verify(token, secret);

    const SQL = `
    SELECT id, username
    FROM users
    WHERE id = $1
  `;
    const response = await client.query(SQL, [payload.id]);
    if (!response.rows.length) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  } catch (err) {
    const error = Error("Not authorized!");
    error.status = 401;
    throw error;
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  fetchUsers,
  updateUser,
  authenticate,
  findUserByToken,
  isLoggedIn,
};
