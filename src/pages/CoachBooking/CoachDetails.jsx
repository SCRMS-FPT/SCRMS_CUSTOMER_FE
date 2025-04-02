import React, { useState, useEffect, useRef } from "react";
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
  Skeleton,
  Switch,
  Alert,
  Radio,
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
  ShoppingCartOutlined,
  GiftOutlined,
  UnorderedListOutlined,
  DashboardOutlined,
  FireOutlined,
  ThunderboltOutlined,
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
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import toast from "react-hot-toast";

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

const PackageCard = styled(motion.div)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.07)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  position: "relative",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
  },
}));

const PackageBadge = styled(Badge)(({ bgColor }) => ({
  "& .ant-badge-count": {
    backgroundColor: bgColor || "#1890ff",
    boxShadow: "none",
    padding: "0 10px",
    height: "22px",
    borderRadius: "11px",
    fontWeight: "500",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& .icon": {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1.5),
    fontSize: "16px",
  },
  "& .text": {
    fontSize: "0.875rem",
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
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [purchasingPackage, setPurchasingPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userPurchases, setUserPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [showPurchasedOnly, setShowPurchasedOnly] = useState(false);

  // Add this ref at the component level (with other state variables)
  const selectedPackageRef = useRef(null);

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

  useEffect(() => {
    const fetchCoachPackages = async () => {
      if (!id) return;

      setLoadingPackages(true);
      try {
        // Get coach packages
        const coachPackages = await client.getActivePackages(id);
        setPackages(coachPackages || []);

        // Get user's purchases - add coachId to filter by this coach only
        setLoadingPurchases(true);
        try {
          const purchases = await client.getHistoryPurchase(false, false, id);
          setUserPurchases(purchases || []);
        } catch (err) {
          console.error("Failed to fetch user purchases:", err);
        } finally {
          setLoadingPurchases(false);
        }
      } catch (err) {
        console.error("Failed to fetch coach packages:", err);
        toast.error("Failed to load coach packages");
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchCoachPackages();
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

  // Update the handlePurchasePackage function like this:
  const handlePurchasePackage = (pkg) => {
    // Store package ID in a local variable instead of state
    const packageToSelect = pkg;
    setSelectedPackage(packageToSelect);
    // Create modal content separately
    const modalContent = (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          You are about to purchase the following package:
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
                <Box>
                  <Typography variant="h6">{coach.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageToSelect.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Number of Sessions:
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <UnorderedListOutlined
                  style={{ color: theme.palette.warning.main }}
                />
                {packageToSelect.sessionCount} sessions
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Package Price:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <DollarOutlined style={{ color: theme.palette.success.main }} />
                {formatPrice(packageToSelect.price)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {packageToSelect.description ||
                  "This package will allow you to attend multiple sessions with your coach at a discounted rate."}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body2" color="text.secondary">
          The amount will be deducted from your wallet upon confirmation.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: theme.palette.info.main,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InfoCircleOutlined /> Package sessions remain valid for 30 days from
          purchase.
        </Typography>
      </Box>
    );

    // Show modal with delay to prevent React state update conflicts
    setTimeout(() => {
      Modal.confirm({
        title: "Purchase Package",
        icon: (
          <ShoppingCartOutlined style={{ color: theme.palette.primary.main }} />
        ),
        width: 500,
        content: modalContent,
        okText: "Confirm Purchase",
        cancelText: "Cancel",
        onOk: async () => {
          setPurchasingPackage(true);
          try {
            // Call API to purchase package
            const request = {
              packageId: packageToSelect.id,
            };
            await client.purchasePackage(request);

            // Process payment
            const paymentRequest = {
              amount: packageToSelect.price,
              description: `Package purchase: ${packageToSelect.name}`,
              paymentType: "Package",
              referenceId: packageToSelect.id,
              coachId: id,
              providerId: id, // Add the coach ID as providerId
              packageId: packageToSelect.id,
              status: "Completed",
            };
            await paymentClient.processBookingPayment(paymentRequest);

            // Refresh user's purchases
            const purchases = await client.getHistoryPurchase(false, false, id);
            setUserPurchases(purchases || []);

            toast.success("Package purchased successfully!");

            // You might want to navigate to a success page or show a success modal
            Modal.success({
              title: "Purchase Successful",
              content: (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    You have successfully purchased the {packageToSelect.name}{" "}
                    package.
                  </Typography>
                  <Typography variant="body2">
                    You can now use this package when booking sessions with{" "}
                    {coach.fullName}.
                  </Typography>
                </Box>
              ),
              okText: "Great!",
            });
          } catch (err) {
            console.error("Failed to purchase package:", err);
            const errorMessage =
              err.response?.data?.message ||
              "Failed to purchase package. Please make sure you have sufficient funds in your wallet.";
            toast.error(errorMessage);

            Modal.error({
              title: "Purchase Failed",
              content: errorMessage,
            });
          } finally {
            setPurchasingPackage(false);
          }
        },
      });
    }, 0);
  };
  const hasUserPurchased = (packageId) => {
    return userPurchases.some(
      (purchase) =>
        purchase.coachPackageId === packageId &&
        purchase.sessionUsed < purchase.sessionCount
    );
  };

  const getRemainingSessionsForPackage = (packageId) => {
    const purchase = userPurchases.find(
      (p) => p.coachPackageId === packageId && p.sessionUsed < p.sessionCount
    );
    return purchase ? purchase.sessionCount - purchase.sessionUsed : 0;
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot first");
      return;
    }

    // Prepare data for the modal
    const userPackagesForThisCoach = userPurchases.filter(
      (p) =>
        p.coachPackageId &&
        packages.some((pkg) => pkg.id === p.coachPackageId) &&
        p.sessionUsed < p.sessionCount
    );

    const hasActivePackages = userPackagesForThisCoach.length > 0;

    // Set the initial value of the ref instead of creating a new one
    selectedPackageRef.current = hasActivePackages
      ? userPackagesForThisCoach[0]?.coachPackageId
      : null;

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

              {hasActivePackages ? (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, width: "100%" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
                    >
                      Choose Payment Method:
                    </Typography>
                    <Radio.Group
                      defaultValue={
                        userPackagesForThisCoach[0]?.coachPackageId || "wallet"
                      }
                      name="payment-method"
                      onChange={(e) => {
                        // Update the ref with the selected value
                        selectedPackageRef.current =
                          e.target.value !== "wallet" ? e.target.value : null;
                        console.log(
                          "Selected package:",
                          selectedPackageRef.current
                        );
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {userPackagesForThisCoach.map((purchase) => {
                        const pkg = packages.find(
                          (p) => p.id === purchase.coachPackageId
                        );
                        const remainingSessions =
                          purchase.sessionCount - purchase.sessionUsed;

                        return (
                          <Radio.Button
                            key={purchase.coachPackageId}
                            value={purchase.coachPackageId}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px 16px",
                              height: "auto",
                              width: "100%",
                              marginBottom: "8px",
                              borderRadius: "8px",
                              borderColor:
                                selectedPackageRef.current ===
                                purchase.coachPackageId
                                  ? theme.palette.success.main
                                  : theme.palette.divider,
                              backgroundColor:
                                selectedPackageRef.current ===
                                purchase.coachPackageId
                                  ? alpha(theme.palette.success.light, 0.1)
                                  : "white",
                              transition: "all 0.2s ease",
                              transform:
                                selectedPackageRef.current ===
                                purchase.coachPackageId
                                  ? "scale(1.02)"
                                  : "scale(1)",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium" }}
                              >
                                {pkg?.name || "Package"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  display: "block",
                                }}
                              >
                                {remainingSessions} session
                                {remainingSessions !== 1 ? "s" : ""} remaining
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label="Use package"
                              color={
                                selectedPackageRef.current ===
                                purchase.coachPackageId
                                  ? "success"
                                  : "default"
                              }
                              icon={<CheckCircleOutlined />}
                            />
                          </Radio.Button>
                        );
                      })}
                      <Radio.Button
                        value="wallet"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          height: "auto",
                          width: "100%",
                          borderRadius: "8px",
                          borderColor:
                            selectedPackageRef.current === null
                              ? theme.palette.primary.main
                              : theme.palette.divider,
                          backgroundColor:
                            selectedPackageRef.current === null
                              ? alpha(theme.palette.primary.light, 0.1)
                              : "white",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            Pay with wallet
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", display: "block" }}
                          >
                            {formatPrice(coach.ratePerHour)}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label="Direct payment"
                          color={
                            selectedPackageRef.current === null
                              ? "primary"
                              : "default"
                          }
                          icon={<DollarOutlined />}
                        />
                      </Radio.Button>
                    </Radio.Group>
                  </Box>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DollarOutlined
                      style={{
                        color: theme.palette.success.main,
                        fontSize: 16,
                      }}
                    />
                    {formatPrice(coach.ratePerHour)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {hasActivePackages
              ? "Choose a package above to use for this booking or pay directly from your wallet."
              : "The amount will be deducted from your wallet upon confirmation."}
          </Typography>
        </Box>
      ),
      okText: "Confirm Booking",
      cancelText: "Cancel",
      onOk: async () => {
        setBookingInProgress(true);
        try {
          // Get the selected package ID from the ref
          const selectedPackageId = selectedPackageRef.current;
          console.log("Using package ID:", selectedPackageId);

          // Create the start and end time by combining date with times
          const startDate = new Date(selectedSlot.date);
          const endDate = new Date(selectedSlot.date);

          // Parse hours and minutes from the time strings
          const [startHours, startMinutes] = selectedSlot.startTime
            .split(":")
            .map(Number);
          const [endHours, endMinutes] = selectedSlot.endTime
            .split(":")
            .map(Number);

          // Set hours and minutes but keep the time in local timezone
          startDate.setHours(startHours, startMinutes, 0);
          endDate.setHours(endHours, endMinutes, 0);

          // Fix timezone issue - create ISO strings that preserve the local time
          // By adding the timezone offset, we ensure the server receives the correct local time
          const localStartTimeISO = createLocalISOString(startDate);
          const localEndTimeISO = createLocalISOString(endDate);

          console.log(
            "Local time booking request:",
            localStartTimeISO,
            localEndTimeISO
          );

          // Create booking request with package ID if selected
          const bookingRequest = {
            coachId: coach.id,
            sportId: coach.sportIds?.[0],
            startTime: localStartTimeISO,
            endTime: localEndTimeISO,
            ...(selectedPackageId && { packageId: selectedPackageId }),
          };

          // Create the booking
          const bookingResult = await client.createBooking(bookingRequest);

          // Process payment only if not using a package
          if (!selectedPackageId) {
            // Calculate hours difference for price
            const hours = (endDate - startDate) / (1000 * 60 * 60);
            const totalPrice = coach.ratePerHour * hours;

            const paymentRequest = {
              amount: totalPrice,
              description: `Booking with ${coach.fullName}`,
              paymentType: "Booking",
              referenceId: bookingResult.id,
              coachId: coach.id,
              bookingId: bookingResult.id,
              status: "Completed",
            };

            await paymentClient.processBookingPayment(paymentRequest);
          }

          // Show success message
          toast.success("Booking created successfully!");

          // Reset selection
          setSelectedSlot(null);

          // Success modal with more details
          Modal.success({
            title: "Booking Confirmed",
            content: (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your session has been successfully booked!
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: alpha(theme.palette.success.light, 0.1),
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <EventAvailable fontSize="small" color="primary" />
                        {dayjs(selectedSlot.date).format("dddd, MMMM D, YYYY")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <ClockCircleOutlined
                          style={{
                            color: theme.palette.primary.main,
                            fontSize: 16,
                          }}
                        />
                        {formatTime(selectedSlot.startTime)} -{" "}
                        {formatTime(selectedSlot.endTime)}
                      </Typography>
                    </Grid>

                    {/* Show sessions remaining if using a package */}
                    {selectedPackageId &&
                      bookingResult.sessionsRemaining !== undefined && (
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: theme.palette.success.main,
                            }}
                          >
                            <CheckCircleOutlined
                              style={{ color: theme.palette.success.main }}
                            />
                            <strong>{bookingResult.sessionsRemaining}</strong>{" "}
                            sessions remaining in your package
                          </Typography>
                        </Grid>
                      )}
                  </Grid>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  You can view and manage your bookings in your profile
                  dashboard.
                </Typography>
              </Box>
            ),
            okText: "Go to Dashboard",
            onOk: () => navigate("/dashboard"),
            cancelText: "Stay Here",
            okCancel: true,
          });

          // Refresh user packages after a successful booking with package
          if (selectedPackageId) {
            try {
              const refreshedPurchases = await client.getHistoryPurchase(
                false,
                false
              );
              setUserPurchases(refreshedPurchases || []);
            } catch (err) {
              console.error("Error refreshing package data:", err);
            }
          }
        } catch (err) {
          console.error("Failed to create booking:", err);
          const errorMessage =
            err.response?.data?.message ||
            "Failed to create booking. Please try again.";
          toast.error(errorMessage);

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

  // Helper function to create ISO strings that preserve local time
  const createLocalISOString = (date) => {
    // Get timezone offset in minutes
    const tzOffset = date.getTimezoneOffset();

    // Create a new date adjusted for the timezone offset
    const adjustedDate = new Date(date.getTime() - tzOffset * 60000);

    // Create ISO string without the 'Z' at the end to indicate it's local time
    const isoString = adjustedDate.toISOString().slice(0, -1);

    return isoString;
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
                          <Box sx={{ p: 2, overflowX: "auto" }}>
                            {" "}
                            {/* Đã thêm overflowX: 'auto' vào Box cha */}
                            <Grid
                              container
                              spacing={1.5}
                              sx={{ width: "max-content", maxWidth: "1800px" }}
                            >
                              {/* Day headers  */}
                              {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
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
                                      minWidth: "120px", // Đảm bảo mỗi header có chiều rộng tối thiểu
                                      maxWidth: "300px",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                      noWrap
                                    >
                                      {day}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      sx={{ mt: 0.5 }}
                                    >
                                      {dayjs(selectedDate)
                                        .day(index + 1)
                                        .format("MMM D")}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}

                              {/* Daily slots */}
                              {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                              ].map((day, index) => {
                                const dayOfWeek = index + 1;
                                // Calculate the actual date for this day in the displayed week
                                const displayedDate = dayjs(selectedDate)
                                  .startOf("week")
                                  .add(index, "day")
                                  .format("YYYY-MM-DD");

                                // Filter schedules for this specific date (not just the day of week)
                                const daySchedules = schedules.filter(
                                  (schedule) => schedule.date === displayedDate
                                );

                                // Calculate if this is today
                                const isToday =
                                  dayjs().format("YYYY-MM-DD") ===
                                  displayedDate;

                                return (
                                  <Grid item xs={12 / 7} key={`slots-${day}`}>
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        height: 300,
                                        p: 1,
                                        overflowY: "auto",
                                        border: `1px solid ${alpha(
                                          theme.palette.primary.main,
                                          0.2
                                        )}`,
                                        borderTop: "none",
                                        bgcolor: isToday
                                          ? alpha(
                                              theme.palette.success.light,
                                              0.15
                                            )
                                          : alpha(
                                              theme.palette.background.paper,
                                              0.8
                                            ),
                                        borderRadius: "0 0 8px 8px",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                          boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.08)",
                                        },
                                        minWidth: "250px", // Đảm bảo mỗi container slot có chiều rộng tối thiểu
                                        maxWidth: "300px",
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
                                            textAlign: "center",
                                            p: 1,
                                          }}
                                        >
                                          <EventBusy
                                            sx={{
                                              fontSize: 30,
                                              mb: 1,
                                              opacity: 0.5,
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            align="center"
                                          >
                                            No sessions available
                                          </Typography>
                                        </Box>
                                      ) : (
                                        daySchedules.map((slot, slotIndex) => {
                                          const isSelected =
                                            selectedSlot?.date === slot.date &&
                                            selectedSlot?.startTime ===
                                              slot.startTime;
                                          const isAvailable =
                                            slot.status === "available";

                                          return (
                                            <Box
                                              key={`slot-${day}-${slotIndex}`}
                                              sx={{
                                                p: 1.5,
                                                mb: 1.5,
                                                borderRadius: 2,
                                                cursor: isAvailable
                                                  ? "pointer"
                                                  : "default",
                                                bgcolor: isSelected
                                                  ? "primary.main"
                                                  : isAvailable
                                                  ? alpha(
                                                      theme.palette.success
                                                        .light,
                                                      0.3
                                                    )
                                                  : alpha(
                                                      theme.palette.grey[300],
                                                      0.5
                                                    ),
                                                color: isSelected
                                                  ? "white"
                                                  : "text.primary",
                                                border: isSelected
                                                  ? `2px solid ${theme.palette.primary.dark}`
                                                  : "1px solid transparent",
                                                "&:hover": {
                                                  transform: isAvailable
                                                    ? "translateY(-3px)"
                                                    : "none",
                                                  boxShadow: isAvailable
                                                    ? "0 6px 12px rgba(0,0,0,0.1)"
                                                    : "none",
                                                  bgcolor: isAvailable
                                                    ? isSelected
                                                      ? "primary.dark"
                                                      : alpha(
                                                          theme.palette.success
                                                            .main,
                                                          0.4
                                                        )
                                                    : alpha(
                                                        theme.palette.grey[300],
                                                        0.5
                                                      ),
                                                },
                                                transition: "all 0.2s ease",

                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                minHeight: "90px",
                                              }}
                                              onClick={() => {
                                                if (isAvailable) {
                                                  setSelectedSlot(slot);
                                                }
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  alignItems: "center",
                                                  width: "100%",
                                                }}
                                              >
                                                <Typography
                                                  variant="body2"
                                                  fontWeight="bold"
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  <ClockCircleOutlined
                                                    style={{
                                                      fontSize: "1rem",
                                                      flexShrink: 0,
                                                    }}
                                                  />
                                                  {`${formatTime(
                                                    slot.startTime
                                                  )}-${formatTime(
                                                    slot.endTime
                                                  )}`}
                                                </Typography>
                                                {slot.status && (
                                                  <Tag
                                                    color={
                                                      isAvailable
                                                        ? "success"
                                                        : "default"
                                                    }
                                                    style={{
                                                      marginLeft: "4px",
                                                      flexShrink: 0,
                                                    }}
                                                  >
                                                    {slot.status.length > 10
                                                      ? slot.status.substring(
                                                          0,
                                                          10
                                                        ) + "..."
                                                      : slot.status}
                                                  </Tag>
                                                )}
                                              </Box>

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  mt: 1,
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                  }}
                                                >
                                                  <DollarOutlined
                                                    style={{
                                                      fontSize: "1rem",
                                                      flexShrink: 0,
                                                    }}
                                                  />
                                                  <Typography variant="body2">
                                                    {formatPrice(
                                                      coach.ratePerHour
                                                    )}
                                                  </Typography>
                                                </Box>
                                                {isAvailable && (
                                                  <Button
                                                    size="small"
                                                    variant={
                                                      isSelected
                                                        ? "outlined"
                                                        : "text"
                                                    }
                                                    color={
                                                      isSelected
                                                        ? "inherit"
                                                        : "primary"
                                                    }
                                                    sx={{
                                                      p: "2px 6px",
                                                      minWidth: "auto",
                                                      lineHeight: 1.2,
                                                      flexShrink: 0,

                                                      ...(isSelected && {
                                                        color: "white",
                                                        borderColor:
                                                          "rgba(255,255,255,0.5)",
                                                      }),
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSelectedSlot(slot);
                                                    }}
                                                  >
                                                    {isSelected
                                                      ? "Selected"
                                                      : "Select"}
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

                <TabPane
                  tab={
                    <span>
                      <ShoppingCartOutlined /> Packages
                    </span>
                  }
                  key="5"
                >
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Box>
                        <Title level={4}>Coaching Packages</Title>
                        <Text type="secondary">
                          Purchase a package to save on multiple sessions
                        </Text>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Text>Show my packages only</Text>
                        <Switch
                          size="small"
                          checked={showPurchasedOnly}
                          onChange={(checked) => setShowPurchasedOnly(checked)}
                        />
                      </Box>
                    </Box>

                    {loadingPackages ? (
                      <Grid container spacing={3}>
                        {[1, 2, 3].map((item) => (
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            key={`skeleton-${item}`}
                          >
                            <Card>
                              <Skeleton active avatar paragraph={{ rows: 4 }} />
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : packages.length === 0 ? (
                      <Empty
                        description="No packages available for this coach"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ) : (
                      <motion.div layout>
                        <Grid container spacing={3}>
                          <AnimatePresence>
                            {packages
                              .filter(
                                (pkg) =>
                                  !showPurchasedOnly || hasUserPurchased(pkg.id)
                              )
                              .map((pkg) => {
                                const purchased = hasUserPurchased(pkg.id);
                                const remainingSessions =
                                  getRemainingSessionsForPackage(pkg.id);
                                const sessionsPerPrice =
                                  Math.round(
                                    (pkg.price / pkg.sessionCount) * 100
                                  ) / 100;
                                const savingsPercent = Math.round(
                                  (1 - sessionsPerPrice / coach.ratePerHour) *
                                    100
                                );

                                return (
                                  <Grid item xs={12} md={6} lg={4} key={pkg.id}>
                                    <PackageCard
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale:
                                          selectedPackage?.id === pkg.id
                                            ? 1.02
                                            : 1,
                                        boxShadow:
                                          selectedPackage?.id === pkg.id
                                            ? "0 12px 28px rgba(0,0,0,0.2)"
                                            : "0 8px 20px rgba(0,0,0,0.07)",
                                      }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.3 }}
                                      style={{
                                        border:
                                          selectedPackage?.id === pkg.id
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : "1px solid rgba(0,0,0,0.06)",
                                      }}
                                    >
                                      {savingsPercent > 0 && (
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            top: 15,
                                            right: 15,
                                            zIndex: 10,
                                          }}
                                        >
                                          <PackageBadge
                                            count={`Save ${savingsPercent}%`}
                                            bgColor={theme.palette.error.main}
                                          />
                                        </Box>
                                      )}

                                      <Box
                                        sx={{
                                          p: 3,
                                          borderBottom: `1px solid ${theme.palette.divider}`,
                                          position: "relative",
                                        }}
                                      >
                                        <Typography
                                          variant="h5"
                                          gutterBottom
                                          fontWeight="bold"
                                          sx={{
                                            color: theme.palette.primary.main,
                                          }}
                                        >
                                          {pkg.name}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ minHeight: 60 }}
                                        >
                                          {pkg.description ||
                                            "Get multiple sessions at a discounted rate."}
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          p: 3,
                                          flex: 1,
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <Box sx={{ mb: 3 }}>
                                          <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            color="text.primary"
                                          >
                                            {formatPrice(pkg.price)}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              mt: 0.5,
                                            }}
                                          >
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {formatPrice(sessionsPerPrice)}{" "}
                                              per session
                                            </Typography>
                                            {savingsPercent > 0 && (
                                              <Chip
                                                size="small"
                                                label={`Save ${savingsPercent}%`}
                                                color="error"
                                                sx={{ ml: 1, height: 20 }}
                                              />
                                            )}
                                          </Box>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                          <FeatureItem>
                                            <CheckCircleOutlined className="icon" />
                                            <Typography className="text">
                                              {pkg.sessionCount} coaching
                                              sessions
                                            </Typography>
                                          </FeatureItem>
                                          <FeatureItem>
                                            <CheckCircleOutlined className="icon" />
                                            <Typography className="text">
                                              Valid for 30 days
                                            </Typography>
                                          </FeatureItem>
                                          <FeatureItem>
                                            <CheckCircleOutlined className="icon" />
                                            <Typography className="text">
                                              Personalized coaching
                                            </Typography>
                                          </FeatureItem>
                                          <FeatureItem>
                                            <CheckCircleOutlined className="icon" />
                                            <Typography className="text">
                                              Book anytime within validity
                                            </Typography>
                                          </FeatureItem>
                                        </Box>

                                        <Box sx={{ mt: "auto" }}>
                                          {purchased ? (
                                            <Box>
                                              <Alert
                                                icon={<CheckCircleOutlined />}
                                                type="success"
                                                message={
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      fontWeight: "medium",
                                                    }}
                                                  >
                                                    Package Active
                                                  </Typography>
                                                }
                                                description={
                                                  <Typography variant="body2">
                                                    You have {remainingSessions}{" "}
                                                    session
                                                    {remainingSessions !== 1
                                                      ? "s"
                                                      : ""}{" "}
                                                    remaining
                                                  </Typography>
                                                }
                                                showIcon
                                                sx={{ mb: 2 }}
                                              />
                                              <Button
                                                type="primary"
                                                block
                                                icon={<CalendarOutlined />}
                                                onClick={() => {
                                                  setActiveTab("2");
                                                  window.scrollTo({
                                                    top: 500,
                                                    behavior: "smooth",
                                                  });
                                                }}
                                              >
                                                Book a Session
                                              </Button>
                                            </Box>
                                          ) : (
                                            <Button
                                              type="primary"
                                              block
                                              size="large"
                                              icon={<ShoppingCartOutlined />}
                                              onClick={(e) => {
                                                e.preventDefault(); // Prevent event bubbling
                                                e.stopPropagation(); // Stop propagation
                                                handlePurchasePackage(pkg);
                                              }}
                                              loading={
                                                purchasingPackage &&
                                                selectedPackage?.id === pkg.id
                                              }
                                              disabled={purchasingPackage}
                                              style={{
                                                backgroundColor:
                                                  selectedPackage?.id === pkg.id
                                                    ? theme.palette.success.main
                                                    : theme.palette.primary
                                                        .main,
                                                borderColor:
                                                  selectedPackage?.id === pkg.id
                                                    ? theme.palette.success.main
                                                    : theme.palette.primary
                                                        .main,
                                              }}
                                            >
                                              {selectedPackage?.id === pkg.id
                                                ? "Selected Package"
                                                : "Purchase Package"}
                                            </Button>
                                          )}
                                        </Box>
                                      </Box>
                                    </PackageCard>
                                  </Grid>
                                );
                              })}
                          </AnimatePresence>
                        </Grid>
                      </motion.div>
                    )}

                    <Box
                      sx={{
                        mt: 4,
                        p: 3,
                        bgcolor: alpha(theme.palette.info.light, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <InfoCircleOutlined
                          style={{
                            color: theme.palette.info.main,
                            fontSize: 24,
                            marginTop: 4,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            gutterBottom
                          >
                            About Coach Packages
                          </Typography>
                          <Typography variant="body2">
                            Purchasing a coaching package gives you access to
                            multiple sessions at a discounted rate. Packages are
                            valid for 30 days from purchase date and can be used
                            to book any available slot with this coach. Once
                            purchased, you can select the package during the
                            booking process instead of paying for each session
                            individually.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
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
