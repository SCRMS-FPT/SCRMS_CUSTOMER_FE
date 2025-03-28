import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Divider,
  Tag,
  Timeline,
  Row,
  Col,
  Descriptions,
  Spin,
  message,
  Select,
  Modal,
  Space,
  Alert,
  Badge,
  Tooltip,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";
import dayjs from "dayjs";
import { Box, Paper, Stepper, Step, StepLabel, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const { Title, Text } = Typography;
const { Option } = Select;

// Status mapping between API values and UI display
const statusMapping = {
  Pending: { text: "Pending", color: "orange", step: 0 },
  PendingPayment: { text: "Pending Payment", color: "gold", step: 0 },
  Deposited: { text: "Deposited", color: "purple", step: 1 },
  Confirmed: { text: "Confirmed", color: "green", step: 1 },
  Completed: { text: "Completed", color: "blue", step: 2 },
  Cancelled: { text: "Cancelled", color: "red", step: -1 },
  PaymentFail: { text: "Payment Failed", color: "volcano", step: -1 },
};

// Status options that court owner can set
const availableStatusOptions = [
  { value: "Confirmed", label: "Confirm Booking" },
  { value: "Completed", label: "Mark as Completed" },
  { value: "Cancelled", label: "Cancel Booking" },
];

const CourtOwnerBookingDetailView = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const client = new Client();

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookingData = await client.getBookingById(bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again.");
        message.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const showStatusUpdateModal = () => {
    setStatusModalVisible(true);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const updateBookingStatus = async () => {
    if (!selectedStatus) {
      message.warning("Please select a status to update to");
      return;
    }

    try {
      setStatusUpdateLoading(true);
      await client.updateBookingStatus(bookingId, {
        status: selectedStatus,
      });

      message.success(
        `Booking status updated to ${
          statusMapping[selectedStatus]?.text || selectedStatus
        }`
      );
      setStatusModalVisible(false);

      // Refresh booking data
      const updatedBooking = await client.getBookingById(bookingId);
      setBooking(updatedBooking);
    } catch (err) {
      console.error("Error updating booking status:", err);
      message.error(
        "Failed to update booking status: " + (err.message || "Unknown error")
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const printBookingDetails = () => {
    window.print();
  };

  const cancelBooking = () => {
    Modal.confirm({
      title: "Cancel Booking",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      okText: "Yes, Cancel Booking",
      cancelText: "No",
      onOk: async () => {
        try {
          await client.cancelBooking(bookingId, {
            cancellationReason: "Cancelled by court owner",
            requestedAt: new Date(),
          });

          message.success("Booking has been cancelled successfully");

          // Refresh booking data
          const updatedBooking = await client.getBookingById(bookingId);
          setBooking(updatedBooking);
        } catch (err) {
          console.error("Error cancelling booking:", err);
          message.error(
            "Failed to cancel booking: " + (err.message || "Unknown error")
          );
        }
      },
    });
  };

  // Format money values
  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString() || 0} VND`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <Card>
        <div className="text-center py-5">
          <InfoCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
          <h3 className="mt-3 text-red-600">{error || "Booking not found"}</h3>
          <Button
            type="primary"
            onClick={() => navigate("/court-owner/bookings")}
            className="mt-3"
          >
            Back to Bookings
          </Button>
        </div>
      </Card>
    );
  }

  // Get current status information
  const statusInfo = statusMapping[booking.status] || {
    text: booking.status || "Unknown",
    color: "default",
    step: 0,
  };

  // Determine available actions based on current status
  const canCancel = [
    "Pending",
    "PendingPayment",
    "Deposited",
    "Confirmed",
  ].includes(booking.status);
  const canUpdateStatus = [
    "Pending",
    "PendingPayment",
    "Deposited",
    "Confirmed",
  ].includes(booking.status);

  // Calculate booking progress step
  const bookingStep = statusInfo.step;
  const isBookingCancelled =
    booking.status === "Cancelled" || booking.status === "PaymentFail";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div className="flex items-center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/court-owner/bookings")}
              style={{ marginRight: 16 }}
            >
              Back to Bookings
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Booking Details
            </Title>
          </div>
        }
        extra={
          <Space>
            <Button icon={<PrinterOutlined />} onClick={printBookingDetails}>
              Print
            </Button>
            {canUpdateStatus && (
              <Button type="primary" onClick={showStatusUpdateModal}>
                Update Status
              </Button>
            )}
            {canCancel && (
              <Button danger onClick={cancelBooking}>
                Cancel Booking
              </Button>
            )}
          </Space>
        }
      >
        {/* Booking Status Banner */}
        <div className="mb-6">
          <Box
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stepper activeStep={bookingStep} alternativeLabel>
              <Step
                completed={[
                  "Pending",
                  "PendingPayment",
                  "Deposited",
                  "Confirmed",
                  "Completed",
                ].includes(booking.status)}
              >
                <StepLabel error={isBookingCancelled}>
                  <Typography variant="body2" fontWeight={500}>
                    Reserved
                  </Typography>
                </StepLabel>
              </Step>
              <Step
                completed={["Confirmed", "Completed"].includes(booking.status)}
              >
                <StepLabel error={isBookingCancelled}>
                  <Typography variant="body2" fontWeight={500}>
                    Confirmed
                  </Typography>
                </StepLabel>
              </Step>
              <Step completed={booking.status === "Completed"}>
                <StepLabel error={isBookingCancelled}>
                  <Typography variant="body2" fontWeight={500}>
                    Completed
                  </Typography>
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        </div>

        {/* Main Booking Information */}
        <Row gutter={[24, 24]}>
          {/* Booking Summary */}
          <Col xs={24} lg={16}>
            <Card
              title="Booking Summary"
              bordered={false}
              className="shadow-sm"
            >
              <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                <Descriptions.Item label="Booking ID" span={2}>
                  <Text copyable>{booking.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  {dayjs(booking.bookingDate).format("MMMM D, YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Created On" span={2}>
                  {dayjs(booking.createdAt).format("MMMM D, YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Notes" span={2}>
                  {booking.note || "No notes provided"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Payment Information */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <span>
                  <CreditCardOutlined /> Payment Information
                </span>
              }
              bordered={false}
              className="shadow-sm"
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Statistic
                  title="Total Price"
                  value={formatCurrency(booking.totalPrice)}
                  valueStyle={{
                    color: theme.palette.success.main,
                    fontWeight: "bold",
                  }}
                />
                <Divider style={{ margin: "12px 0" }} />
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Initial Deposit">
                    {formatCurrency(booking.initialDeposit)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Remaining Balance">
                    {formatCurrency(booking.remainingBalance)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Time">
                    {booking.totalTime} minutes
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Booked Courts */}
        <div className="mt-6">
          <Card title="Booked Courts" bordered={false} className="shadow-sm">
            {booking.bookingDetails && booking.bookingDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Court
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sports Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Slot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.bookingDetails.map((detail, index) => {
                      const startTime = dayjs(`2000-01-01T${detail.startTime}`);
                      const endTime = dayjs(`2000-01-01T${detail.endTime}`);
                      const duration = endTime.diff(startTime, "minute");

                      return (
                        <tr
                          key={detail.id || index}
                          className={index % 2 === 0 ? "" : "bg-gray-50"}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {detail.courtName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {detail.sportsCenterName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {startTime.format("HH:mm")} -{" "}
                              {endTime.format("HH:mm")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {duration} minutes
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(detail.totalPrice)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty description="No court details available" />
            )}
          </Card>
        </div>

        {/* Customer Information Section */}
        <div className="mt-6">
          <Card
            title={
              <span>
                <UserOutlined /> Customer Information
              </span>
            }
            bordered={false}
            className="shadow-sm"
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Card bordered={false} className="bg-gray-50">
                  <Space direction="vertical" size="small">
                    <div className="flex items-center">
                      <UserOutlined className="mr-2 text-blue-500" />
                      <Text strong>Customer ID:</Text>
                    </div>
                    <Text>{booking.userId || "Not available"}</Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="bg-gray-50">
                  <Space direction="vertical" size="small">
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2 text-green-500" />
                      <Text strong>Contact:</Text>
                    </div>
                    <Text>Contact info not available</Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="bg-gray-50">
                  <Space direction="vertical" size="small">
                    <div className="flex items-center">
                      <MailOutlined className="mr-2 text-orange-500" />
                      <Text strong>Email:</Text>
                    </div>
                    <Text>Email not available</Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Card>

      {/* Status Update Modal */}
      <Modal
        title="Update Booking Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={statusUpdateLoading}
            onClick={updateBookingStatus}
          >
            Update Status
          </Button>,
        ]}
      >
        <div className="py-4">
          <Alert
            message="Current Status"
            description={
              <Tag color={statusInfo.color} style={{ marginTop: 8 }}>
                {statusInfo.text}
              </Tag>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div className="mb-4">
            <Text strong>Select New Status:</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              placeholder="Select new status"
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              {availableStatusOptions.map((option) => {
                // Skip option if it's the current status
                if (option.value === booking.status) return null;

                return (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                );
              })}
            </Select>
          </div>

          <Alert
            message="Note"
            description="Changing the booking status will notify the customer. Please ensure this action is correct."
            type="warning"
            showIcon
          />
        </div>
      </Modal>
    </motion.div>
  );
};

export default CourtOwnerBookingDetailView;
