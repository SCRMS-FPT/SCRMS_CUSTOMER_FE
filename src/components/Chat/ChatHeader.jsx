import React from "react";
import { Avatar } from "antd";
import { Typography } from "@mui/material"; // using MUI for polished typography

const ChatHeader = ({ chatSessionId, miniHeader }) => {
  // In a real app, fetch chat details using chatSessionId.
  // For demo purposes, we use dummy data:
  const dummyChat = {
    name: "Chat with Nguyen Van B",
    avatar: "/default-avatar.png",
    status: "Online",
  };

  return (
    <div className="flex items-center">
      <Avatar
        src={dummyChat.avatar}
        size={miniHeader ? 32 : 50}
        className="mr-3"
        style={{marginRight: 8}}
      />
      <div>
        <Typography
          variant={miniHeader ? "subtitle1" : "h6"}
          className="text-white font-medium"
        >
          {dummyChat.name}
        </Typography>
        {!miniHeader && (
          <Typography variant="body2" className="text-white">
            {dummyChat.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
