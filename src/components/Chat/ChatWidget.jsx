import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatHeader from "./ChatHeader";
import ChatListWidget from "./ChatListWidget";
import { Button } from "antd";
import { MessageOutlined, CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "chat"

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setViewMode("chat");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button for Widget Open/Close */}
      {!visible && (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          onClick={() => {
            setVisible(true);
            setViewMode("list");
          }}
          className="shadow-lg"
        />
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="widget"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-96 bg-white shadow-2xl border rounded-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500">
              {viewMode === "chat" ? (
                <div className="flex items-center space-x-2">
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined className="text-white" />}
                    onClick={handleBackToList}
                  />
                  <ChatHeader chatSessionId={activeChatId} miniHeader />
                </div>
              ) : (
                <div className="font-semibold text-white">Trò chuyện</div>
              )}
              <Button
                type="text"
                icon={<CloseOutlined className="text-white" />}
                onClick={() => setVisible(false)}
              />
            </div>

            {/* Animated Body */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence exitBeforeEnter>
                {viewMode === "list" ? (
                  <motion.div
                    key="list"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <ChatListWidget onSelectChat={handleSelectChat} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {activeChatId ? (
                      <ChatWindow chatSessionId={activeChatId} isMini />
                    ) : (
                      <div className="p-4">Không có đoạn chat nào đang được thực hiện</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
