import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Rate,
  Tag,
  Input,
  Select,
  Button,
  Slider,
  Spin,
  Empty,
  message,
  Space,
  Avatar,
  Divider,
  Typography,
  List,
  Modal,
  Badge,
  DatePicker,
  Calendar,
  Radio,
  Tooltip,
  Progress,
  Pagination,
  Collapse,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  UserOutlined,
  StarOutlined,
  DollarOutlined,
  CalendarOutlined,
  RightOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  InfoCircleOutlined,
  UnorderedListOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Container,
  Typography as MuiTypography,
  Chip as MuiChip,
  useMediaQuery,
  Stack,
  LinearProgress,
  Fade,
  Zoom,
} from "@mui/material";
import {
  SportsTennis,
  SportsBasketball,
  DirectionsRun,
  Pool,
  FitnessCenter,
  EventAvailable as EventAvailableIcon,
  EventBusy,
} from "@mui/icons-material";
import { Client } from "@/API/CoachApi";
import { Client as CourtClient } from "@/API/CourtApi";
import { Client as PaymentClient } from "@/API/PaymentApi";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

const { Option } = Select;
const { Search } = Input;
const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

// Enhanced styled components with animation effects
const StyledCard = styled(motion.div)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  height: "100%",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },
}));

const CardMedia = styled(Box)(({ theme }) => ({
  height: 180,
  overflow: "hidden",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  },
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  position: "relative",
}));

const CoachAvatar = styled(Avatar)(({ theme }) => ({
  border: "3px solid white",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: 80,
  height: 80,
  position: "absolute",
  top: -40,
  left: 24,
  transition: "all 0.3s ease",
}));

const CoachName = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  marginTop: 40,
  marginBottom: 8,
  transition: "all 0.2s ease",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const PriceChip = styled(MuiChip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.dark,
  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  backdropFilter: "blur(5px)",
}));

const StyledRate = styled(Rate)({
  fontSize: "16px",
});

const AnimatedTag = styled(Tag)(({ theme }) => ({
  margin: "0 4px 4px 0",
  borderRadius: "12px",
  padding: "3px 10px",
  fontSize: "0.8rem",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  marginBottom: theme.spacing(4),
}));

const ButtonWithIcon = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  height: "auto",
  padding: "8px 16px",
  borderRadius: "12px",
  fontWeight: 500,
}));

const AnimatedButton = styled(motion.div)(({ theme }) => ({
  width: "100%",
}));

const CoachBio = styled(Paragraph)(({ theme }) => ({
  margin: "12px 0",
  color: alpha("#000", 0.7),
  fontSize: "0.9rem",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.5,
}));

