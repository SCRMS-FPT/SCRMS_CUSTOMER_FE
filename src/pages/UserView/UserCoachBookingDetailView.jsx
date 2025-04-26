import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client as CoachClient } from "../../API/CoachApi";
import { Client as CourtClient } from "../../API/CourtApi";
import { Client as ReviewClient } from "../../API/ReviewApi";
import {
  Card,
  Spin,
  Typography,
  Space,
  Tag,
  Button,
  Alert,
  Avatar,
  Divider,
  Row,
  Col,
  Timeline,
  Descriptions,
  Statistic,
  Modal,
  Result,
  Rate,
  Input,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  TrophyOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  StarFilled,
  SendOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Box, Paper } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Styled components for review modal (copied from UserCoachBookingsView)
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

const UserCoachBookingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [coach, setCoach] = useState(null);
  const [sport, setSport] = useState(null);
  const [error, setError] = useState(null);

  // Review modal states
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);

  const coachClient = new CoachClient();
  const courtClient = new CourtClient();
  const reviewClient = new ReviewClient();

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch booking details
        const bookingData = await coachClient.getBookingById(id);
        setBooking(bookingData);

        // Step 2: Fetch coach details using coachId from booking
        if (bookingData && bookingData.coachId) {
          const coachData = await coachClient.getCoachById(bookingData.coachId);
          setCoach(coachData);
        }

        // Step 3: Fetch sport details using sportId from booking
        if (bookingData && bookingData.sportId) {
          try {
            const sportData = await courtClient.getSportById(
              bookingData.sportId
            );
            setSport(sportData);
          } catch (sportError) {
            console.error("Error fetching sport details:", sportError);
            // Don't fail everything if sport data can't be fetched
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id]);

  const handleCancelBooking = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn hủy đặt lịch này không?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Việc hủy có thể phải tuân theo chính sách hủy của huấn luyện viên.",
      okText: "Có, Hủy Đặt Lịch",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          await coachClient.updateBookingStatus(id, "CANCELLED");
          Modal.success({
            title: "Đã Hủy Đặt Lịch",
            content: "Đặt lịch của bạn đã được hủy thành công.",
            onOk: () => {
              // Refresh the booking data
              window.location.reload();
            },
          });
        } catch (error) {
          Modal.error({
            title: "Hủy Thất Bại",
            content: "Không thể hủy đặt lịch của bạn. Vui lòng thử lại sau.",
          });
        }
      },
    });
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
      const reviewRequest = {
        subjectType: "coach",
        subjectId: booking.coachId,
        rating: rating,
        comment: feedback.trim() || "Trải nghiệm tốt",
      };

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
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setReviewSubmitting(false);
    }
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

  // Check if session has been completed
  const isSessionCompletedAndReviewable = () => {
    if (!booking) return false;

    // Only completed sessions can be reviewed
    if (booking.status.toLowerCase() !== "completed") return false;

    // Check if the session date and end time are in the past
    const sessionDateTime = dayjs(
      `${booking.bookingDate} ${booking.endTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    return sessionDateTime.isBefore(dayjs());
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", icon: <ClockCircleOutlined /> },
      confirmed: { color: "blue", icon: <CheckCircleOutlined /> },
      completed: { color: "green", icon: <CheckCircleOutlined /> },
      cancelled: { color: "red", icon: <CloseCircleOutlined /> },
      no_show: { color: "gray", icon: <CloseCircleOutlined /> },
    };

    const normalizedStatus = status.toLowerCase();
    const config = statusMap[normalizedStatus] || {
      color: "default",
      icon: <InfoCircleOutlined />,
    };

    const statusText =
      {
        pending: "ĐANG CHỜ",
        confirmed: "ĐÃ XÁC NHẬN",
        completed: "HOÀN THÀNH",
        cancelled: "ĐÃ HỦY",
        no_show: "KHÔNG ĐẾN",
      }[normalizedStatus] || status.toUpperCase();

    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{ padding: "4px 8px", fontSize: "14px" }}
      >
        {statusText}
      </Tag>
    );
  };

  // Calculate duration in hours and minutes
  const calculateDuration = () => {
    if (!booking || !booking.startTime || !booking.endTime) return "N/A";

    const [startHour, startMinute] = booking.startTime.split(":").map(Number);
    const [endHour, endMinute] = booking.endTime.split(":").map(Number);

    let durationMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight sessions

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return hours > 0
      ? `${hours} giờ${hours > 1 ? "" : ""}${
          minutes > 0 ? ` ${minutes} phút` : ""
        }`
      : `${minutes} phút`;
  };

  // Can the user cancel this booking?
  const canCancel = () => {
    if (!booking) return false;

    const statusLower = booking.status.toLowerCase();
    const isPending = statusLower === "pending";
    const isConfirmed = statusLower === "confirmed";
    const isFuture = dayjs(booking.bookingDate).isAfter(dayjs(), "day");

    return (isPending || isConfirmed) && isFuture;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin đặt lịch..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi Tải Thông Tin"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Quay Lại
          </Button>
        }
      />
    );
  }

  if (!booking) {
    return (
      <Result
        status="404"
        title="Không Tìm Thấy Đặt Lịch"
        subTitle="Xin lỗi, đặt lịch bạn đang tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/user/coachings")}>
            Quay Lại Danh Sách Đặt Lịch
          </Button>
        }
      />
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        my: 2,
      }}
    >
      {/* Header with back button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Chi Tiết Đặt Lịch
        </Title>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Quay Lại
        </Button>
      </Box>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} md={16}>
          {/* Session Details Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: theme.shape.borderRadius,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.light, 0.1),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarOutlined
                  style={{
                    fontSize: 18,
                    marginRight: 8,
                    color: theme.palette.primary.main,
                  }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  Thông Tin Buổi Tập
                </Title>
              </Box>
              {getStatusTag(booking.status)}
            </Box>

            <Box sx={{ p: 3 }}>
              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Ngày" span={2}>
                  <Text strong>
                    {dayjs(booking.bookingDate).format("dddd, DD/MM/YYYY")}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  <Text strong>
                    {booking.startTime} - {booking.endTime}
                  </Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({calculateDuration()})
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Môn thể thao" span={2}>
                  {sport ? sport.name : booking.sportId}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền" span={2}>
                  <Text
                    strong
                    style={{ fontSize: 16, color: theme.palette.success.main }}
                  >
                    {booking.totalPrice?.toLocaleString()}đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Gói" span={2}>
                  {booking.packageName || "Buổi tập đơn"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã đặt lịch" span={2}>
                  <Text type="secondary" copyable>
                    {booking.id}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                {/* Review Button */}
                {isSessionCompletedAndReviewable() && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="default"
                      icon={<StarFilled style={{ color: "#faad14" }} />}
                      onClick={() => {
                        setFeedbackModalVisible(true);
                        setRating(0);
                        setFeedback("");
                      }}
                      style={{
                        background:
                          "linear-gradient(to right, #faad14, #ffd666)",
                        color: "white",
                        border: "none",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.045)",
                      }}
                    >
                      Đánh giá
                    </Button>
                  </motion.div>
                )}

                {/* Cancel Button */}
                {canCancel() && (
                  <Button
                    danger
                    type="primary"
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelBooking}
                  >
                    Hủy Đặt Lịch
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Booking Timeline */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: theme.shape.borderRadius,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              p: 3,
              mb: 3,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Title level={4}>Lịch Sử Đặt Lịch</Title>
            </Box>

            <Timeline>
              <Timeline.Item color="green">
                <Text strong>Tạo Đặt Lịch</Text>
                <div>
                  {dayjs(booking.createdAt || new Date()).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </div>
              </Timeline.Item>
              {booking.status.toLowerCase() !== "pending" && (
                <Timeline.Item color="blue">
                  <Text strong>Xác Nhận Đặt Lịch</Text>
                  <div>
                    Huấn luyện viên đã chấp nhận yêu cầu đặt lịch của bạn
                  </div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "completed" && (
                <Timeline.Item color="green">
                  <Text strong>Buổi Tập Đã Hoàn Thành</Text>
                  <div>{dayjs(booking.bookingDate).format("DD/MM/YYYY")}</div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "cancelled" && (
                <Timeline.Item color="red">
                  <Text strong>Đặt Lịch Đã Hủy</Text>
                  <div>
                    {dayjs(booking.lastModified || new Date()).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "pending" && (
                <Timeline.Item color="orange">
                  <Text strong>Đang Chờ Xác Nhận</Text>
                  <div>
                    Vui lòng đợi huấn luyện viên xác nhận đặt lịch của bạn
                  </div>
                </Timeline.Item>
              )}
            </Timeline>
          </Paper>
        </Col>

        {/* Right Column */}
        <Col xs={24} md={8}>
          {/* Coach Profile Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: theme.shape.borderRadius,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.light, 0.1),
                display: "flex",
                alignItems: "center",
              }}
            >
              <UserOutlined
                style={{
                  fontSize: 18,
                  marginRight: 8,
                  color: theme.palette.primary.main,
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Thông Tin Huấn Luyện Viên
              </Title>
            </Box>

            <Box sx={{ p: 3, textAlign: "center" }}>
              <Avatar src={coach?.avatar} size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {coach?.fullName || booking.coachName}
              </Title>

              {sport && (
                <Tag
                  color="blue"
                  icon={<TrophyOutlined />}
                  style={{ margin: "8px 0" }}
                >
                  {sport.name}
                </Tag>
              )}

              {coach?.bio && (
                <Box sx={{ mt: 2, textAlign: "left" }}>
                  <Paragraph>{coach.bio}</Paragraph>
                </Box>
              )}

              <Divider />

              <Box sx={{ textAlign: "left" }}>
                {coach?.email && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MailOutlined
                      style={{
                        marginRight: 8,
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Text>{coach.email}</Text>
                  </Box>
                )}

                {coach?.phone && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneOutlined
                      style={{
                        marginRight: 8,
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Text>{coach.phone}</Text>
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DollarOutlined
                    style={{
                      marginRight: 8,
                      color: theme.palette.success.main,
                    }}
                  />
                  <Text>
                    {coach?.ratePerHour?.toLocaleString() ||
                      booking.totalPrice?.toLocaleString()}
                    đ / giờ
                  </Text>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() => navigate(`/coaches/${booking.coachId}`)}
                  block
                >
                  Xem Hồ Sơ Huấn Luyện Viên
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Stats Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: theme.shape.borderRadius,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              p: 3,
            }}
          >
            <Title level={4}>Tóm Tắt Đặt Lịch</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Thời Lượng"
                  value={calculateDuration()}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tổng Tiền"
                  value={booking.totalPrice?.toLocaleString()}
                  suffix="đ"
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>

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
                Đánh giá buổi tập với {booking?.coachName}
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
      `}</style>
    </Box>
  );
};

export default UserCoachBookingDetailView;
