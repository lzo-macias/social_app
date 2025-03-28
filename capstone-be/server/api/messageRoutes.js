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
      `SELECT gm.*, u.username AS "senderUsername"
       FROM group_messages gm
       JOIN users u ON gm.sender_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.created_at ASC`,
      [roomId]
    );
    console.log(`Returning ${result.rows.length} messages for room ${roomId}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching chat messages for room", roomId, ":", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// GET all unique direct message threads for a user
router.get("/direct-threads/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT
        u.id,
        u.username,
        u.profile_picture,
        MAX(dm.created_at) AS last_message_at
      FROM direct_messages dm
      JOIN users u ON
        (u.id = dm.sender_id AND dm.receiver_id = $1)
        OR (u.id = dm.receiver_id AND dm.sender_id = $1)
      WHERE u.id != $1
      GROUP BY u.id, u.username, u.profile_picture
      ORDER BY last_message_at DESC;
    `;

    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching direct threads:", err);
    res.status(500).json({ error: "Failed to fetch message threads" });
  }
});

// GET direct messages between two users
router.get("/direct/:user1Id/:user2Id", async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const result = await pool.query(
      `SELECT dm.*, u.username AS senderUsername
       FROM direct_messages dm
       JOIN users u ON dm.sender_id = u.id
       WHERE (dm.sender_id = $1 AND dm.receiver_id = $2)
          OR (dm.sender_id = $2 AND dm.receiver_id = $1)
       ORDER BY dm.created_at ASC`,
      [user1Id, user2Id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching direct messages:", err);
    res.status(500).json({ error: "Failed to fetch direct messages" });
  }
});

module.exports = router;
