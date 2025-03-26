// /src/components/Chat/MessageBubble.jsx
import React, { useState } from "react";
import { Avatar, Tooltip } from "antd";
import { format } from "date-fns";

const MessageBubble = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const isOwnMessage = message.sender_id === "current-user";

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} cursor-pointer transition-colors duration-150`}
      onClick={toggleExpanded}
    >
      {!isOwnMessage && <Avatar src="/default-avatar.png" style={{marginRight: 8, marginLeft: -14}} size={30} />}
      <div className={`max-w-xs px-2 py-1 rounded-xl shadow ${isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
        <p className="text-base">{message.message_text}</p>
        {isOwnMessage && message.status && (
          <div className="mt-2">
            {message.status === "sending" && <span className="text-xs text-gray-300">Sending...</span>}
            {message.status === "sent" && <span className="text-xs text-green-300">✓ Sent</span>}
            {message.status === "error" && <span className="text-xs text-red-300">Send failed</span>}
          </div>
        )}
        {expanded && (
          <div className="mt-2 text-xs text-gray-500">
            <Tooltip title={format(new Date(message.sent_at), "PPpp")}>
              <span>{format(new Date(message.sent_at), "p")}</span>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
