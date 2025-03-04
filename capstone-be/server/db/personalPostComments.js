const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid");

const createPersonalPostComment = async ({ createdbyId, postId, comment}) => {
    try {
      const SQL = `
        INSERT INTO comments (id, created_by, post_id, comment, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
      `;
      const { rows } = await pool.query(SQL, [uuidv4(), createdbyId, postId, comment]);
      return rows[0];
    } catch (err) {
      console.error("❌ Error creating comment", err);
      throw err;
    }
  };
  
  const updatePersonalPostComment = async ({ commentId, comment }) => {
    try {
      const SQL = `
            UPDATE comments SET comment =$1 WHERE id = $2
            RETURNING *;
          `;
      const { rows } = await pool.query(SQL, [comment, commentId]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPersonalPostComment = async ({ postId }) => {
    try {
      const SQL = `SELECT id, comment, created_by, post_id, created_at FROM comments WHERE post_id = $1;`;
      const { rows } = await pool.query(SQL, [postId]);
  
      console.log("Backend Comments Data:", rows); 
  
      return Array.isArray(rows) ? rows : []; 
    } catch (err) {
      console.error("Error fetching comments:", err);
      return []; 
    }
  };

  const deletePersonalPostComment = async (commentId) => {
    try {
        const SQL = `DELETE FROM comments WHERE id = $1 RETURNING *;`;
        const { rows } = await pool.query(SQL, [commentId]);
        return rows[0];
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

module.exports = {createPersonalPostComment,fetchPersonalPostComment,updatePersonalPostComment,deletePersonalPostComment};