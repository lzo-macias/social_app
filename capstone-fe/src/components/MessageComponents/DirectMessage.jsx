import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";



// 🔌 Connect to Socket.IO server
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  path: "/sockets",
  transports: ["polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const DirectMessage = ({ senderUsername, receiverUsername }) => {
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();
}, [messages]);

  console.log("this is sender username", senderUsername);
  console.log("this is receiver username", receiverUsername);


  const fetchUsers = async () => {
    try {
      const [senderRes, receiverRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${senderUsername}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${receiverUsername}`),
      ]);
      setSender(senderRes.data);
      setReceiver(receiverRes.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchMessages = async (senderId, receiverId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/messages/direct/${senderId}/${receiverId}`
      );
      console.log("Fetched direct messages:", res.data); // 🔍 log here
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching direct messages:", error);
    }
  };

  useEffect(() => {
    if (senderUsername && receiverUsername) fetchUsers();
  }, [senderUsername, receiverUsername]);

  useEffect(() => {
    if (!sender?.id || !receiver?.id) return;

    fetchMessages(sender.id, receiver.id);
    socket.emit("joinDirectChannel", sender.id);
    // socket.emit("joinDirectChannel", receiver.id);
    // socket.emit("joinDirectChannel", sender.id);
    

    socket.on("receiveDirectMessage", (msg) => {
      console.log("📥 Received direct message:", msg);
      const isForThisChat =
        (msg.senderId === sender.id && msg.receiverId === receiver.id) ||
        (msg.senderId === receiver.id && msg.receiverId === sender.id);

      if (isForThisChat) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveDirectMessage");
    };
  }, [sender?.id, receiver?.id]);

  const sendMessage = () => {
    if (!message.trim() || !sender?.id || !receiver?.id) return;

    const newMessage = {
      senderId: sender.id,
      receiverId: receiver.id,
      senderUsername: sender.username,
      content: message,
      created_at: new Date().toISOString(),
    };

    socket.emit("sendDirectMessage", newMessage);
    // setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  if (!sender || !receiver) return <div className="card">Loading chat...</div>;

  return (
    <div className="chat-box-container">
      <div className="chat-box-header">
        Chat between <strong>@{sender.username}</strong> and <strong>@{receiver.username}</strong>
      </div>
      <div className="chat-box-messages">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="chat-message">
            <strong>{msg.senderusername  || msg.senderUsername}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default DirectMessage;
