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
  Tooltip,
  Divider,
  Image,
  Typography as AntTypography,
  Space,
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  height: "100%",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
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

  // API client
  const client = new Client();

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
  const handleDateChange = (date) => {
    setSelectedDate(dayjs(date));
    setSelectedSlot(null);
  };

  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  // Handle booking button click
  const handleBookNow = () => {
    if (selectedSlot) {
      navigate(
        `/coaches/${id}/book?slot=${selectedSlot.id}&date=${selectedDate.format(
          "YYYY-MM-DD"
        )}`
      );
    } else {
      message.info("Please select a time slot first");
    }
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
  const dateCellRender = (date) => {
    const dateObj = dayjs(date);
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
            backgroundImage: `url(${
              coach.avatar ||
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
                                alt={`${coach.fullName} - Gallery image ${
                                  index + 1
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
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Calendar Column */}
                      <Grid item xs={12} md={7}>
                        <Title level={4}>Select a Date</Title>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                          }}
                        >
                          <Calendar
                            fullscreen={false}
                            value={selectedDate.toDate()}
                            onChange={handleDateChange}
                            dateCellRender={dateCellRender}
                            disabledDate={(current) => {
                              return (
                                current && current < dayjs().startOf("day")
                              );
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Time Slots Column */}
                      <Grid item xs={12} md={5}>
                        <Title level={4}>Available Time Slots</Title>
                        <Box sx={{ mt: 2 }}>
                          <Card
                            title={
                              <Space>
                                <EventAvailable
                                  style={{ color: theme.palette.primary.main }}
                                />
                                {selectedDate.format("dddd, MMMM D, YYYY")}
                              </Space>
                            }
                            size="small"
                            style={{ marginBottom: 16 }}
                          >
                            {getAvailableSlotsForDate().length === 0 ? (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No available time slots on this day"
                              />
                            ) : (
                              <List
                                dataSource={getAvailableSlotsForDate()}
                                renderItem={(slot) => (
                                  <TimeSlotCard
                                    selected={selectedSlot?.id === slot.id}
                                    available={!slot.isBooked}
                                    bodyStyle={{ padding: "12px 16px" }}
                                    onClick={() => handleSlotSelect(slot)}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Space>
                                        <ClockCircleOutlined
                                          style={{
                                            color: theme.palette.primary.main,
                                          }}
                                        />
                                        <Text strong>
                                          {formatTime(slot.startTime)} -{" "}
                                          {formatTime(slot.endTime)}
                                        </Text>
                                      </Space>
                                      {slot.isBooked ? (
                                        <Tag color="error">Booked</Tag>
                                      ) : (
                                        <Tag color="success">Available</Tag>
                                      )}
                                    </Box>
                                  </TimeSlotCard>
                                )}
                              />
                            )}

                            <Box sx={{ mt: 3, textAlign: "center" }}>
                              <Button
                                type="primary"
                                icon={<BookOutlined />}
                                size="large"
                                disabled={!selectedSlot}
                                onClick={handleBookNow}
                                block
                              >
                                Book Selected Slot
                              </Button>
                            </Box>
                          </Card>

                          <Box sx={{ mt: 3 }}>
                            <Collapse>
                              <Panel header="Regular Weekly Schedule" key="1">
                                <List
                                  size="small"
                                  dataSource={Array.from(
                                    new Set(
                                      schedules.map((slot) => slot.dayOfWeek)
                                    )
                                  )
                                    .sort()
                                    .map((day) => ({
                                      day,
                                      dayName: getDayName(day),
                                      slots: schedules
                                        .filter(
                                          (slot) => slot.dayOfWeek === day
                                        )
                                        .sort((a, b) =>
                                          a.startTime.localeCompare(b.startTime)
                                        ),
                                    }))}
                                  renderItem={(item) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Event
                                            style={{
                                              color: theme.palette.primary.main,
                                            }}
                                          />
                                        }
                                        title={item.dayName}
                                        description={
                                          <Space
                                            direction="vertical"
                                            style={{ width: "100%" }}
                                          >
                                            {item.slots.map((slot, index) => (
                                              <Tag
                                                key={index}
                                                color={
                                                  slot.isBooked
                                                    ? "default"
                                                    : "green"
                                                }
                                              >
                                                {formatTime(slot.startTime)} -{" "}
                                                {formatTime(slot.endTime)}
                                              </Tag>
                                            ))}
                                          </Space>
                                        }
                                      />
                                    </List.Item>
                                  )}
                                />
                              </Panel>
                            </Collapse>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <PercentageOutlined /> Promotions
                    </span>
                  }
                  key="3"
                >
                  <Box sx={{ p: 3 }}>
                    <Title level={4}>Special Offers</Title>
                    {promotions.length === 0 ? (
                      <Empty description="No active promotions available at the moment" />
                    ) : (
                      <List
                        itemLayout="vertical"
                        dataSource={promotions}
                        renderItem={(promo) => (
                          <Card
                            style={{ marginBottom: 16 }}
                            hoverable
                            extra={
                              <Tag color="red" style={{ fontSize: 16 }}>
                                {promo.discountType === "Percentage"
                                  ? `${promo.discountValue}% OFF`
                                  : formatPrice(promo.discountValue) + " OFF"}
                              </Tag>
                            }
                          >
                            <List.Item.Meta
                              avatar={
                                <TagOutlined
                                  style={{
                                    fontSize: 24,
                                    color: theme.palette.error.main,
                                  }}
                                />
                              }
                              title={promo.description}
                              description={
                                <Space direction="vertical">
                                  <Text>
                                    Valid from{" "}
                                    {dayjs(promo.validFrom).format(
                                      "MMM D, YYYY"
                                    )}{" "}
                                    to{" "}
                                    {dayjs(promo.validTo).format("MMM D, YYYY")}
                                  </Text>
                                  <Text type="secondary">
                                    Use this promotion when booking to receive a
                                    discount on your session.
                                  </Text>
                                </Space>
                              }
                            />
                            <Button
                              type="primary"
                              icon={<BookOutlined />}
                              onClick={() => {
                                setActiveTab("2");
                                window.scrollTo({
                                  top: 500,
                                  behavior: "smooth",
                                });
                              }}
                              style={{ marginTop: 16 }}
                            >
                              Book with this promotion
                            </Button>
                          </Card>
                        )}
                      />
                    )}
                  </Box>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <StarOutlined /> Reviews
                    </span>
                  }
                  key="4"
                >
                  <Box sx={{ p: 3 }}>
                    <Title level={4} style={{ marginBottom: 24 }}>
                      Client Reviews
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={coach.rating || 4.5}
                        style={{ marginLeft: 16, fontSize: 18 }}
                      />
                    </Title>

                    {reviews.length === 0 ? (
                      <Empty description="No reviews yet" />
                    ) : (
                      <List
                        itemLayout="vertical"
                        dataSource={reviews}
                        renderItem={(review) => (
                          <Card style={{ marginBottom: 16 }}>
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar src={review.avatar} />}
                                title={
                                  <Space>
                                    <Text strong>{review.author}</Text>
                                    <Rate
                                      disabled
                                      allowHalf
                                      value={review.rating}
                                      style={{ fontSize: 14 }}
                                    />
                                  </Space>
                                }
                                description={dayjs(review.date).format(
                                  "MMMM D, YYYY"
                                )}
                              />
                              <Paragraph style={{ marginTop: 16 }}>
                                {review.content}
                              </Paragraph>
                            </List.Item>
                          </Card>
                        )}
                      />
                    )}
                  </Box>
                </TabPane>
              </Tabs>
            </Paper>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Quick Booking Card */}
            <StyledCard
              title={
                <Space>
                  <BookOutlined style={{ color: theme.palette.primary.main }} />
                  <Text strong>Quick Booking</Text>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Box sx={{ mb: 2 }}>
                <Text type="secondary">Rate per session</Text>
                <Title
                  level={3}
                  style={{ margin: "4px 0", color: theme.palette.success.main }}
                >
                  {formatPrice(coach.ratePerHour)}
                  <Text
                    type="secondary"
                    style={{ fontSize: 14, marginLeft: 4 }}
                  >
                    / hour
                  </Text>
                </Title>
              </Box>

              <Divider style={{ margin: "12px 0" }} />

              <Button
                type="primary"
                block
                size="large"
                icon={<BookOutlined />}
                onClick={() => {
                  setActiveTab("2");
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                style={{ marginBottom: 16 }}
              >
                Check Availability
              </Button>

              <Card
                size="small"
                style={{ background: alpha(theme.palette.info.light, 0.1) }}
              >
                <Space>
                  <InfoCircleOutlined
                    style={{ color: theme.palette.info.main }}
                  />
                  <Text type="secondary">
                    Select a date and time slot to book a session with this
                    coach.
                  </Text>
                </Space>
              </Card>
            </StyledCard>

            {/* Training Packages */}
            {coach.packages && coach.packages.length > 0 && (
              <StyledCard
                title={
                  <Space>
                    <TrophyOutlined
                      style={{ color: theme.palette.warning.main }}
                    />
                    <Text strong>Training Packages</Text>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <List
                  dataSource={coach.packages}
                  renderItem={(pkg) => (
                    <Card
                      size="small"
                      style={{
                        marginBottom: 12,
                        background: alpha(theme.palette.warning.light, 0.1),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Text strong>{pkg.name}</Text>
                          <Text type="secondary" style={{ display: "block" }}>
                            {pkg.sessionCount} sessions
                          </Text>
                          <Text type="secondary" style={{ display: "block" }}>
                            {pkg.description}
                          </Text>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Text
                            strong
                            style={{
                              color: theme.palette.success.main,
                              display: "block",
                            }}
                          >
                            {formatPrice(pkg.price)}
                          </Text>
                          <Text type="secondary" style={{ display: "block" }}>
                            {formatPrice(pkg.price / pkg.sessionCount)} /
                            session
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  )}
                />
              </StyledCard>
            )}

            {/* Contact Options */}
            <StyledCard
              title={
                <Space>
                  <MailOutlined style={{ color: theme.palette.primary.main }} />
                  <Text strong>Contact Options</Text>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {coach.email && (
                  <Button
                    block
                    icon={<MailOutlined />}
                    onClick={() => window.open(`mailto:${coach.email}`)}
                  >
                    Email the Coach
                  </Button>
                )}
                {coach.phone && (
                  <Button
                    block
                    icon={<PhoneOutlined />}
                    onClick={() => window.open(`tel:${coach.phone}`)}
                  >
                    Call the Coach
                  </Button>
                )}
              </Space>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default CoachDetails;
