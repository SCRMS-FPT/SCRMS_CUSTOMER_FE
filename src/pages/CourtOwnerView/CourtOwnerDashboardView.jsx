import React, { useState } from "react";
import { Card, Table, Statistic, Button, Tag, Tabs, List, Row, Col, Progress, Typography, Modal, Space, Divider  } from "antd";
import { CalendarOutlined, DollarOutlined, AlertOutlined, BellOutlined, CommentOutlined, ToolOutlined, HomeOutlined, DownloadOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph  } = Typography;

// Mock Data
const totalCourts = 10;
const totalBookings = 7;
const courtUtilization = Math.round((totalBookings / totalCourts) * 100); // Dynamic Utilization
const utilizationChange = 5; // Example Change from Yesterday

const todayBookings = [
  { key: "1", time: "18:00", court: "Court A", player: "John Doe" },
  { key: "2", time: "20:00", court: "Court B", player: "Alice Smith" },
];

{/* Mock Revenue Data (Previous & Current) */ }
const revenueData = {
  daily: 250,
  weekly: 1750,
  monthly: 7200,
};

const previousRevenueData = {
  daily: 200,  // Yesterday
  weekly: 1600, // Last week
  monthly: 7000, // Last month
};

// Function to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return 100; // Avoid division by zero
  return Math.round(((current - previous) / previous) * 100);
};

// Function to calculate progress bar percentage
const calculateProgress = (current, previous) => {
  return Math.min(100, Math.abs(calculateGrowth(current, previous))); // Limit progress to 100%
};

// Calculated growth & progress values
const dailyGrowth = calculateGrowth(revenueData.daily, previousRevenueData.daily);
const weeklyGrowth = calculateGrowth(revenueData.weekly, previousRevenueData.weekly);
const monthlyGrowth = calculateGrowth(revenueData.monthly, previousRevenueData.monthly);

const dailyProgress = calculateProgress(revenueData.daily, previousRevenueData.daily);
const weeklyProgress = calculateProgress(revenueData.weekly, previousRevenueData.weekly);
const monthlyProgress = calculateProgress(revenueData.monthly, previousRevenueData.monthly);

const pendingRequests = [
  { key: "1", type: "Cancellation", court: "Court A", player: "Michael" },
  { key: "2", type: "Modification", court: "Court C", player: "Sarah" },
  { key: "3", type: "Modification", court: "Court D", player: "Sarah" },
  { key: "4", type: "Modification", court: "Court E", player: "Sarah" },
  { key: "5", type: "Modification", court: "Court F", player: "Sarah" },
];

const recentFeedbacks = [
  { key: "1", user: "Emily", rating: 5, comment: "Amazing court quality!" },
  { key: "2", user: "James", rating: 4, comment: "Great service, but the lighting could be improved." },
  { key: "3", user: "James", rating: 4.5, comment: "Great service." },
];

const notifications = [
  { key: "1", message: "Court B requires maintenance", type: "Maintenance", time: "10 mins ago" },
  { key: "2", message: "New member registration: Alex", type: "Membership", time: "30 mins ago" },
  { key: "3", message: "Payment received: $50 from John Doe", type: "Payment", time: "1 hour ago" },
  { key: "4", message: "Booking confirmed for Court A (6 PM) by Sarah", type: "Booking", time: "2 hours ago" },
  { key: "5", message: "Booking cancellation requested for Court C by Mike", type: "Cancellation", time: "3 hours ago" },
  { key: "6", message: "Upcoming event: Tennis Championship 2025 (Register now!)", type: "Event", time: "5 hours ago" },
  { key: "7", message: "Price update needed for Badminton Courts", type: "Pricing", time: "6 hours ago" },
  { key: "8", message: "Coach James has updated availability for next week", type: "Coach Update", time: "8 hours ago" },
  { key: "9", message: "Security alert: Unusual login attempt detected", type: "Security", time: "10 hours ago" },
  { key: "10", message: "Reminder: Court D maintenance scheduled for tomorrow", type: "Maintenance", time: "12 hours ago" },
  { key: "11", message: "Player feedback received: 'Great experience at City Tennis Court'", type: "Feedback", time: "Yesterday" },
  { key: "12", message: "Refund processed: $30 for booking cancellation", type: "Refund", time: "Yesterday" },
  { key: "13", message: "New promotional offer: 20% off weekend bookings", type: "Promotion", time: "2 days ago" },
  { key: "14", message: "Monthly earnings report is now available", type: "Report", time: "2 days ago" },
  { key: "15", message: "New coach application submitted by Daniel", type: "Membership", time: "3 days ago" },
];



