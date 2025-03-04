const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid");

const createPersonalPost = async ({ userId, content, imgId }) => {
  try {
    const SQL = `
      INSERT INTO posts (id, user_id, content, img_id, created_at)
      VALUES ($1, $2, $3, $4::uuid, NOW())  -- 🔹 Cast imgId to UUID
      RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [uuidv4(), userId, content, imgId]);
    return rows[0];
  } catch (err) {
    console.error("❌ Error creating personal post with image:", err);
    throw err;
  }
};

const UpdatePersonalPost = async ({ postId, content }) => {
  try {
    const SQL = `
          UPDATE posts SET content =$1 WHERE id = $2
          RETURNING *;
        `;
    const { rows } = await pool.query(SQL, [content, postId]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const fetchPostsByUser = async (userId) => {
  try {
    console.log("Querying posts for userId:", userId); // Log userId before the query
    const SQL = `SELECT * FROM posts WHERE user_id = $1;`;
    const { rows } = await pool.query(SQL, [userId]);

    if (rows.length === 0) {
      console.warn("⚠️ No posts found for userId:", userId);
    } else {
      console.log("✅ Posts found:", rows);
    }

    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

const fetchUserIdByUsername = async (username) => {
  try {
    const SQL = `SELECT id FROM users WHERE username = $1;`;
    const { rows } = await pool.query(SQL, [username]);

    if (rows.length === 0) {
      return null; // No user found
    }

    return rows[0]; // Return the user object with the UUID
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};


const fetchPostbyId = async (postId) => {
  try {
    const SQL = `
      SELECT 
          posts.*, 
          images.filename AS image_filename,
          images.filepath AS image_path
      FROM posts
      LEFT JOIN images ON posts.img_id = images.id
      WHERE posts.id = $1;
    `;
    const { rows } = await pool.query(SQL, [postId]);

    return rows[0]; // Return post data including image details
  } catch (err) {
    console.error("❌ Error fetching post by ID:", err);
    throw err;
  }
};

const deletePersonalPost = async (personal_postId) => {
  try {
    const SQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(SQL, [personal_postId]);
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createPersonalPost,
  fetchPostsByUser,
  fetchPostbyId,
  fetchUserIdByUsername,
  deletePersonalPost,
  UpdatePersonalPost,
};
