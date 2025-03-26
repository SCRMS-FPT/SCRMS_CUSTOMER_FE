// /src/components/Chat/ChatListWidget.jsx
import React, { useEffect, useState } from "react";
import { Avatar, List, Badge } from "antd";
import { format } from "date-fns";
import ChatSkeleton from "@/components/Chat/ChatSkeleton";

const ChatListWidget = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      // Simulated response for demo purposes
      const response = [
        {
          chat_session_id: "1",
          name: "Chat with Nguyen Van B",
          updated_at: new Date().toISOString(),
          unread_count: 2,
          avatar: "/default-avatar.png",
        },
        {
          chat_session_id: "2",
          name: "Chat with Le Thi C",
          updated_at: new Date().toISOString(),
          unread_count: 0,
          avatar: "/default-avatar.png",
        },
      ];
      setChats(response);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ChatSkeleton />;

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Chats</h3>
      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item
            className="cursor-pointer hover:bg-blue-50 p-3 rounded-md transition-all duration-150"
            onClick={() => onSelectChat(chat.chat_session_id)}
          >
            <List.Item.Meta
              avatar={<Avatar src={chat.avatar} size={40} />}
              title={
                <span className="text-base font-medium text-gray-700">
                  {chat.name || "Unnamed Chat"}
                </span>
              }
              description={
                <span className="text-xs text-gray-500">
                  {format(new Date(chat.updated_at), "PPpp")}
                </span>
              }
            />
            {chat.unread_count > 0 && (
              <Badge
                count={chat.unread_count}
                className="mt-2"
                style={{ backgroundColor: "#f5222d" }}
              />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatListWidget;
