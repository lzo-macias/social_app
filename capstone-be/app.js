// capstone-be/app.js
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./server/api");
const { pool } = require("./server/db"); // Use pool for DB connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use API Routes
app.use("/api", apiRoutes);

// Initialize the app with database connection check
const init = async () => {
  try {
    console.log("Connecting to database...");
    
    // Test the pool connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected!");

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

// Start the server
init();





