import React, { useState } from "react";
import { Card, Table, Statistic, Button, Tag, Tabs, List, Avatar, Row, Col, Input, Space } from "antd";
import { CalendarOutlined, TeamOutlined, TrophyOutlined, WalletOutlined, BellOutlined, CommentOutlined, HomeOutlined, MessageOutlined  } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserDashboardNotificationCard from "@/components/UserPage/UserDashboardNotificationCard";
import ChatWidget from "../../components/Chat/ChatWidget";

//Mock data
const upcomingBookings = [
  { key: "1", date: "2025-03-10", time: "18:00", court: "Court A", sport: "Tennis", status: "Confirmed" },
  { key: "2", date: "2025-03-12", time: "20:00", court: "Court B", sport: "Badminton", status: "Pending" },
  { key: "3", date: "2025-03-15", time: "16:00", court: "Court C", sport: "Basketball", status: "Confirmed" },
];

const coachingSessions = [
  { key: "1", date: "2025-03-15", time: "16:00", coach: "John Doe", sport: "Tennis", status: "Confirmed" },
  { key: "2", date: "2025-03-18", time: "14:00", coach: "Sarah Lee", sport: "Badminton", status: "Pending" },
  { key: "3", date: "2025-03-20", time: "12:00", coach: "Mike Smith", sport: "Basketball", status: "Confirmed" },
];

const pendingMatches = [
  { key: "1", opponent: "Alex", sport: "Basketball", date: "2025-03-20", time: "16:00", status: "Pending" },
  { key: "2", opponent: "Chris", sport: "Tennis", date: "2025-03-22", time: "16:00", status: "Confirmed" },
  { key: "3", opponent: "Jordan", sport: "Badminton", date: "2025-03-25", time: "16:00", status: "Pending" },
];

const paymentStatus = [
  { key: "1", amount: "$50", date: "2025-03-08", status: "Unpaid" },
];

const payments = [
  { key: "1", amount: "$50", date: "2025-03-08", status: "Unpaid" },
  { key: "2", amount: "$30", date: "2025-03-10", status: "Pending" },
  { key: "3", amount: "$20", date: "2025-03-12", status: "Unpaid" },
  { key: "4", amount: "$100", date: "2025-02-25", status: "Paid" }, // Should not be shown in Dashboard
];

const notifications = [
  { id: "1", title: "Booking Confirmed", description: "Your booking for Court A on March 10 is confirmed.", time: "2h ago" },
  { id: "2", title: "Payment Reminder", description: "You have an unpaid booking fee of $50.", time: "1d ago" },
];

const feedbackData = [
  { key: "1", user: "Alice", date: "2024-03-22", rating: 5, comment: "Great session!", status: "Reviewed" },
  { key: "2", user: "Bob", date: "2024-03-21", rating: 4, comment: "Helpful!", status: "Pending" },
  { key: "3", user: "Charlie", date: "2024-03-20", rating: 3, comment: "It was okay.", status: "Reviewed" },
];
//

//Tables columns
const bookingColumns = (navigate) => [
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date)
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
    sorter: (a, b) => a.time.localeCompare(b.time)
  },
  {
    title: "Sân",
    dataIndex: "court",
    key: "court"
  },
  {
    title: "Môn thể thao",
    dataIndex: "sport",
    key: "sport",
    filters: [
      { text: "Tennis", value: "Tennis" },
      { text: "Cầu lông", value: "Badminton" },
      { text: "Bóng rổ", value: "Basketball" },
    ],
    onFilter: (value, record) => record.sport === value
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Xác nhận", value: "Confirmed" },
      { text: "Đang xử lý", value: "Pending" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Button type="link" onClick={() => navigate(`/user/bookings/${record.key}`)}>Xem chi tiết</Button>
    )
  },
];

const coachingColumns = (navigate) => [
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date)
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
    sorter: (a, b) => a.time.localeCompare(b.time)
  },
  {
    title: "Huấn luyện viên",
    dataIndex: "coach",
    key: "coach"
  },
  {
    title: "Môn thể thao",
    dataIndex: "sport",
    key: "sport",
    filters: [
      { text: "Tennis", value: "Tennis" },
      { text: "Cầu lông", value: "Badminton" },
      { text: "Bóng rổ", value: "Basketball" },
    ],
    onFilter: (value, record) => record.sport === value
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Xác nhận", value: "Confirmed" },
      { text: "Đang xử lý", value: "Pending" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Button type="link" onClick={() => navigate(`/user/coachings/schedule/${record.key}`)}>Xem chi tiết</Button>
    )
  },
];

