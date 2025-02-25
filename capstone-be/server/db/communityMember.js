const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createCommunityMember = async (communityId, userId) => {
  try {
    const SQL = `
        INSERT INTO community_members(id, community_id, user_id)
        VALUES($1, $2, $3) RETURNING *;
      `;
    const { rows } = await client.query(SQL, [uuidv4(), communityId, userId]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const fetchCommunityMembers = async (communityId) => {
  try {
    const SQL = `SELECT * FROM community_members WHERE community_id = $1;`;
    const { rows } = await client.query(SQL, [communityId]);
    return rows;
  } catch (err) {
    console.error(err);
  }
};
