// capstone-be/server/api/messageRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET chat messages for a specific room (community)
// This query joins group_messages with users to include the sender's username.
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM group_messages WHERE group_id=$1`,
      // `SELECT gm.*, u.username AS "senderUsername"
      //  FROM group_messages gm
      //  JOIN users u ON gm.sender_id = u.id
      //  WHERE gm.group_id = $1
      //  ORDER BY gm.created_at ASC`,
      [roomId]
    );
    console.log(`Returning ${result.rows.length} messages for room ${roomId}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching chat messages for room", roomId, ":", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

module.exports = router;
