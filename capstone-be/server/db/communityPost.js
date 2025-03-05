const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createCommunityPost = async ({
  userId,
  communityId,
  title,
  content,
  imgId,
  imageUrl,
}) => {
  try {
    const SQL = `
      INSERT INTO posts (id, user_id, community_id, title, content, img_id, img_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [
      uuidv4(),
      userId,
      communityId,
      title,
      content,
      imgId,
      imageUrl,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error creating community post:", err);
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
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    throw err;
  }
};

// Update a community post
const updateCommunityPost = async (postId, content, userId) => {
  try {
    // ✅ Check if the post exists and belongs to the user
    const postCheck = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );

    if (postCheck.rows.length === 0) {
      throw new Error("Post not found");
    }

    if (postCheck.rows[0].user_id !== userId) {
      throw new Error("You are not authorized to edit this post");
    }

    // ✅ Update the post content
    const SQL = `
      UPDATE posts SET content = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *;
    `;
    const { rows } = await pool.query(SQL, [content, postId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error updating post:", err);
    throw err;
  }
};

async function fetchAllPosts() {
  const result = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  return result.rows;
}

module.exports = {
  createCommunityPost,
  fetchPostsByCommunity,
  updateCommunityPost,
  deleteCommunityPost,
  fetchAllPosts,
};
