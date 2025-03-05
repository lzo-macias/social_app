const { pool } = require("../db/index");

const createCommunityPost = async ({ user_id, community_id, title, content }) => {
  console.log("🔍 Debug - Creating community post with values:", { user_id, community_id, title });

  try {
    const SQL = `
      INSERT INTO posts(id, user_id, community_id, title, content, created_at, updated_at)
      VALUES(uuid_generate_v4(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;

    const result = await pool.query(SQL, [user_id, community_id, title, content]);

    console.log(`✅ Community post "${title}" created successfully.`);
    return result.rows[0];

  } catch (err) {
    console.error("❌ Error creating community post:", err);
    throw err;
  }
};

const fetchCommunityPosts = async (community_id) => {
  try {
    const SQL = `SELECT * FROM posts WHERE community_id = $1;`;
    const { rows } = await pool.query(SQL, [community_id]);
    return rows;
  } catch (err) {
    console.error("❌ Error fetching community posts:", err);
    throw err;
  }
};

const deleteCommunityPost = async (id) => {
  try {
    const SQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
    const result = await pool.query(SQL, [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Error deleting community post:", err);
    throw err;
  }
};

module.exports = {
  createCommunityPost,
  fetchCommunityPosts,
  deleteCommunityPost,
};
