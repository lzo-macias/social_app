// server/db/community.js
const { pool } = require("./index");  // Use the pool directly from index.js

// Fetch all communities
const fetchCommunities = async () => {
  const result = await pool.query('SELECT * FROM communities');
  return result.rows;
};

// Fetch community by ID
const fetchCommunityById = async (id) => {
  const result = await pool.query('SELECT * FROM communities WHERE id = $1', [id]);
  return result.rows[0];
};

// Fetch members of a specific community
const fetchCommunityMembers = async (communityId) => {
  const result = await pool.query(
    'SELECT * FROM community_members WHERE community_id = $1',
    [communityId]
  );
  return result.rows;
};

// Fetch posts by a specific community
const fetchPostsByCommunity = async (communityId) => {
  const result = await pool.query(
    'SELECT * FROM posts WHERE community_id = $1',
    [communityId]
  );
  return result.rows;
};

// Create a new community
const createCommunity = async ({ name, description }) => {
  const result = await pool.query(
    'INSERT INTO communities (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
};

// Add a user to a community
const addUserToCommunity = async (communityId, userId) => {
  const result = await pool.query(
    'INSERT INTO community_members (community_id, user_id) VALUES ($1, $2) RETURNING *',
    [communityId, userId]
  );
  return result.rows[0];
};

module.exports = {
  fetchCommunities,
  fetchCommunityById,
  fetchCommunityMembers,
  fetchPostsByCommunity,
  createCommunity,
  addUserToCommunity,
};
