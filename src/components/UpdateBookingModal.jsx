import React from "react";
import { Modal, Select, Typography, Space, Tag, Divider, notification } from "antd";
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const UpdateBookingModal = ({ isVisible, setIsVisible, booking, updateBookingStatus }) => {
  if (!booking) return null;

  const handleUpdate = (newStatus) => {
    updateBookingStatus(booking.id, newStatus);
    notification.success({
      message: "Update Success",
      description: `Booking status changed to "${newStatus.toUpperCase()}".`,
      placement: "topRight",
    });
    setIsVisible(false);
  };

  return (
    <Modal
      title={<Title level={4} style={{ marginBottom: 0 }}>Update Booking Status</Title>}
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={null}
      centered
    >
      {/* Booking Details Section */}
      <div style={{ padding: "10px 0" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text>
            <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <strong>Customer:</strong> {booking.customer_name}
          </Text>
          <Text>
            <FieldTimeOutlined style={{ color: "#722ed1", marginRight: 8 }} />
            <strong>Court:</strong> {booking.court_name}
          </Text>
          <Text>
            <CalendarOutlined style={{ color: "#f5222d", marginRight: 8 }} />
            <strong>Date:</strong> {booking.slot_date}
          </Text>
          <Text>
            <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
            <strong>Time:</strong> {booking.start_time} - {booking.end_time}
          </Text>
          <Text>
            <strong>Status:</strong>{" "}
            <Tag color={booking.status === "confirmed" ? "green" : booking.status === "canceled" ? "red" : "volcano"}>
              {booking.status.toUpperCase()}
            </Tag>
          </Text>
        </Space>
      </div>

      <Divider />

      {/* Status Selection */}
      <Title level={5}>Change Status</Title>
      <Select
        defaultValue={booking.status}
        style={{ width: "100%" }}
        onChange={handleUpdate}
        size="large"
      >
        <Option value="pending">Pending</Option>
        <Option value="confirmed">Confirmed</Option>
        <Option value="canceled">Canceled</Option>
      </Select>
    </Modal>
  );
};

export default UpdateBookingModal;
