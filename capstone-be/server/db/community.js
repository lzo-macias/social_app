const { v4: uuidv4 } = require('uuid');  // Import uuid for generating UUIDs


const fetchCommunities = async () => {
    try {
      const SQL = `SELECT * FROM communities;`;
      const { rows } = await client.query(SQL);
      return rows;
    } catch (err) {
      console.error(err);
    }
  };

  const createCommunity = async (name, adminId) => {
    try {
      const SQL = `
        INSERT INTO communities(id, name, admin)
        VALUES($1, $2, $3) RETURNING *;
      `;
      const { rows } = await client.query(SQL, [uuidv4(), name, adminId]);
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  };