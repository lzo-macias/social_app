import React, { useState } from "react";
import MessageNavBar from "./MessageNavBar";
import DirectMessage from "./DirectMessage";
import ChatBox from "../Chat-boxComponents/Chat-boxComponent";

const MessageDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null); // { type, id, name, senderUsername }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MessageNavBar onSelectChat={setSelectedChat} />
      <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
        {selectedChat ? (
          selectedChat.type === "direct" ? (
            <DirectMessage
              senderUsername={selectedChat.senderUsername}
              receiverUsername={selectedChat.name}
            />
          ) : (
            <ChatBox communityId={selectedChat.id} />
          )
        ) : (
          <div className="card">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default MessageDashboard;
