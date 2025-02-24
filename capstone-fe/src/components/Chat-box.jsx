import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const GroupChat = ({ senderId, groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("joinGroup", groupId);

    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => socket.off("receiveMessage");
  }, [groupId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: senderId,
      group_id: groupId,
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div>
      <h3>Group Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender_id}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default GroupChat;
