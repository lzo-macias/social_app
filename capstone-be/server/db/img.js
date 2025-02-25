const { client } = require("../db");

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

// Fetch all image metadata from the database
const fetchAllImages = async () => {
  const SQL = `SELECT * FROM images ORDER BY uploaded_at DESC`;
  const result = await client.query(SQL);
  return result.rows; // Returns an array of images
};

// Fetch image metadata by filename
const fetchImageByFilename = async (filename) => {
  const SQL = `SELECT * FROM images WHERE filename = $1`;
  const result = await client.query(SQL, [filename]);
  return result.rows[0]; // Returns a single image record
};

module.exports = { saveImage, fetchAllImages, fetchImageByFilename };
