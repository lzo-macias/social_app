import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// ✅ Connect to the Socket.IO server using the custom path '/sockets'
const socket = io("http://localhost:5000", {
  path: "/sockets",
  transports: ["polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    console.log(
      "💬 ChatBox: Setting up socket event listeners with path '/sockets'"
    );

    socket.on("connect", () => {
      console.log(
        "🟢 ChatBox: Connected to socket server, socket id:",
        socket.id
      );
    });

    socket.on("connect_error", (error) => {
      console.error("❌ ChatBox: Connection error:", error);
    });

    socket.on("receiveMessage", (msg) => {
      console.log("📩 ChatBox: Received message from server:", msg);
      setChatMessages((prev) => [...prev, msg]); // ✅ Updates chat state
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", "testRoom");
    console.log("🚪 ChatBox: Joining room testRoom");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const currentUser = JSON.parse(localStorage.getItem("user")) || {
      id: "testUser",
    };
    const senderId = currentUser.id;

    console.log("📤 ChatBox: Sending message:", message);
    socket.emit("sendMessage", {
      senderId,
      receiverId: "testRoom",
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="chat-box-container">
      <div className="chat-box-header">Live Chat</div>
      <div className="chat-box-messages">
        {chatMessages.map((msg, index) => (
          <div key={msg.id || index} className="chat-message">
            <strong>
              {msg.senderUsername
                ? `${msg.senderUsername}: `
                : "Unknown User: "}
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
