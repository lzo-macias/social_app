const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

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
      INSERT INTO users(id, username, password, email, name, dob, is_admin)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
      username,
      password,
      email,
      name,
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
module.exports = { createUser, fetchUsers };
