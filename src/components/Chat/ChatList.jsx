// /src/components/Chat/ChatList.jsx
import React, { useEffect, useState } from "react";
import { Avatar, List, Badge } from "antd";
import { format } from "date-fns";
import ChatSkeleton from "@/components/Chat/ChatSkeleton";

const ChatList = ({ onSelectChat, readChats, activeChatId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      // Simulated API response
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Chats</h2>
      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => {
          const unread =
            readChats && readChats[chat.chat_session_id] ? 0 : chat.unread_count;
          const isActive = activeChatId === chat.chat_session_id;
          return (
            <List.Item
              className={`cursor-pointer p-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 border border-blue-300"
                  : "hover:bg-blue-50"
              }`}
              onClick={() => onSelectChat(chat.chat_session_id)}
            >
              <List.Item.Meta
                avatar={<Avatar src={chat.avatar} size={50} />}
                title={
                  <span className="text-xl font-medium text-gray-700">
                    {chat.name || "Unnamed Chat"}
                  </span>
                }
                description={
                  <span className="text-sm text-gray-500">
                    Last message: {format(new Date(chat.updated_at), "PPpp")}
                  </span>
                }
              />
              {unread > 0 && (
                <Badge
                  count={unread}
                  className="mt-2"
                  style={{ backgroundColor: "#f5222d" }}
                />
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ChatList;
