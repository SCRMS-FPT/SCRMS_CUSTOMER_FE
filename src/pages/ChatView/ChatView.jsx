import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "@/components/Chat/ChatList";
import ChatWindow from "@/components/Chat/ChatWindow";
import { LeftOutlined, RightOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ChatView = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [readChats, setReadChats] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleMarkChatRead = (chatId) => {
    setReadChats((prev) => ({ ...prev, [chatId]: true }));
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Left: Collapsible ChatList */}
      <div
        className={`${
          collapsed ? "w-16" : "w-1/4"
        } transition-all duration-300 border-r border-gray-300 bg-white shadow-lg flex flex-col overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <Button type="link" icon={<HomeOutlined />} onClick={() => navigate("/")}>
              Home
            </Button>
          )}
          <Button type="text" onClick={toggleCollapse}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        {!collapsed && (
          <ChatList onSelectChat={setActiveChatId} readChats={readChats} activeChatId={activeChatId} />
        )}
      </div>

      {/* Right: ChatWindow */}
      <div className="flex-1 flex flex-col">
        {activeChatId ? (
          <ChatWindow
            key={activeChatId}
            chatSessionId={activeChatId}
            onMarkChatRead={handleMarkChatRead}
          />
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-600 text-2xl">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
