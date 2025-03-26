// /src/components/Chat/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { Client } from "@/API/ChatApi";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBubble from "@/components/Chat/MessageBubble";
import ChatInput from "@/components/Chat/ChatInput";
import TypingIndicator from "@/components/Chat/TypingIndicator";
import { Spin } from "antd";

const chatApiClient = new Client();

const ChatWindow = ({ chatSessionId, isMini = false, onMarkChatRead }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    loadMessages();
    // Setup your WebSocket/SignalR connection here if needed.
  }, [chatSessionId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simulated dummy messages for demo:
      const response = [
        {
          message_id: "101",
          sender_id: "other-user",
          message_text: "Hello! How are you?",
          sent_at: new Date().toISOString(),
        },
        {
          message_id: "102",
          sender_id: "current-user",
          message_text: "I'm good, thank you!",
          sent_at: new Date().toISOString(),
        },
      ];
      setMessages(response);
      // After loading messages, mark the chat as read.
      onMarkChatRead && onMarkChatRead(chatSessionId);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = async (text) => {
    const newMsg = {
      message_id: Date.now().toString(),
      sender_id: "current-user",
      message_text: text,
      sent_at: new Date().toISOString(),
      status: "sending",
    };
    setMessages((prev) => [...prev, newMsg]);
    scrollToBottom();

    try {
      await chatApiClient.sendMessage(chatSessionId, { messageText: text });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === newMsg.message_id ? { ...msg, status: "sent" } : msg
        )
      );
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === newMsg.message_id ? { ...msg, status: undefined } : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === newMsg.message_id ? { ...msg, status: "error" } : msg
        )
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <Spin tip="Loading messages..." className="p-6" />;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      {!isMini && (
        <div className="flex-none bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
          <ChatHeader chatSessionId={chatSessionId} />
        </div>
      )}
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-gradient-to-b from-gray-100 to-gray-50">
        {messages.map((msg) => (
          <MessageBubble key={msg.message_id} message={msg} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Section */}
      <div className="flex-none border-t bg-white px-6 py-4 shadow-inner">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
