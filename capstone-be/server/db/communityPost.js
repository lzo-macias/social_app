const { pool } = require("./index"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createCommunityPost = async ({
  userId,
  communityId,
  title,
  content,
  img_id,
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
      img_id,
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
    const SQL = `
      SELECT 
        posts.*, 
        images.filename AS image_filename,
        images.filepath AS image_path
      FROM posts
      LEFT JOIN images ON posts.img_id = images.id
      WHERE posts.community_id = $1
      ORDER BY posts.created_at DESC;
    `;

    const { rows } = await pool.query(SQL, [communityId]);

    if (rows.length === 0) {
      console.warn(`⚠️ No posts found for community ID: ${communityId}`);
    } else {
      console.log(`✅ Fetched Posts for Community ID: ${communityId}`, rows);
    }

    return rows;
  } catch (err) {
    console.error("❌ Error fetching posts by community:", err);
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
  try {
    const SQL = `
    SELECT 
    posts.*, 
    images.filename AS image_filename,
    images.filepath AS image_path
    FROM posts
    LEFT JOIN images ON posts.img_id = images.id
    ORDER BY posts.created_at DESC;
    `;

    const result = await pool.query(SQL);
    
    if (result.rows.length === 0) {
      console.warn("⚠️ No posts found.");
    } else {
      console.log("✅ Fetched All Posts:", result.rows);
    }

    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching all posts:", err);
    throw err;
  }
}


module.exports = {
  createCommunityPost,
  fetchPostsByCommunity,
  updateCommunityPost,
  deleteCommunityPost,
  fetchAllPosts,
};
