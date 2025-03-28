const { pool } = require("./index"); // Use pool instead of client
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Save image metadata to the database
const saveImage = async ({ filename, filepath, userId }) => {
  try {
    const correctedFilePath = `/uploads/${filename}`; // ✅ Correct path format

    const SQL = `
      INSERT INTO images (id, filename, filepath, user_id, uploaded_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuidv4(),
      filename,
      correctedFilePath,
      userId,
    ]);
    return rows[0];
  } catch (err) {
    console.error("❌ Error saving image:", err);
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

// Delete image by filename

const deleteImageByFilename = async (filename) => {
  try {
    const SQL = `DELETE FROM images WHERE filename = $1 RETURNING *`;
    const result = await pool.query(SQL, [filename]);

    if (result.rowCount === 0) {
      return null; // No image found
    }

    const deleted = result.rows[0];

    // Define file paths
    const extension = path.extname(filename);             // e.g., '.jpg'
    const baseName = path.basename(filename, extension);  // e.g., '1700000000-myimg'
    const uploadDir = path.join(__dirname, "../../uploads");

    const filePathsToDelete = [
      path.join(uploadDir, `${baseName}${extension}`),        // original
      path.join(uploadDir, `${baseName}_small${extension}`),  // small
      path.join(uploadDir, `${baseName}_medium${extension}`), // medium
    ];

    // Delete each file
    filePathsToDelete.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("❌ Error deleting file:", filePath, err);
        } else if (!err) {
          console.log("🗑️ Deleted file:", filePath);
        }
      });
    });

    return deleted; // Return deleted image metadata
  } catch (err) {
    console.error("❌ Error deleting image:", err);
    throw err;
  }
};
// const deleteImageByFilename = async (filename) => {
//   try {
//     const SQL = `DELETE FROM images WHERE filename = $1 RETURNING *`;
//     const result = await pool.query(SQL, [filename]);

//     if (result.rowCount === 0) {
//       return null; // No image found
//     }

//     // Delete file from filesystem
//     const filePath = path.join(__dirname, "../../uploads", filename);
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         console.error("Error deleting file:", err);
//       } else {
//         console.log("File deleted:", filename);
//       }
//     });

//     return result.rows[0]; // Return deleted image data
//   } catch (err) {
//     console.error("Error deleting image:", err);
//     throw err;
//   }
// };

// Fetch images uploaded by a specific user
const fetchImagesByUser = async (userId) => {
  try {
    console.log("🔍 Running DB query for user:", userId);

    const SQL = `SELECT * FROM images WHERE user_id = $1 ORDER BY uploaded_at DESC;`;
    const { rows } = await pool.query(SQL, [userId]);

    console.log("✅ DB Query Result:", rows);
    return rows;
  } catch (err) {
    console.error("❌ Error fetching images by user:", err);
    throw err;
  }
};

module.exports = {
  saveImage,
  fetchAllImages,
  fetchImageByFilename,
  deleteImageByFilename,
  fetchImagesByUser,
};
