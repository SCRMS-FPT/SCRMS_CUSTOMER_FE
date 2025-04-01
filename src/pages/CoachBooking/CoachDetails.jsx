import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Tabs,
  Tag,
  Button,
  Spin,
  Empty,
  message,
  Calendar,
  Badge,
  Rate,
  Collapse,
  List,
  DatePicker,
  Tooltip as AntTooltip,
  Divider,
  Image,
  Typography as AntTypography,
  Space,
  Modal,
  Select,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
  BookOutlined,
  LeftOutlined,
  TagOutlined,
  PercentageOutlined,
  InfoCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Container,
  LinearProgress,
  Stack,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  SportsTennis,
  SportsBasketball,
  DirectionsRun,
  Verified,
  Event,
  EventAvailable,
  EventBusy,
} from "@mui/icons-material";
import { Client } from "@/API/CoachApi";
import {
  Client as PaymentClient,
  ProcessPaymentRequest,
} from "../../API/PaymentApi";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(weekday);

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Text, Paragraph } = AntTypography;

// Add these styled component definitions after the imports and before the component definitions

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 300,
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  marginBottom: theme.spacing(4),
  display: "flex",
  alignItems: "flex-end",
}));

const HeroOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75))",
  zIndex: 1,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  padding: theme.spacing(3),
  width: "100%",
  color: "white",
}));

const TimeSlotCard = styled(Card)(({ theme, selected, available }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  cursor: available ? "pointer" : "default",
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : "1px solid #f0f0f0",
  backgroundColor: !available
    ? alpha("#f5f5f5", 0.6)
    : selected
      ? alpha(theme.palette.primary.main, 0.1)
      : "white",
  transition: "all 0.2s",
  "&:hover": {
    transform: available ? "translateY(-3px)" : "none",
    boxShadow: available ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
  },
}));

// Sport icon component
const SportIcon = ({ sport }) => {
  switch (sport?.toLowerCase()) {
    case "tennis":
      return <SportsTennis />;
    case "basketball":
      return <SportsBasketball />;
    default:
      return <DirectionsRun />;
  }
};

// Helper function to format price
const formatPrice = (price) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return "";
  return dayjs(`2000-01-01T${timeString}`).format("HH:mm");
};

// Helper function to get day name
const getDayName = (day) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[(day - 1) % 7];
};

const CoachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // State variables
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // API client
  const client = new Client();
  const paymentClient = new PaymentClient();

  // Fetch coach data
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);

        // Fetch coach details
        const coachData = await client.getCoachById(id);
        setCoach(coachData);

        // Fetch coach schedules
        const startDate = dayjs().format("YYYY-MM-DD");
        const endDate = dayjs().add(30, "day").format("YYYY-MM-DD");

        const schedulesData = await client.getPublicCoachSchedules(
          id,
          startDate,
          endDate,
          1,
          100
        );

        console.log("Schedules data:", schedulesData);
        setSchedules(schedulesData.schedules || []);

        // Fetch coach promotions
        const promotionsData = await client.getAllPromotion(id, 1, 20);
        setPromotions(promotionsData || []);

        // Fetch reviews (mock data for now)
        setReviews([
          {
            id: 1,
            author: "John Smith",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 5,
            content:
              "Excellent coach! Very professional and knowledgeable. Helped me improve my technique significantly.",
            date: "2023-11-15",
          },
          {
            id: 2,
            author: "Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 4.5,
            content:
              "Great coaching sessions. Very patient and attentive to details. I'd definitely recommend.",
            date: "2023-10-28",
          },
          {
            id: 3,
            author: "Michael Chen",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
            rating: 5,
            content:
              "Amazing experience! The coach is very skilled and creates personalized training plans.",
            date: "2023-10-05",
          },
        ]);
      } catch (err) {
        console.error("Error fetching coach data:", err);
        setError("Failed to load coach information. Please try again later.");
        message.error("Failed to load coach data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoachData();
    }
  }, [id]);

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Handle date change in calendar
  const handleDateChange = (value) => {
    // Convert the Date object to a dayjs object
    setSelectedDate(dayjs(value));
    setSelectedSlot(null);
  };

  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      message.info("Please select a time slot first");
      return;
    }

    // Show confirmation modal
    Modal.confirm({
      title: "Booking Confirmation",
      icon: <BookOutlined style={{ color: theme.palette.primary.main }} />,
      width: 500,
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            You are about to book a session with:
          </Typography>

          <Box
            sx={{
              p: 2,
              mt: 2,
              mb: 3,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.light, 0.1),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={coach.avatar}
                    alt={coach.fullName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="h6">{coach.fullName}</Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Date:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <EventAvailable fontSize="small" color="primary" />
                  {dayjs(selectedSlot.date).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Time:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ClockCircleOutlined
                    style={{ color: theme.palette.primary.main, fontSize: 16 }}
                  />
                  {formatTime(selectedSlot.startTime)} -{" "}
                  {formatTime(selectedSlot.endTime)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Price:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DollarOutlined
                    style={{ color: theme.palette.success.main, fontSize: 16 }}
                  />
                  {formatPrice(coach.ratePerHour)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" color="text.secondary">
            The amount will be deducted from your wallet upon confirmation.
          </Typography>
        </Box>
      ),
      okText: "Confirm Booking",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setBookingInProgress(true);

          // Parse date and time
          const bookingDate = selectedSlot.date;
          const startTime = selectedSlot.startTime;
          const endTime = selectedSlot.endTime;

          // Create booking request with proper time handling
          const bookingRequest = {
            coachId: id,
            sportId: coach.sportIds[0], // Using first sport id
            startTime: `${bookingDate}T${startTime}`,
            endTime: `${bookingDate}T${endTime}`,
          };

          // Step 1: Create the booking
          console.log("Creating booking with:", bookingRequest);
          const bookingResult = await client.createBooking(bookingRequest);

          if (bookingResult && bookingResult.id) {
            console.log("Booking created:", bookingResult);

            // Step 2: Process payment
            const paymentRequest = new ProcessPaymentRequest({
              amount: coach.ratePerHour,
              description: `Booking with ${coach.fullName} on ${dayjs(
                bookingDate
              ).format("YYYY-MM-DD")} at ${formatTime(startTime)}`,
              paymentType: "CoachBooking",
              referenceId: bookingResult.id,
              coachId: id,
              bookingId: bookingResult.id,
              status: "COMPLETED",
            });

            console.log("Processing payment:", paymentRequest);
            const paymentResult = await paymentClient.processBookingPayment(
              paymentRequest
            );

            // Show success message
            message.success(
              "Booking confirmed and payment processed successfully!"
            );

            // Show success modal with details
            Modal.success({
              title: "Booking Successful!",
              content: (
                <div>
                  <p>
                    Your session with {coach.fullName} has been confirmed for:
                  </p>
                  <p>
                    <strong>
                      {dayjs(bookingDate).format("dddd, MMMM D, YYYY")}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      {formatTime(startTime)} - {formatTime(endTime)}
                    </strong>
                  </p>
                  <p>You can view your bookings in your profile.</p>
                </div>
              ),
              onOk: () => {
                // Refresh the schedules to reflect the new booking
                fetchCoachData();
                // Clear selection
                setSelectedSlot(null);
              },
            });
          } else {
            throw new Error("Failed to create booking");
          }
        } catch (error) {
          console.error("Error during booking process:", error);

          // Show appropriate error message
          const errorMessage =
            error.response?.data?.detail ||
            "Failed to complete your booking. Please try again later.";

          Modal.error({
            title: "Booking Failed",
            content: errorMessage,
          });
        } finally {
          setBookingInProgress(false);
        }
      },
    });
  };

  // Check if slot is available on selected date
  const isSlotAvailableOnDate = (slot) => {
    const slotDayOfWeek = slot.dayOfWeek;
    const selectedDayOfWeek = selectedDate.day() === 0 ? 7 : selectedDate.day();
    return slotDayOfWeek === selectedDayOfWeek && !slot.isBooked;
  };

  // Get available slots for selected date
  const getAvailableSlotsForDate = () => {
    return schedules
      .filter((slot) => isSlotAvailableOnDate(slot))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Calendar date cell renderer - to show available slots
  const dateCellRender = (value) => {
    // Convert the Date object to a dayjs object for comparison
    const dateObj = dayjs(value);

    // Can't book in the past
    if (dateObj.isBefore(dayjs(), "day")) {
      return null;
    }

    const dayOfWeek = dateObj.day() === 0 ? 7 : dateObj.day();
    const slotsOnDay = schedules.filter((slot) => slot.dayOfWeek === dayOfWeek);

    if (slotsOnDay.length === 0) {
      return null;
    }

    const availableSlots = slotsOnDay.filter((slot) => !slot.isBooked);

    if (availableSlots.length > 0) {
      return (
        <Badge
          count={availableSlots.length}
          style={{ backgroundColor: theme.palette.success.main }}
        />
      );
    }

    return null;
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <Spin size="large" />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Loading coach information...
          </Typography>
          <LinearProgress sx={{ width: "50%", mt: 2 }} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !coach) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <Empty
            description={error || "Coach not found"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            onClick={() => navigate("/coaches")}
            style={{ marginTop: 16 }}
          >
            Back to Coaches
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back button */}
        <Box sx={{ mb: 2 }}>
          <Button icon={<LeftOutlined />} onClick={() => navigate("/coaches")}>
            Back to Coaches
          </Button>
        </Box>

        {/* Hero Section */}
        <HeroSection
          sx={{
            backgroundImage: `url(${coach.avatar ||
              "https://source.unsplash.com/random/1200x400/?sport"
              })`,
          }}
        >
          <HeroOverlay />
          <HeroContent>
            <Grid container alignItems="flex-end" spacing={2}>
              <Grid item>
                <Avatar
                  src={coach.avatar}
                  alt={coach.fullName}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "4px solid white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
              </Grid>
              <Grid item xs>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {coach.fullName}
                    </Typography>
                    {coach.isVerified && (
                      <Verified
                        sx={{
                          color: "white",
                          fontSize: 24,
                          ml: 1,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Rate
                      allowHalf
                      defaultValue={coach.rating || 4.5}
                      disabled
                    />
                    <Text style={{ color: "white", marginLeft: 8 }}>
                      ({coach.reviewCount || reviews.length} reviews)
                    </Text>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                  >
                    {coach.sportIds?.map((sportId, index) => (
                      <Chip
                        key={sportId}
                        icon={<SportIcon sport={coach.sportName} />}
                        label={coach.sportName || `Sport ${index + 1}`}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.9),
                          color: "white",
                        }}
                      />
                    ))}
                    <Chip
                      icon={<DollarOutlined />}
                      label={formatPrice(coach.ratePerHour)}
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.9),
                        color: "white",
                      }}
                    />
                    {coach.experienceYears && (
                      <Chip
                        icon={<TeamOutlined />}
                        label={`${coach.experienceYears} years experience`}
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.9),
                          color: "white",
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Grid>
              <Grid item>
                <Button
                  type="primary"
                  size="large"
                  icon={<BookOutlined />}
                  onClick={() => {
                    setActiveTab("2");
                    window.scrollTo({ top: 500, behavior: "smooth" });
                  }}
                >
                  Check Availability
                </Button>
              </Grid>
            </Grid>
          </HeroContent>
        </HeroSection>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Content - Tabs */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: theme.shape.borderRadius,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                size="large"
                centered={isMobile}
                tabBarStyle={{
                  padding: "0 16px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                }}
              >
                <TabPane
                  tab={
                    <span>
                      <UserOutlined /> About
                    </span>
                  }
                  key="1"
                >
                  <Box sx={{ p: 3 }}>
                    <Title level={4}>Biography</Title>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                      {coach.bio || "No biography information provided."}
                    </Paragraph>

                    <Divider />

                    {/* Coach's Gallery */}
                    {coach.imageUrls && coach.imageUrls.length > 0 && (
                      <Box sx={{ my: 3 }}>
                        <Title level={4}>Gallery</Title>
                        <Image.PreviewGroup>
                          <Space size={[16, 16]} wrap>
                            {coach.imageUrls.map((img, index) => (
                              <Image
                                key={index}
                                width={150}
                                height={150}
                                src={img}
                                alt={`${coach.fullName} - Gallery image ${index + 1
                                  }`}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                              />
                            ))}
                          </Space>
                        </Image.PreviewGroup>
                      </Box>
                    )}

                    {/* Certifications & Experience */}
                    <Box sx={{ my: 3 }}>
                      <Title level={4}>Qualifications & Experience</Title>
                      <List
                        itemLayout="horizontal"
                        dataSource={
                          coach.certifications || [
                            {
                              title: "Professional Coaching Certificate",
                              description: "National Sports Academy",
                              year: 2020,
                            },
                            {
                              title: "Advanced Training Methodology",
                              description: "International Sports Federation",
                              year: 2018,
                            },
                            {
                              title: "Sports Medicine Foundation",
                              description: "Sports Science Institute",
                              year: 2019,
                            },
                          ]
                        }
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <TrophyOutlined
                                  style={{
                                    fontSize: 28,
                                    color: theme.palette.warning.main,
                                  }}
                                />
                              }
                              title={item.title}
                              description={`${item.description} (${item.year})`}
                            />
                          </List.Item>
                        )}
                      />
                    </Box>

                    {/* Contact Information */}
                    <Box sx={{ my: 3 }}>
                      <Title level={4}>Contact Information</Title>
                      <Grid container spacing={2}>
                        {coach.email && (
                          <Grid item xs={12} sm={6}>
                            <Card
                              size="small"
                              bordered={false}
                              style={{
                                background: alpha(
                                  theme.palette.primary.light,
                                  0.1
                                ),
                              }}
                            >
                              <Space>
                                <MailOutlined
                                  style={{
                                    fontSize: 18,
                                    color: theme.palette.primary.main,
                                  }}
                                />
                                <Text copyable>{coach.email}</Text>
                              </Space>
                            </Card>
                          </Grid>
                        )}
                        {coach.phone && (
                          <Grid item xs={12} sm={6}>
                            <Card
                              size="small"
                              bordered={false}
                              style={{
                                background: alpha(
                                  theme.palette.primary.light,
                                  0.1
                                ),
                              }}
                            >
                              <Space>
                                <PhoneOutlined
                                  style={{
                                    fontSize: 18,
                                    color: theme.palette.primary.main,
                                  }}
                                />
                                <Text copyable>{coach.phone}</Text>
                              </Space>
                            </Card>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <CalendarOutlined /> Schedule
                    </span>
                  }
                  key="2"
                >
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Improved layout with full-width container */}
                    <Grid container spacing={3}>
                      {/* Weekly Schedule Section - Expanded width */}
                      <Grid item xs={12}>
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
                              p: 3,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <Box>
                              <Typography variant="h5" fontWeight="500">
                                Available Time Slots
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Click on an available time slot to book your
                                session
                              </Typography>
                            </Box>
                            <Button
                              type="primary"
                              icon={<CalendarOutlined />}
                              onClick={() => setSelectedDate(dayjs())}
                            >
                              Today
                            </Button>
                          </Box>

                          {/* Week Navigation */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              bgcolor: alpha(theme.palette.primary.light, 0.05),
                            }}
                          >
                            <Button
                              startIcon={<LeftOutlined />}
                              onClick={() => {
                                const newDate = dayjs(selectedDate).subtract(
                                  7,
                                  "day"
                                );
                                setSelectedDate(newDate);
                              }}
                            >
                              Previous Week
                            </Button>
                            <Typography
                              variant="h6"
                              fontWeight="500"
                              sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                              }}
                            >
                              {dayjs(selectedDate)
                                .startOf("week")
                                .format("MMM D")}{" "}
                              -{" "}
                              {dayjs(selectedDate)
                                .endOf("week")
                                .format("MMM D, YYYY")}
                            </Typography>
                            <Button
                              endIcon={
                                <LeftOutlined
                                  style={{ transform: "rotate(180deg)" }}
                                />
                              }
                              onClick={() => {
                                const newDate = dayjs(selectedDate).add(
                                  7,
                                  "day"
                                );
                                setSelectedDate(newDate);
                              }}
                            >
                              Next Week
                            </Button>
                          </Box>

                          {/* Weekly Calendar View */}
                          <Box sx={{ p: 2, overflowX: 'auto' }}> {/* Đã thêm overflowX: 'auto' vào Box cha */}
                            <Grid container spacing={1.5} sx={{ width: 'max-content' }}>
                              {/* Day headers - Без змін */}
                              {[
                                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                              ].map((day, index) => (
                                <Grid item xs={12 / 7} key={day}>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      bgcolor: "primary.main",
                                      color: "primary.contrastText",
                                      borderRadius: "8px 8px 0 0",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                      minWidth: '120px', // Đảm bảo mỗi header có chiều rộng tối thiểu
                                    }}
                                  >
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                      {day}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                      {dayjs(selectedDate).day(index + 1).format("MMM D")}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}

                              {/* Daily slots */}
                              {[
                                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                              ].map((day, index) => {
                                const dayOfWeek = index + 1;
                                const daySchedules = schedules.filter((schedule) => {
                                  const scheduleDate = dayjs(schedule.date);
                                  return scheduleDate.day() === (dayOfWeek === 7 ? 0 : dayOfWeek);
                                });
                                const isToday = dayjs().day() === (dayOfWeek === 7 ? 0 : dayOfWeek);

                                return (
                                  <Grid item xs={12 / 7} key={`slots-${day}`}>
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        height: 300,
                                        p: 1,
                                        overflowY: "auto",
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        borderTop: "none",
                                        bgcolor: isToday
                                          ? alpha(theme.palette.success.light, 0.15)
                                          : alpha(theme.palette.background.paper, 0.8),
                                        borderRadius: "0 0 8px 8px",
                                        transition: "all 0.3s ease",
                                        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                                        minWidth: '250px', // Đảm bảo mỗi container slot có chiều rộng tối thiểu
                                      }}
                                    >
                                      {daySchedules.length === 0 ? (
                                        <Box
                                          sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "text.secondary",
                                            textAlign: 'center', 
                                            p: 1, 
                                          }}
                                        >
                                          <EventBusy sx={{ fontSize: 30, mb: 1, opacity: 0.5 }} /> 
                                          <Typography variant="caption" align="center"> 
                                            No sessions available
                                          </Typography>
                                        </Box>
                                      ) : (
                                        daySchedules.map((slot, slotIndex) => {
                                          const isSelected = selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime;
                                          const isAvailable = slot.status === "available";

                                          return (
                                            <Box
                                              key={`slot-${day}-${slotIndex}`}
                                              sx={{
                                                p: 1.5,
                                                mb: 1.5,
                                                borderRadius: 2,
                                                cursor: isAvailable ? "pointer" : "default",
                                                bgcolor: isSelected
                                                  ? "primary.main"
                                                  : isAvailable
                                                    ? alpha(theme.palette.success.light, 0.3)
                                                    : alpha(theme.palette.grey[300], 0.5),
                                                color: isSelected ? "white" : "text.primary",
                                                border: isSelected
                                                  ? `2px solid ${theme.palette.primary.dark}`
                                                  : "1px solid transparent",
                                                "&:hover": {
                                                  transform: isAvailable ? "translateY(-3px)" : "none",
                                                  boxShadow: isAvailable ? "0 6px 12px rgba(0,0,0,0.1)" : "none",
                                                  bgcolor: isAvailable
                                                    ? isSelected
                                                      ? "primary.dark"
                                                      : alpha(theme.palette.success.main, 0.4)
                                                    : alpha(theme.palette.grey[300], 0.5),
                                                },
                                                transition: "all 0.2s ease",

                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                minHeight: '90px',
                                              }}
                                              onClick={() => {
                                                if (isAvailable) {
                                                  setSelectedSlot(slot);
                                                }
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  width: '100%',
                                                }}
                                              >
                                                <Typography
                                                  variant="body2"
                                                  fontWeight="bold"
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                >
                                                  <ClockCircleOutlined style={{ fontSize: '1rem', flexShrink: 0 }} />
                                                  {`${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`}
                                                </Typography>
                                                {slot.status && (
                                                  <Tag
                                                    color={isAvailable ? "success" : "default"}
                                                    style={{ marginLeft: '4px', flexShrink: 0 }}
                                                  >
                                                    {slot.status.length > 10 ? slot.status.substring(0, 10) + '...' : slot.status}
                                                  </Tag>
                                                )}
                                              </Box>


                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  width: '100%',
                                                  mt: 1,
                                                }}
                                              >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                  <DollarOutlined style={{ fontSize: '1rem', flexShrink: 0 }} />
                                                  <Typography variant="body2">
                                                    {formatPrice(coach.ratePerHour)}
                                                  </Typography>
                                                </Box>
                                                {isAvailable && (
                                                  <Button
                                                    size="small"

                                                    variant={isSelected ? "outlined" : "text"}

                                                    color={isSelected ? "inherit" : "primary"}
                                                    sx={{
                                                      p: '2px 6px',
                                                      minWidth: 'auto',
                                                      lineHeight: 1.2,
                                                      flexShrink: 0,

                                                      ...(isSelected && { color: 'white', borderColor: 'rgba(255,255,255,0.5)' })
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSelectedSlot(slot);
                                                    }}
                                                  >
                                                    {isSelected ? "Selected" : "Select"}
                                                  </Button>
                                                )}
                                              </Box>
                                            </Box>

                                          );
                                        })
                                      )}
                                    </Paper>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Booking Summary Section */}
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            p: 0,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              p: 3,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              bgcolor: alpha(theme.palette.primary.light, 0.05),
                            }}
                          >
                            <Typography variant="h5" fontWeight="500">
                              Booking Summary
                            </Typography>
                          </Box>

                          {selectedSlot ? (
                            <Box sx={{ p: 3 }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                  <Box
                                    sx={{
                                      p: 3,
                                      borderRadius: 2,
                                      border: `1px solid ${theme.palette.divider}`,
                                      bgcolor: alpha(
                                        theme.palette.success.light,
                                        0.05
                                      ),
                                    }}
                                  >
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={6}>
                                        <Typography
                                          variant="subtitle2"
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          Date
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <EventAvailable color="primary" />
                                          {dayjs(selectedSlot.date).format(
                                            "dddd, MMMM D, YYYY"
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography
                                          variant="subtitle2"
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          Time
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <ClockCircleOutlined
                                            style={{
                                              color: theme.palette.primary.main,
                                            }}
                                          />
                                          {formatTime(selectedSlot.startTime)} -{" "}
                                          {formatTime(selectedSlot.endTime)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography
                                          variant="subtitle2"
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          Price
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <DollarOutlined
                                            style={{
                                              color: theme.palette.success.main,
                                            }}
                                          />
                                          {formatPrice(coach.ratePerHour)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography
                                          variant="subtitle2"
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          Coach
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <UserOutlined
                                            style={{
                                              color: theme.palette.info.main,
                                            }}
                                          />
                                          {coach.fullName}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Box
                                    sx={{
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Button
                                      type="primary"
                                      icon={<BookOutlined />}
                                      size="large"
                                      onClick={handleBookNow}
                                      loading={bookingInProgress}
                                      disabled={bookingInProgress}
                                      block
                                      style={{
                                        height: "auto",
                                        padding: "12px 16px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          fontSize: 16,
                                          fontWeight: "bold",
                                          py: 0.5,
                                        }}
                                      >
                                        {bookingInProgress
                                          ? "Processing..."
                                          : "Book Session Now"}
                                      </Box>
                                    </Button>
                                    <Typography
                                      variant="caption"
                                      align="center"
                                      sx={{ mt: 1, color: "text.secondary" }}
                                    >
                                      Your schedule will be confirmed after
                                      booking
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                p: 5,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <EventBusy
                                sx={{
                                  fontSize: 64,
                                  color: "text.disabled",
                                  mb: 2,
                                }}
                              />
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                align="center"
                              >
                                Please select an available time slot from the
                                calendar
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.disabled"
                                align="center"
                                sx={{ mt: 1 }}
                              >
                                The booking summary will appear here once you
                                select a slot
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPane>

                {/* Other TabPanes remain the same */}
                <TabPane
                  tab={
                    <span>
                      <PercentageOutlined /> Promotions
                    </span>
                  }
                  key="3"
                >
                  {/* Content for promotions tab */}
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <StarOutlined /> Reviews
                    </span>
                  }
                  key="4"
                >
                  {/* Content for reviews tab */}
                </TabPane>
              </Tabs>
            </Paper>
          </Grid>

          {/* Right sidebar */}
          <Grid item xs={12} md={4}>
            {/* Quick booking card and other sidebar content */}
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default CoachDetails;
