const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid");

const createPersonalPost = async ({ userId, content, imgId, imgUrl }) => {
  try {
    const SQL = `
      INSERT INTO posts ON CONFLICT (id) DO NOTHING (id, user_id, content, img_id, img_url, created_at)
      VALUES ($1, $2, $3, $4::uuid, $5, NOW())  -- 🔹 Cast imgId to UUID and insert imgUrl
      RETURNING *;
    `;

    const { rows } = await pool.query(SQL, [
      uuidv4(), // Generates a new post ID
      userId,
      content,
      imgId || null, // Ensure imgId is NULL if not provided
      imgUrl || null, // Ensure imgUrl is stored correctly
    ]);

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
    console.log("🔍 Querying posts for userId:", userId); // Log userId before the query
    const SQL = `
      SELECT 
          posts.*, 
          posts.img_url  -- ✅ Ensure img_url is fetched directly from posts
      FROM posts
      WHERE posts.user_id = $1
      ORDER BY posts.created_at DESC;
    `;
    const { rows } = await pool.query(SQL, [userId]);

    if (rows.length === 0) {
      console.warn("⚠️ No posts found for userId:", userId);
    } else {
      console.log("✅ Posts found:", rows);
    }

    console.log("🚀 Debug: Fetched Posts from DB", rows); // ✅ Log the posts
    return rows;
  } catch (err) {
    console.error("❌ Database query error:", err);
    throw err;
  }
};

const fetchUserIdByUsername = async (username) => {
  try {
    console.log("🔍 Fetching UUID for username:", username);

    const SQL = `SELECT id FROM users WHERE username = $1;`;
    const { rows } = await pool.query(SQL, [username]);

    if (rows.length === 0) {
      console.log("❌ No user found with username:", username);
      return null;
    }

    console.log("✅ Fetched user UUID:", rows[0].id);
    return rows[0]; // Return the user object with the UUID
  } catch (err) {
    console.error("❌ Database query error:", err);
    throw err;
  }
};

const fetchPostbyId = async (postId) => {
  try {
    const SQL = `
      SELECT 
          posts.*, 
          images.filename AS image_filename,
          images.filepath AS image_path,
          posts.img_url  -- ✅ Ensure img_url is fetched directly from posts
      FROM posts
      LEFT JOIN images ON posts.img_id = images.id
      WHERE posts.id = $1;
    `;

    const { rows } = await pool.query(SQL, [postId]);

    console.log("🚀 Debug: Post Data from DB", rows[0]); // ✅ Ensure img_url is fetched
    return rows[0]; // ✅ Should now include img_url
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
