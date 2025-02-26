const { pool } = require("./index"); // Use pool instead of client

// Save image metadata to the database
const saveImage = async ({ filename, filepath }) => {
  try {
    const SQL = `
      INSERT INTO images (filename, filepath, uploaded_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const result = await pool.query(SQL, [filename, filepath]);
    return result.rows[0];
  } catch (err) {
    console.error("Error saving image:", err);
    throw err;
  }
};

// Fetch all image metadata from the database
const fetchAllImages = async () => {
  try {
    const SQL = `SELECT * FROM images ORDER BY uploaded_at DESC`;
    const result = await pool.query(SQL);
    return result.rows;
  } catch (err) {
    console.error("Error fetching all images:", err);
    throw err;
  }
};

// Fetch image metadata by filename
const fetchImageByFilename = async (filename) => {
  try {
    const SQL = `SELECT * FROM images WHERE filename = $1`;
    const result = await pool.query(SQL, [filename]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching image by filename:", err);
    throw err;
  }
};

module.exports = { saveImage, fetchAllImages, fetchImageByFilename };
