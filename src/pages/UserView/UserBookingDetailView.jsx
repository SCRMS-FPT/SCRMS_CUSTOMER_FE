import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  Button,
  message,
  Typography,
  Row,
  Col,
  Modal,
  Rate,
  Input,
  Divider,
  Timeline,
  Empty,
  Slider,
  InputNumber,
  Progress,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SyncOutlined,
  DollarOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Client as CourtClient } from "../../API/CourtApi";
import {
  Client as PaymentClient,
  ProcessPaymentRequest,
} from "../../API/PaymentApi";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Typography as MuiTypography,
  Chip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Client as ReviewClient,
  CreateReviewRequest,
} from "../../API/ReviewApi";
import { motion } from "framer-motion";
import {
  StarFilled,
  CommentOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Transition } from "@headlessui/react";
import Lottie from "react-lottie";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Map API booking status codes to user-friendly names
const statusMap = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Cancelled",
  4: "NoShow",
  5: "Expired",
};

// Status colors for tags
const statusColors = {
  Pending: "orange",
  Confirmed: "green",
  Completed: "blue",
  Cancelled: "red",
  NoShow: "black",
  Expired: "volcano",
};

// Styled components for the payment modal
const PaymentModalContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const PaymentProgress = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
}));

const PaymentInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  background: "linear-gradient(to right, #f9f9f9, #ffffff)",
}));

// Add this constant directly in the component file
const confettiAnimation = {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 60,
  w: 512,
  h: 512,
  nm: "Confetti",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Confetti",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [256, 256, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: Array(40)
            .fill()
            .map((_, i) => ({
              ty: "rc",
              d: 1,
              s: { a: 0, k: [15, 15], ix: 2 },
              p: {
                a: 1,
                k: [
                  {
                    t: 0,
                    s: [Math.random() * 500 - 250, -100],
                    e: [Math.random() * 500 - 250, 500],
                  },
                  { t: 60 },
                ],
              },
              r: {
                a: 1,
                k: [{ t: 0, s: [0], e: [360] }, { t: 60 }],
              },
              fl: 1,
              c: { a: 0, k: [Math.random(), Math.random(), Math.random(), 1] },
            })),
          nm: "Confetti Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
  markers: [],
};

const UserBookingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // New states for payment functionality
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Add these state variables
  const [courtReviewModalVisible, setCourtReviewModalVisible] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtRating, setCourtRating] = useState(0);
  const [courtFeedback, setCourtFeedback] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const reviewClient = new ReviewClient();
  const courtClient = new CourtClient();
  const paymentClient = new PaymentClient();

  // Add this function to handle court reviews
  const handleCourtReviewSubmit = async () => {
    if (!courtRating) {
      message.warning("Vui lòng chọn đánh giá sao trước khi gửi.");
      return;
    }

    try {
      setReviewLoading(true);

      const reviewRequest = new CreateReviewRequest({
        subjectType: "court",
        subjectId: selectedCourt.courtId,
        rating: courtRating,
        comment: courtFeedback.trim() || "Trải nghiệm tốt",
      });

      await reviewClient.createReview(reviewRequest);

      // Show success animation
      setReviewSuccess(true);

      // Reset after delay
      setTimeout(() => {
        setCourtReviewModalVisible(false);
        setReviewSuccess(false);
        setCourtRating(0);
        setCourtFeedback("");
        message.success("Cảm ơn bạn đã đánh giá sân!");
      }, 2000);
    } catch (error) {
      console.error("Error submitting court review:", error);
      message.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setReviewLoading(false);
    }
  };
  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await courtClient.getBookingById(id);

        if (response) {
          setBooking(response);
          // Initialize payment amount with full remaining balance
          if (response.remainingBalance) {
            setPaymentAmount(response.remainingBalance);
          }
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        message.error("Failed to load booking details");
        navigate("/user/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  // Function to handle cancellation
  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      message.warning("Vui lòng cung cấp lý do hủy bỏ.");
      return;
    }

    try {
      await courtClient.cancelBooking(id, {
        cancellationReason: cancellationReason,
        requestedAt: new Date(),
      });

      message.success("Đặt lịch đã được hủy thành công!");
      setCancelModalVisible(false);

      // Refresh booking data
      const updatedBooking = await courtClient.getBookingById(id);
      setBooking(updatedBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("Hủy đặt lịch không thành công. Vui lòng thử lại.");
    }
  };

  // Function to handle submitting a review
  const handleSubmitReview = () => {
    if (!rating) {
      message.warning("Vui lòng chọn đánh giá.");
      return;
    }

    // Call the API to submit review (not implemented in the current API)
    // For now, just show a success message
    console.log("Review Submitted:", { courtId: booking.id, rating, feedback });
    message.success("Cảm ơn vì phản hồi của bạn!");
    setReviewModalVisible(false);
  };

  // New function to handle additional payment
  const handleAdditionalPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      message.warning("Vui lòng nhập số tiền thanh toán hợp lệ.");
      return;
    }

    if (paymentAmount > booking.remainingBalance) {
      message.warning("Số tiền thanh toán không thể vượt quá số dư còn lại.");
      return;
    }

    try {
      setPaymentLoading(true);

      // Create payment request
      const paymentRequest = new ProcessPaymentRequest({
        amount: paymentAmount,
        description: "Thanh toán bổ sung cho đặt sân",
        paymentType: "CourtBookingAdditional",
        bookingId: booking.id,
        referenceId: booking.id,
        status: booking.status,
      });

      // Process payment
      const response = await paymentClient.processBookingPayment(
        paymentRequest
      );

      // Show success message
      message.success("Thanh toán bổ sung thành công!");
      setPaymentSuccess(true);

      // Refresh booking data after a short delay
      setTimeout(async () => {
        const updatedBooking = await courtClient.getBookingById(id);
        setBooking(updatedBooking);
        setPaymentModalVisible(false);
        setPaymentSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("Thanh toán không thành công. Vui lòng thử lại.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Function to handle payment amount change
  const handlePaymentAmountChange = (value) => {
    // Ensure payment amount doesn't exceed remaining balance
    if (value > booking.remainingBalance) {
      value = booking.remainingBalance;
    }
    if (value < 0) {
      value = 0;
    }
    setPaymentAmount(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Đang tải thông tin lịch đặt..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <Empty description="Booking not found" style={{ margin: "50px 0" }}>
        <Button type="primary" onClick={() => navigate("/user/bookings")}>
          Quay trở lại
        </Button>
      </Empty>
    );
  }

  const formattedStatus = statusMap[booking.status] || booking.status;
  const paymentPercentage = booking.totalPrice
    ? Math.round(
        ((booking.totalPrice - booking.remainingBalance) / booking.totalPrice) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto p-4">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeftOutlined
              onClick={() => navigate("/user/bookings")}
              style={{ cursor: "pointer" }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Thông tin lịch đặt
            </Title>
          </div>
        }
        className="shadow-lg rounded-lg"
        extra={
          <>
            {(formattedStatus === "Pending" ||
              formattedStatus === "Confirmed") && (
              <Space>
                {booking.remainingBalance > 0 && (
                  <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={() => setPaymentModalVisible(true)}
                    style={{
                      marginRight: 8,
                      background:
                        "linear-gradient(45deg, #36D1DC 0%, #5B86E5 100%)",
                    }}
                  >
                    Thanh toán bổ sung
                  </Button>
                )}
                <Button
                  type="primary"
                  danger
                  onClick={() => setCancelModalVisible(true)}
                >
                  Hủy đặt lịch
                </Button>
              </Space>
            )}
          </>
        }
      >
        <Row gutter={[24, 24]}>
          {/* Booking Status */}
          <Col span={24}>
            <div className="text-center mb-4">
              <Tag
                color={statusColors[formattedStatus] || "default"}
                style={{ padding: "4px 12px", fontSize: "16px" }}
              >
                {formattedStatus}
              </Tag>
            </div>
          </Col>

          {/* Payment Progress Bar */}
          {booking.remainingBalance > 0 && (
            <Col span={24}>
              <Card
                className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                style={{ borderRadius: 12 }}
              >
                <div className="mb-2 flex justify-between items-center">
                  <Text strong>Trạng thái thanh toán:</Text>
                  <Text>{paymentPercentage}% đã thanh toán</Text>
                </div>
                <Progress
                  percent={paymentPercentage}
                  status="active"
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                <div className="mt-3 flex justify-between items-center">
                  <Text type="secondary">
                    Đã thanh toán:{" "}
                    {(
                      booking.totalPrice - booking.remainingBalance
                    ).toLocaleString()}{" "}
                    VND
                  </Text>
                  <Text type="secondary">
                    Tổng: {booking.totalPrice.toLocaleString()} VND
                  </Text>
                </div>
              </Card>
            </Col>
          )}

          {/* Booking Summary */}
          <Col xs={24} md={12}>
            <Title level={5} className="mb-3">
              <CalendarOutlined /> Thông tin đặt lịch
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="ID đặt lịch">
                {booking.id}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {booking.bookingDate
                  ? dayjs(booking.bookingDate).format("YYYY-MM-DD")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tạo ngày">
                {booking.createdAt
                  ? dayjs(booking.createdAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng">
                {booking.totalTime || 0} tiếng
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá tiền">
                {booking.totalPrice?.toLocaleString() || 0} VND
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Payment Details */}
          <Col xs={24} md={12}>
            <Title level={5} className="mb-3">
              <CreditCardOutlined /> Thông tin thanh toán
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tiền đặt cọc ban đầu">
                {booking.initialDeposit?.toLocaleString() || 0} VND
              </Descriptions.Item>
              <Descriptions.Item label="Số dư còn lại">
                <div className="flex items-center">
                  {booking.remainingBalance?.toLocaleString() || 0} VND
                  {booking.remainingBalance > 0 && (
                    <Button
                      type="link"
                      size="small"
                      icon={<DollarOutlined />}
                      onClick={() => setPaymentModalVisible(true)}
                    >
                      Thanh toán
                    </Button>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={booking.remainingBalance > 0 ? "orange" : "green"}>
                  {booking.remainingBalance > 0
                    ? "Đã thanh toán một phần"
                    : "Đã thanh toán đầy đủ"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
        {/* Court Details */}
        <Title level={5} className="mb-3">
          <EnvironmentOutlined /> Thông tin sân
        </Title>
        {booking.bookingDetails && booking.bookingDetails.length > 0 ? (
          <Row gutter={[16, 16]}>
            {booking.bookingDetails.map((detail, index) => (
              <Col xs={24} md={12} key={detail.id || index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    size="small"
                    title={
                      <div className="flex justify-between items-center">
                        <span>
                          {detail.courtName || `Đặt sân ${index + 1}`}
                        </span>
                        {/* Only show review button for completed bookings */}
                        {formattedStatus === "Completed" && (
                          <Button
                            type="primary"
                            shape="round"
                            size="small"
                            icon={<CommentOutlined />}
                            onClick={() => {
                              setSelectedCourt(detail);
                              setCourtReviewModalVisible(true);
                            }}
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 border-0 hover:from-blue-500 hover:to-cyan-500"
                          >
                            Đánh giá
                          </Button>
                        )}
                      </div>
                    }
                    style={{
                      marginBottom: 16,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                    }}
                    className="hover:shadow-lg transition-shadow duration-300"
                    bodyStyle={{ padding: "16px" }}
                  >
                    <Descriptions column={1} size="small" bordered>
                      <Descriptions.Item label="Trung tâm thể thao">
                        {detail.sportsCenterName || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giờ bắt đầu">
                        {detail.startTime || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giờ kết thúc">
                        {detail.endTime || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá tiền">
                        {detail.totalPrice?.toLocaleString() || 0} VND
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Không có thông tin sân." />
        )}
        {/* Additional Notes */}
        {booking.note && (
          <>
            <Divider />
            <Title level={5} className="mb-3">
              <FileTextOutlined /> Thông tin ghi chú
            </Title>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text>{booking.note}</Text>
            </Card>
          </>
        )}
        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          {formattedStatus === "Completed" && (
            <Button type="primary" onClick={() => setReviewModalVisible(true)}>
              Viết nhận xét
            </Button>
          )}
          <Button onClick={() => navigate("/user/bookings")}>
            Quay trở lại danh sách đặt lịch
          </Button>
        </div>
      </Card>
      {/* Review Modal */}
      <Modal
        title="Đánh giá trải nghiệm của bạn"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReviewModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitReview}>
            Đánh giá
          </Button>,
        ]}
      >
        <div className="mb-4">
          <Text>How was your experience?</Text>
          <div className="mt-2">
            <Rate value={rating} onChange={setRating} />
          </div>
        </div>
        <div>
          <Text>Đánh giá thêm (Tùy ý):</Text>
          <TextArea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Chia sẻ cảm nghĩ của bạn..."
          />
        </div>
      </Modal>
      {/* Cancel Booking Modal */}
      <Modal
        title="Hủy đặt lịch"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCancelModalVisible(false)}>
            Quay trở lại
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleCancelBooking}
          >
            Xác nhận hủy
          </Button>,
        ]}
      >
        <div className="mb-4">
          <p>
            Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này không thể
            hoàn tác.
          </p>
          <p className="text-red-500">
            Lưu ý: Việc hủy có thể bị tính phí tùy theo chính sách hủy đặt lịch.
          </p>
        </div>
        <div className="mb-4">
          <Text>Vui lòng cung cấp lý do hủy bỏ:</Text>
          <TextArea
            rows={4}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Lý do hủy bỏ..."
            required
          />
        </div>
      </Modal>
      {/* Additional Payment Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CreditCardOutlined style={{ color: "#1890ff" }} />
            <span>Thanh toán bổ sung</span>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => {
          if (!paymentLoading) {
            setPaymentModalVisible(false);
            setPaymentSuccess(false);
          }
        }}
        footer={
          paymentSuccess
            ? [
                <Button
                  key="close"
                  type="primary"
                  onClick={() => {
                    setPaymentModalVisible(false);
                    setPaymentSuccess(false);
                  }}
                >
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="back"
                  onClick={() => setPaymentModalVisible(false)}
                  disabled={paymentLoading}
                >
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={paymentLoading}
                  onClick={handleAdditionalPayment}
                >
                  Xác nhận thanh toán
                </Button>,
              ]
        }
        width={550}
        className="payment-modal"
      >
        {paymentSuccess ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <CheckCircleOutlined style={{ fontSize: 60, color: "#52c41a" }} />
            </div>
            <Title level={4}>Thanh toán thành công!</Title>
            <Text>Cảm ơn bạn đã thanh toán. Hóa đơn đã được cập nhật.</Text>
          </div>
        ) : (
          <div className="payment-content">
            <PaymentInfoCard elevation={2}>
              <MuiTypography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin thanh toán
              </MuiTypography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <MuiTypography variant="body2">
                  Số tiền đã đặt cọc:
                </MuiTypography>
                <MuiTypography variant="body2" fontWeight="medium">
                  {booking.initialDeposit?.toLocaleString()} VND
                </MuiTypography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <MuiTypography variant="body2">Tổng số tiền:</MuiTypography>
                <MuiTypography variant="body2" fontWeight="medium">
                  {booking.totalPrice?.toLocaleString()} VND
                </MuiTypography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <MuiTypography variant="body2" fontWeight="bold" color="error">
                  Số tiền còn lại:
                </MuiTypography>
                <MuiTypography variant="body2" fontWeight="bold" color="error">
                  {booking.remainingBalance?.toLocaleString()} VND
                </MuiTypography>
              </Box>
            </PaymentInfoCard>

            <PaymentProgress>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <MuiTypography variant="body2">
                    Tiến độ thanh toán
                  </MuiTypography>
                  <Chip
                    label={`${paymentPercentage}%`}
                    size="small"
                    color={paymentPercentage >= 100 ? "success" : "primary"}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={paymentPercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </PaymentProgress>

            <div className="mb-6">
              <Text strong className="block mb-2">
                Số tiền thanh toán:
              </Text>
              <div className="flex items-center">
                <Slider
                  min={0}
                  max={booking.remainingBalance}
                  onChange={handlePaymentAmountChange}
                  value={typeof paymentAmount === "number" ? paymentAmount : 0}
                  step={1000}
                  className="mr-4 flex-1"
                  tipFormatter={(value) => `${value.toLocaleString()} VND`}
                  marks={{
                    0: "0",
                    [booking.remainingBalance]: "Đủ",
                  }}
                />
                <InputNumber
                  min={0}
                  max={booking.remainingBalance}
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: 120 }}
                  addonAfter="VND"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                type="default"
                onClick={() => setPaymentAmount(booking.remainingBalance)}
                icon={<CreditCardOutlined />}
              >
                Thanh toán đủ
              </Button>
              <Button
                type="default"
                onClick={() =>
                  setPaymentAmount(Math.round(booking.remainingBalance / 2))
                }
                icon={<WalletOutlined />}
              >
                Thanh toán một nửa
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Court Review Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {reviewSuccess ? (
              <SmileOutlined style={{ color: "#52c41a" }} />
            ) : (
              <StarFilled style={{ color: "#faad14" }} />
            )}
            <span>
              {reviewSuccess
                ? "Đánh giá thành công!"
                : `Đánh giá sân ${selectedCourt?.courtName || ""}`}
            </span>
          </div>
        }
        open={courtReviewModalVisible}
        onCancel={() => {
          if (!reviewLoading) {
            setCourtReviewModalVisible(false);
            setReviewSuccess(false);
            setCourtRating(0);
            setCourtFeedback("");
          }
        }}
        footer={
          reviewSuccess
            ? [
                <Button
                  key="close"
                  type="primary"
                  onClick={() => {
                    setCourtReviewModalVisible(false);
                    setReviewSuccess(false);
                    setCourtRating(0);
                    setCourtFeedback("");
                  }}
                >
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="back"
                  onClick={() => setCourtReviewModalVisible(false)}
                  disabled={reviewLoading}
                >
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={reviewLoading}
                  onClick={handleCourtReviewSubmit}
                  icon={<SendOutlined />}
                  disabled={!courtRating}
                >
                  Gửi đánh giá
                </Button>,
              ]
        }
        width={500}
        className="court-review-modal"
        centered
      >
        {reviewSuccess ? (
          <div className="text-center py-6">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: confettiAnimation,
              }}
              height={200}
              width={200}
            />
            <Title level={4} className="mb-2">
              Cảm ơn bạn đã đánh giá!
            </Title>
            <Text>
              Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn.
            </Text>
          </div>
        ) : (
          <div className="review-content">
            <div className="mb-6">
              <div className="mb-2 flex items-center">
                <Text strong className="mr-3">
                  Đánh giá trải nghiệm của bạn:
                </Text>
                <div className="flex items-center">
                  {courtRating > 0 && (
                    <Text className="mr-2" type="secondary">
                      {courtRating}/5
                    </Text>
                  )}
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <Rate
                  value={courtRating}
                  onChange={setCourtRating}
                  className="text-2xl"
                  style={{ fontSize: "32px" }}
                />
              </div>

              <div className="rating-labels flex justify-between text-xs text-gray-500 px-2">
                <span>Rất tệ</span>
                <span>Tệ</span>
                <span>Bình thường</span>
                <span>Tốt</span>
                <span>Rất tốt</span>
              </div>
            </div>

            <div className="mb-4">
              <Text strong className="block mb-2">
                Chi tiết đánh giá (Tùy chọn):
              </Text>
              <TextArea
                rows={4}
                value={courtFeedback}
                onChange={(e) => setCourtFeedback(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn với sân này..."
                maxLength={500}
                showCount
                className="transition-all focus:border-blue-400 hover:border-blue-300"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 flex items-start mb-3">
              <InfoCircleOutlined className="mr-2 mt-1 flex-shrink-0" />
              <div>
                Đánh giá của bạn sẽ giúp người dùng khác có trải nghiệm tốt hơn
                khi lựa chọn sân. Xin hãy chia sẻ ý kiến trung thực và hữu ích.
              </div>
            </div>

            {selectedCourt && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text strong className="block mb-1 text-gray-700">
                  Thông tin sân đánh giá:
                </Text>
                <div className="text-sm text-gray-600">
                  <div>Sân: {selectedCourt.courtName}</div>
                  <div>Trung tâm: {selectedCourt.sportsCenterName}</div>
                  <div>
                    Thời gian: {selectedCourt.startTime} -{" "}
                    {selectedCourt.endTime}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      <style jsx>{`
        .court-review-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }

        .court-review-modal .ant-modal-header {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
        }

        .court-review-modal .ant-modal-body {
          padding: 24px;
        }

        .rating-labels {
          margin-top: -8px;
          max-width: 330px;
          margin-left: auto;
          margin-right: auto;
        }

        .ant-rate-star {
          transition: transform 0.2s;
        }

        .ant-rate-star:hover {
          transform: scale(1.1);
        }

        /* Fancy animations for the cards */
        .card-container {
          transition: all 0.3s ease;
        }

        .card-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UserBookingDetailView;
