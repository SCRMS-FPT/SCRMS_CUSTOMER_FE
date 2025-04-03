// /src/components/Chat/NewChatModal.jsx
import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { Client } from "@/API/ChatApi";
import { useNavigate } from "react-router-dom";

const chatApiClient = new Client();

const NewChatModal = ({ visible, onClose }) => {
  const [participantId, setParticipantId] = useState("");
  const [chatName, setChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateChat = async () => {
    setLoading(true);
    try {
      const payload = {
        // For a one-to-one chat, pass both user IDs.
        // Here we assume current user ID is available (e.g., from auth context)
        user1Id: "current-user",
        user2Id: participantId,
      };
      // NOTE: The createChatSession method currently returns Promise<void>.
      // For demo, we simulate a new chat session ID.
      await chatApiClient.createChatSession(payload);
      // Simulated response:
      const response = { chat_session_id: "3" };
      navigate(`/chats/${response.chat_session_id}`);
      onClose();
    } catch (error) {
      console.error("Failed to create chat session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Tạo Cuộc Trò Chuyện Mới" visible={visible} onCancel={onClose} footer={null}>
      <div className="space-y-4">
        <Input
          placeholder="Nhập ID hoặc tên người tham gia"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        />
        <Input
          placeholder="Nhập tên cuộc trò chuyện (không bắt buộc)"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
        <Button type="primary" loading={loading} onClick={handleCreateChat}>
          Bắt Đầu Trò Chuyện
        </Button>
      </div>
    </Modal>
  );
};

export default NewChatModal;
