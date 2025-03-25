// /src/hooks/useChat.js
import { useState } from "react";
import { Client } from "@/API/ChatApi";

const chatApiClient = new Client();

const useChat = (chatSessionId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async (page = 1, limit = 50) => {
    setLoading(true);
    try {
      // Replace with your API call when available
      // const response = await chatApiClient.getChatMessages(chatSessionId, page, limit);
      // For demo, simulate:
      const response = [
        {
          message_id: "101",
          sender_id: "other-user",
          message_text: "Hello!",
          sent_at: new Date().toISOString(),
        },
        {
          message_id: "102",
          sender_id: "current-user",
          message_text: "Hi there!",
          sent_at: new Date().toISOString(),
        },
      ];
      setMessages(response);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    try {
      await chatApiClient.sendMessage(chatSessionId, { messageText: text });
      const newMessage = {
        message_id: Date.now().toString(),
        sender_id: "current-user",
        message_text: text,
        sent_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    messages,
    loading,
    loadMessages,
    sendMessage,
  };
};

export default useChat;
