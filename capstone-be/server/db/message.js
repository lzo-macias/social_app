const { v4: uuidv4 } = require('uuid');  // Import uuid for generating UUIDs

const createMessage = async ({ senderId, communityId, content }) => {
    try {
      const SQL = `
        INSERT INTO messages(id, sender_id, community_id, content)
        VALUES($1, $2, $3, $4) RETURNING *;
      `;
      const { rows } = await client.query(SQL, [uuidv4(), senderId, communityId, content]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchMessagesByPost = async (postId) => {
    try {
      const SQL = `SELECT * FROM messages WHERE post_id = $1;`;
      const { rows } = await client.query(SQL, [postId]);
      return rows;
    } catch (err) {
      console.error(err);
    }
  };