import React, { useState, useEffect } from "react";
import {
  Card,
  Statistic,
  Button,
  Tag,
  Skeleton,
  Avatar,
  Row,
  Col,
  Input,
  Table,
  Space,
  Spin,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  TrophyOutlined,
  CommentOutlined,
  StarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Client as CoachClient } from "@/API/CoachApi";
import { Client as CourtClient } from "@/API/CourtApi";
import { Client as ReviewClient } from "@/API/ReviewApi";
import { useAuth } from "@/hooks/useAuth";

const UserDashboardView = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  // State for different data sections
  const [courtBookings, setCourtBookings] = useState([]);
  const [coachSessions, setCoachSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    upcomingBookings: 0,
    coachSessions: 0,
    pendingReviews: 0,
  });
  const [sports, setSports] = useState({});

  // Loading states
  const [loadingCourt, setLoadingCourt] = useState(true);
  const [loadingCoach, setLoadingCoach] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Error states
  const [errorCourt, setErrorCourt] = useState(null);
  const [errorCoach, setErrorCoach] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);

  // Search states
  const [courtSearchText, setCourtSearchText] = useState("");
  const [coachSearchText, setCoachSearchText] = useState("");
  const [reviewSearchText, setReviewSearchText] = useState("");

  useEffect(() => {
    // Fetch dashboard data from APIs
    fetchCourtBookings();
    fetchCoachSessions();
    fetchReviews();
    fetchAllSports();
  }, []);

  // Cache for coach and court data to avoid duplicate API calls
  const [coachCache, setCoachCache] = useState({});
  const [courtCache, setCourtCache] = useState({});

  const fetchCoachDetails = async (coachId) => {
    // Return from cache if available
    if (coachCache[coachId]) return coachCache[coachId];

    try {
      const client = new CoachClient();
      const response = await client.getCoachById(coachId);

      // Update cache
      setCoachCache((prev) => ({
        ...prev,
        [coachId]: response,
      }));

      return response;
    } catch (error) {
      console.error(`Error fetching coach details for ID ${coachId}:`, error);
      return null;
    }
  };

  const fetchCourtDetails = async (courtId) => {
    // Return from cache if available
    if (courtCache[courtId]) return courtCache[courtId];

    try {
      const client = new CourtClient();
      const response = await client.getCourtDetails(courtId);

      // Update cache
      setCourtCache((prev) => ({
        ...prev,
        [courtId]: response?.court || null,
      }));

      return response?.court || null;
    } catch (error) {
      console.error(`Error fetching court details for ID ${courtId}:`, error);
      return null;
    }
  };

  const fetchAllSports = async () => {
    try {
      const client = new CourtClient();
      const response = await client.getSports();

      if (response && response.sports) {
        const sportsMap = {};
        response.sports.forEach((sport) => {
          sportsMap[sport.id] = sport.name;
        });
        setSports(sportsMap);
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchCourtBookings = async () => {
    try {
      setLoadingCourt(true);
      const client = new CourtClient();
      const response = await client.getUserDashboard();

      if (response && response.upcomingBookings) {
        setCourtBookings(response.upcomingBookings);

        if (response.stats) {
          setDashboardStats((prev) => ({
            ...prev,
            upcomingBookings: response.stats.upcomingBookings || 0,
          }));
        }
      }
      setLoadingCourt(false);
    } catch (error) {
      console.error("Error fetching court bookings:", error);
      setErrorCourt("Failed to fetch your court bookings");
      setLoadingCourt(false);
    }
  };

  const fetchCoachSessions = async () => {
    try {
      setLoadingCoach(true);
      const client = new CoachClient();
      const response = await client.getUserCoachDashboard();

      if (response && response.upcomingSessions) {
        setCoachSessions(response.upcomingSessions);
        setDashboardStats((prev) => ({
          ...prev,
          coachSessions: response.totalSessions || 0,
        }));
      }
      setLoadingCoach(false);
    } catch (error) {
      console.error("Error fetching coaching sessions:", error);
      setErrorCoach("Failed to fetch your coaching sessions");
      setLoadingCoach(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const client = new ReviewClient();
      const response = await client.getReviewsSubmittedByUser(1, 10);

      if (response && Array.isArray(response.data)) {
        // Process each review to add subject name
        const reviewsWithDetails = await Promise.all(
          response.data.map(async (review) => {
            let subjectName = "Không xác định";

            // Fetch subject details based on type
            if (review.subjectType.toLowerCase() === "coach") {
              const coachDetails = await fetchCoachDetails(review.subjectId);
              subjectName = coachDetails?.fullName || "HLV không xác định";
            } else if (review.subjectType.toLowerCase() === "court") {
              const courtDetails = await fetchCourtDetails(review.subjectId);
              subjectName = courtDetails?.courtName || "Sân không xác định";
            }

            return {
              ...review,
              subjectName,
            };
          })
        );

        setReviews(reviewsWithDetails);
      } else {
        setReviews([]);
      }
      setLoadingReviews(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setErrorReviews("Failed to fetch your reviews");
      setLoadingReviews(false);
    }
  };

  // Filter the data based on search text
  const filteredCourtBookings = courtBookings.filter(
    (booking) =>
      booking.courtName
        ?.toLowerCase()
        .includes(courtSearchText.toLowerCase()) ||
      booking.sportCenterName
        ?.toLowerCase()
        .includes(courtSearchText.toLowerCase())
  );

  const filteredCoachSessions = coachSessions.filter((session) =>
    session.coachName?.toLowerCase().includes(coachSearchText.toLowerCase())
  );

  const filteredReviews = reviews.filter(
    (review) =>
      review.subjectName
        ?.toLowerCase()
        .includes(reviewSearchText.toLowerCase()) ||
      review.comment?.toLowerCase().includes(reviewSearchText.toLowerCase())
  );

  // Table columns for court bookings
  const courtColumns = [
    {
      title: "Ngày",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) =>
        `${record.startTime.substring(0, 5)} - ${record.endTime.substring(
          0,
          5
        )}`,
    },
    {
      title: "Sân",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "Địa điểm",
      dataIndex: "sportCenterName",
      key: "sportCenterName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        switch (status.toLowerCase()) {
          case "confirmed":
            color = "green";
            break;
          case "deposited":
            color = "orange";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/user/bookings/${record.bookingId}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Table columns for coaching sessions
  const coachColumns = [
    {
      title: "Ngày",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) =>
        `${record.startTime.substring(0, 5)} - ${record.endTime.substring(
          0,
          5
        )}`,
    },
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (name, record) => (
        <Space>
          {record.coachAvatar && <Avatar src={record.coachAvatar} />}
          {name}
        </Space>
      ),
    },
    {
      title: "Môn thể thao",
      key: "sportId",
      render: (_, record) => sports[record.sportId] || "Chưa có thông tin",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        switch (status.toLowerCase()) {
          case "confirmed":
            color = "green";
            break;
          case "pending":
            color = "orange";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/user/coachings/${record.bookingId}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Table columns for reviews
  const reviewColumns = [
    {
      title: "Đánh giá cho",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Loại",
      dataIndex: "subjectType",
      key: "subjectType",
      render: (type) => {
        let text = type;
        switch (type.toLowerCase()) {
          case "coach":
            text = "HLV";
            break;
          case "court":
            text = "Sân";
            break;
          default:
            break;
        }
        return text;
      },
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          {[...Array(5)].map((_, i) => (
            <StarOutlined
              key={i}
              style={{ color: i < rating ? "#fadb14" : "#d9d9d9" }}
            />
          ))}
        </span>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/user/feedbacks/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="dashboard-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div variants={childVariants} className="mb-8">
        <Card className="welcome-card bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <Row gutter={16} align="middle">
            <Col span={16}>
              <h1 className="text-2xl font-bold text-blue-800">
                Xin chào, {userProfile?.fullName || "người dùng"}!
              </h1>
              <p className="text-blue-600 mt-2">
                Chào mừng bạn quay trở lại với hệ thống quản lý đặt sân và huấn
                luyện viên.
              </p>
            </Col>
            <Col span={8} className="text-right">
              <Button
                type="primary"
                size="large"
                className="mr-2 hover:scale-105 transition-transform"
                onClick={() => navigate("/browse-courts")}
              >
                Tìm sân
              </Button>
              <Button
                size="large"
                className="hover:scale-105 transition-transform"
                onClick={() => navigate("/coaches")}
              >
                Tìm HLV
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={childVariants} className="mb-8">
        <Row gutter={16}>
          <Col span={8}>
            <Card
              hoverable
              className="stat-card shadow hover:shadow-md transition-shadow"
            >
              <Statistic
                title={
                  <span className="text-lg font-medium">
                    Lịch đặt sân sắp tới
                  </span>
                }
                value={dashboardStats.upcomingBookings}
                prefix={<CalendarOutlined className="text-blue-500" />}
                valueStyle={{ color: "#3f8600", fontSize: "28px" }}
              />
              <Button
                type="link"
                onClick={() => navigate("/user/bookings")}
                className="mt-2 px-0 hover:text-blue-700"
              >
                Xem tất cả
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              className="stat-card shadow hover:shadow-md transition-shadow"
            >
              <Statistic
                title={
                  <span className="text-lg font-medium">Buổi tập với HLV</span>
                }
                value={dashboardStats.coachSessions}
                prefix={<TrophyOutlined className="text-green-500" />}
                valueStyle={{ color: "#3f8600", fontSize: "28px" }}
              />
              <Button
                type="link"
                onClick={() => navigate("/user/coachings")}
                className="mt-2 px-0 hover:text-green-700"
              >
                Xem tất cả
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              className="stat-card shadow hover:shadow-md transition-shadow"
            >
              <Statistic
                title={
                  <span className="text-lg font-medium">Đánh giá đã gửi</span>
                }
                value={reviews.length}
                prefix={<CommentOutlined className="text-purple-500" />}
                valueStyle={{ color: "#722ed1", fontSize: "28px" }}
              />
              <Button
                type="link"
                onClick={() => navigate("/user/feedbacks")}
                className="mt-2 px-0 hover:text-purple-700"
              >
                Xem tất cả
              </Button>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Court Bookings Section */}
      <motion.div variants={childVariants} className="mb-8">
        <Card
          title={
            <h2 className="text-xl font-semibold">Lịch đặt sân sắp tới</h2>
          }
          extra={
            <Input
              placeholder="Tìm theo tên sân hoặc địa điểm"
              value={courtSearchText}
              onChange={(e) => setCourtSearchText(e.target.value)}
              style={{ width: 250 }}
              prefix={<InfoCircleOutlined />}
              allowClear
            />
          }
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          {loadingCourt ? (
            <Spin tip="Đang tải...">
              <Skeleton active />
            </Spin>
          ) : errorCourt ? (
            <Empty
              description={
                <span className="text-red-500">
                  {errorCourt}.{" "}
                  <Button type="link" onClick={fetchCourtBookings}>
                    Thử lại
                  </Button>
                </span>
              }
            />
          ) : (
            <>
              <Table
                dataSource={filteredCourtBookings}
                columns={courtColumns}
                rowKey="bookingId"
                pagination={{ pageSize: 5 }}
                className="animate-fade-in"
                locale={{
                  emptyText: "Không có lịch đặt sân nào",
                }}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  ghost
                  onClick={() => navigate("/user/bookings")}
                >
                  Xem tất cả lịch đặt sân
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      {/* Coaching Sessions Section */}
      <motion.div variants={childVariants} className="mb-8">
        <Card
          title={
            <h2 className="text-xl font-semibold">
              Lịch tập với huấn luyện viên
            </h2>
          }
          extra={
            <Input
              placeholder="Tìm theo tên huấn luyện viên"
              value={coachSearchText}
              onChange={(e) => setCoachSearchText(e.target.value)}
              style={{ width: 250 }}
              prefix={<InfoCircleOutlined />}
              allowClear
            />
          }
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          {loadingCoach ? (
            <Spin tip="Đang tải...">
              <Skeleton active />
            </Spin>
          ) : errorCoach ? (
            <Empty
              description={
                <span className="text-red-500">
                  {errorCoach}.{" "}
                  <Button type="link" onClick={fetchCoachSessions}>
                    Thử lại
                  </Button>
                </span>
              }
            />
          ) : (
            <>
              <Table
                dataSource={filteredCoachSessions}
                columns={coachColumns}
                rowKey="bookingId"
                pagination={{ pageSize: 5 }}
                className="animate-fade-in"
                locale={{
                  emptyText: "Không có lịch tập với huấn luyện viên nào",
                }}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  ghost
                  onClick={() => navigate("/user/coachings")}
                >
                  Xem tất cả lịch tập với huấn luyện viên
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      {/* Reviews Section */}
      <motion.div variants={childVariants}>
        <Card
          title={<h2 className="text-xl font-semibold">Đánh giá của bạn</h2>}
          extra={
            <Input
              placeholder="Tìm theo tên hoặc bình luận"
              value={reviewSearchText}
              onChange={(e) => setReviewSearchText(e.target.value)}
              style={{ width: 250 }}
              prefix={<InfoCircleOutlined />}
              allowClear
            />
          }
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          {loadingReviews ? (
            <Spin tip="Đang tải...">
              <Skeleton active />
            </Spin>
          ) : errorReviews ? (
            <Empty
              description={
                <span className="text-red-500">
                  {errorReviews}.{" "}
                  <Button type="link" onClick={fetchReviews}>
                    Thử lại
                  </Button>
                </span>
              }
            />
          ) : (
            <>
              <Table
                dataSource={filteredReviews}
                columns={reviewColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                className="animate-fade-in"
                locale={{
                  emptyText: "Không có đánh giá nào",
                }}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  ghost
                  onClick={() => navigate("/user/feedbacks")}
                >
                  Xem tất cả đánh giá
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .welcome-card {
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .welcome-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </motion.div>
  );
};

export default UserDashboardView;
