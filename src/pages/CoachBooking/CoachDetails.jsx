import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
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
  Pagination,
  Progress,
  Carousel,
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
  MessageOutlined,
  StarFilled,
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
  Zoom,
  Fade,
  Avatar,
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
import { Client as ReviewClient } from "../../API/ReviewApi";
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

// New styled components for enhanced UI
const ModernTabContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  marginBottom: 20,
}));

const ModernTab = styled(Box)(({ theme, active }) => ({
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: active ? 600 : 500,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-3px)",
    boxShadow: active ? "0 6px 20px rgba(0,0,0,0.1)" : "none",
  },
}));

const TabIndicator = styled(Box)(({ theme, left, width }) => ({
  position: "absolute",
  height: "3px",
  width: width,
  left: left,
  bottom: "-2px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "3px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const ContentContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
  },
}));

const AnimatedContent = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: "500px",
}));

// Enhanced Hero section styles
const EnhancedHeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 350, // Increased height
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: theme.shape.borderRadius * 1.5, // More rounded corners
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)", // Enhanced shadow
  marginBottom: theme.spacing(5),
  display: "flex",
  alignItems: "flex-end",
  transition: "all 0.5s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },
}));

const EnhancedHeroOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))", // Better gradient
  zIndex: 1,
}));

// New styled components for the redesigned layout
const InfoTabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ScheduleCalendar = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.primary.light,
    0.1
  )} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`,
}));

const DateCell = styled("div")(
  ({ theme, $isSelected, $isAvailable, $isPast }) => ({
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: $isSelected
      ? `2px solid ${theme.palette.primary.main}`
      : "1px solid transparent",
    backgroundColor: $isPast
      ? alpha(theme.palette.grey[200], 0.5)
      : $isSelected
      ? alpha(theme.palette.primary.main, 0.1)
      : $isAvailable
      ? alpha(theme.palette.success.light, 0.1)
      : "transparent",
    cursor: $isPast ? "default" : "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    "&:hover": {
      backgroundColor: $isPast
        ? alpha(theme.palette.grey[200], 0.5)
        : $isSelected
        ? alpha(theme.palette.primary.main, 0.15)
        : alpha(theme.palette.primary.light, 0.05),
      transform: $isPast ? "none" : "translateY(-2px)",
      boxShadow: $isPast ? "none" : "0 4px 8px rgba(0,0,0,0.1)",
    },
  })
);

const TimeSlot = styled("div")(({ theme, $isAvailable, $isSelected }) => ({
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: $isSelected
    ? alpha(theme.palette.primary.main, 0.15)
    : $isAvailable
    ? alpha(theme.palette.success.light, 0.1)
    : alpha(theme.palette.grey[300], 0.3),
  border: $isSelected
    ? `1px solid ${theme.palette.primary.main}`
    : $isAvailable
    ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
    : `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
  cursor: $isAvailable ? "pointer" : "default",
  transition: "all 0.2s",
  "&:hover": {
    transform: $isAvailable ? "translateY(-2px)" : "none",
    boxShadow: $isAvailable ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
    backgroundColor: $isSelected
      ? alpha(theme.palette.primary.main, 0.2)
      : $isAvailable
      ? alpha(theme.palette.success.light, 0.15)
      : alpha(theme.palette.grey[300], 0.3),
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(3),
  height: "100%",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    transform: "translateY(-5px)",
  },
}));

const PromotionBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 24,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: "4px 12px",
  borderRadius: "0 0 12px 12px",
  fontWeight: 600,
  fontSize: "0.85rem",
  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  zIndex: 1,
}));

// Helper function for calendar view
const generateDateArray = (startDate, days = 14) => {
  const dates = [];
  const start = dayjs(startDate).startOf("day");

  for (let i = 0; i < days; i++) {
    dates.push(start.add(i, "day"));
  }

  return dates;
};

// Helper function to format promotion discount
const formatDiscount = (promotion) => {
  if (!promotion) return null;

  if (promotion.discountType === "percentage") {
    return `${promotion.discountValue}%`;
  } else {
    return formatPrice(promotion.discountValue);
  }
};

// Add this helper function for day name translation
const translateDayName = (englishDayName) => {
  const translations = {
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
    Sunday: "Chủ nhật",
  };
  return translations[englishDayName] || englishDayName;
};

