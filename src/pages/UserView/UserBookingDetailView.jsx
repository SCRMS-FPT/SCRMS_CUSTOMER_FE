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
} from "@ant-design/icons";
import { Client } from "../../API/CourtApi";
import dayjs from "dayjs";

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

  const courtClient = new Client();

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await courtClient.getBookingById(id);

        if (response) {
          setBooking(response);
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
          (formattedStatus === "Pending" ||
            formattedStatus === "Confirmed") && (
            <Button
              type="primary"
              danger
              onClick={() => setCancelModalVisible(true)}
            >
              Hủy đặt lịch
            </Button>
          )
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
                {booking.remainingBalance?.toLocaleString() || 0} VND
              </Descriptions.Item>
              {/* Additional payment fields can be added here when API provides them */}
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
                <Card
                  size="small"
                  title={detail.courtName || `Đặt sân ${index + 1}`}
                  style={{ marginBottom: 16 }}
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
            Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này không thể hoàn tác.
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
    </div>
  );
};

export default UserBookingDetailView;
