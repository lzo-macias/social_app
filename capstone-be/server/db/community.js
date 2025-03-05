const { pool } = require("../db/index");

const createCommunity = async ({ name, description, admin_id, created_by, visibility }) => {
  console.log("🔍 Debug - Creating community with values:", { name, admin_id, created_by, visibility });

  try {
    const SQL = `
      INSERT INTO communities(id, name, description, admin_id, created_by, visibility, created_at, updated_at)
      VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `;

    const result = await pool.query(SQL, [name, description, admin_id, created_by, visibility]);

    if (!result.rows.length) {
      console.log(`⚠️ Community "${name}" already exists. Skipping.`);
      return null;
    }

    console.log(`✅ Community "${name}" created successfully.`);
    return result.rows[0];

  } catch (err) {
    console.error("❌ Error creating community:", err);
    throw err;
  }
};

const fetchCommunities = async () => {
  try {
    const SQL = `SELECT * FROM communities;`;
    const { rows } = await pool.query(SQL);
    return rows;
  } catch (err) {
    console.error("❌ Error fetching communities:", err);
    throw err;
  }
};

const deleteCommunity = async (id) => {
  try {
    const SQL = `DELETE FROM communities WHERE id = $1 RETURNING *;`;
    const result = await pool.query(SQL, [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Error deleting community:", err);
    throw err;
  }
};

module.exports = {
  createCommunity,
  fetchCommunities,
  deleteCommunity,
};
