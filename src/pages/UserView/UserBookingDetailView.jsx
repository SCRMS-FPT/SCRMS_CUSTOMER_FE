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
      message.warning("Please provide a reason for cancellation");
      return;
    }

    try {
      await courtClient.cancelBooking(id, {
        cancellationReason: cancellationReason,
        requestedAt: new Date(),
      });

      message.success("Booking cancelled successfully");
      setCancelModalVisible(false);

      // Refresh booking data
      const updatedBooking = await courtClient.getBookingById(id);
      setBooking(updatedBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("Failed to cancel booking. Please try again.");
    }
  };

  // Function to handle submitting a review
  const handleSubmitReview = () => {
    if (!rating) {
      message.warning("Please select a rating.");
      return;
    }

    // Call the API to submit review (not implemented in the current API)
    // For now, just show a success message
    console.log("Review Submitted:", { courtId: booking.id, rating, feedback });
    message.success("Thank you for your feedback!");
    setReviewModalVisible(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading booking details..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <Empty description="Booking not found" style={{ margin: "50px 0" }}>
        <Button type="primary" onClick={() => navigate("/user/bookings")}>
          Back to Bookings
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
              Booking Details
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
              Cancel Booking
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
              <CalendarOutlined /> Booking Summary
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Booking ID">
                {booking.id}
              </Descriptions.Item>
              <Descriptions.Item label="Booking Date">
                {booking.bookingDate
                  ? dayjs(booking.bookingDate).format("YYYY-MM-DD")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {booking.createdAt
                  ? dayjs(booking.createdAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Time">
                {booking.totalTime || 0} hours
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                {booking.totalPrice?.toLocaleString() || 0} VND
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Payment Details */}
          <Col xs={24} md={12}>
            <Title level={5} className="mb-3">
              <CreditCardOutlined /> Payment Details
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Initial Deposit">
                {booking.initialDeposit?.toLocaleString() || 0} VND
              </Descriptions.Item>
              <Descriptions.Item label="Remaining Balance">
                {booking.remainingBalance?.toLocaleString() || 0} VND
              </Descriptions.Item>
              {/* Additional payment fields can be added here when API provides them */}
              <Descriptions.Item label="Payment Status">
                <Tag color={booking.remainingBalance > 0 ? "orange" : "green"}>
                  {booking.remainingBalance > 0
                    ? "Partially Paid"
                    : "Fully Paid"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        {/* Court Details */}
        <Title level={5} className="mb-3">
          <EnvironmentOutlined /> Court Details
        </Title>

        {booking.bookingDetails && booking.bookingDetails.length > 0 ? (
          <Row gutter={[16, 16]}>
            {booking.bookingDetails.map((detail, index) => (
              <Col xs={24} md={12} key={detail.id || index}>
                <Card
                  size="small"
                  title={detail.courtName || `Court Booking ${index + 1}`}
                  style={{ marginBottom: 16 }}
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Sports Center">
                      {detail.sportsCenterName || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Time">
                      {detail.startTime || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Time">
                      {detail.endTime || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {detail.totalPrice?.toLocaleString() || 0} VND
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No court details available" />
        )}

        {/* Additional Notes */}
        {booking.note && (
          <>
            <Divider />
            <Title level={5} className="mb-3">
              <FileTextOutlined /> Notes
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
              Write Review
            </Button>
          )}
          <Button onClick={() => navigate("/user/bookings")}>
            Back to Bookings
          </Button>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        title="Rate Your Experience"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReviewModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitReview}>
            Submit
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
          <Text>Additional Feedback (optional):</Text>
          <TextArea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
          />
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        title="Cancel Booking"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCancelModalVisible(false)}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleCancelBooking}
          >
            Confirm Cancellation
          </Button>,
        ]}
      >
        <div className="mb-4">
          <p>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
          <p className="text-red-500">
            Note: Cancellation may be subject to fees depending on the
            cancellation policy.
          </p>
        </div>
        <div className="mb-4">
          <Text>Please provide a reason for cancellation:</Text>
          <TextArea
            rows={4}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Reason for cancellation..."
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserBookingDetailView;
