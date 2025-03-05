const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createCommunityPostComment = async ({
  createdbyId,
  postId,
  communityId,
  comment,
}) => {
  try {
    const SQL = `
      INSERT INTO comments (id, created_by, post_id, community_id, comment, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuidv4(),
      createdbyId,
      postId,
      communityId,
      comment,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error posting comment", err);
    throw err;
  }
};

// Fetch posts by community
const fetchCommentsByPostCommunity = async (postId) => {
  try {
    const SQL = `SELECT * FROM comments WHERE post_id= $1;`;
    const { rows } = await pool.query(SQL, [postId]);
    return rows;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err;
  }
};

// Add delete-post function
const deleteCommunityPostComment = async (commentId) => {
  try {
    const SQL = `DELETE FROM comments WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(SQL, [commentId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    throw err;
  }
};

// Update a community post
const updateCommunityPostComment = async (commentId, comment) => {
  try {
    const SQL = `
      UPDATE comments SET comment = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [comment, commentId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error updating comment:", err);
    throw err;
  }
};

module.exports = {
  createCommunityPostComment,
  fetchCommentsByPostCommunity,
  updateCommunityPostComment,
  deleteCommunityPostComment,
};