const CourtOwnerDashboardView = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Function to open modal with notification details
  const showNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Row gutter={16}>
              {/* Court Utilization */}
              <Col span={6}>
                <Card title="Court Utilization" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                  <Title level={5}>Percentage of booked courts</Title>
                  <Progress
                    type="circle"
                    percent={courtUtilization}
                    strokeColor={courtUtilization > 80 ? "red" : courtUtilization > 50 ? "orange" : "green"}
                  />

                  <Divider />

                  <Row justify="space-between">
                    <Col>
                      <Text strong>Total Bookings:</Text>
                      <br />
                      <Text type="secondary">{totalBookings} bookings</Text>
                    </Col>

                    <Col>
                      <Text strong>Available Courts:</Text>
                      <br />
                      <Text type="secondary">{totalCourts - totalBookings} courts</Text>
                    </Col>
                  </Row>

                  <Divider />

                  <Row justify="space-between">
                    <Col>
                      <Text strong>Change vs. Yesterday:</Text>
                      <br />
                      <Tag color={utilizationChange > 0 ? "red" : "green"}>
                        {utilizationChange > 0 ? `+${utilizationChange}%` : `${utilizationChange}%`}
                      </Tag>
                    </Col>

                    <Col>
                      <Text strong>Utilization Status:</Text>
                      <br />
                      <Tag color={courtUtilization > 80 ? "red" : courtUtilization > 50 ? "orange" : "green"}>
                        {courtUtilization > 80 ? "High" : courtUtilization > 50 ? "Moderate" : "Low"}
                      </Tag>
                    </Col>
                  </Row>

                  <Divider />

                  {/* View Details Button (Always at Bottom) */}
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <Button
                      type="primary"
                      block
                      icon={<HomeOutlined />}
                      onClick={() => navigate("/court-owner/court-utilization")}
                    >
                      View Full Utilization Details
                    </Button>
                  </div>
                </Card>
              </Col>

              {/* Revenue Overview */}
              <Col span={6}>
                <Card title="Revenue Overview" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                  {/* Daily Earnings */}
                  <Statistic
                    title="Daily Earnings"
                    value={`$${revenueData.daily}`}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: dailyGrowth >= 0 ? "green" : "red" }}
                    suffix={dailyGrowth >= 0 ? `▲ ${dailyGrowth}%` : `▼ ${Math.abs(dailyGrowth)}%`}
                  />
                  <Progress percent={dailyProgress} size="small" status={dailyGrowth >= 0 ? "success" : "exception"} />

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                  {/* Weekly Earnings */}
                  <Statistic
                    title="Weekly Earnings"
                    value={`$${revenueData.weekly}`}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: weeklyGrowth >= 0 ? "green" : "red" }}
                    suffix={weeklyGrowth >= 0 ? `▲ ${weeklyGrowth}%` : `▼ ${Math.abs(weeklyGrowth)}%`}
                  />
                  <Progress percent={weeklyProgress} size="small" status={weeklyGrowth >= 0 ? "success" : "exception"} />

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                  {/* Monthly Earnings */}
                  <Statistic
                    title="Monthly Earnings"
                    value={`$${revenueData.monthly}`}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: monthlyGrowth >= 0 ? "green" : "red" }}
                    suffix={monthlyGrowth >= 0 ? `▲ ${monthlyGrowth}%` : `▼ ${Math.abs(monthlyGrowth)}%`}
                  />
                  <Progress percent={monthlyProgress} size="small" status={monthlyGrowth >= 0 ? "success" : "exception"} />

                  <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                  {/* View Details Button */}
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <Button
                      type="primary"
                      block
                      icon={<DollarOutlined />}
                      onClick={() => navigate("/court-owner/revenue")} // ✅ Navigate to Revenue Reports Page
                    >
                      View Full Revenue Details
                    </Button>
                  </div>
                </Card>
              </Col>


              {/* Pending Requests */}
              <Col span={12}>
                <Card title="Pending Requests" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                  <Table
                    columns={[
                      { title: "Type", dataIndex: "type", key: "type", render: (type) => <Tag color={type === "Cancellation" ? "red" : "orange"}>{type}</Tag> },
                      { title: "Court", dataIndex: "court", key: "court" },
                      { title: "Player", dataIndex: "player", key: "player" },
                      {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                          <Space>
                            <Button type="primary" icon={<CheckOutlined />}>Approve</Button>
                            <Button danger icon={<CloseOutlined />}>Decline</Button>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={pendingRequests}
                    pagination={{ pageSize: 5 }} // ✅ Pagination Added (Max 5 records per page)
                    size="small"
                  />

                  <Divider />

                  {/* View All Requests Button (Always at Bottom) */}
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <Button
                      type="primary"
                      block
                      icon={<HomeOutlined />}
                      onClick={() => navigate("/court-owner/requests")}
                    >
                      View All Requests
                    </Button>
                  </div>
                </Card>
              </Col>

            </Row>

            {/* Today's Bookings & Feedback */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="Today's Bookings" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                  <Table
                    columns={[
                      { title: "Time", dataIndex: "time", key: "time" },
                      { title: "Court", dataIndex: "court", key: "court" },
                      { title: "Player", dataIndex: "player", key: "player" },
                      {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                          <Button type="link" onClick={() => navigate(`/court-owner/bookings/${record.key}`)}>View Details</Button>
                        ),
                      },
                    ]}
                    dataSource={todayBookings}
                    pagination={{ pageSize: 3 }} // ✅ Pagination Added (Max 3 records per page)
                    size="small"
                  />

                  <Divider />

                  {/* View All Bookings Button (Always at Bottom) */}
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <Button
                      type="primary"
                      block
                      icon={<CalendarOutlined />}
                      onClick={() => navigate("/court-owner/bookings")}
                    >
                      View All Bookings
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Recent Feedback" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                  <List
                    dataSource={recentFeedbacks.slice(0, 3)} // ✅ Show only the first 3 records
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta title={<Text strong>{item.user}</Text>} description={item.comment} />
                        <Tag color="gold">{item.rating} ★</Tag>
                      </List.Item>
                    )}
                  />

                  <Divider />

                  {/* View All Feedback Button (Always at Bottom) */}
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <Button
                      type="primary"
                      block
                      icon={<CommentOutlined />}
                      onClick={() => navigate("/court-owner/feedbacks")}
                    >
                      View All Feedback
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        );

      case "notifications":
        return (
          <div style={{ position: "relative" }}>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              pagination={{ pageSize: 8 }} // ✅ Added Pagination (Max 8 records per page)
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => showNotificationDetails(item)}>View Details</Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>{item.message}</Text>}
                    avatar={<AlertOutlined />}
                  />
                </List.Item>
              )}
            />

            <Button
              type="primary"
              block
              icon={<BellOutlined />}
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/court-owner/notifications")}
            >
              View All Notifications
            </Button>

            {/* Notification Details Modal */}
            <Modal
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <BellOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                  <Text strong>Notification Details</Text>
                </div>
              }
              open={isModalVisible} // Updated from 'visible' to 'open' for latest Ant Design
              onCancel={handleCloseModal}
              footer={[
                <Button key="markAsRead" type="primary" onClick={handleCloseModal}>
                  Mark as Read
                </Button>,
                <Button key="close" onClick={handleCloseModal}>
                  Close
                </Button>,
              ]}
            >
              {selectedNotification ? (
                <div style={{ padding: "10px" }}>
                  {/* Notification Type */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <AlertOutlined style={{ fontSize: "18px", color: "#faad14" }} />
                    <Text strong>Type:</Text>
                    <Tag color="blue">{selectedNotification.type}</Tag>
                  </div>

                  <Divider />

                  {/* Notification Message */}
                  <div style={{ marginBottom: "12px" }}>
                    <Text strong style={{ fontSize: "16px" }}>Message:</Text>
                    <Paragraph style={{ marginTop: "5px", fontSize: "14px" }}>{selectedNotification.message}</Paragraph>
                  </div>

                  <Divider />

                  {/* Time & Additional Info */}
                  <div>
                    <Text strong>Received:</Text>
                    <Text> {selectedNotification.time || "Just now"}</Text>
                  </div>
                </div>
              ) : (
                <Text>No details available.</Text>
              )}
            </Modal>

          </div>
        );

      default:
        return null;
    }
  };

  const tabItems = [
    { key: "overview", label: <span><HomeOutlined /> Overview</span> },
    { key: "notifications", label: <span><BellOutlined /> Notifications</span> },
  ];

  return (
    <Card title="Court Owner Dashboard" className="p-4">
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={tabItems} />
      <div className="mt-4">{renderContent()}</div>
      <Divider />

      {/* Quick Actions */}
      <Row gutter={16} justify="center">
        <Col>
          <Button icon={<HomeOutlined />}>View All Courts</Button>
        </Col>
        <Col>
          <Button icon={<DollarOutlined />}>Update Pricing</Button>
        </Col>
        <Col>
          <Button icon={<CheckOutlined />}>Approve Bookings</Button>
        </Col>
        <Col>
          <Button icon={<DownloadOutlined />}>Export Reports</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CourtOwnerDashboardView;
