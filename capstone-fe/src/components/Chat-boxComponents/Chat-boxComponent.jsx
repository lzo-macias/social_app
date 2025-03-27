// capstone-fe/src/components/Chat-boxComponents/Chat-boxComponent.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  path: "/sockets",
  transports: ["polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatBox = ({ communityId }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (communityId) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/messages/${communityId}`)
        .then((response) => {
          console.log("ChatBox: Fetched chat history:", response.data);
          setChatMessages(response.data);
        })
        .catch((error) => {
          console.error("ChatBox: Failed to fetch chat history:", error);
        });
    }
  }, [communityId]);

  useEffect(() => {
    console.log("ChatBox: Current chatMessages state:", chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    if (communityId) {
      socket.emit("joinRoom", communityId);
      console.log(`ChatBox: Joined community room: ${communityId}`);
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

    socket.on("receiveMessage", (msg) => {
      console.log("ChatBox: Received message:", msg);
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const senderId = currentUser?.id;
    console.log("ChatBox: Sending message:", message);
    socket.emit("sendMessage", {
      roomId: communityId,
      senderId,
      content: message,
    });
    setMessage("");
  };

  return (
    <div className="chat-box-container">
  <div className="chat-box-header">
    Community Chat (Total messages: {chatMessages.length})
  </div>

  <div className="chat-box-messages">
    {chatMessages.length === 0 ? (
      <p>No messages yet.</p>
    ) : (
      chatMessages.map((msg, index) => (
        <div key={msg.id || index} className="chat-message">
          {msg.senderUsername ? (
            <strong>{msg.senderUsername}: </strong>
          ) : null}
          {msg.content}
        </div>
      ))
    )}
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
