const { pool } = require("./index");

// **Send a Direct Message**
const sendDirectMessage = async ({ senderId, receiverId, content }) => {
  const query = `
    INSERT INTO direct_messages (sender_id, receiver_id, content, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;
  const values = [senderId, receiverId, content];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// **Send a Group Message**
const sendGroupMessage = async ({ senderId, groupId, content }) => {
  const query = `
    INSERT INTO group_messages (sender_id, group_id, content, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;
  const values = [senderId, groupId, content];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// **Fetch Direct Messages**
const fetchDirectMessages = async (senderId, receiverId) => {
  const query = `
    SELECT * FROM direct_messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at DESC;
  `;
  const values = [senderId, receiverId];

  const { rows } = await pool.query(query, values);
  return rows;
};

// **Fetch Group Messages**
const fetchGroupMessages = async (groupId) => {
  const query = `
    SELECT * FROM group_messages
    WHERE group_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [groupId]);
  return rows;
};

module.exports = {
  sendDirectMessage,
  sendGroupMessage,
  fetchDirectMessages,
  fetchGroupMessages,
};

