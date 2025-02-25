<<<<<<< HEAD
module.exports = { ...require("./community.js"), ...require("./users.js") };
=======
const { Client } = require("pg");
require("dotenv").config();

// Set up the database client
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432, // Default PostgreSQL port
});

module.exports = {
  client,
  ...require("./users.js"),
  ...require("./post.js"),
  ...require("./community.js"),
  ...require("./communityMember.js"),
  ...require("./db.js"),
  ...require("./message.js"),
};
>>>>>>> community_branch
