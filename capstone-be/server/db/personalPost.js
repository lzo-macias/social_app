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
    const SQL = `SELECT * FROM posts WHERE user_id = $1 ;`;
    const { rows } = await pool.query(SQL, [userId]);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const fetchPostbyId = async (postId) => {
  try {
    const SQL = `SELECT * FROM posts WHERE id = $1 ;`;
    const { rows } = await pool.query(SQL, [postId]);
    return rows[0];
  } catch (err) {
    console.error(err);
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
  deletePersonalPost,
  UpdatePersonalPost,
};
