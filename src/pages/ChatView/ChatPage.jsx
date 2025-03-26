// /src/pages/ChatPage.jsx
import React, { useState } from "react";
import ChatList from "@/components/Chat/ChatList";
import ChatWindow from "@/components/Chat/ChatWindow";

const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: ChatList */}
      <div className="w-1/4 border-r border-gray-300 bg-white shadow-sm">
        <ChatList onSelectChat={setActiveChatId} />
      </div>

      {/* Right: ChatWindow */}
      <div className="flex-1 flex flex-col">
        {activeChatId ? (
          <ChatWindow key={activeChatId} chatSessionId={activeChatId} />
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-600 text-xl">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
