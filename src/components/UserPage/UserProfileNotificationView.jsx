// src/components/UserProfileNotificationView.jsx
// ----------------------------------------------------
// This component displays a list of notifications for the user.
// It includes a search bar, category filter, and each notification 
// has a "View" button to open a modal with detailed information.
// Users can also mark notifications as read.
//
// This version uses Ant Design components and React hooks to manage state and interactions.
// ----------------------------------------------------

import React, { useState, useEffect } from "react";
import { Card, Typography, List, Button, Input, Modal, Divider, Select, Space, message } from "antd";
import { BellOutlined, EyeOutlined, CheckOutlined } from "@ant-design/icons";

// Destructure Typography components for convenience
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// ---------------------------------------------------------------------
// MOCK NOTIFICATIONS DATA
// ---------------------------------------------------------------------
// In a real-world application, this data would be fetched from an API.
const initialNotifications = [
  { id: 1, title: "Booking Confirmed", description: "Your court booking has been confirmed. Please check your email for the details.", time: "2 hours ago", category: "Booking", read: false },
  { id: 2, title: "New Promotion", description: "Check out the latest promotion available for members. Limited time offer!", time: "1 day ago", category: "Promotion", read: false },
  { id: 3, title: "Session Reminder", description: "Reminder: Your training session is scheduled tomorrow at 10:00 AM. Don't be late!", time: "3 days ago", category: "Reminder", read: true },
  { id: 4, title: "Account Update", description: "Your account details have been updated successfully.", time: "5 days ago", category: "Account", read: true },
  { id: 5, title: "Booking Cancelled", description: "Your court booking has been cancelled. Please contact support for more details.", time: "1 week ago", category: "Booking", read: false },
  { id: 6, title: "Feedback Received", description: "Thank you for your feedback. We value your opinion.", time: "2 weeks ago", category: "Feedback", read: true },
  // More notifications can be added here...
];

// ---------------------------------------------------------------------
// MAIN COMPONENT: UserProfileNotificationView
// ---------------------------------------------------------------------
const UserProfileNotificationView = () => {
  // State for notifications
  const [notifications, setNotifications] = useState(initialNotifications);
  // State for search term filtering
  const [searchTerm, setSearchTerm] = useState("");
  // State for selected category filtering (default "All")
  const [selectedCategory, setSelectedCategory] = useState("All");
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  // State for the currently selected notification to view in modal
  const [selectedNotification, setSelectedNotification] = useState(null);

  // -------------------------------------------------------------------
  // Filter notifications based on search term and selected category.
  // -------------------------------------------------------------------
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by search term (case-insensitive)
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Filter by category if not "All"
    const matchesCategory = selectedCategory === "All" || notification.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------------------------------
  // Handler: Open modal to view notification details.
  // -------------------------------------------------------------------
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  // -------------------------------------------------------------------
  // Handler: Close the modal.
  // -------------------------------------------------------------------
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  // -------------------------------------------------------------------
  // Handler: Mark a notification as read.
  // -------------------------------------------------------------------
  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map((notif) => {
      if (notif.id === id) {
        return { ...notif, read: true };
      }
      return notif;
    });
    setNotifications(updatedNotifications);
    message.success("Notification marked as read");
  };

  // -------------------------------------------------------------------
  // Render function for the modal content.
  // -------------------------------------------------------------------
  const renderModalContent = () => {
    if (!selectedNotification) return null;
    return (
      <div>
        <Title level={4}>{selectedNotification.title}</Title>
        <Paragraph className="mb-2">{selectedNotification.description}</Paragraph>
        <Text type="secondary">Received: {selectedNotification.time}</Text>
        <Divider />
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />} onClick={() => message.info("Chức năng xem thông tin chi tiết sẽ được cập nhật trong tương lai.")}>
            Thêm thông tin
          </Button>
          {!selectedNotification.read && (
            <Button icon={<CheckOutlined />} onClick={() => handleMarkAsRead(selectedNotification.id)}>
              Đánh dấu đã đọc
            </Button>
          )}
        </Space>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // Render function for the top filter controls.
  // -------------------------------------------------------------------
  const renderFilterControls = () => {
    return (
      <div className="mb-6">
        <Space size="large" direction="vertical" className="w-full">
          <Input
            placeholder="Tìm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            className="w-full"
          />
          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            size="large"
            className="w-full"
          >
            <Option value="All">Tất cả các danh mục</Option>
            <Option value="Booking">Đặt lịch</Option>
            <Option value="Promotion">Ưu đãi</Option>
            <Option value="Reminder">Lời nhắc</Option>
            <Option value="Account">Tài khoản</Option>
            <Option value="Feedback">Phản hồi đánh giá</Option>
          </Select>
        </Space>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // Main render of the component
  // -------------------------------------------------------------------
  return (
    <div className="container mx-auto p-6">
      <Card
        title={<Title level={3}>Thông báo</Title>}
        className="shadow-lg rounded-lg"
        style={{ background: "linear-gradient(135deg, #ffffff, #f7f7f7)", padding: "24px" }}
      >
        {renderFilterControls()}
        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          renderItem={(notification) => (
            <List.Item className="py-4 border-b">
              <List.Item.Meta
                avatar={<BellOutlined style={{ fontSize: "24px", color: "#1890ff" }} />}
                title={<span className="font-bold text-lg">{notification.title}</span>}
                description={
                  <div className="text-gray-600">
                    {notification.description}
                    <span className="ml-2 text-sm text-gray-500">• {notification.time}</span>
                  </div>
                }
              />
              <div className="flex flex-col items-end space-y-2">
                <Button type="link" onClick={() => handleViewNotification(notification)}>
                  Xem
                </Button>
                {!notification.read && (
                  <Button type="link" onClick={() => handleMarkAsRead(notification.id)}>
                    Đánh dấu đã đọc
                  </Button>
                )}
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Modal for Notification Details */}
      <Modal
        title="Notification Details"
        visible={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        style={{ top: 240 }}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default UserProfileNotificationView;
