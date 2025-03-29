import React, { useEffect, useState } from "react";
import axios from "axios";

const MessageNavBar = ({ onSelectChat }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [allChats, setAllChats] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchAllChats = async () => {
      try {
        const [directRes, groupRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/direct-threads/${currentUser.id}`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/group-threads/${currentUser.id}`),
        ]);

        const directChats = directRes.data.map((chat) => ({
          id: chat.id,
          name: chat.username,
          type: "direct",
          profile_picture: chat.profile_picture,
          last_message_at: chat.last_message_at,
          senderUsername: currentUser.username,
        }));

        const groupChats = groupRes.data.map((group) => ({
          id: group.id,
          name: group.name,
          type: "group",
          last_message_at: group.last_message_at,
        }));

        const combined = [...directChats, ...groupChats].sort(
          (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
        );

        setAllChats(combined);
      } catch (err) {
        console.error("❌ Error fetching chat threads:", err);
      }
    };

    fetchAllChats();
  }, [currentUser?.id]);

  const handleClick = (chat) => {
    onSelectChat(chat); // ✅ Send selected chat to parent
  };

  return (
    <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "1rem", overflowY: "auto" }}>
      <h3>💬 Messages</h3>
      {allChats.length > 0 ? (
        allChats.map((chat) => (
          <div
            key={`${chat.type}-${chat.id}`}
            onClick={() => handleClick(chat)}
            style={{
              cursor: "pointer",
              marginBottom: "1rem",
              padding: "0.5rem",
              borderRadius: "8px",
              background: "#f8f8f8",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {chat.type === "direct" ? (
              <img
                src={chat.profile_picture || "https://placehold.co/40x40"}
                alt="pfp"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>#</span>
            )}
            <div>@{chat.name}</div>
          </div>
        ))
      ) : (
        <p>No messages yet</p>
      )}
    </div>
  );
};

export default MessageNavBar;
