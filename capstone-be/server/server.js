//const express = require("express");
//const http = require("http");
//const { Server } = require("socket.io");
//const { router } = require("../db"); // Import the router
//
//const app = express();
//app.use(express.json());
//
//// Use the router for all API requests
//app.use("/api", router);
//
//const server = http.createServer(app);
//const io = new Server(server, {
//  cors: { origin: "*" },
//});
//
//io.on("connection", (socket) => {
//  console.log("A user connected");
//
//  socket.on("sendMessage", (messageData) => {
//    io.to(messageData.group_id).emit("receiveMessage", messageData);
//  });
//
//  socket.on("joinGroup", (group_id) => {
//    socket.join(group_id);
//  });
//
//  socket.on("disconnect", () => {
//    console.log("A user disconnected");
//  });
//});
//
//server.listen(3000, () => {
//  console.log("Server running on port 3000");
//});

