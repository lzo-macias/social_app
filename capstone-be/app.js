const express = require("express");
const cors = require("cors");
const apiRoutes = require("./server/api");
const communityPostRoutes = require("./server/api/communityPostRoutes");
const { pool } = require("./server/db"); // Use pool for DB connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log every incoming request URL
app.use("/api", (req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  next();
});

// Use API Routes
app.use("/api", apiRoutes);
app.use("/api", communityPostRoutes);

// Global error handler (for handling errors passed to next(err))
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

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
