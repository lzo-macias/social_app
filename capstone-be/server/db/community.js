// db/community.js
const { pool } = require("./index");

// Fetch all communities
const fetchCommunities = async () => {
  const result = await pool.query("SELECT * FROM communities");
  return result.rows;
};

// get community by ID
const getCommunityById = async (communityId) => {
  const query = "SELECT * FROM communities WHERE id = $1";
  const result = await pool.query(query, [communityId]);
  return result.rows[0]; // Return the first community row
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
  try {
    // ✅ Check if community name already exists
    const checkSQL = `SELECT * FROM communities WHERE name = $1;`;
    const checkResult = await pool.query(checkSQL, [name]);

    if (checkResult.rows.length > 0) {
      throw new Error(`Community with name "${name}" already exists.`);
    }

    // ✅ Insert new community
    const communitySQL = `
      INSERT INTO communities (id, name, description, created_by, created_at)
      VALUES (uuid_generate_v4(), $1, $2, $3, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(communitySQL, [
      name,
      description,
      createdBy,
    ]);
    const community = rows[0];

    if (!community) {
      throw new Error("Failed to create community.");
    }

    // ✅ Add the creator as an admin in community_members
    const addAdminSQL = `
      INSERT INTO community_members (id, community_id, user_id, role, joined_at)
      VALUES (uuid_generate_v4(), $1, $2, 'admin', NOW())
      RETURNING *;
    `;
    await pool.query(addAdminSQL, [community.id, createdBy]);

    return community;
  } catch (err) {
    console.error("❌ Error creating community:", err.message);
    throw new Error(err.message);
  }
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

// Fetch all communities a user is part of
const fetchUserCommunities = async (username) => {
  try {
    // Get the user ID from the username
    console.log("fetching id from username")
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
   
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const userId = userResult.rows[0].id;
    console.log(userId)

    // Get the communities where the user is a member
      const communitiesResult  = await pool.query(
      `SELECT c.* 
       FROM communities c
       JOIN community_members cm ON cm.community_id = c.id
       WHERE cm.user_id = $1`,
      [userId]
    );
    // console.log(communitiesResult.rows)
    return communitiesResult.rows;
  } catch (err) {
    console.error("Error fetching user communities:", err.message);
    throw err;
  }
};

module.exports = {
  pool,
  fetchCommunities,
  getCommunityById,
  fetchCommunityMembers,
  createCommunity,
  addUserToCommunity,
  updateCommunity,
  deleteCommunity,
  fetchUserCommunities,
};
