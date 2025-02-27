const { pool } = require("./index");

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

// Create a new community (with creator)
const createCommunity = async ({ name, description, createdBy }) => {
  const result = await pool.query(
    "INSERT INTO communities (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
    [name, description, createdBy]
  );
  return result.rows[0];
};

// Add a user to a community with a role (default: "member")
const addUserToCommunity = async (communityId, userId, role = "member") => {
  const result = await pool.query(
    "INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3) RETURNING *",
    [communityId, userId, role]
  );
  return result.rows[0];
};

// Update a community
const updateCommunity = async (communityId, updateData) => {
  try {
    const { name, description } = updateData;
    const result = await pool.query(
      "UPDATE communities SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, communityId]
    );

    if (result.rows.length === 0) {
      return null; // Community not found
    }

    return result.rows[0]; // Return updated community
  } catch (error) {
    console.error("Error updating community:", error);
    throw error;
  }
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
      return null;
    }

    console.log("Successfully deleted community:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting community:", err);
    throw err;
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
