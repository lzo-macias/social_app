const { client } = require("./db"); // Import client from the db setup
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createPost = async ({ userId, communityId, content }) => {
  try {
    const SQL = `
        INSERT INTO posts(id, user_id, community_id, content)
        VALUES($1, $2, $3, $4) RETURNING *;
      `;
    const { rows } = await client.query(SQL, [
      uuidv4(),
      userId,
      communityId,
      content,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const fetchPostsByCommunity = async (communityId) => {
  try {
    const SQL = `SELECT * FROM posts WHERE community_id = $1;`;
    const { rows } = await client.query(SQL, [communityId]);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { createPost, fetchPostsByCommunity };