const matchingColumns = (navigate) => [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date)
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    sorter: (a, b) => a.time.localeCompare(b.time)
  },
  {
    title: "Opponent",
    dataIndex: "opponent",
    key: "opponent"
  },
  {
    title: "Sport",
    dataIndex: "sport",
    key: "sport",
    filters: [
      { text: "Basketball", value: "Basketball" },
      { text: "Tennis", value: "Tennis" },
      { text: "Badminton", value: "Badminton" },
    ],
    onFilter: (value, record) => record.sport === value
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Confirmed", value: "Confirmed" },
      { text: "Pending", value: "Pending" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Button type="link" onClick={() => navigate(`/user/matching/${record.key}`)}>View Details</Button>
    )
  },
];

const paymentColumns = [
  {
    title: "Khối lượng",
    dataIndex: "amount",
    key: "amount",
    sorter: (a, b) => parseFloat(a.amount.replace("$", "")) - parseFloat(b.amount.replace("$", ""))
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date)
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Chưa thanh toán", value: "Unpaid" },
      { text: "Đang xử lý", value: "Pending" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => <Tag color={status === "Unpaid" ? "red" : "orange"}>{status}</Tag>
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Button type="link" onClick={() => navigate(`/payments/${record.key}`)}>Xem chi tiết</Button>
    )
  },
];

