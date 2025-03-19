const { pool } = require("./index");
const { v4: uuidv4 } = require("uuid");

const createCommunityPostComment = async ({
  createdbyId,
  postId,
  communityId,
  comment,
}) => {
  try {
    const SQL = `
      WITH inserted AS (
        INSERT INTO comments (id, created_by, post_id, community_id, comment, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      )
      SELECT inserted.*, users.username
      FROM inserted
      JOIN users ON inserted.created_by = users.id;
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

const fetchCommentsByPostCommunity = async (postId) => {
  try {
    const SQL = `
      SELECT c.*, u.username
      FROM comments c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.post_id = $1;
    `;
    const { rows } = await pool.query(SQL, [postId]);
    return rows;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err;
  }
};

const updateCommunityPostComment = async (commentId, comment) => {
  try {
    const SQL = `
      WITH updated AS (
        UPDATE comments
        SET comment = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      )
      SELECT updated.*, users.username
      FROM updated
      JOIN users ON updated.created_by = users.id;
    `;
    const { rows } = await pool.query(SQL, [comment, commentId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error updating comment:", err);
    throw err;
  }
};

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

module.exports = {
  createCommunityPostComment,
  fetchCommentsByPostCommunity,
  updateCommunityPostComment,
  deleteCommunityPostComment,
};
