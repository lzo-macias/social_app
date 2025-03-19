// capstone-be/server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./api");
const { pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from "uploads"
app.use("/uploads", express.static(path.join(__dirname, "../", "uploads")));

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for API requests
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

// Create HTTP Server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  path: "/sockets",
  cors: { origin: "*" },
  methods: ["GET", "POST"],
});

console.log("✅ Socket.IO configured with path '/sockets'");

// SOCKET.IO CONNECTION HANDLING
io.on("connection", (socket) => {
  console.log("🟢 Socket.IO: A user connected, socket id:", socket.id);
  console.log("🔗 Socket handshake query:", socket.handshake.query);

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO: Connection error:", error);
  });

  // JOIN A ROOM
  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`🚪 User ${socket.id} joined room: ${roomId}`);

    // Log all users in the room after 2 seconds to verify
    setTimeout(async () => {
      const socketsInRoom = await io.in(roomId).fetchSockets();
      console.log(
        `👥 Users currently in ${roomId}:`,
        socketsInRoom.map((s) => s.id)
      );
    }, 2000);
  });

  // LISTEN FOR CHAT MESSAGES
  socket.on("sendMessage", async ({ senderId, roomId, content }) => {
    try {
      // Fetch sender's username from the database
      const usernameQuery = await pool.query(
        "SELECT username FROM users WHERE id = $1",
        [senderId]
      );
      const senderUsername =
        usernameQuery.rows.length > 0
          ? usernameQuery.rows[0].username
          : "Unknown";

      const createdAt = new Date().toISOString();
      const message = {
        senderId,
        senderUsername,
        roomId, // Community ID
        content,
        created_at: createdAt,
      };

      // Insert the message into the group_messages table for persistence
      await pool.query(
        "INSERT INTO group_messages (sender_id, group_id, content, created_at) VALUES ($1, $2, $3, $4)",
        [senderId, roomId, content, createdAt]
      );

      // Emit the message to everyone in the room
      io.to(roomId).emit("receiveMessage", message);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket.IO: A user disconnected, socket id:", socket.id);
  });
});

// DATABASE CHECK + SERVER STARTUP
const init = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected!");

    // Start the HTTP server (for both Express and Socket.IO)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

// Start the server
init();
