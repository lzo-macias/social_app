import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend socket server

const Messages = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  // Fetch past messages on load
  useEffect(() => {
    fetch(`http://localhost:5000/messages/direct/${senderId}/${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [senderId, receiverId]);

  // Listen for new messages in real-time
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!content.trim()) return;

    // Emit message event to backend
    socket.emit("sendMessage", { senderId, receiverId, content });
    setContent(""); // Clear input
  };

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.sender_id === senderId ? "Me" : "Them"}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Messages;
