const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./server/api");
const { pool } = require("./server/db");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Changed from 3000 to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "uploads"
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Logging middleware
app.use("/api", (req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  next();
});

// Use API Routes
app.use("/api", apiRoutes);

// Global error handler
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
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected!");

    // Start the server on port 5000
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

// Start the server
init();
