import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client as CoachClient } from "../../API/CoachApi";
import { Client as CourtClient } from "../../API/CourtApi";
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
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Box, Paper } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const { Title, Text, Paragraph } = Typography;

const UserCoachBookingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [coach, setCoach] = useState(null);
  const [sport, setSport] = useState(null);
  const [error, setError] = useState(null);

  const coachClient = new CoachClient();
  const courtClient = new CourtClient();

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
        setError("Failed to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id]);

  const handleCancelBooking = () => {
    Modal.confirm({
      title: "Are you sure you want to cancel this booking?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Cancellation may be subject to the coach's cancellation policy.",
      okText: "Yes, Cancel Booking",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await coachClient.updateBookingStatus(id, "CANCELLED");
          Modal.success({
            title: "Booking Cancelled",
            content: "Your booking has been successfully cancelled.",
            onOk: () => {
              // Refresh the booking data
              window.location.reload();
            },
          });
        } catch (error) {
          Modal.error({
            title: "Cancellation Failed",
            content: "Could not cancel your booking. Please try again later.",
          });
        }
      },
    });
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
        <Spin size="large" tip="Loading booking details..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Booking"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }

  if (!booking) {
    return (
      <Result
        status="404"
        title="Booking Not Found"
        subTitle="Sorry, the booking you're looking for doesn't exist."
        extra={
          <Button type="primary" onClick={() => navigate("/user/coachings")}>
            Back to Bookings
          </Button>
        }
      />
    );
  }

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

    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{ padding: "4px 8px", fontSize: "14px" }}
      >
        {status.toUpperCase()}
      </Tag>
    );
  };

  // Calculate duration in hours and minutes
  const calculateDuration = () => {
    if (!booking.startTime || !booking.endTime) return "N/A";

    const [startHour, startMinute] = booking.startTime.split(":").map(Number);
    const [endHour, endMinute] = booking.endTime.split(":").map(Number);

    let durationMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight sessions

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return hours > 0
      ? `${hours} hour${hours > 1 ? "s" : ""}${
          minutes > 0 ? ` ${minutes} min${minutes > 1 ? "s" : ""}` : ""
        }`
      : `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  // Can the user cancel this booking?
  const canCancel = () => {
    const statusLower = booking.status.toLowerCase();
    const isPending = statusLower === "pending";
    const isConfirmed = statusLower === "confirmed";
    const isFuture = dayjs(booking.bookingDate).isAfter(dayjs(), "day");

    return (isPending || isConfirmed) && isFuture;
  };

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
          Booking Details
        </Title>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Back to Bookings
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
                  Session Details
                </Title>
              </Box>
              {getStatusTag(booking.status)}
            </Box>

            <Box sx={{ p: 3 }}>
              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Date" span={2}>
                  <Text strong>
                    {dayjs(booking.bookingDate).format("dddd, MMMM D, YYYY")}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Time">
                  <Text strong>
                    {booking.startTime} - {booking.endTime}
                  </Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({calculateDuration()})
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Sport" span={2}> 
                  {sport ? sport.name : booking.sportId}
                </Descriptions.Item>
                <Descriptions.Item label="Total Price" span={2}>
                  <Text
                    strong
                    style={{ fontSize: 16, color: theme.palette.success.main }}
                  >
                    ${booking.totalPrice?.toLocaleString()}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Package" span={2}>
                  {booking.packageName || "Single Session"}
                </Descriptions.Item>
                <Descriptions.Item label="Booking ID" span={2}>
                  <Text type="secondary" copyable>
                    {booking.id}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                {canCancel() && (
                  <Button
                    danger
                    type="primary"
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
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
              <Title level={4}>Booking Timeline</Title>
            </Box>

            <Timeline>
              <Timeline.Item color="green">
                <Text strong>Booking Created</Text>
                <div>
                  {dayjs(booking.createdAt || new Date()).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </div>
              </Timeline.Item>
              {booking.status.toLowerCase() !== "pending" && (
                <Timeline.Item color="blue">
                  <Text strong>Booking Confirmed</Text>
                  <div>Coach accepted your booking request</div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "completed" && (
                <Timeline.Item color="green">
                  <Text strong>Session Completed</Text>
                  <div>{dayjs(booking.bookingDate).format("MMM D, YYYY")}</div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "cancelled" && (
                <Timeline.Item color="red">
                  <Text strong>Booking Cancelled</Text>
                  <div>
                    {dayjs(booking.lastModified || new Date()).format(
                      "MMM D, YYYY h:mm A"
                    )}
                  </div>
                </Timeline.Item>
              )}
              {booking.status.toLowerCase() === "pending" && (
                <Timeline.Item color="orange">
                  <Text strong>Awaiting Confirmation</Text>
                  <div>Please wait for the coach to confirm your booking</div>
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
                Coach Information
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
                    $
                    {coach?.ratePerHour?.toLocaleString() ||
                      booking.totalPrice?.toLocaleString()}{" "}
                    per hour
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
                  View Coach Profile
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
            <Title level={4}>Booking Summary</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Session Length"
                  value={calculateDuration()}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Price"
                  value={booking.totalPrice?.toLocaleString()}
                  prefix="$"
                  precision={2}
                />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

export default UserCoachBookingDetailView;
