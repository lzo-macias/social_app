<<<<<<< HEAD
const { v4: uuidv4 } = require("uuid");
const client = require("./db"); // Ensure this connects to PostgreSQL

// **Send a Direct Message**
const sendDirectMessage = async ({ senderId, receiverId, content }) => {
  try {
    const SQL = `
            INSERT INTO messages(id, sender_id, receiver_id, content)
            VALUES($1, $2, $3, $4) RETURNING *;
        `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
      senderId,
      receiverId,
=======
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createMessage = async ({ senderId, communityId, content }) => {
  try {
    const SQL = `
        INSERT INTO messages(id, sender_id, community_id, content)
        VALUES($1, $2, $3, $4) RETURNING *;
      `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
      senderId,
      communityId,
>>>>>>> main
      content,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

<<<<<<< HEAD
// **Send a Group Message**
const sendGroupMessage = async ({ senderId, groupId, content }) => {
  try {
    const SQL = `
            INSERT INTO messages(id, sender_id, group_id, content)
            VALUES($1, $2, $3, $4) RETURNING *;
        `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
      senderId,
      groupId,
      content,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

// **Fetch Direct Messages**
const fetchDirectMessages = async (senderId, receiverId) => {
  try {
    const SQL = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1) 
            ORDER BY created_at ASC;
        `;
    const { rows } = await client.query(SQL, [senderId, receiverId]);
=======
const fetchMessagesByPost = async (postId) => {
  try {
    const SQL = `SELECT * FROM messages WHERE post_id = $1;`;
    const { rows } = await client.query(SQL, [postId]);
>>>>>>> main
    return rows;
  } catch (err) {
    console.error(err);
  }
};
<<<<<<< HEAD

// **Fetch Group Messages**
const fetchGroupMessages = async (groupId) => {
  try {
    const SQL = `
            SELECT * FROM messages 
            WHERE group_id = $1 
            ORDER BY created_at ASC;
        `;
    const { rows } = await client.query(SQL, [groupId]);
    return rows;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  sendDirectMessage,
  sendGroupMessage,
  fetchDirectMessages,
  fetchGroupMessages,
};
=======
>>>>>>> main
