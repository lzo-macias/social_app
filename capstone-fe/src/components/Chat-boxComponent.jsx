import axios from "axios";
import { useState, useEffect } from "react";

const Chat = ({ senderId, receiverId, groupId, chatType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatType === "direct") {
        const response = await axios.get(
          `/messages/direct/${senderId}/${receiverId}`
        );
        setMessages(response.data);
      } else if (chatType === "group") {
        const response = await axios.get(`/messages/group/${groupId}`);
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [senderId, receiverId, groupId, chatType]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    let response;
    if (chatType === "direct") {
      response = await axios.post("/messages/direct", {
        sender_id: senderId,
        receiver_id: receiverId,
        content: newMessage,
      });
    } else if (chatType === "group") {
      response = await axios.post("/messages/group", {
        sender_id: senderId,
        group_id: groupId,
        content: newMessage,
      });
    }

    setMessages([...messages, response.data]);
    setNewMessage("");
  };

  return (
    <div>
      <h3>{chatType === "direct" ? "Direct Chat" : "Group Chat"}</h3>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.sender_id}:</strong> {msg.content}
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

export default Chat;
