const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createCommunityPost = async ({ userId, communityId, title, content }) => {
  try {
    const SQL = `
      INSERT INTO posts(id, user_id, community_id, title, content)
      VALUES($1, $2, $3, $4, $5) RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuidv4(),
      userId,
      communityId,
      title,
      content,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
};

// Fetch posts by community
const fetchPostsByCommunity = async (communityId) => {
  try {
    const SQL = `SELECT * FROM posts WHERE community_id = $1;`;
    const { rows } = await pool.query(SQL, [communityId]);
    return rows;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};

// Add delete-post function
const deleteCommunityPost = async (postId) => {
  try {
    const SQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(SQL, [postId]);

    return rows[0]; // Returns deleted post or null if not found
  } catch (err) {
    console.error("Error deleting post:", err);
    throw err;
  }
};

// Update a community post
const updateCommunityPost = async (postId, content, userId) => {
  try {
    const SQL = `SELECT * FROM posts WHERE id = $1`;
    const { rows } = await pool.query(SQL, [postId]);

    if (!rows.length) {
      throw new Error("Post not found");
    }

    const post = rows[0];

    // Check if the logged-in user is the post owner
    if (post.user_id !== userId) {
      throw new Error("You are not authorized to edit this post");
    }

    const updateSQL = `UPDATE posts SET content = $1 WHERE id = $2 RETURNING *`;
    const { rows: updatedPost } = await pool.query(updateSQL, [
      content,
      postId,
    ]);

    return updatedPost[0];
  } catch (err) {
    console.error("Error updating post:", err);
    throw err;
  }
};

module.exports = {
  createCommunityPost,
  fetchPostsByCommunity,
  updateCommunityPost,
  deleteCommunityPost,
};
