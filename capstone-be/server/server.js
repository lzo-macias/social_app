const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./db"); // Optional, if needed for other routes
const { sendDirectMessage, fetchDirectMessages } = require("./message");
// Import routes as needed
const communityRoutes = require("./api/communityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/community", communityRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  // For debugging purposes, we're using the default path
  cors: { origin: "*" },
});

// Socket.IO connection event with extra logging
io.on("connection", (socket) => {
  console.log("Socket.IO: A user connected, socket id:", socket.id);
  console.log("Socket handshake query:", socket.handshake.query);

  socket.on("connect_error", (error) => {
    console.error("Socket.IO: Connection error:", error);
  });

  // Optionally have the socket join a room if a userId is provided in the query:
  const { userId } = socket.handshake.query;
  if (userId) {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  }

  // Listen for sendMessage events (example: direct messaging)
  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    console.log("Socket.IO: Received sendMessage event:", {
      senderId,
      receiverId,
      content,
    });
    try {
      const message = await sendDirectMessage({
        senderId,
        receiverId,
        content,
      });
      console.log("Socket.IO: Emitting receiveMessage to sender and receiver", {
        senderId,
        receiverId,
        message,
      });
      io.to(receiverId).emit("receiveMessage", message);
      io.to(senderId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Socket.IO: Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO: A user disconnected, socket id:", socket.id);
  });
});

// Example API route to fetch direct messages
app.get("/messages/direct/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await fetchDirectMessages(senderId, receiverId);
    res.json(messages);
  } catch (err) {
    console.error("Socket.IO: Error fetching direct messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
