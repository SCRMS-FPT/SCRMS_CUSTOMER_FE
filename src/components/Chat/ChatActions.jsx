// /src/components/Chat/ChatActions.jsx
import React from "react";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ChatActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button icon={<EditOutlined />} size="small" onClick={onEdit}>
        Edit
      </Button>
      <Button icon={<DeleteOutlined />} size="small" danger onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};

export default ChatActions;
