const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid");

const createPersonalPost = async ({ userId, content }) => {
    try {
      const SQL = `
          INSERT INTO personal_posts(id, user_id, content)
          VALUES($1, $2, $3) RETURNING *;
        `;
      const { rows } = await pool.query(SQL, [
        uuidv4(),
        userId,
        content,
      ]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  };

  const UpdatePersonalPost = async ({ postId, content }) => {
    try {
      const SQL = `
          UPDATE personal_posts SET content =$1 WHERE id = $2
          RETURNING *;
        `;
      const { rows } = await pool.query(SQL, [
        content,postId
      ]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchPostsByUser = async (userId) => {
    try {
      const SQL = `SELECT * FROM personal_posts WHERE user_id = $1 ;`;
      const { rows } = await pool.query(SQL, [userId]);
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const fetchPostbyId = async (postId) => {
    try {
      const SQL = `SELECT * FROM personal_posts WHERE id = $1 ;`;
      const { rows } = await pool.query(SQL, [postId]);
      return rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const deletePersonalPost = async (personal_postId) => {
    try {
      const SQL = `DELETE FROM personal_posts WHERE id = $1 RETURNING *;`;
      const { rows } = await pool.query(SQL, [personal_postId]);
      return rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  module.exports = {createPersonalPost,fetchPostsByUser,fetchPostbyId,deletePersonalPost,UpdatePersonalPost }