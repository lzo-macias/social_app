// server/db/community.js
const { pool } = require("./index"); // Use the pool directly from index.js

// Fetch all communities
const fetchCommunities = async () => {
  const result = await pool.query("SELECT * FROM communities");
  return result.rows;
};

// Fetch community by ID
const fetchCommunityById = async (id) => {
  const result = await pool.query("SELECT * FROM communities WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

// Fetch members of a specific community
const fetchCommunityMembers = async (communityId) => {
  const result = await pool.query(
    "SELECT * FROM community_members WHERE community_id = $1",
    [communityId]
  );
  return result.rows;
};

// Create a new community with admin_id
const createCommunity = async ({ name, description, admin_id }) => {
  const result = await pool.query(
    "INSERT INTO communities (name, description, admin_id) VALUES ($1, $2, $3) RETURNING *",
    [name, description, admin_id] // Include admin_id in the query
  );
  return result.rows[0];
};

// Add a user to a community
const addUserToCommunity = async (communityId, userId) => {
  const result = await pool.query(
    "INSERT INTO community_members (community_id, user_id) VALUES ($1, $2) RETURNING *",
    [communityId, userId]
  );
  return result.rows[0];
};

// Update a community
const updateCommunity = async (communityId, { name, description }) => {
  const result = await pool.query(
    "UPDATE communities SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, communityId]
  );
  return result.rows[0];
};

// Delete a community
const deleteCommunity = async (communityId) => {
  try {
    console.log("Attempting to delete community with ID:", communityId);

    await pool.query("DELETE FROM community_members WHERE community_id = $1", [
      communityId,
    ]);
    await pool.query("DELETE FROM posts WHERE community_id = $1", [
      communityId,
    ]);

    const result = await pool.query(
      "DELETE FROM communities WHERE id = $1 RETURNING *",
      [communityId]
    );

    if (result.rows.length === 0) {
      console.log("No community found with the given ID.");
      return null; // If no rows are deleted, return null
    }

    console.log("Successfully deleted community:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting community:", err);
    throw err; // This will make sure the error is properly forwarded
  }
};

module.exports = {
  fetchCommunities,
  fetchCommunityById,
  fetchCommunityMembers,
  createCommunity,
  addUserToCommunity,
  updateCommunity,
  deleteCommunity,
};
