import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

const Messages = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/messages/direct/${senderId}/${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))) // Sort messages
      .catch((err) => console.error("Error fetching messages:", err));
  }, [senderId, receiverId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (!content.trim()) return;
    socket.emit("sendMessage", { senderId, receiverId, content });
    setContent("");
  };

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}><strong>{msg.sender_id === senderId ? "Me" : "Them"}:</strong> {msg.content}</li>
        ))}
      </ul>
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Messages;
