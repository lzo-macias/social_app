const { Pool } = require("pg"); // Only require Pool (not Client)
require("dotenv").config();

// Initialize the pool for handling multiple connections
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
});

// Test the database connection on startup
pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ Database connected successfully!");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// Export pool to be used in other database files
module.exports = { pool };




