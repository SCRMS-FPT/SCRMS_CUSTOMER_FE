// /src/components/Chat/ChatHeader.jsx
import React from "react";
import { Avatar } from "antd";

const ChatHeader = ({ chatSessionId }) => {
  // In a real app, fetch chat session info using chatSessionId
  const dummyChat = {
    name: "Chat with Nguyen Van B",
    avatar: "/default-avatar.png",
  };

  return (
    <div className="flex items-center p-4 border-b">
      <Avatar src={dummyChat.avatar} size="large" className="mr-4" />
      <div>
        <h3 className="text-lg font-semibold">{dummyChat.name}</h3>
        <p className="text-sm text-gray-500">Online</p>
      </div>
    </div>
  );
};

export default ChatHeader;
