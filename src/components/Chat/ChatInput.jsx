// /src/components/Chat/ChatInput.jsx
import React, { useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="flex items-center">
      <Input
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSend}
        className="rounded-full shadow-sm focus:shadow-md transition-shadow duration-150"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        className="ml-3 rounded-full"
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