const feedbackColumns = (navigate) => [
  { title: "Người dùng", dataIndex: "user", key: "user", sorter: (a, b) => a.user.localeCompare(b.user) },
  { title: "Ngày", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
  { title: "Đánh giá sao", dataIndex: "rating", key: "rating", sorter: (a, b) => a.rating - b.rating },
  { title: "Bình luận", dataIndex: "comment", key: "comment", ellipsis: true },
  { title: "Trạng thái", dataIndex: "status", key: "status", filters: [{ text: "Reviewed", value: "Reviewed" }, { text: "Pending", value: "Pending" }], onFilter: (value, record) => record.status.includes(value), render: (status) => <Tag color={status === "Reviewed" ? "green" : "orange"}>{status}</Tag> },
  { title: "Hành động", key: "action", render: (_, record) => <Button type="link" onClick={() => navigate(`/user/feedbacks/${record.key}`)}>Xem chi tiết</Button> },
];

const UserDashboardView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingSearchText, setBookingSearchText] = useState("");
  const [coachingSearchText, setCoachingSearchText] = useState("");
  const [matchingSearchText, setMatchingSearchText] = useState("");
  const [paymentSearchText, setPaymentSearchText] = useState("");
  const [feedbackSearchText, setFeedbackSearchText] = useState("");
  const navigate = useNavigate();

  // Search logic (search by court name)
  const filteredBookings = upcomingBookings.filter(
    (booking) => booking.court.toLowerCase().includes(bookingSearchText.toLowerCase())
  );

  // Search logic (search by coach name)
  const filteredCoaching = coachingSessions.filter(
    (session) => session.coach.toLowerCase().includes(coachingSearchText.toLowerCase())
  );

  // Search logic (search by opponent name)
  const filteredMatches = pendingMatches.filter(
    (match) => match.opponent.toLowerCase().includes(matchingSearchText.toLowerCase())
  );

  // Show only unpaid or pending payments
  const filteredPayments = payments.filter(
    (payment) => payment.status === "Unpaid" || payment.status === "Pending"
  );

  // Search logic (search by amount or date)
  const searchFilteredPayments = filteredPayments.filter(
    (payment) =>
      payment.amount.toLowerCase().includes(paymentSearchText.toLowerCase()) ||
      payment.date.includes(paymentSearchText)
  );

  const filteredFeedbacks = feedbackData.filter(
    (feedback) =>
      feedback.user.toLowerCase().includes(feedbackSearchText.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(feedbackSearchText.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic title="Lịch đặt sắp tới" value={upcomingBookings.length} prefix={<CalendarOutlined />} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Số buổi tập với huấn luyện viên" value={coachingSessions.length} prefix={<TrophyOutlined />} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Số trận đang chờ" value={pendingMatches.length} prefix={<TeamOutlined />} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Giao dịch chưa hoàn thành" value={paymentStatus.length} prefix={<WalletOutlined />} />
                </Card>
              </Col>
            </Row>
            <div className="flex gap-4 mt-4">
              <Button type="primary">Tìm sân</Button>
              <Button>Đặt lịch sân</Button>
              <Button>Đặt lịch huấn luyện viên</Button>
            </div>
          </motion.div>
        );
      case "bookings":
        return (
          <>
            {/* Title & Search Bar - Flex Container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lịch đặt sân sắp tới</h2>
              <Input
                placeholder="Tìm theo tên sân"
                value={bookingSearchText}
                onChange={(e) => setBookingSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            {/* Table with Filters, Sorting, and Pagination */}
            <Table
              dataSource={filteredBookings}
              columns={bookingColumns(navigate)}
              pagination={{ pageSize: 8 }}
            />

            {/* View All Bookings Button */}
            <div className="flex justify-end mt-4">
              <Button type="link" onClick={() => navigate("/user/bookings")}>
                Xem tất cả lịch đặt
              </Button>
            </div>
          </>
        );
      case "coaching":
        return (
          <>
            {/* Title & Search Bar - Flex Container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lịch đặt huấn luyện viên sắp tới</h2>
              <Input
                placeholder="Tìm theo tên huấn luyện viên"
                value={coachingSearchText}
                onChange={(e) => setCoachingSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            {/* Table with Filters, Sorting, and Pagination */}
            <Table
              dataSource={filteredCoaching}
              columns={coachingColumns(navigate)}
              pagination={{ pageSize: 8 }}
            />

            {/* View All Coaching Sessions Button */}
            <div className="flex justify-end mt-4">
              <Button type="link" onClick={() => navigate("/user/coachings")}>
                Xem tất cả các buổi tập với huấn luyện viên
              </Button>
            </div>
          </>
        );
      case "matches":
        return (
          <>
            {/* Title & Search Bar - Flex Container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Các trận đấu sắp tới</h2>
              <Input
                placeholder="Tìm theo tên đối thủ"
                value={matchingSearchText}
                onChange={(e) => setMatchingSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            {/* Table with Filters, Sorting, and Pagination */}
            <Table
              dataSource={filteredMatches}
              columns={matchingColumns(navigate)}
              pagination={{ pageSize: 8 }}
            />

            {/* View All Matches Button */}
            <div className="flex justify-end mt-4">
              <Button type="link" onClick={() => navigate("/user/matching")}>
                Xem tất cả các trận đấu
              </Button>
            </div>
          </>
        );
      case "payments":
        return (
          <>
            {/* Title & Search Bar - Flex Container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Giao dịch chưa hoàn thành</h2>
              <Input
                placeholder="Tìm theo khối lượng hoặc ngày"
                value={paymentSearchText}
                onChange={(e) => setPaymentSearchText(e.target.value)}
                style={{ width: 290 }}
              />
            </div>

            {/* Table with Filters, Sorting, and Pagination */}
            <Table
              dataSource={searchFilteredPayments}
              columns={paymentColumns}
              pagination={{ pageSize: 8 }}
            />

            {/* View All Transactions Button */}
            <div className="flex justify-end mt-4">
              <Button type="link" onClick={() => navigate("/user/transactions")}>
                Xem tất cả các giao dịch
              </Button>
            </div>
          </>
        );
      case "notifications":
        return (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => <UserDashboardNotificationCard key={item.id} {...item} />}
          />
        );
      case "feedbacks":
        return (
          <>
            {/* Title & Search Bar - Flex Container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Phản hồi gần đây</h2>
              <Input
                placeholder="Tìm theo tên hoặc bình luận"
                value={feedbackSearchText}
                onChange={(e) => setFeedbackSearchText(e.target.value)}
                style={{ width: 290 }}
              />
            </div>

            {/* Table with Filters, Sorting, and Pagination */}
            <Table
              dataSource={filteredFeedbacks}
              columns={feedbackColumns(navigate)}
              pagination={{ pageSize: 8 }}
            />

            {/* View All Feedback Button */}
            <div className="flex justify-end mt-4">
              <Button type="link" onClick={() => navigate("/user/feedbacks")}>
                View All Feedback
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const tabItems = [
    { key: "overview", label: <span><HomeOutlined className="mr-2" /> Tổng quan</span> },
    { key: "bookings", label: <span><CalendarOutlined className="mr-2" /> Lịch đặt sân</span> },
    { key: "matches", label: <span><TeamOutlined className="mr-2" /> Trận đấu</span> },
    { key: "coaching", label: <span><TrophyOutlined className="mr-2" /> Huấn luyện viên</span> },
    { key: "payments", label: <span><WalletOutlined className="mr-2" /> Thanh toán</span> },
    { key: "feedbacks", label: <span><CommentOutlined className="mr-2" /> Phản hồi</span> },
    { key: "notifications", label: <span><BellOutlined className="mr-2" /> Thông báo</span> },
  ];

  return (
    <Card title="User Dashboard" className="p-4">
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={tabItems} />
      <div className="mt-4">{renderContent()}</div>

    </Card>
  );
};

export default UserDashboardView;