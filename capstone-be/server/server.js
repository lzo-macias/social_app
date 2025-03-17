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

// **✅ CREATE HTTP SERVER AND ATTACH SOCKET.IO**
const server = http.createServer(app);
const io = new Server(server, {
  path: "/sockets", // ✅ Ensure the path is correct
  cors: { origin: "*" },
});

console.log("✅ Socket.IO configured with path '/sockets'");

// **✅ SOCKET.IO CONNECTION HANDLING**
io.on("connection", (socket) => {
  console.log("🟢 Socket.IO: A user connected, socket id:", socket.id);
  console.log("🔗 Socket handshake query:", socket.handshake.query);

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO: Connection error:", error);
  });

  // **JOIN A ROOM**
  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`🚪 User ${socket.id} joined room: ${roomId}`);

    // ✅ Log all users in the room after 2 seconds to verify
    setTimeout(async () => {
      const socketsInRoom = await io.in(roomId).fetchSockets();
      console.log(
        `👥 Users currently in ${roomId}:`,
        socketsInRoom.map((s) => s.id)
      );
    }, 2000);
  });

  // **LISTEN FOR CHAT MESSAGES**
  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    console.log("📨 Server received message:", {
      senderId,
      receiverId,
      content,
    });

    try {
      // ✅ Fetch username from database
      const usernameQuery = await pool.query(
        "SELECT username FROM users WHERE id = $1",
        [senderId]
      );
      const senderUsername =
        usernameQuery.rows.length > 0
          ? usernameQuery.rows[0].username
          : "Unknown";

      const message = {
        id: Date.now(), // Temporary ID
        senderId,
        senderUsername, // ✅ Include sender's username
        receiverId,
        content,
        created_at: new Date().toISOString(),
      };

      console.log(`📢 Emitting message to Room: ${receiverId}`, message);

      // ✅ Log all sockets in the room
      const socketsInRoom = await io.in(receiverId).fetchSockets();
      console.log(
        `👥 Users in ${receiverId}:`,
        socketsInRoom.map((s) => s.id)
      );

      io.to(receiverId).emit("receiveMessage", message);
      io.to(senderId).emit("receiveMessage", message);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket.IO: A user disconnected, socket id:", socket.id);
  });
});

// **✅ DATABASE CHECK + SERVER STARTUP**
const init = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected!");

    // ✅ Start the HTTP server (for both Express and Socket.IO)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

// ✅ Start the server
init();
