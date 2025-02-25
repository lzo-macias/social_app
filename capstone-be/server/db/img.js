const { client } = require("./db");

// Save image metadata to the database
const saveImage = async ({ filename, filepath }) => {
  const SQL = `
    INSERT INTO images (filename, filepath, uploaded_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  const result = await client.query(SQL, [filename, filepath]);
  return result.rows[0];
};

module.exports = { saveImage };