import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Use the socket URL from the new env variable
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  path: "/socket.io", // This is the default; can be omitted if unchanged.
  transports: ["polling"], // or ["websocket"] if you prefer.
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatBox = ({ communityId }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Join the community room once communityId is available
  useEffect(() => {
    if (communityId) {
      socket.emit("joinRoom", communityId);
      console.log(`Joined community room: ${communityId}`);
    }
  }, [communityId]);

  useEffect(() => {
    console.log("ChatBox: Setting up socket event listeners");

    socket.on("connect", () => {
      console.log("ChatBox: Connected, socket id:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("ChatBox: Connection error:", error);
    });

    // Listen for group messages from the server
    socket.on("receiveGroupMessage", (msg) => {
      console.log("ChatBox: Received group message:", msg);
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveGroupMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Get current user id from localStorage (ensure you store it when user logs in)
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const senderId = currentUser?.id;

    console.log("ChatBox: Sending group message:", message);
    // Emit a "sendGroupMessage" event that includes the community id, sender id, and content
    socket.emit("sendGroupMessage", {
      communityId,
      senderId,
      content: message,
    });
    setMessage("");
  };

  return (
    <div className="chat-box-container">
      <div className="chat-box-header">Community Chat</div>
      <div className="chat-box-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg.sender ? <strong>{msg.sender}: </strong> : null}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-box-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
