const { pool } = require("./index");

// **Send a Direct Message with Error Handling**
const sendDirectMessage = async ({ senderId, receiverId, content }) => {
  try {
    const query = `
      INSERT INTO direct_messages (sender_id, receiver_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [senderId, receiverId, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("❌ Database error sending direct message:", error);
    return null; // Avoids app crash
  }
};

// **Fetch Direct Messages Between Two Users**
const fetchDirectMessages = async (senderId, receiverId) => {
  try {
    const query = `
      SELECT * FROM direct_messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC;
    `;
    const { rows } = await pool.query(query, [senderId, receiverId]);
    return rows;
  } catch (error) {
    console.error("❌ Database error fetching direct messages:", error);
    return [];
  }
};

// **Send a Group Message**
const sendGroupMessage = async ({ senderId, groupId, content }) => {
  try {
    const query = `
      INSERT INTO group_messages (sender_id, group_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [senderId, groupId, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("❌ Database error sending group message:", error);
    return null;
  }
};

// **Fetch Messages in a Group**
const fetchGroupMessages = async (groupId) => {
  try {
    const query = `
      SELECT gm.*, u.username FROM group_messages gm
      JOIN users u ON gm.sender_id = u.id
      WHERE group_id = $1
      ORDER BY created_at ASC;
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  } catch (error) {
    console.error("❌ Database error fetching group messages:", error);
    return [];
  }
};

module.exports = { sendDirectMessage, fetchDirectMessages, sendGroupMessage, fetchGroupMessages };
