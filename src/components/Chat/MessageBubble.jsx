// /src/components/Chat/MessageBubble.jsx
import React from "react";
import { Avatar, Tooltip } from "antd";
import { format } from "date-fns";

const MessageBubble = ({ message, onEdit, onDelete }) => {
  // Compare sender_id with current user's id (here using "current-user" as a demo)
  const isOwnMessage = message.sender_id === "current-user";

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {!isOwnMessage && (
        <Avatar src="/default-avatar.png" className="mr-2" />
      )}
      <div className={`max-w-xs p-2 rounded-lg ${isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        <p>{message.message_text}</p>
        <div className="text-xs text-right mt-1">
          <Tooltip title={format(new Date(message.sent_at), "PPpp")}>
            <span>{format(new Date(message.sent_at), "p")}</span>
          </Tooltip>
        </div>
        {isOwnMessage && (
          <div className="flex space-x-2 mt-1">
            <button className="text-xs text-gray-300 hover:text-white" onClick={() => onEdit && onEdit(message)}>
              Edit
            </button>
            <button className="text-xs text-gray-300 hover:text-white" onClick={() => onDelete && onDelete(message)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
