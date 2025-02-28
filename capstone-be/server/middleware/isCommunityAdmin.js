const { pool } = require("../db/index");

const isCommunityAdmin = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id;

    // ✅ Check if user is the creator of the community
    const communityResult = await pool.query(
      "SELECT created_by FROM communities WHERE id = $1",
      [communityId]
    );

    if (communityResult.rows.length === 0) {
      return res.status(404).json({ error: "Community not found" });
    }

    const community = communityResult.rows[0];

    if (community.created_by === userId) {
      return next(); // ✅ User is the creator of the community
    }

    // ✅ Check if user is an admin in the community_members table
    const adminResult = await pool.query(
      "SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2 AND role = 'admin'",
      [communityId, userId]
    );

    if (adminResult.rows.length > 0) {
      return next(); // ✅ User has admin role
    }

    return res.status(403).json({ error: "Access denied" });
  } catch (error) {
    console.error("❌ Error checking admin permissions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = isCommunityAdmin;