const BookingModalContent = styled(Box)(({ theme }) => ({
  maxWidth: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

const TimeSlot = styled(Paper)(({ theme, $isAvailable, $isSelected }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  cursor: $isAvailable ? "pointer" : "default",
  border: $isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: !$isAvailable
    ? alpha(theme.palette.grey[100], 0.7)
    : $isSelected
    ? alpha(theme.palette.primary.main, 0.1)
    : "#fff",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: $isAvailable && !$isSelected ? "translateY(-3px)" : "none",
    boxShadow:
      $isAvailable && !$isSelected ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
  },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// New components for the booking modal
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

// Sport Icon Component
const SportIcon = ({ sport }) => {
  // Map sport names to icons
  switch (sport?.toLowerCase()) {
    case "tennis":
      return <SportsTennis />;
    case "basketball":
      return <SportsBasketball />;
    case "swimming":
      return <Pool />;
    case "gym":
      return <FitnessCenter />;
    default:
      return <DirectionsRun />;
  }
};

// Helper function to format price
const formatPrice = (price) => {
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

// Helper functions for the booking modal
const generateDateArray = (startDate, days = 7) => {
  const dates = [];
  const start = dayjs(startDate).startOf("day");
  for (let i = 0; i < days; i++) {
    dates.push(start.add(i, "day"));
  }
  return dates;
};

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

// Loading skeleton component
const CoachSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Grid
        key={item}
        size={{
          xs: 12,
          sm: 6,
          md: 4
        }}>
        <Paper
          sx={{ p: 0, height: "100%", borderRadius: 4, overflow: "hidden" }}
        >
          <Box sx={{ height: 180, bgcolor: "grey.200" }} />
          <Box sx={{ p: 3, position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "grey.300",
                  position: "absolute",
                  top: -40,
                  left: 24,
                }}
              />
              <Box sx={{ ml: 2, width: "100%", mt: 5 }}>
                <Box
                  sx={{
                    height: 24,
                    width: "70%",
                    bgcolor: "grey.300",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    height: 16,
                    width: "40%",
                    bgcolor: "grey.300",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  height: 16,
                  width: "90%",
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  width: "80%",
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  width: "60%",
                  bgcolor: "grey.200",
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Box
                sx={{
                  height: 36,
                  width: "45%",
                  bgcolor: "grey.300",
                  borderRadius: 2,
                }}
              />
              <Box
                sx={{
                  height: 36,
                  width: "45%",
                  bgcolor: "grey.300",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

const CoachList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State variables
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState(undefined);
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [sortOrder, setSortOrder] = useState("rating");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });
  const [error, setError] = useState(null);
  const [favoriteCoaches, setFavoriteCoaches] = useState([]);
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Booking modal states
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarDates, setCalendarDates] = useState([]);
  const [calendarStartDate, setCalendarStartDate] = useState(dayjs());
  const [coachSchedules, setCoachSchedules] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedPackageRef, setSelectedPackageRef] = useState(null);
  const [userPurchases, setUserPurchases] = useState([]);

  // Intersection observer for animation
  const { ref: cardRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const client = new Client();
  const courtClient = new CourtClient();
  const paymentClient = new PaymentClient();

  // Initialize calendar dates
  useEffect(() => {
    setCalendarDates(generateDateArray(calendarStartDate, 7));
  }, [calendarStartDate]);

  // Fetch coaches based on current filters
  useEffect(() => {
    fetchCoaches();
    fetchSports();

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favoriteCoaches");
    if (storedFavorites) {
      try {
        setFavoriteCoaches(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error parsing favorites from localStorage:", e);
      }
    }
  }, [pagination.current, selectedSport, priceRange, sortOrder]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert empty strings to undefined and null to undefined
      const nameParam = searchText === "" ? undefined : searchText;
      const sportIdParam = selectedSport === null ? undefined : selectedSport;
      const minPriceParam = priceRange[0];
      const maxPriceParam = priceRange[1];

      // Convert from 1-based UI pagination to 0-based API pagination
      const pageIndex = pagination.current - 1;
      const pageSize = pagination.pageSize;

      // Call the API with all parameters including pagination
      const response = await client.getCoaches(
        nameParam,
        sportIdParam,
        minPriceParam,
        maxPriceParam,
        pageIndex,
        pageSize
      );

      if (response) {
        // Extract coaches from data array in response
        const coachesData = response.data || [];

        setCoaches(coachesData);
        setPagination({
          ...pagination,
          total: response.count || 0,
        });
      } else {
        setCoaches([]);
        setPagination({
          ...pagination,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
      setError("Không thể tải dữ liệu huấn luyện viên. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu huấn luyện viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await courtClient.getSports();
      if (response) {
        setSports(response.sports || []);
      }
    } catch (err) {
      console.error("Error fetching sports:", err);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Reset pagination when searching
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSportChange = (value) => {
    // If user clears the selection, set to undefined, not null
    setSelectedSport(value === null ? undefined : value);
    // Reset pagination when changing filters
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    // Reset pagination when changing filters
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      current: page,
    });
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    // Reset to empty string instead of undefined
    setSearchText("");
    // Set to undefined instead of null
    setSelectedSport(undefined);
    setPriceRange([100000, 500000]);
    setSortOrder("rating");
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Handle favorite toggle
  const toggleFavorite = (coachId) => {
    const newFavorites = favoriteCoaches.includes(coachId)
      ? favoriteCoaches.filter((id) => id !== coachId)
      : [...favoriteCoaches, coachId];

    setFavoriteCoaches(newFavorites);
    localStorage.setItem("favoriteCoaches", JSON.stringify(newFavorites));

    // Show toast notification
    if (newFavorites.includes(coachId)) {
      toast.success("Đã thêm huấn luyện viên vào danh sách yêu thích");
    } else {
      toast("Đã xóa khỏi danh sách yêu thích");
    }
  };

  // Function to open booking modal with selected coach
  const handleBookNow = async (coach) => {
    setSelectedCoach(coach);
    setBookingModalVisible(true);
    setSelectedDate(dayjs());
    setSelectedSlot(null);

    // Fetch coach schedules
    setLoadingSchedules(true);
    try {
      const startDate = dayjs().format("YYYY-MM-DD");
      const endDate = dayjs().add(30, "day").format("YYYY-MM-DD");

      const schedulesData = await client.getPublicCoachSchedules(
        coach.id,
        startDate,
        endDate,
        1,
        100
      );

      setCoachSchedules(schedulesData.schedules || []);

      // Also fetch user's purchases for this coach
      try {
        const purchases = await client.getHistoryPurchase(
          false,
          false,
          coach.id
        );
        setUserPurchases(purchases || []);
      } catch (err) {
        console.error("Failed to fetch user purchases:", err);
      }
    } catch (err) {
      console.error("Error fetching coach schedules:", err);
      message.error("Không thể tải lịch trình của huấn luyện viên");
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Function to close booking modal
  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
    setSelectedCoach(null);
    setSelectedDate(dayjs());
    setSelectedSlot(null);
  };

  // Function to get slots for a specific date
  const getSlotsForDate = (date) => {
    // Format date to match API format
    const formattedDate = date.format("YYYY-MM-DD");

    // Return slots for the current date
    return coachSchedules
      .filter(
        (slot) => slot.date === formattedDate && slot.status === "available"
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Function to confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedCoach || !selectedSlot) {
      toast.error("Vui lòng chọn một khung giờ phù hợp");
      return;
    }

    // Show confirmation modal
    Modal.confirm({
      title: "Xác nhận đặt lịch",
      icon: <BookOutlined style={{ color: theme.palette.primary.main }} />,
      width: 500,
      content: (
        <Box sx={{ mt: 2 }}>
          <MuiTypography variant="subtitle1" gutterBottom>
            Bạn chuẩn bị đặt lịch một buổi tập với:
          </MuiTypography>

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
                    src={selectedCoach.avatar}
                    alt={selectedCoach.fullName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <MuiTypography variant="h6">
                    {selectedCoach.fullName}
                  </MuiTypography>
                </Box>
              </Grid>

              <Grid size={6}>
                <MuiTypography variant="body2" color="text.secondary">
                  Ngày:
                </MuiTypography>
                <MuiTypography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <EventAvailableIcon fontSize="small" color="primary" />
                  {dayjs(selectedSlot.date).format("dddd, DD/MM/YYYY")}
                </MuiTypography>
              </Grid>

              <Grid size={6}>
                <MuiTypography variant="body2" color="text.secondary">
                  Thời gian:
                </MuiTypography>
                <MuiTypography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ClockCircleOutlined
                    style={{ color: theme.palette.primary.main, fontSize: 16 }}
                  />
                  {formatTime(selectedSlot.startTime)} -{" "}
                  {formatTime(selectedSlot.endTime)}
                </MuiTypography>
              </Grid>

              <Grid size={6}>
                <MuiTypography variant="body2" color="text.secondary">
                  Giá buổi tập:
                </MuiTypography>
                <MuiTypography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DollarOutlined
                    style={{
                      color: theme.palette.success.main,
                      fontSize: 16,
                    }}
                  />
                  {formatPrice(selectedCoach.ratePerHour)}
                </MuiTypography>
              </Grid>
            </Grid>
          </Box>

          <MuiTypography variant="body2" color="text.secondary">
            Số tiền sẽ được trừ từ ví của bạn sau khi xác nhận.
          </MuiTypography>
        </Box>
      ),
      okText: "Xác nhận đặt lịch",
      cancelText: "Hủy",
      onOk: async () => {
        setBookingInProgress(true);
        try {
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
          const localStartTimeISO = createLocalISOString(startDate);
          const localEndTimeISO = createLocalISOString(endDate);

          // Create booking request
          const bookingRequest = {
            coachId: selectedCoach.id,
            sportId: selectedCoach.sportIds?.[0],
            startTime: localStartTimeISO,
            endTime: localEndTimeISO,
          };

          // Create the booking
          const bookingResult = await client.createBooking(bookingRequest);

          // Calculate hours difference for price
          const hours = (endDate - startDate) / (1000 * 60 * 60);
          const totalPrice = selectedCoach.ratePerHour * hours;

          // Process payment
          const paymentRequest = {
            amount: totalPrice,
            description: `Booking with ${selectedCoach.fullName}`,
            paymentType: "Booking",
            referenceId: bookingResult.id,
            coachId: selectedCoach.id,
            bookingId: bookingResult.id,
            status: "Completed",
          };

          await paymentClient.processBookingPayment(paymentRequest);

          // Show success message
          toast.success("Lịch đã được đặt thành công!");

          // Reset selection and close modal
          setSelectedSlot(null);
          setBookingModalVisible(false);

          // Success modal
          Modal.success({
            title: "Lịch đã được xác nhận",
            content: (
              <Box sx={{ mt: 2 }}>
                <MuiTypography variant="subtitle1" gutterBottom>
                  Buổi tập của bạn đã được đặt lịch thành công!
                </MuiTypography>
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
                      <MuiTypography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventAvailableIcon fontSize="small" color="primary" />
                        {dayjs(selectedSlot.date).format("dddd, DD/MM/YYYY")}
                      </MuiTypography>
                    </Grid>
                    <Grid size={12}>
                      <MuiTypography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ClockCircleOutlined
                          style={{
                            color: theme.palette.primary.main,
                            fontSize: 16,
                          }}
                        />
                        {formatTime(selectedSlot.startTime)} -{" "}
                        {formatTime(selectedSlot.endTime)}
                      </MuiTypography>
                    </Grid>
                  </Grid>
                </Box>
                <MuiTypography variant="body2" sx={{ mt: 2 }}>
                  Bạn có thể xem và quản lý lịch đặt của bạn trong bảng điều
                  khiển cá nhân.
                </MuiTypography>
              </Box>
            ),
            okText: "Đi đến lịch đặt",
            onOk: () => navigate("/user/coachings"),
            cancelText: "Ở lại trang này",
            okCancel: true,
          });
        } catch (err) {
          console.error("Failed to create booking:", err);
          const errorMessage =
            err.response?.data?.message ||
            "Failed to create booking. Please try again.";
          toast.error(errorMessage);

          Modal.error({
            title: "Đặt lịch thất bại",
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

  // Function to move calendar dates
  const moveCalendarDays = (direction) => {
    const newStartDate =
      direction === "next"
        ? calendarStartDate.add(7, "day")
        : calendarStartDate.subtract(7, "day");
    setCalendarStartDate(newStartDate);
  };

  // Function to get sport name by ID
  const getSportNameById = (sportId) => {
    const sport = sports.find((s) => s.id === sportId);
    return sport ? sport.name : "Unknown Sport";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <MuiTypography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Tìm huấn luyện viên
          </MuiTypography>
          <MuiTypography variant="body1" color="text.secondary">
            Khám phá các huấn luyện viên chất lượng cao trong khu vực của bạn
          </MuiTypography>
        </Box>

        {isMobile && (
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
            style={{ marginBottom: showFilters ? 16 : 0 }}
          >
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
        )}
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showFilters && (
          <FilterContainer>
            <Grid container spacing={3}>
              {/* Search */}
              <Grid
                size={{
                  xs: 12,
                  md: 4
                }}>
                <MuiTypography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  Tìm kiếm
                </MuiTypography>
                <Search
                  allowClear
                  placeholder="Tên huấn luyện viên..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  prefix={<SearchOutlined />}
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Grid>

              {/* Sport Filter */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <MuiTypography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  Môn thể thao
                </MuiTypography>
                <Select
                  placeholder="Chọn môn thể thao"
                  allowClear
                  value={selectedSport}
                  onChange={handleSportChange}
                  style={{ width: "100%" }}
                  size="large"
                >
                  {sports.map((sport) => (
                    <Option key={sport.id} value={sport.id}>
                      <Space align="center">
                        <SportIcon sport={sport.name} />
                        <span>{sport.name}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Grid>

              {/* Price Range Filter */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <MuiTypography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  Khoảng giá (VND)
                </MuiTypography>
                <Slider
                  range
                  value={priceRange}
                  onChange={handlePriceChange}
                  min={50000}
                  max={2000000}
                  step={50000}
                  marks={{
                    50000: "50K",
                    2000000: "2M",
                  }}
                  tooltip={{
                    formatter: (value) => `${value.toLocaleString()} VND`,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <MuiTypography variant="caption" color="text.secondary">
                    {priceRange[0].toLocaleString()} VND
                  </MuiTypography>
                  <MuiTypography variant="caption" color="text.secondary">
                    {priceRange[1].toLocaleString()} VND
                  </MuiTypography>
                </Box>
              </Grid>

              {/* Sort and Reset */}
              <Grid
                size={{
                  xs: 12,
                  md: 2
                }}>
                <MuiTypography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  Sắp xếp theo
                </MuiTypography>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Select
                    defaultValue="rating"
                    value={sortOrder}
                    onChange={handleSortChange}
                    style={{ width: "100%" }}
                    size="large"
                  >
                    <Option value="rating">
                      <Space>
                        <StarOutlined />
                        Đánh giá
                      </Space>
                    </Option>
                    <Option value="price_asc">
                      <Space>
                        <ArrowUpOutlined />
                        Giá tăng dần
                      </Space>
                    </Option>
                    <Option value="price_desc">
                      <Space>
                        <ArrowDownOutlined />
                        Giá giảm dần
                      </Space>
                    </Option>
                  </Select>
                  <Button onClick={resetFilters} icon={<FilterOutlined />}>
                    Đặt lại bộ lọc
                  </Button>
                </Space>
              </Grid>
            </Grid>
          </FilterContainer>
        )}
      </motion.div>
      {loading ? (
        <CoachSkeleton />
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Box>
      ) : coaches.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Empty description="Không tìm thấy huấn luyện viên phù hợp" />
        </Box>
      ) : (
        <>
          <MuiTypography variant="body2" sx={{ mb: 3 }}>
            Hiển thị {coaches.length} huấn luyện viên trong tổng số{" "}
            {pagination.total} kết quả
          </MuiTypography>

          <Grid container spacing={4} ref={cardRef}>
            {coaches.map((coach, index) => (
              <Grid
                key={coach.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StyledCard
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardMedia
                      sx={{
                        backgroundImage: `url(${
                          coach.avatar ||
                          "https://source.unsplash.com/random/300x180/?sport"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Favorite button */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                        }}
                      >
                        <Button
                          shape="circle"
                          icon={
                            favoriteCoaches.includes(coach.id) ? (
                              <HeartFilled style={{ color: "#ff4d4f" }} />
                            ) : (
                              <HeartOutlined />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(coach.id);
                          }}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(4px)",
                          }}
                          size="large"
                        />
                      </motion.div>

                      {/* Price chip */}
                      <PriceChip
                        label={formatPrice(coach.ratePerHour) + "/giờ"}
                        icon={<DollarOutlined />}
                      />
                    </CardMedia>

                    <CardContent>
                      <CoachAvatar src={coach.avatar} alt={coach.fullName} />

                      <CoachName variant="h6">{coach.fullName}</CoachName>

                      {/* Rating */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <StyledRate
                          disabled
                          defaultValue={coach.rating || 4}
                          allowHalf
                        />
                        <Text style={{ marginLeft: 8, fontWeight: 500 }}>
                          {coach.rating || 4}
                        </Text>
                      </Box>

                      {/* Sport tags */}
                      <Box sx={{ mb: 2 }}>
                        {coach.sportIds &&
                          coach.sportIds.map((sportId) => (
                            <AnimatedTag
                              key={sportId}
                              color="processing"
                              icon={
                                <SportIcon sport={getSportNameById(sportId)} />
                              }
                            >
                              {getSportNameById(sportId)}
                            </AnimatedTag>
                          ))}
                      </Box>

                      {/* Bio */}
                      <CoachBio>
                        {coach.bio ||
                          "Huấn luyện viên chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực đào tạo và huấn luyện thể thao."}
                      </CoachBio>

                      {/* Actions */}
                      <Space
                        size="large"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: "16px",
                        }}
                      >
                        <AnimatedButton
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          style={{ flex: 1, marginRight: 8 }}
                        >
                          <ButtonWithIcon
                            type="default"
                            icon={<RightOutlined />}
                            onClick={() => navigate(`/coaches/${coach.id}`)}
                            block
                          >
                            Xem chi tiết
                          </ButtonWithIcon>
                        </AnimatedButton>

                        <AnimatedButton
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          style={{ flex: 1 }}
                        >
                          <ButtonWithIcon
                            type="primary"
                            icon={<BookOutlined />}
                            onClick={() => handleBookNow(coach)}
                            block
                          >
                            Đặt lịch ngay
                          </ButtonWithIcon>
                        </AnimatedButton>
                      </Space>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {pagination.total > pagination.pageSize && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </Box>
          )}
        </>
      )}
      {/* Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        onCancel={handleCloseBookingModal}
        footer={null}
        width={800}
        centered
        zIndex={10500}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CalendarOutlined />
            <MuiTypography variant="h6">
              Đặt lịch với {selectedCoach?.fullName}
            </MuiTypography>
          </Box>
        }
      >
        {selectedCoach && (
          <BookingModalContent>
            {/* Coach info summary */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={selectedCoach.avatar}
                  alt={selectedCoach.fullName}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <MuiTypography variant="h6">
                    {selectedCoach.fullName}
                  </MuiTypography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Rate
                      disabled
                      defaultValue={selectedCoach.rating || 4}
                      style={{ fontSize: 16 }}
                    />
                    <MuiTypography variant="body2" color="text.secondary">
                      ({selectedCoach.rating || 4})
                    </MuiTypography>
                  </Box>
                  <MuiChip
                    label={formatPrice(selectedCoach.ratePerHour) + "/giờ"}
                    size="small"
                    color="success"
                    variant="outlined"
                    icon={<DollarOutlined />}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loadingSchedules ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Spin size="large" tip="Đang tải lịch trình..." />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  <Grid
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <MuiTypography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Chọn ngày:
                    </MuiTypography>

                    {/* Calendar header */}
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
                      <MuiTypography fontWeight="medium">
                        {calendarStartDate.format("DD/MM/YYYY")} -{" "}
                        {calendarStartDate.add(6, "days").format("DD/MM/YYYY")}
                      </MuiTypography>
                      <Button
                        onClick={() => moveCalendarDays("next")}
                        icon={
                          <LeftOutlined
                            style={{ transform: "rotate(180deg)" }}
                          />
                        }
                      >
                        Tiếp
                      </Button>
                    </Box>

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
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          borderRadius: "10px",
                        },
                      }}
                    >
                      {calendarDates.map((date, index) => {
                        const formattedDate = formatCalendarDate(date);
                        const isSelected =
                          selectedDate && selectedDate.isSame(date, "day");
                        const hasAvailableSlots =
                          getSlotsForDate(date).length > 0;

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
                              transform: isSelected
                                ? "scale(1.05)"
                                : "scale(1)",
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

                            <MuiTypography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mb: 0.5, fontWeight: "500" }}
                            >
                              {formattedDate.dayName}
                            </MuiTypography>

                            <MuiTypography
                              variant="h5"
                              sx={{
                                fontWeight: formattedDate.isToday
                                  ? "700"
                                  : "600",
                                color: formattedDate.isToday
                                  ? "primary.main"
                                  : "text.primary",
                                lineHeight: 1,
                              }}
                            >
                              {formattedDate.dayNumber}
                            </MuiTypography>

                            <MuiTypography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formattedDate.monthName}
                            </MuiTypography>

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
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <MuiTypography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Khung giờ trống ({selectedDate.format("DD/MM/YYYY")}):
                    </MuiTypography>

                    {/* Available slots */}
                    <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
                      {getSlotsForDate(selectedDate).length > 0 ? (
                        getSlotsForDate(selectedDate).map((slot, index) => {
                          const isSlotSelected =
                            selectedSlot &&
                            selectedSlot.date === slot.date &&
                            selectedSlot.startTime === slot.startTime;

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <TimeSlot
                                $isAvailable={true}
                                $isSelected={isSlotSelected}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <ClockCircleOutlined
                                    style={{
                                      color: theme.palette.primary.main,
                                      marginRight: 8,
                                      fontSize: 16,
                                    }}
                                  />
                                  <MuiTypography
                                    variant="body2"
                                    sx={{ fontWeight: "500" }}
                                  >
                                    {formatTime(slot.startTime)} -{" "}
                                    {formatTime(slot.endTime)}
                                  </MuiTypography>
                                </Box>
                                <Tag color="success">Trống</Tag>
                              </TimeSlot>
                            </motion.div>
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
                            color: "text.secondary",
                          }}
                        >
                          <EventBusy
                            sx={{ fontSize: 36, opacity: 0.4, mb: 1 }}
                          />
                          <MuiTypography>
                            Không có khung giờ trống cho ngày này
                          </MuiTypography>
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
                  </Grid>
                </Grid>

                {/* Booking summary and confirm button */}
                <Box sx={{ mt: 3 }}>
                  {selectedSlot ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.success.light, 0.05),
                      }}
                    >
                      <MuiTypography
                        variant="h6"
                        gutterBottom
                        fontWeight="medium"
                      >
                        Tóm tắt lịch đặt
                      </MuiTypography>

                      <Grid container spacing={2}>
                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <EventAvailableIcon
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                            <Box>
                              <MuiTypography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ngày
                              </MuiTypography>
                              <MuiTypography variant="body1">
                                {dayjs(selectedSlot.date).format(
                                  "dddd, DD/MM/YYYY"
                                )}
                              </MuiTypography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
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
                              <MuiTypography
                                variant="body2"
                                color="text.secondary"
                              >
                                Thời gian
                              </MuiTypography>
                              <MuiTypography variant="body1">
                                {formatTime(selectedSlot.startTime)} -{" "}
                                {formatTime(selectedSlot.endTime)}
                              </MuiTypography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
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
                              <MuiTypography
                                variant="body2"
                                color="text.secondary"
                              >
                                Giá buổi tập
                              </MuiTypography>
                              <MuiTypography variant="body1" fontWeight="500">
                                {formatPrice(selectedCoach.ratePerHour)}
                              </MuiTypography>
                            </Box>
                          </Box>
                        </Grid>
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
                            onClick={handleConfirmBooking}
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
                  ) : (
                    <Empty description="Vui lòng chọn một khung giờ trên lịch để đặt lịch" />
                  )}
                </Box>
              </>
            )}
          </BookingModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default CoachList;