// Replace the existing tabs with consolidated views
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

  // Add this with your other state variables in CoachDetails
  const [coachReviews, setCoachReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsPageSize, setReviewsPageSize] = useState(5);
  const [reviewsTotalCount, setReviewsTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const reviewClient = new ReviewClient();

  // API client
  const client = new Client();
  const paymentClient = new PaymentClient();

  // New state for calendar view
  const [calendarDates, setCalendarDates] = useState([]);
  const [calendarStartDate, setCalendarStartDate] = useState(dayjs());
  const [visibleSlots, setVisibleSlots] = useState([]);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  useEffect(() => {
    // Generate 14 days for the calendar view
    setCalendarDates(generateDateArray(calendarStartDate, 14));
  }, [calendarStartDate]);

  // Group available slots by date
  useEffect(() => {
    if (schedules.length > 0) {
      setVisibleSlots(schedules);
    }
  }, [schedules]);

  // Match promotions with packages
  useEffect(() => {
    if (promotions.length > 0 && packages.length > 0) {
      // Find valid promotions with linked packages
      const validPromos = promotions.filter((promo) => {
        const now = dayjs();
        const isValid =
          dayjs(promo.validFrom).isBefore(now) &&
          dayjs(promo.validTo).isAfter(now);
        const hasPackage = packages.some((pkg) => pkg.id === promo.packageId);
        return isValid && hasPackage;
      });
      setAvailablePromotions(validPromos);
    }
  }, [promotions, packages]);

  // Fetch coach data
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);

        // Fetch coach details
        const coachData = await client.getCoachById(id);
        // Translate day names to Vietnamese in weeklySchedule
        if (coachData.weeklySchedule && coachData.weeklySchedule.length > 0) {
          coachData.weeklySchedule = coachData.weeklySchedule.map(
            (schedule) => ({
              ...schedule,
              dayName: translateDayName(schedule.dayName),
            })
          );
        }
        setCoach(coachData);

        // Fetch coach schedules - using the current date range
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

        // Fetch coach reviews
        try {
          const reviewResponse = await reviewClient.getReviews(
            "coach",
            id,
            1,
            5
          );

          if (reviewResponse && reviewResponse.data) {
            setCoachReviews(reviewResponse.data || []);
            setReviewsTotalCount(reviewResponse.totalCount || 0);

            // Calculate average rating
            if (reviewResponse.data.length > 0) {
              const sum = reviewResponse.data.reduce(
                (acc, review) => acc + review.rating,
                0
              );
              setAverageRating(sum / reviewResponse.data.length);
            }
          }
        } catch (reviewErr) {
          console.error("Error fetching coach reviews:", reviewErr);
        }
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

  // Add this useEffect to fetch coach reviews
  useEffect(() => {
    const fetchCoachReviews = async () => {
      if (!id) return;

      try {
        setReviewsLoading(true);

        const response = await reviewClient.getReviews(
          "coach",
          id,
          reviewsPage,
          reviewsPageSize
        );

        // Parse the response
        const responseData = await response;

        if (responseData && responseData.data) {
          setCoachReviews(responseData.data || []);
          setReviewsTotalCount(responseData.totalCount || 0);

          // Calculate average rating
          if (responseData.data.length > 0) {
            const sum = responseData.data.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            setAverageRating(sum / responseData.data.length);
          } else {
            setAverageRating(0);
          }
        } else {
          setCoachReviews([]);
          setReviewsTotalCount(0);
          setAverageRating(0);
        }

        setReviewsError(null);
      } catch (error) {
        console.error("Error fetching coach reviews:", error);
        setReviewsError("Failed to load reviews. Please try again later.");
        setCoachReviews([]);
        setReviewsTotalCount(0);
        setAverageRating(0);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (activeTab === "4") {
      fetchCoachReviews();
    }
  }, [id, reviewsPage, reviewsPageSize, activeTab]);

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
          Bạn chuẩn bị thanh toán gói sau:
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
            <Grid size={12}>
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

            <Grid size={6}>
              <Typography variant="body2" color="text.secondary">
                Số buổi:
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <UnorderedListOutlined
                  style={{ color: theme.palette.warning.main }}
                />
                {packageToSelect.sessionCount} buổi
              </Typography>
            </Grid>

            <Grid size={6}>
              <Typography variant="body2" color="text.secondary">
                Giá gói:
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

            <Grid size={12}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {packageToSelect.description ||
                  "This package will allow you to attend multiple sessions with your coach at a discounted rate."}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Số tiền sẽ được trừ từ ví của bạn sau khi xác nhận.
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
          <InfoCircleOutlined /> Các buổi trong gói sẽ có hiệu lực trong 30 ngày
          kể từ ngày mua.
        </Typography>
      </Box>
    );

    // Show modal with delay to prevent React state update conflicts
    setTimeout(() => {
      Modal.confirm({
        title: "Mua gói",
        icon: (
          <ShoppingCartOutlined style={{ color: theme.palette.primary.main }} />
        ),
        width: 500,
        content: modalContent,
        okText: "Xác nhận mua",
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
              description: `Gói chọn lựa: ${packageToSelect.name}`,
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

            toast.success("Gói đã được thanh toán thành công!");

            // You might want to navigate to a success page or show a success modal
            Modal.success({
              title: "Thanh toán thành công",
              content: (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Bạn đã thanh toán thành công gói {packageToSelect.name} .
                  </Typography>
                  <Typography variant="body2">
                    Bạn có thể sử dụng gói này khi luyện tập cùng huấn luyện
                    viên {coach.fullName}.
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
              title: "Thanh toán lỗi",
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
      toast.error("Vui lòng lựa chọn một khoảng thời gian phù hợp");
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
      title: "Xác nhận đặt lịch",
      icon: <BookOutlined style={{ color: theme.palette.primary.main }} />,
      width: 500,
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Bạn chuẩn bị đặt lịch một buổi tập với:
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
              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={coach.avatar}
                    alt={coach.fullName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="h6" className="">
                    {coach.fullName}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Ngày:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <EventAvailable fontSize="small" color="primary" />
                  {dayjs(selectedSlot.date).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Grid>

              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Thời gian:
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
                <Grid size={12}>
                  <Box sx={{ mt: 2, width: "100%" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
                    >
                      Chọn phương thức thanh toán:
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
                                {remainingSessions} buổi tất cả
                                {remainingSessions !== 1 ? "s" : ""} buổi còn
                                lại
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
                            Trả bằng ví
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
                <Grid size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Giá tiền:
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
              ? "Chọn một gói ở trên để sử dụng cho lần đặt lịch này hoặc thanh toán trực tiếp từ ví của bạn."
              : "Số tiền sẽ được trừ từ ví của bạn sau khi xác nhận."}
          </Typography>
        </Box>
      ),
      okText: "Xác nhận đặt lịch",
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
              status: bookingResult.status,
            };

            await paymentClient.processBookingPayment(paymentRequest);
          }

          // Show success message
          toast.success("Lịch đã được đặt thành công!");

          // Reset selection
          setSelectedSlot(null);

          // Success modal with more details
          Modal.success({
            title: "Lịch đã được xác nhận",
            content: (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Buổi tập của bạn đã được đặt lịch thành công!
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
                    <Grid size={12}>
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
                    <Grid size={12}>
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
                        <Grid size={12}>
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
                            buổi còn lại trong gói của bạn.
                          </Typography>
                        </Grid>
                      )}
                  </Grid>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Bạn có thể xem và quản lý lịch đặt của bạn trong bảng điều
                  khiển cá nhân.
                </Typography>
              </Box>
            ),
            okText: "Go to Dashboard",
            onOk: () => navigate("/user/coachings"),
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

  // Find promotion for a package
  const getPromoForPackage = (packageId) => {
    return availablePromotions.find((promo) => promo.packageId === packageId);
  };

  // Format calendar dates for display
  const formatCalendarDate = (date) => {
    return {
      date: date,
      dayName: date.format("ddd"),
      dayNumber: date.format("D"),
      monthName: date.format("MMM"),
      isToday: date.isSame(dayjs(), "day"),
      isPast: date.isBefore(dayjs(), "day"),
    };
  };

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    return visibleSlots
      .filter((slot) => slot.date === date.format("YYYY-MM-DD"))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Navigate calendar dates
  const moveCalendarDays = (direction) => {
    const newStartDate =
      direction === "next"
        ? calendarStartDate.add(7, "day")
        : calendarStartDate.subtract(7, "day");
    setCalendarStartDate(newStartDate);
  };

  // Apply promotion to a package
  const calculateDiscountedPrice = (basePrice, promotion) => {
    if (!promotion) return basePrice;

    if (promotion.discountType === "percentage") {
      return basePrice * (1 - promotion.discountValue / 100);
    } else {
      return Math.max(0, basePrice - promotion.discountValue);
    }
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
            Đang tải thông tin huấn luyện viên...
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
            Quay trở lại danh sách
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
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate("/coaches")}
              size="large"
              style={{
                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                borderRadius: 12,
                padding: "8px 16px",
                height: "auto",
              }}
            >
              Quay trở lại danh sách
            </Button>
          </motion.div>
        </Box>

        {/* Enhanced Hero Section */}
        <EnhancedHeroSection>
          <EnhancedHeroOverlay />
          {coach && coach.imageUrls && coach.imageUrls.length > 0 ? (
            <div
              style={{ width: "100%", height: "400px", position: "relative" }}
            >
              <Carousel autoplay style={{ height: "100%" }}>
                {coach.imageUrls.map((imageUrl, index) => (
                  <div key={index} style={{ height: "400px" }}>
                    <div
                      style={{
                        height: "400px",
                        width: "100%",
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "70%",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </Carousel>
              {/* Position coach info on top of the carousel */}
              <div className="absolute bottom-8 left-0 w-full z-10 px-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  <div className="text-center">
                    <Avatar
                      src={coach?.avatar}
                      alt={coach?.fullName}
                      className="border-4 border-white shadow-xl mx-auto"
                      sx={{
                        width: { xs: 100, md: 120 },
                        height: { xs: 100, md: 120 },
                        border: "1px solid white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                    />
                  </div>
                  <div className="text-white text-center md:text-left mt-4 md:mt-0">
                    {" "}
                    {/* Thêm margin-top cho mobile view */}
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      color="white"
                      sx={{
                        fontSize: { xs: "1.75rem", md: "2.5rem" },
                        textShadow: "0 3px 10px rgba(0,0,0,0.5)",
                        mb: 1,
                      }}
                    >
                      {coach.fullName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mt: 1,
                      }}
                    >
                      <Rate
                        allowHalf
                        defaultValue={coach.rating || averageRating || 0}
                        disabled
                      />
                      <Text
                        style={{
                          color: "white",
                          marginLeft: 8,
                          fontWeight: "500",
                          textShadow: "0 2px 5px rgba(0,0,0,0.5)",
                        }}
                      >
                        ({reviewsTotalCount || 0} đánh giá)
                      </Text>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{ width: "100%", height: "400px", position: "relative" }}
            >
              <div
                style={{
                  height: "400px",
                  width: "100%",
                  backgroundImage: `url(${
                    coach?.avatar ||
                    "https://source.unsplash.com/random/1200x400/?sport,coach"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              {/* Position coach info on top of the image for the non-carousel case */}
              <div className="absolute bottom-8 left-0 w-full z-10 px-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  <div className="text-center">
                    <Avatar
                      src={coach?.avatar}
                      alt={coach?.fullName}
                      className="border-4 border-white shadow-xl mx-auto"
                      sx={{
                        width: { xs: 320, md: 350 }, // Tăng từ 160/180 lên 320/350
                        height: { xs: 320, md: 350 }, // Tăng từ 160/180 lên 320/350
                        border: "8px solid white", // Tăng độ dày của border
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)", // Tăng shadow cho nổi bật hơn
                      }}
                    />
                  </div>
                  <div className="text-white text-center md:text-left mt-4 md:mt-0">
                    {" "}
                    {/* Thêm margin-top cho mobile view */}
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      color="white"
                      sx={{
                        fontSize: { xs: "1.75rem", md: "2.5rem" },
                        textShadow: "0 3px 10px rgba(0,0,0,0.5)",
                        mb: 1,
                      }}
                    >
                      {coach.fullName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mt: 1,
                      }}
                    >
                      <Rate
                        allowHalf
                        defaultValue={coach.rating || averageRating || 0}
                        disabled
                      />
                      <Text
                        style={{
                          color: "white",
                          marginLeft: 8,
                          fontWeight: "500",
                          textShadow: "0 2px 5px rgba(0,0,0,0.5)",
                        }}
                      >
                        ({reviewsTotalCount || 0} đánh giá)
                      </Text>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          )}
        </EnhancedHeroSection>

        {/* Main Content - 2 Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column - Coach Info and Reviews */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InfoCard sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Thông tin huấn luyện viên
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Giới thiệu
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {coach.bio ||
                      "Huấn luyện viên chưa cung cấp thông tin giới thiệu."}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin liên hệ
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1 }}>
                    {coach.email && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <MailOutlined
                          style={{
                            color: theme.palette.primary.main,
                            fontSize: 18,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {coach.email}
                        </Typography>
                      </Box>
                    )}
                    {coach.phone && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <PhoneOutlined
                          style={{
                            color: theme.palette.success.main,
                            fontSize: 18,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {coach.phone}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Lịch trình hàng tuần
                  </Typography>
                  {coach.weeklySchedule && coach.weeklySchedule.length > 0 ? (
                    <List
                      size="small"
                      bordered
                      dataSource={coach.weeklySchedule}
                      renderItem={(schedule) => (
                        <List.Item
                          style={{
                            padding: "8px 12px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {schedule.dayName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </Typography>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontStyle: "italic" }}
                    >
                      Không có thông tin lịch trình.
                    </Typography>
                  )}
                </Box>
              </InfoCard>
            </motion.div>

            {/* Reviews Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <InfoCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Đánh giá
                  </Typography>
                  <Badge
                    count={reviewsTotalCount}
                    overflowCount={999}
                    color={theme.palette.warning.main}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />

                {reviewsLoading ? (
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                ) : coachReviews.length > 0 ? (
                  <>
                    {/* Rating summary */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mr: 3,
                        }}
                      >
                        <Typography
                          variant="h2"
                          fontWeight="bold"
                          sx={{
                            color: theme.palette.warning.main,
                            lineHeight: 1,
                          }}
                        >
                          {averageRating.toFixed(1)}
                        </Typography>
                        <Rate
                          value={averageRating}
                          disabled
                          allowHalf
                          style={{ fontSize: 14 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ mt: 0.5, color: "text.secondary" }}
                        >
                          {reviewsTotalCount} đánh giá
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <RatingSummary
                          coachReviews={coachReviews}
                          totalCount={reviewsTotalCount}
                        />
                      </Box>
                    </Box>

                    {/* Recent reviews list */}
                    <List
                      itemLayout="horizontal"
                      dataSource={coachReviews.slice(0, 2)}
                      renderItem={(item, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            duration: 0.5,
                          }}
                        >
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar src={item.userAvatar} />}
                              title={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="500">
                                    {item.userName}
                                  </Typography>
                                  <Rate
                                    value={item.rating}
                                    disabled
                                    allowHalf
                                    style={{ fontSize: 12 }}
                                  />
                                </Box>
                              }
                              description={
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary", mt: 0.5 }}
                                >
                                  {item.comment && item.comment.length > 100
                                    ? `${item.comment.substring(0, 100)}...`
                                    : item.comment}
                                </Typography>
                              }
                            />
                          </List.Item>
                        </motion.div>
                      )}
                    />

                    {reviewsTotalCount > 2 && (
                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                          type="text"
                          icon={<UnorderedListOutlined />}
                          onClick={() => {
                            // Open reviews in modal
                            Modal.info({
                              title: "Tất cả đánh giá",
                              width: 700,
                              content: (
                                <List
                                  itemLayout="vertical"
                                  dataSource={coachReviews}
                                  renderItem={(item) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Avatar
                                            src={item.userAvatar}
                                            size="large"
                                          />
                                        }
                                        title={
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <Typography
                                              variant="body1"
                                              fontWeight="500"
                                            >
                                              {item.userName}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {dayjs(item.createdAt).format(
                                                "DD/MM/YYYY"
                                              )}
                                            </Typography>
                                          </Box>
                                        }
                                        description={
                                          <Rate
                                            value={item.rating}
                                            disabled
                                            allowHalf
                                            style={{ fontSize: 14 }}
                                          />
                                        }
                                      />
                                      <Typography
                                        variant="body1"
                                        sx={{ mt: 2 }}
                                      >
                                        {item.comment}
                                      </Typography>

                                      {item.reply && (
                                        <Box
                                          sx={{
                                            mt: 2,
                                            p: 2,
                                            bgcolor: alpha(
                                              theme.palette.primary.light,
                                              0.1
                                            ),
                                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                                            borderRadius: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            fontWeight="500"
                                            sx={{
                                              mb: 1,
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <MessageOutlined /> Phản hồi từ huấn
                                            luyện viên:
                                          </Typography>
                                          <Typography variant="body2">
                                            {item.reply}
                                          </Typography>
                                        </Box>
                                      )}
                                    </List.Item>
                                  )}
                                  pagination={{
                                    pageSize: 5,
                                    total: reviewsTotalCount,
                                    onChange: (page) => setReviewsPage(page),
                                  }}
                                />
                              ),
                              icon: (
                                <StarOutlined
                                  style={{ color: theme.palette.warning.main }}
                                />
                              ),
                            });
                          }}
                        >
                          Xem tất cả {reviewsTotalCount} đánh giá
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Empty
                    description="Chưa có đánh giá nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </InfoCard>
            </motion.div>
          </Grid>

          {/* Right Column - Booking Calendar and Packages */}
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            {/* Calendar and Booking Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              id="booking-section"
            >
              <InfoCard sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Đặt lịch buổi tập
                  </Typography>
                  <Box>
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => setCalendarStartDate(dayjs())}
                    >
                      Hôm nay
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Calendar Navigation */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    bgcolor: alpha(theme.palette.primary.light, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Button
                    icon={<LeftOutlined />}
                    onClick={() => moveCalendarDays("prev")}
                  >
                    Trước
                  </Button>
                  <Typography fontWeight="medium">
                    {calendarStartDate.format("DD/MM/YYYY")} -{" "}
                    {calendarStartDate.add(13, "days").format("DD/MM/YYYY")}
                  </Typography>
                  <Button
                    onClick={() => moveCalendarDays("next")}
                    icon={
                      <LeftOutlined style={{ transform: "rotate(180deg)" }} />
                    }
                  >
                    Tiếp
                  </Button>
                </Box>

                {/* Calendar Grid - Redesigned for better usability */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ marginBottom: 24 }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Chọn ngày:
                  </Typography>

                  {/* Horizontal scrollable date picker */}
                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto",
                      pb: 1,
                      pt: 1,
                      mb: 3,
                      "::-webkit-scrollbar": {
                        height: "8px",
                      },
                      "::-webkit-scrollbar-thumb": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {calendarDates.map((date, index) => {
                      const formattedDate = formatCalendarDate(date);
                      const isSelected =
                        selectedDate && selectedDate.isSame(date, "day");
                      const hasAvailableSlots = visibleSlots.some(
                        (slot) =>
                          slot.date === date.format("YYYY-MM-DD") &&
                          slot.status === "available"
                      );

                      return (
                        <Paper
                          key={index}
                          elevation={isSelected ? 3 : 0}
                          onClick={() =>
                            !formattedDate.isPast && setSelectedDate(date)
                          }
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "80px",
                            height: "90px",
                            mr: 1,
                            p: 1,
                            borderRadius: "12px",
                            cursor: formattedDate.isPast
                              ? "default"
                              : "pointer",
                            border: isSelected
                              ? `2px solid ${theme.palette.primary.main}`
                              : "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: formattedDate.isPast
                              ? alpha(theme.palette.grey[200], 0.5)
                              : isSelected
                              ? alpha(theme.palette.primary.main, 0.1)
                              : hasAvailableSlots
                              ? alpha(theme.palette.success.light, 0.1)
                              : "white",
                            opacity: formattedDate.isPast ? 0.5 : 1,
                            transform: isSelected ? "scale(1.05)" : "scale(1)",
                            transition: "all 0.2s ease",
                            position: "relative",
                            "&:hover": {
                              transform: formattedDate.isPast
                                ? "scale(1)"
                                : "scale(1.05)",
                              backgroundColor: formattedDate.isPast
                                ? alpha(theme.palette.grey[200], 0.5)
                                : isSelected
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.primary.light, 0.05),
                              boxShadow: formattedDate.isPast
                                ? "none"
                                : "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          {formattedDate.isToday && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -2,
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                fontSize: "10px",
                                py: 0.3,
                                px: 1,
                                borderRadius: "0 0 4px 4px",
                                fontWeight: "bold",
                              }}
                            >
                              TODAY
                            </Box>
                          )}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 0.5, fontWeight: "500" }}
                          >
                            {formattedDate.dayName}
                          </Typography>

                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: formattedDate.isToday ? "700" : "600",
                              color: formattedDate.isToday
                                ? "primary.main"
                                : "text.primary",
                              lineHeight: 1,
                            }}
                          >
                            {formattedDate.dayNumber}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {formattedDate.monthName}
                          </Typography>

                          {hasAvailableSlots && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: "6px",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: theme.palette.success.main,
                              }}
                            />
                          )}
                        </Paper>
                      );
                    })}
                  </Box>

                  {/* Available times for selected date */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        Khung giờ trống ({selectedDate.format("DD/MM/YYYY")}):
                      </Typography>

                      <Box>
                        <Button
                          type="text"
                          size="small"
                          icon={<LeftOutlined />}
                          onClick={() => moveCalendarDays("prev")}
                          style={{ marginRight: 8 }}
                        >
                          Trước
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => moveCalendarDays("next")}
                          icon={
                            <LeftOutlined
                              style={{ transform: "rotate(180deg)" }}
                            />
                          }
                        >
                          Sau
                        </Button>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr 1fr",
                        },
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {getSlotsForDate(selectedDate).length > 0 ? (
                        getSlotsForDate(selectedDate).map((slot, slotIndex) => {
                          const isSlotSelected =
                            selectedSlot &&
                            selectedSlot.date === slot.date &&
                            selectedSlot.startTime === slot.startTime;
                          const isAvailable = slot.status === "available";

                          return (
                            <Paper
                              key={slotIndex}
                              onClick={() =>
                                isAvailable && setSelectedSlot(slot)
                              }
                              sx={{
                                p: 2,
                                borderRadius: "12px",
                                cursor: isAvailable ? "pointer" : "default",
                                border: isSlotSelected
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "1px solid rgba(0,0,0,0.08)",
                                backgroundColor: isSlotSelected
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : isAvailable
                                  ? "white"
                                  : alpha(theme.palette.grey[100], 0.8),
                                transition: "all 0.2s",
                                position: "relative",
                                overflow: "hidden",
                                "&:hover": {
                                  transform: isAvailable
                                    ? "translateY(-3px)"
                                    : "none",
                                  boxShadow: isAvailable
                                    ? "0 6px 16px rgba(0,0,0,0.1)"
                                    : "none",
                                },
                                "&::before": isSlotSelected
                                  ? {
                                      content: '""',
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "4px",
                                      height: "100%",
                                      backgroundColor:
                                        theme.palette.primary.main,
                                    }
                                  : {},
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <ClockCircleOutlined
                                    style={{
                                      color: isAvailable
                                        ? theme.palette.primary.main
                                        : theme.palette.text.disabled,
                                      marginRight: 8,
                                      fontSize: 18,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: "500",
                                      color: isAvailable
                                        ? "text.primary"
                                        : "text.disabled",
                                    }}
                                  >
                                    {formatTime(slot.startTime)} -{" "}
                                    {formatTime(slot.endTime)}
                                  </Typography>
                                </Box>

                                <Tag
                                  color={isAvailable ? "success" : "default"}
                                >
                                  {isAvailable ? "Trống" : "Đã đặt"}
                                </Tag>
                              </Box>

                              {isAvailable && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    mt: 1,
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Nhấn vào để chọn khung giờ này
                                </Typography>
                              )}
                            </Paper>
                          );
                        })
                      ) : (
                        <Box
                          sx={{
                            py: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gridColumn: "1 / -1",
                            color: "text.secondary",
                          }}
                        >
                          <EventBusy
                            sx={{ fontSize: 36, opacity: 0.4, mb: 1 }}
                          />
                          <Typography>
                            Không có khung giờ trống cho ngày này
                          </Typography>
                          <Button
                            type="text"
                            onClick={() => setCalendarStartDate(dayjs())}
                            icon={<CalendarOutlined />}
                            style={{ marginTop: 16 }}
                          >
                            Tìm ngày khác
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </motion.div>

                {/* Booking Summary */}
                {selectedSlot ? (
                  <Box sx={{ mt: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.success.light, 0.05),
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight="medium">
                        Tóm tắt lịch đặt
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid
                          size={{
                            xs: 12,
                            sm: 6,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <EventAvailable color="primary" sx={{ mt: 0.5 }} />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ngày
                              </Typography>
                              <Typography variant="body1">
                                {dayjs(selectedSlot.date).format(
                                  "dddd, DD/MM/YYYY"
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <ClockCircleOutlined
                              style={{
                                color: theme.palette.primary.main,
                                fontSize: 20,
                                marginTop: 4,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Thời gian
                              </Typography>
                              <Typography variant="body1">
                                {formatTime(selectedSlot.startTime)} -{" "}
                                {formatTime(selectedSlot.endTime)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <DollarOutlined
                              style={{
                                color: theme.palette.success.main,
                                fontSize: 20,
                                marginTop: 4,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Giá buổi tập
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {formatPrice(coach.ratePerHour)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        {hasUserPurchased(coach.packages?.[0]?.id) && (
                          <Grid
                            size={{
                              xs: 12,
                              sm: 6,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                              }}
                            >
                              <CheckCircleOutlined
                                style={{
                                  color: theme.palette.success.main,
                                  fontSize: 20,
                                  marginTop: 4,
                                }}
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Gói khả dụng
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="success.main"
                                  fontWeight="500"
                                >
                                  {getRemainingSessionsForPackage(
                                    coach.packages[0].id
                                  )}{" "}
                                  buổi còn lại
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>

                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            type="primary"
                            size="large"
                            icon={<BookOutlined />}
                            onClick={handleBookNow}
                            loading={bookingInProgress}
                            style={{
                              height: "auto",
                              padding: "10px 24px",
                              fontWeight: 600,
                            }}
                          >
                            Xác nhận đặt lịch
                          </Button>
                        </motion.div>
                      </Box>
                    </Paper>
                  </Box>
                ) : (
                  <Empty
                    description="Vui lòng chọn một khung giờ trên lịch để đặt lịch"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </InfoCard>
            </motion.div>

            {/* Packages Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <InfoCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Gói huấn luyện
                  </Typography>
                  <Box>
                    <Button
                      type={showPurchasedOnly ? "default" : "primary"}
                      onClick={() => setShowPurchasedOnly(!showPurchasedOnly)}
                      icon={
                        showPurchasedOnly ? (
                          <UnorderedListOutlined />
                        ) : (
                          <ShoppingCartOutlined />
                        )
                      }
                    >
                      {showPurchasedOnly ? "Tất cả gói" : "Gói đã mua"}
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {loadingPackages ? (
                  <Box sx={{ p: 4 }}>
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                  </Box>
                ) : packages.length === 0 ? (
                  <Empty description="Không có gói huấn luyện nào khả dụng" />
                ) : (
                  <Grid container spacing={3}>
                    {packages
                      .filter(
                        (pkg) => !showPurchasedOnly || hasUserPurchased(pkg.id)
                      )
                      .map((pkg, index) => {
                        const purchased = hasUserPurchased(pkg.id);
                        const remainingSessions =
                          getRemainingSessionsForPackage(pkg.id);
                        const promotion = getPromoForPackage(pkg.id);
                        const originalPrice = pkg.price;
                        const discountedPrice = promotion
                          ? calculateDiscountedPrice(originalPrice, promotion)
                          : originalPrice;
                        const discount = promotion
                          ? originalPrice - discountedPrice
                          : 0;
                        const discountPercent =
                          promotion && promotion.discountType === "percentage"
                            ? promotion.discountValue
                            : Math.round((discount / originalPrice) * 100);

                        return (
                          <Grid
                            key={pkg.id}
                            size={{
                              xs: 12,
                              md: 6,
                            }}
                          >
                            <PackageCard
                              whileHover={{ y: -8 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              style={{
                                border: purchased
                                  ? `2px solid ${theme.palette.success.main}`
                                  : "1px solid rgba(0,0,0,0.08)",
                              }}
                            >
                              {/* Promotion badge if available */}
                              {promotion && (
                                <PromotionBadge>
                                  Giảm {formatDiscount(promotion)}
                                </PromotionBadge>
                              )}

                              <Box
                                sx={{
                                  p: 3,
                                  borderBottom: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  fontWeight="600"
                                  gutterBottom
                                >
                                  {pkg.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ minHeight: 40 }}
                                >
                                  {pkg.description ||
                                    "Gói buổi tập với giá ưu đãi"}
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    color={
                                      promotion ? "error.main" : "text.primary"
                                    }
                                  >
                                    {formatPrice(discountedPrice)}
                                  </Typography>

                                  {promotion && (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        ml: 1,
                                        textDecoration: "line-through",
                                        color: "text.disabled",
                                      }}
                                    >
                                      {formatPrice(originalPrice)}
                                    </Typography>
                                  )}
                                </Box>

                                <Stack spacing={1.5} sx={{ mb: 3 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{
                                        color: theme.palette.success.main,
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {pkg.sessionCount} buổi tập
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{
                                        color: theme.palette.success.main,
                                      }}
                                    />
                                    <Typography variant="body2">
                                      Hiệu lực trong 30 ngày
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{
                                        color: theme.palette.success.main,
                                      }}
                                    />
                                    <Typography variant="body2">
                                      Tiết kiệm{" "}
                                      {promotion
                                        ? discountPercent
                                        : Math.round(
                                            ((pkg.sessionCount *
                                              coach.ratePerHour -
                                              pkg.price) /
                                              (pkg.sessionCount *
                                                coach.ratePerHour)) *
                                              100
                                          )}
                                      %
                                    </Typography>
                                  </Box>
                                </Stack>

                                {purchased ? (
                                  <Box sx={{ mt: "auto" }}>
                                    <Alert
                                      type="success"
                                      icon={<CheckCircleOutlined />}
                                      message={
                                        <Box>
                                          <Typography
                                            variant="body2"
                                            fontWeight="500"
                                          >
                                            Gói đã được mua
                                          </Typography>
                                          <Typography variant="body2">
                                            Còn {remainingSessions} /{" "}
                                            {pkg.sessionCount} buổi
                                          </Typography>
                                        </Box>
                                      }
                                      style={{ marginBottom: 16 }}
                                    />
                                    <Button
                                      block
                                      icon={<CalendarOutlined />}
                                      onClick={() => {
                                        const bookingSection =
                                          document.getElementById(
                                            "booking-section"
                                          );
                                        if (bookingSection) {
                                          bookingSection.scrollIntoView({
                                            behavior: "smooth",
                                          });
                                        }
                                      }}
                                    >
                                      Đặt lịch ngay
                                    </Button>
                                  </Box>
                                ) : (
                                  <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={() => handlePurchasePackage(pkg)}
                                    loading={
                                      purchasingPackage &&
                                      selectedPackage?.id === pkg.id
                                    }
                                  >
                                    Mua gói
                                  </Button>
                                )}
                              </Box>
                            </PackageCard>
                          </Grid>
                        );
                      })}
                  </Grid>
                )}
              </InfoCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

// Add this component inside CoachDetails but before the return statement
const RatingSummary = ({ coachReviews, totalCount }) => {
  // Skip if we have no reviews
  if (coachReviews.length === 0) return null;

  // Count reviews by rating
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  coachReviews.forEach((review) => {
    const rating = Math.floor(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating]++;
    }
  });

  return (
    <Box>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratingCounts[rating] || 0;
        const percent = totalCount ? Math.round((count / totalCount) * 100) : 0;

        return (
          <Box
            key={rating}
            sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 1 }}
          >
            <Box sx={{ width: 16, display: "flex", alignItems: "center" }}>
              <Typography variant="caption" fontWeight="medium">
                {rating}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, mx: 1 }}>
              <Progress
                percent={percent}
                size="small"
                showInfo={false}
                strokeColor={{
                  "0%":
                    rating >= 4
                      ? "#52c41a"
                      : rating >= 3
                      ? "#faad14"
                      : "#f5222d",
                  "100%":
                    rating >= 4
                      ? "#95de64"
                      : rating >= 3
                      ? "#ffd666"
                      : "#ff7875",
                }}
                trailColor="#f5f5f5"
              />
            </Box>
            <Box sx={{ width: 36, textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                {count}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CoachDetails;
