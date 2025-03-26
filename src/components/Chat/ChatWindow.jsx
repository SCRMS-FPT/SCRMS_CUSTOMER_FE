// /src/components/Chat/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@/API/ChatApi";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBubble from "@/components/Chat/MessageBubble";
import ChatInput from "@/components/Chat/ChatInput";
import TypingIndicator from "@/components/Chat/TypingIndicator";
import { Spin } from "antd";
import { format } from "date-fns";

const chatApiClient = new Client();

const ChatWindow = () => {
  const { chatSessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    // Setup your WebSocket/SignalR connection here if needed
  }, [chatSessionId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // NOTE: In your real implementation, update getChatMessages to return message data.
      // const response = await chatApiClient.getChatMessages(chatSessionId, 1, 50);
      // For demo, simulate dummy messages:
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
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = async (text) => {
    try {
      // Call API to send the message
      await chatApiClient.sendMessage(chatSessionId, { messageText: text });
      // Append sent message to local state
      const newMsg = {
        message_id: Date.now().toString(),
        sender_id: "current-user",
        message_text: text,
        sent_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <Spin tip="Loading messages..." />;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chatSessionId={chatSessionId} />
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.message_id} message={msg} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-none">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;