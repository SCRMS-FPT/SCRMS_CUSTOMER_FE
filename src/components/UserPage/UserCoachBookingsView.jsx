import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Tag,
  Button,
  Modal,
  Rate,
  Input,
  Space,
  Alert,
  Typography,
  DatePicker,
  Select,
  Avatar,
  message,
  Progress,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Client } from "../../API/CoachApi";
import {
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarFilled,
  SendOutlined,
  CheckCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  Client as ReviewClient,
  CreateReviewRequest,
} from "../../API/ReviewApi";

const { Text, Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

// Styled components for review modal
const ReviewModalContent = styled.div`
  padding: 10px 0;
`;

const RatingContainer = styled.div`
  text-align: center;
  margin: 20px 0 30px;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const RatingLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
  padding: 0 10px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

const FeedbackInput = styled.div`
  margin-top: 25px;
`;

const SuccessAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;

  .check-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 40px;
    margin-bottom: 20px;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
  }

  .confetti {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
`;

const UserCoachBookingsView = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchParams] = useSearchParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Add new states for the enhanced review modal
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);

  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || "1";
  const client = new Client();
  const reviewClient = new ReviewClient();

  // Update useEffect to include pageIndex
  useEffect(() => {
    fetchBookings();
  }, [dateRange, statusFilter, pageIndex]);

  // Update the fetchBookings function to use proper date formatting
  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Format dates properly for API
      let formattedStartDate = undefined;
      let formattedEndDate = undefined;

      if (dateRange[0]) {
        formattedStartDate = dateRange[0].format("YYYY-MM-DD");
      }

      if (dateRange[1]) {
        formattedEndDate = dateRange[1].format("YYYY-MM-DD");
      }

      // Call API to get user bookings
      const response = await client.getUserBookings(
        formattedStartDate ? new Date(formattedStartDate) : undefined,
        formattedEndDate ? new Date(formattedEndDate) : undefined,
        statusFilter || undefined,
        pageIndex, // pageIndex
        10, // pageSize
        undefined, // sportId (optional)
        undefined, // coachId (optional)
        undefined // packageId (optional)
      );
      setBookings(response.data || []);
      setTotalCount(response.count || 0);
      setError(null);

      console.log("Fetched bookings with params:", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: statusFilter,
        pageIndex: pageIndex,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "pending":
        return <Tag color="orange">Đang chờ</Tag>;
      case "confirmed":
        return <Tag color="blue">Đã xác nhận</Tag>;
      case "completed":
        return <Tag color="green">Hoàn thành</Tag>;
      case "cancelled":
        return <Tag color="red">Đã hủy</Tag>;
      case "no_show":
        return <Tag color="gray">Không đến</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Updated method to check if a session is completed and reviewable
  const isSessionCompletedAndReviewable = (record) => {
    // Only completed sessions can be reviewed
    if (record.status.toLowerCase() !== "completed") return false;

    // Check if the session date and end time are in the past
    const sessionDateTime = dayjs(
      `${record.bookingDate} ${record.endTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    return sessionDateTime.isBefore(dayjs());
  };

  // Enhanced feedback submit method
  const handleFeedbackSubmit = async () => {
    if (!rating) {
      message.warning("Vui lòng đánh giá số sao trước khi gửi");
      return;
    }

    try {
      setReviewSubmitting(true);

      // Create the review request
      const reviewRequest = new CreateReviewRequest({
        subjectType: "coach",
        subjectId: selectedBooking.coachId,
        rating: rating,
        comment: feedback.trim() || "Trải nghiệm tốt",
      });

      // Call the API to create the review
      await reviewClient.createReview(reviewRequest);

      // Show success animation
      setReviewSuccess(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setFeedbackModalVisible(false);
        setReviewSuccess(false);
        setRating(0);
        setFeedback("");
        message.success("Cảm ơn bạn đã đánh giá huấn luyện viên!");

        // Refresh the bookings list to update UI
        fetchBookings();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Huấn luyện viên & Buổi tập",
      dataIndex: "coachName",
      key: "coachInfo",
      render: (_, record) => (
        <Space direction="vertical">
          <Space>
            <UserOutlined />
            <Text strong>{record.coachName}</Text>
          </Space>
          <Text type="secondary">{record.packageName || "Buổi tập đơn"}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày & Giờ",
      dataIndex: "bookingDate",
      key: "dateTime",
      render: (_, record) => (
        <Space direction="vertical">
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(record.bookingDate).format("DD/MM/YYYY")}</Text>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <Text>
              {record.startTime.substring(0, 5)} -{" "}
              {record.endTime.substring(0, 5)}
            </Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => {
        const dateA = dayjs(a.bookingDate).valueOf();
        const dateB = dayjs(b.bookingDate).valueOf();
        return dateA - dateB;
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      key: "price",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Đang chờ", value: "pending" },
        { text: "Đã xác nhận", value: "confirmed" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Đã hủy", value: "cancelled" },
        { text: "Không đến", value: "no_show" },
      ],
      onFilter: (value, record) =>
        record.status.toLowerCase() === value.toLowerCase(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const canReview = isSessionCompletedAndReviewable(record);
        const isFutureBooking = dayjs(
          `${record.bookingDate} ${record.startTime}`
        ).isAfter(dayjs());

        return (
          <Space>
            <Button
              type="primary"
              onClick={() => navigate(`/user/coachings/${record.id}`)}
            >
              Xem chi tiết
            </Button>

            {canReview && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="default"
                  icon={<StarFilled style={{ color: "#faad14" }} />}
                  onClick={() => {
                    setSelectedBooking(record);
                    setFeedbackModalVisible(true);
                    setRating(0);
                    setFeedback("");
                  }}
                  className="review-button"
                  style={{
                    background: "linear-gradient(to right, #faad14, #ffd666)",
                    color: "white",
                    border: "none",
                    boxShadow: "0 2px 0 rgba(0,0,0,0.045)",
                  }}
                >
                  Đánh giá
                </Button>
              </motion.div>
            )}

            {isFutureBooking && record.status.toLowerCase() === "pending" && (
              <Button danger>Hủy</Button>
            )}
          </Space>
        );
      },
    },
  ];

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleResetFilters = () => {
    setDateRange([null, null]);
    setStatusFilter(null);
  };

  // Function to get emotional feedback based on rating
  const getEmotionalFeedback = (rating) => {
    if (!rating) return "";

    switch (rating) {
      case 1:
        return "Rất không hài lòng";
      case 2:
        return "Không hài lòng";
      case 3:
        return "Bình thường";
      case 4:
        return "Hài lòng";
      case 5:
        return "Rất hài lòng!";
      default:
        return "";
    }
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Title level={4}>Lịch sử đặt lịch huấn luyện của bạn</Title>

        {/* Filters */}
        <Space wrap style={{ marginBottom: 16 }}>
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
            onChange={handleFilterChange}
            value={statusFilter}
            allowClear
          >
            <Option value="pending">Đang chờ</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="no_show">Không đến</Option>
          </Select>

          <Button onClick={handleResetFilters} icon={<FilterOutlined />}>
            Làm mới bộ lọc
          </Button>
        </Space>
      </Space>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            total: totalCount,
            current: pageIndex + 1,
            onChange: (page, pageSize) => {
              setPageIndex(page - 1);
            },
          }}
        />
      )}

      {/* Enhanced Feedback Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            {reviewSuccess ? (
              <span style={{ color: "#10b981" }}>
                <CheckCircleOutlined style={{ marginRight: 8 }} />
                Đánh giá thành công!
              </span>
            ) : (
              <>
                <StarFilled style={{ color: "#faad14", marginRight: 8 }} />
                Đánh giá buổi tập với {selectedBooking?.coachName}
              </>
            )}
          </div>
        }
        open={feedbackModalVisible}
        onCancel={() => {
          if (!reviewSubmitting) {
            setFeedbackModalVisible(false);
            setReviewSuccess(false);
          }
        }}
        footer={
          reviewSuccess ? (
            <Button
              type="primary"
              onClick={() => {
                setFeedbackModalVisible(false);
                setReviewSuccess(false);
              }}
            >
              Đóng
            </Button>
          ) : (
            [
              <Button
                key="cancel"
                onClick={() => setFeedbackModalVisible(false)}
                disabled={reviewSubmitting}
              >
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={reviewSubmitting}
                onClick={handleFeedbackSubmit}
                disabled={!rating}
                icon={<SendOutlined />}
              >
                Gửi đánh giá
              </Button>,
            ]
          )
        }
        width={500}
        destroyOnClose
        centered
        className="review-modal"
      >
        <AnimatePresence mode="wait">
          {reviewSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SuccessAnimation>
                <div className="check-circle">
                  <CheckCircleOutlined />
                </div>
                <Title level={4} style={{ margin: 0 }}>
                  Cảm ơn bạn đã đánh giá!
                </Title>
                <Paragraph type="secondary">
                  Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ
                </Paragraph>

                {/* Confetti animation using CSS */}
                <div className="confetti">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                        animation: `fall ${
                          Math.random() * 3 + 2
                        }s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              </SuccessAnimation>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReviewModalContent>
                {selectedBooking && (
                  <div
                    style={{
                      background: "#f9fafb",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <Space align="start">
                      <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        src={selectedBooking.coachAvatar}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                      <div>
                        <Text strong style={{ fontSize: "16px" }}>
                          {selectedBooking.coachName}
                        </Text>
                        <div style={{ color: "#6b7280", fontSize: "14px" }}>
                          <div>
                            <CalendarOutlined style={{ marginRight: "4px" }} />
                            {dayjs(selectedBooking.bookingDate).format(
                              "MMM D, YYYY"
                            )}
                          </div>
                          <div>
                            <ClockCircleOutlined
                              style={{ marginRight: "4px" }}
                            />
                            {selectedBooking.startTime} -{" "}
                            {selectedBooking.endTime}
                          </div>
                        </div>
                      </div>
                    </Space>
                  </div>
                )}

                <RatingContainer>
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Bạn đánh giá buổi tập của mình như thế nào?
                  </Text>

                  <div style={{ fontSize: "32px" }}>
                    <Rate
                      value={rating}
                      onChange={(value) => {
                        setRating(value);
                        setRatingHover(0);
                      }}
                      onHoverChange={(value) => setRatingHover(value)}
                      style={{ fontSize: "36px" }}
                    />
                  </div>

                  <RatingLabels>
                    <span>Rất tệ</span>
                    <span>Tệ</span>
                    <span>Bình thường</span>
                    <span>Tốt</span>
                    <span>Rất tốt</span>
                  </RatingLabels>

                  {(rating > 0 || ratingHover > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: "16px",
                        color:
                          rating >= 4
                            ? "#10b981"
                            : rating >= 3
                            ? "#0ea5e9"
                            : "#f59e0b",
                        fontWeight: "500",
                      }}
                    >
                      {getEmotionalFeedback(ratingHover || rating)}
                    </motion.div>
                  )}
                </RatingContainer>

                <FeedbackInput>
                  <Text
                    strong
                    style={{ marginBottom: "8px", display: "block" }}
                  >
                    Chi tiết đánh giá (tùy chọn):
                  </Text>
                  <TextArea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Mô tả về trải nghiệm của bạn với huấn luyện viên này..."
                    rows={4}
                    maxLength={500}
                    showCount
                    style={{ borderRadius: "8px" }}
                  />

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      background: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "6px",
                      borderLeft: "3px solid #10b981",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    <MessageOutlined
                      style={{ marginRight: "8px", color: "#10b981" }}
                    />
                    Đánh giá của bạn giúp những người khác tìm được huấn luyện
                    viên phù hợp
                  </div>
                </FeedbackInput>
              </ReviewModalContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(360deg) scale(1.2);
            opacity: 0;
          }
        }

        .confetti-piece {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          pointer-events: none;
        }

        .review-button {
          transition: all 0.3s ease;
        }

        .review-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3);
        }

        .review-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .review-modal .ant-modal-header {
          padding: 16px 24px;
          background: linear-gradient(to right, #f9fafb, #f3f4f6);
          border-bottom: 1px solid #e5e7eb;
        }

        .review-modal .ant-modal-body {
          padding: 20px 24px;
        }

        .review-modal .ant-modal-footer {
          border-top: 1px solid #e5e7eb;
          padding: 12px 24px;
        }

        .ant-rate-star {
          margin-right: 4px;
          transition: transform 0.2s ease;
        }

        .ant-rate-star:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default UserCoachBookingsView;
