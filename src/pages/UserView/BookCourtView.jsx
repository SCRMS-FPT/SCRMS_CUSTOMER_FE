import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Client as CourtClient } from "../../API/CourtApi";
import { Client as PaymentClient } from "../../API/PaymentApi";
import { Button, Modal, Tooltip } from "antd";
import {
  WalletOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Typography,
  Steps,
  Card,
  DatePicker,
  Row,
  Col,
  Space,
  Tag,
  Badge,
  Form,
  Checkbox,
  Radio,
  Alert,
  Divider,
  List,
  Avatar,
  Result,
  Spin,
  Empty,
  Statistic,
  message,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TagOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_PAYMENT_URL } from "../../API/config";
import { ProcessPaymentRequest } from "../../API/PaymentApi";
import {
  StarFilled,
  StarOutlined,
  MessageOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Rate, Skeleton } from "antd";
import { Client as ReviewClient } from "../../API/ReviewApi";
import * as Separator from "@radix-ui/react-separator";
import { format } from "date-fns";
const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;

// API client instance
const apiClient = new CourtClient();
const paymentClient = new PaymentClient();

// Helper function to format date
const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

// Format address
const formatAddress = (sportCenter) => {
  if (!sportCenter) return "";
  const parts = [];
  if (sportCenter.addressLine) parts.push(sportCenter.addressLine);
  if (sportCenter.commune) parts.push(sportCenter.commune);
  if (sportCenter.district) parts.push(sportCenter.district);
  if (sportCenter.city) parts.push(sportCenter.city);
  return parts.join(", ");
};

const BookCourtView = () => {
  const { id } = useParams(); // This is the sportCenterId from URL
  const location = useLocation();
  const navigate = useNavigate();

  // State for API data
  const [sportCenter, setSportCenter] = useState(null);
  const [courts, setCourts] = useState([]);
  // Remove the single court selection and use an array for multiple selection
  const [selectedCourtIds, setSelectedCourtIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  // Booking states
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate ? dayjs(location.state.selectedDate) : dayjs()
  );
  // Track available slots for each court
  const [availableSlotsMap, setAvailableSlotsMap] = useState({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  // Add state for price calculation
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceDetails, setPriceDetails] = useState(null);
  const [bookingNote, setBookingNote] = useState("");
  // Add these state variables inside BookCourtView component
  const [courtReviews, setCourtReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsPageSize, setReviewsPageSize] = useState(5);
  const [reviewsTotalCount, setReviewsTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const reviewClient = new ReviewClient();
  // Add this state variable
  const [paymentChoice, setPaymentChoice] = useState("deposit"); // 'deposit' or 'full'
  // UI states
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: "Chọn thời gian",
      icon: <CalendarOutlined />,
    },
    {
      title: "Thông tin của bạn",
      icon: <UserOutlined />,
    },
    {
      title: "Thanh toán",
      icon: <CreditCardOutlined />,
    },
  ];
  // Add this function in the component
  const fetchCourtReviews = useCallback(
    async (courtId) => {
      if (!courtId) return;

      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const response = await reviewClient.getReviews(
          "court",
          courtId,
          reviewsPage,
          reviewsPageSize
        );

        // Parse response JSON
        const responseData = await response;

        if (responseData && responseData.data) {
          setCourtReviews(responseData.data || []);
          setReviewsTotalCount(responseData.data.totalCount || 0);

          // Calculate average rating
          if (responseData.data.items && responseData.data.length > 0) {
            const sum = responseData.data.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            setAverageRating(sum / responseData.data.length);
          } else {
            setAverageRating(0);
          }
        } else {
          setCourtReviews([]);
          setReviewsTotalCount(0);
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching court reviews:", error);
        setReviewsError("Không thể tải đánh giá. Vui lòng thử lại sau.");
        setCourtReviews([]);
        setReviewsTotalCount(0);
        setAverageRating(0);
      } finally {
        setReviewsLoading(false);
      }
    },
    [reviewsPage, reviewsPageSize]
  );
  // Add this function to fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      setWalletError(null);

      const paymentClient = new PaymentClient(API_PAYMENT_URL);
      const balanceResponse = await paymentClient.getWalletBalance();

      setWalletBalance(balanceResponse);
      setWalletLoading(false);

      return balanceResponse;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletError("Failed to fetch wallet balance");
      setWalletLoading(false);

      // Return a default balance of 0 when there's an error
      return { balance: 0 };
    }
  };
  // Add this useEffect to handle reviews fetching
  useEffect(() => {
    if (selectedCourtIds.length > 0) {
      const selectedCourt = courts.find(
        (court) => court.id === selectedCourtIds[0]
      );
      if (selectedCourt?.id) {
        fetchCourtReviews(selectedCourt.id);
      }
    }
  }, [selectedCourtIds, courts, fetchCourtReviews]);
  useEffect(() => {
    // Fetch wallet balance when entering payment step
    if (current === 2) {
      fetchWalletBalance();
    }
  }, [current]);
  // Check for preselected court from SportCenterDetails
  useEffect(() => {
    // If there's a preselected court in the location state, select it
    if (location.state?.preselectedCourt && courts.length > 0) {
      const preselectedCourtId = location.state.preselectedCourt;

      // Check if the preselected court exists in the available courts
      const courtExists = courts.some(
        (court) => court.id === preselectedCourtId
      );

      if (courtExists && !selectedCourtIds.includes(preselectedCourtId)) {
        setSelectedCourtIds((prev) => [...prev, preselectedCourtId]);

        // Scroll to the court selection area after a brief delay to ensure rendering
        setTimeout(() => {
          const courtSelectionElement = document.getElementById(
            "court-selection-area"
          );
          if (courtSelectionElement) {
            courtSelectionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 500);
      }
    }
  }, [courts, location.state]);
  // 1. Fetch Sport Center data
  useEffect(() => {
    const fetchSportCenterData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Sport Center ID is required");
        }

        // Fetch sport center details
        const sportCenterData = await apiClient.getSportCenterById(id);
        setSportCenter(sportCenterData);

        // Change from getAllCourtsOfSportCenter to getCourts with sportCenterId parameter
        const courtsResponse = await apiClient.getCourts(
          0, // pageIndex
          50, // pageSize - set to a high number to get all courts
          id, // sportCenterId
          undefined, // sportId - not filtering by sport
          undefined // courtType - not filtering by court type
        );

        if (
          courtsResponse &&
          courtsResponse.courts &&
          courtsResponse.courts.data &&
          courtsResponse.courts.data.length > 0
        ) {
          // Update to use the data array from the paginated result
          setCourts(courtsResponse.courts.data);
        } else {
          setCourts([]);
          setError("No courts available for this sport center");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load sport center details. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchSportCenterData();
  }, [id]);

  // 2. Fetch available slots when court and date are selected
  useEffect(() => {
    // Replace or update the fetchAvailableSlots function

    const fetchAvailableSlots = async () => {
      if (selectedCourtIds.length === 0 || !selectedDate) return;

      try {
        setLoadingSlots(true);
        const isToday = selectedDate.isSame(dayjs(), "day");
        const currentHour = dayjs().hour();
        const currentMinute = dayjs().minute();

        const newSlotsMap = {};

        await Promise.all(
          selectedCourtIds.map(async (courtId) => {
            const startDate = selectedDate.startOf("day").toDate();
            const endDate = selectedDate.endOf("day").toDate();

            const response = await apiClient.getCourtAvailability(
              courtId,
              startDate,
              endDate
            );

            if (response && response.schedule && response.schedule.length > 0) {
              const dailySchedule = response.schedule[0];
              let slots = dailySchedule.timeSlots || [];

              // Process each time slot
              slots = slots.map((slot) => {
                // By default, use the API-provided availability status
                const isApiAvailable = slot.status === "AVAILABLE";

                // Check if it's a past slot (only for today)
                let isPastSlot = false;

                if (isToday) {
                  const slotStartParts = slot.startTime?.split(":");
                  if (slotStartParts && slotStartParts.length >= 2) {
                    const slotHour = parseInt(slotStartParts[0], 10);
                    const slotMinute = parseInt(slotStartParts[1], 10);

                    // Mark as past if the slot time is earlier than current time
                    isPastSlot =
                      slotHour < currentHour ||
                      (slotHour === currentHour && slotMinute <= currentMinute);
                  }
                }

                // If slot is in the past (for today), mark it as unavailable
                // Otherwise, keep its original API status
                return {
                  ...slot,
                  isPastSlot: isPastSlot,
                  isAvailable: isApiAvailable && !isPastSlot,
                  courtId: courtId,
                  displayTime: `${slot.startTime} - ${slot.endTime}`,
                };
              });

              newSlotsMap[courtId] = slots;
            }
          })
        );

        setAvailableSlotsMap(newSlotsMap);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        message.error("Failed to load available time slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedCourtIds, selectedDate]);

  // 3. New function to calculate booking price using the API
  const calculateBookingPrice = useCallback(async () => {
    if (Object.keys(selectedTimeSlots).length === 0) return;

    try {
      setPriceLoading(true);

      // Create booking details for the API request
      const bookingDetails = [];
      Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
        slots.forEach((slot) => {
          bookingDetails.push({
            courtId: courtId,
            startTime: slot.startTime + ":00",
            endTime: slot.endTime + ":00",
          });
        });
      });

      const request = {
        booking: {
          bookingDate: selectedDate.format("YYYY-MM-DD"),
          bookingDetails: bookingDetails,
        },
      };

      // Call the API
      const response = await apiClient.calculateBookingPrice(request);
      setPriceDetails(response);
    } catch (err) {
      console.error("Error calculating price:", err);
      message.error("Failed to calculate booking price");
    } finally {
      setPriceLoading(false);
    }
  }, [selectedTimeSlots, selectedDate, apiClient]);

  // Call price calculation when slots change or moving to next step
  useEffect(() => {
    if (Object.keys(selectedTimeSlots).length > 0) {
      calculateBookingPrice();
    } else {
      setPriceDetails(null);
    }
  }, [selectedTimeSlots, calculateBookingPrice]);

  // Handle court selection
  const handleCourtSelect = (courtId) => {
    setSelectedCourtIds((prevSelectedCourts) => {
      // If court is already selected, remove it
      if (prevSelectedCourts.includes(courtId)) {
        // Also remove any selected slots for this court
        setSelectedTimeSlots((prev) => {
          const newSlots = { ...prev };
          delete newSlots[courtId];
          return newSlots;
        });
        return prevSelectedCourts.filter((id) => id !== courtId);
      }
      // Otherwise add it
      return [...prevSelectedCourts, courtId];
    });
  };

  // Toggle time slot selection
  // Update the toggleTimeSlot function to include promotion discount
  const toggleTimeSlot = (slot) => {
    if (!slot.isAvailable) return;

    setSelectedTimeSlots((prevSlots) => {
      const newSlots = { ...prevSlots };

      // Initialize court array if it doesn't exist
      if (!newSlots[slot.courtId]) {
        newSlots[slot.courtId] = [];
      }

      // Check if slot is already selected for this court
      const courtSlots = newSlots[slot.courtId];
      const slotIndex = courtSlots.findIndex(
        (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
      );

      if (slotIndex >= 0) {
        // Remove slot if already selected
        courtSlots.splice(slotIndex, 1);
        // Remove court entirely if no slots left
        if (courtSlots.length === 0) {
          delete newSlots[slot.courtId];
        }
      } else {
        // Get active promotions for this court
        const court = courts.find((c) => c.id === slot.courtId);
        const activePromos = getActivePromotions(court);

        // Add slot with original and discounted price
        const slotWithDiscount = {
          ...slot,
          originalPrice: slot.price,
          price:
            activePromos.length > 0
              ? calculateDiscountedPrice(slot.price, activePromos[0])
              : slot.price,
        };

        // Add slot, maintaining chronological order
        courtSlots.push(slotWithDiscount);
        courtSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      }

      return newSlots;
    });
  };

  // Calculate pricing
  const calculateSubtotal = () => {
    let total = 0;

    Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
      slots.forEach((slot) => {
        total += slot.price || 0;
      });
    });

    return total;
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const formatPromotion = (promotion) => {
    if (promotion.discountType === "Percentage") {
      return `${promotion.discountValue}% off`;
    } else if (promotion.discountType === "FixedAmount") {
      return `${new Intl.NumberFormat("vi-VN").format(
        promotion.discountValue
      )} VND off`;
    }
    return "";
  };

  // Get active promotions from a court
  const getActivePromotions = (court) => {
    if (!court || !court.promotions || court.promotions.length === 0) {
      return [];
    }

    const now = dayjs();
    return court.promotions.filter((promo) => {
      const validFrom = dayjs(promo.validFrom);
      const validTo = dayjs(promo.validTo);
      return now.isAfter(validFrom) && now.isBefore(validTo);
    });
  };
  const calculateDiscountedPrice = (price, promotion) => {
    if (!promotion) return price;

    if (promotion.discountType === "Percentage") {
      return price * (1 - promotion.discountValue / 100);
    } else if (promotion.discountType === "FixedAmount") {
      return Math.max(0, price - promotion.discountValue);
    }

    return price;
  };
  // Get the currently selected court (first one if multiple are selected)
  // Update or replace the getSelectedCourt function
  const getSelectedCourt = () => {
    if (selectedCourtIds.length === 0) return null;
    return courts.find((court) => court.id === selectedCourtIds[0]) || null;
  };

  // Steps navigation
  // Update the next function with balance check
  const next = async () => {
    // When moving to step 2, ensure price is calculated
    if (current === 0) {
      calculateBookingPrice();
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 300);
      setCurrent(current + 1);
    }
    // Check balance before proceeding to payment step
    else if (current === 1) {
      try {
        // Show loading first
        message.loading({
          content: "Đang kiểm tra số dư ví...",
          key: "walletCheck",
        });

        // Get updated pricing if not already loaded
        if (!priceDetails) {
          await calculateBookingPrice();
        }

        // Get wallet balance
        const balanceData = await fetchWalletBalance();

        // Check if user has enough for deposit
        const minimumDeposit = priceDetails?.minimumDeposit || 0;

        if (balanceData.balance < minimumDeposit) {
          // Not enough for deposit - show modal
          message.error({
            content: "Số dư ví không đủ. Vui lòng nạp thêm tiền.",
            key: "walletCheck",
          });

          Modal.confirm({
            title: "Insufficient Wallet Balance",
            icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
            content: (
              <div>
                <p>
                  Your wallet balance is{" "}
                  {new Intl.NumberFormat("vi-VN").format(balanceData.balance)}{" "}
                  VND, but the minimum deposit required is{" "}
                  {new Intl.NumberFormat("vi-VN").format(minimumDeposit)} VND.
                </p>
                <p>Would you like to add funds to your wallet?</p>
              </div>
            ),
            okText: "Go to Wallet",
            cancelText: "Cancel",
            onOk() {
              navigate("/wallet");
            },
          });
          return;
        }

        // Enough for deposit - proceed to step 3
        message.success({
          content: "Kiểm tra ví thành công",
          key: "walletCheck",
        });
        setCurrent(current + 1);
      } catch (error) {
        message.error({
          content: "Lỗi khi kiểm tra số dư ví.",
          key: "walletCheck",
        });
        console.error("Error in wallet balance check:", error);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (Object.keys(selectedTimeSlots).length === 0) {
      message.error("Vui lòng chọn ít nhất một khung giờ");
      return;
    }

    try {
      // Show loading
      message.loading({
        content: "Đang xử lý đặt sân...",
        key: "bookingMessage",
      });

      // Check wallet balance one more time before processing
      const balanceData = await fetchWalletBalance();
      const paymentAmount =
        paymentChoice === "deposit"
          ? priceDetails?.minimumDeposit || 0
          : priceDetails?.totalPrice || 0;

      if (balanceData.balance < paymentAmount) {
        message.error({
          content: "Số dư ví không đủ. Vui lòng nạp thêm tiền.",
          key: "bookingMessage",
        });
        return;
      }

      // Create booking details array for API
      const bookingDetails = [];
      Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
        slots.forEach((slot) => {
          bookingDetails.push({
            courtId: courtId,
            startTime: slot.startTime + ":00",
            endTime: slot.endTime + ":00",
          });
        });
      });

      // Create booking request
      const bookingRequest = {
        booking: {
          bookingDate: selectedDate.format("YYYY-MM-DD"),
          note: bookingNote,
          depositAmount:
            paymentChoice === "deposit"
              ? priceDetails?.minimumDeposit
              : priceDetails?.totalPrice,
          bookingDetails: bookingDetails,
        },
      };

      // Create booking
      const bookingResponse = await apiClient.createBooking(bookingRequest);

      if (bookingResponse && bookingResponse.id) {
        // Get the sport center owner ID for providerId
        let providerId = null;

        // Try to get ownerId from sportCenter state
        if (sportCenter && sportCenter.ownerId) {
          providerId = sportCenter.ownerId;
        } else {
          // If sportCenter doesn't have ownerId, fetch detailed info
          try {
            // This approach depends on whether your API supports getting detailed center info
            const detailedSportCenter = await apiClient.getSportCenterById(id);
            providerId = detailedSportCenter.ownerId;
          } catch (error) {
            console.error("Error fetching sport center details:", error);
          }
        }

        if (!providerId) {
          // Fallback: If we still can't get ownerId, use the sportCenterId
          providerId = id;
          console.warn("Using sportCenterId as providerId fallback");
        }

        // Process payment
        const paymentRequest = new ProcessPaymentRequest({
          amount: paymentAmount,
          description: `Đặt sân tại ${
            sportCenter?.name
          } vào ngày ${selectedDate.format("YYYY-MM-DD")}`,
          paymentType: "CourtBooking",
          referenceId: bookingResponse.id,
          bookingId: bookingResponse.id,
          providerId: providerId, // Set the providerId to the sport center owner ID
          status: bookingResponse.status,
        });

        // Call the payment API
        await paymentClient.processBookingPayment(paymentRequest);

        // Show success message
        message.success({
          content: "Đặt sân thành công! Sân của bạn đã được giữ chỗ.",
          key: "bookingMessage",
          duration: 5,
        });

        // Navigate to bookings page or confirmation screen
        navigate("/user/bookings", { replace: true });
      } else {
        message.error({
          content: "Lỗi khi xử lý đặt sân.",
          key: "bookingMessage",
        });
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      message.error({
        content: "Đã xảy ra lỗi khi xử lý đặt sân.",
        key: "bookingMessage",
      });
    }
  };

  // Format court type
  const formatCourtType = (type) => {
    switch (type) {
      case 1:
        return "Trong nhà";
      case 2:
        return "Ngoài trời";
      case 3:
        return "Kết hợp";
      default:
        return "Tiêu chuẩn";
    }
  };

  // Get court status badge
  const getCourtStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <Badge status="success" text="Khả dụng" />;
      case 1:
        return <Badge status="warning" text="Bận" />;
      case 2:
        return <Badge status="error" text="Bảo trì" />;
      default:
        return <Badge status="default" text="Không xác định" />;
    }
  };

  // Move RatingSummary inside BookCourtView
  const RatingSummary = () => {
    // Skip if we have no reviews
    if (courtReviews.length === 0) return null;

    // Count reviews by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    courtReviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 p-4 rounded-lg mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <Text strong className="text-gray-700">
            Tóm tắt đánh giá
          </Text>
          <Badge
            count={`${courtReviews.length} đánh giá`}
            style={{ backgroundColor: "#1890ff" }}
          />
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating] || 0;
            const percent = courtReviews.length
              ? Math.round((count / courtReviews.length) * 100)
              : 0;

            return (
              <div key={rating} className="flex items-center">
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium text-gray-600">
                    {rating}
                  </span>
                  <StarFilled
                    className="text-yellow-400 ml-1"
                    style={{ fontSize: "12px" }}
                  />
                </div>
                <div className="flex-grow mx-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          rating >= 4
                            ? "#52c41a"
                            : rating >= 3
                            ? "#faad14"
                            : "#ff4d4f",
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <Text type="secondary" className="text-xs">
                    {count} ({percent}%)
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Move CourtReviewsSection inside BookCourtView
  const CourtReviewsSection = () => {
    const selectedCourt = getSelectedCourt();

    if (!selectedCourt) return null;

    return (
      <div className="reviews-section mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <StarFilled
              style={{
                fontSize: "22px",
                color: "#faad14",
                marginRight: "12px",
              }}
            />
            <Title level={5} style={{ margin: 0 }}>
              Đánh giá sân
            </Title>
          </div>

          <div className="flex items-center">
            {averageRating > 0 && (
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <Rate
                  disabled
                  defaultValue={averageRating}
                  style={{ fontSize: "14px" }}
                />
                <span className="ml-2 text-yellow-700 font-semibold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Add RatingSummary here */}
        <RatingSummary />

        {reviewsLoading ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
            <Skeleton active avatar paragraph={{ rows: 1 }} className="mt-4" />
          </div>
        ) : reviewsError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <InfoCircleOutlined className="mr-2" />
            {reviewsError}
          </div>
        ) : courtReviews.length > 0 ? (
          <AnimatePresence>
            <div className="space-y-4">
              {courtReviews.map((review, index) => (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="review-card"
                >
                  <Card
                    size="small"
                    className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                    styles={{
                      body: { padding: "16px" },
                    }}
                  >
                    <div className="flex items-start">
                      <Avatar
                        size={40}
                        src={review.userAvatar}
                        icon={!review.userAvatar && <UserOutlined />}
                        style={{ marginRight: "12px", background: "#f0f5ff" }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <Text strong className="text-gray-800">
                              {review.userName || "Người dùng ẩn danh"}
                            </Text>
                            <div className="text-xs text-gray-500 mt-1">
                              {review.createdAt
                                ? format(
                                    new Date(review.createdAt),
                                    "dd/MM/yyyy"
                                  )
                                : "Không có ngày"}
                            </div>
                          </div>
                          <div>
                            <Rate
                              disabled
                              value={review.rating}
                              style={{ fontSize: "14px" }}
                            />
                          </div>
                        </div>

                        <Separator.Root
                          className="my-3 h-px bg-gray-200 w-full"
                          decorative
                        />

                        <div className="mt-2 text-gray-700 whitespace-pre-line">
                          {review.comment}
                        </div>

                        {review.reply && (
                          <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                            <div className="flex items-center text-blue-700 font-medium text-sm">
                              <MessageOutlined className="mr-2" />
                              Phản hồi từ quản lý
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {review.reply}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-end text-gray-500 text-xs">
                          <div className="flex items-center mr-4">
                            <LikeOutlined className="mr-1" />
                            <span>{review.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-gray-50 rounded-lg text-center"
          >
            <StarOutlined style={{ fontSize: "24px", color: "#bfbfbf" }} />
            <div className="mt-3 text-gray-500">
              Chưa có đánh giá nào cho sân này
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Hãy là người đầu tiên chia sẻ trải nghiệm!
            </div>
          </motion.div>
        )}

        {reviewsTotalCount > reviewsPageSize && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={reviewsPage}
              pageSize={reviewsPageSize}
              total={reviewsTotalCount}
              onChange={(page) => setReviewsPage(page)}
              showSizeChanger={false}
              size="small"
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large">
          <div
            className="content"
            style={{ padding: "50px", textAlign: "center" }}
          >
            <div style={{ marginTop: "20px" }}>
              Đang tải thông tin trung tâm thể thao...
            </div>
          </div>
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Không thể tải"
        subTitle={error}
        extra={[
          <Button
            type="primary"
            key="back"
            onClick={() => navigate(-1)}
            icon={<ArrowLeftOutlined />}
          >
            Quay lại
          </Button>,
        ]}
      />
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header with back button */}
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Card
              variant={false}
              style={{ marginBottom: 16 }}
              styles={{ body: { padding: "16px 24px" } }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  style={{ marginRight: 16 }}
                >
                  Quay lại
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                  {location.state?.courtName
                    ? `Đặt ${location.state.courtName} tại ${sportCenter?.name}`
                    : `Đặt sân tại ${sportCenter?.name}`}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Progress Steps */}
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Card variant={false} style={{ marginBottom: 16 }}>
              <Steps
                current={current}
                items={steps.map((step) => ({
                  title: step.title,
                  icon: step.icon,
                }))}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 24]}>
          {/* Left Column - Steps content */}
          <Col xs={24} lg={16}>
            {/* Step 1 - Select Date & Time */}
            {current === 0 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    <span>Chọn ngày và giờ</span>
                  </div>
                }
                variant={false}
                className="step-card"
              >
                {/* Date Selection */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Chọn ngày</Title>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) =>
                      date ? setSelectedDate(date) : setSelectedDate(dayjs())
                    }
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      // Can't select days before today
                      return current && current < dayjs().startOf("day");
                    }}
                    size="large"
                    placeholder="Chọn ngày đặt sân"
                  />
                </div>

                {/* Court Selection with Promotions - Updated for multiple selection */}
                <div id="court-selection-area" style={{ marginBottom: 24 }}>
                  <Title level={5}>Chọn sân</Title>
                  <Text
                    type="secondary"
                    style={{ marginBottom: 12, display: "block" }}
                  >
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    Bạn có thể chọn nhiều sân để đặt
                  </Text>

                  {courts.length === 0 ? (
                    <Empty description="Không có sân khả dụng" />
                  ) : (
                    <Row gutter={[16, 16]}>
                      {courts.map((court) => {
                        const isSelected = selectedCourtIds.includes(court.id);
                        const activePromotions = getActivePromotions(court);
                        const hasPromotions = activePromotions.length > 0;
                        const promotion = hasPromotions
                          ? activePromotions[0]
                          : null;

                        return (
                          <Col key={court.id} xs={12} sm={8} md={6}>
                            {/* Enhanced Sale Badge */}
                            {hasPromotions && (
                              <Badge.Ribbon
                                text={
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {promotion.discountType === "Percentage"
                                      ? `GIẢM ${promotion.discountValue}%`
                                      : `GIẢM ${new Intl.NumberFormat(
                                          "vi-VN"
                                        ).format(promotion.discountValue)}₫`}
                                  </span>
                                }
                                color="#f50"
                                placement="start"
                                style={{
                                  top: "-4px",
                                  marginTop: "-8px",
                                  zIndex: 2,
                                }}
                              >
                                <Card
                                  hoverable
                                  className={isSelected ? "selected-court" : ""}
                                  onClick={() => handleCourtSelect(court.id)}
                                  style={{
                                    textAlign: "center",
                                    border: isSelected
                                      ? "2px solid #1890ff"
                                      : "1px solid #f0f0f0",
                                    background: isSelected
                                      ? "#e6f7ff"
                                      : "white",
                                    position: "relative",
                                    paddingTop: "16px",
                                    marginTop: "8px",
                                  }}
                                  styles={{ body: { padding: "12px 8px" } }}
                                >
                                  <Meta
                                    title={court.courtName}
                                    description={
                                      <div>
                                        <div>
                                          {court.sportName || "Thể thao"}
                                        </div>
                                        {hasPromotions && (
                                          <div style={{ marginTop: 8 }}>
                                            <Tag
                                              color="volcano"
                                              icon={<TagOutlined />}
                                              style={{ marginTop: 4 }}
                                            >
                                              {formatPromotion(promotion)}
                                            </Tag>
                                          </div>
                                        )}
                                      </div>
                                    }
                                  />
                                  {isSelected && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "#1890ff",
                                        borderRadius: "50%",
                                        width: 20,
                                        height: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <CheckOutlined
                                        style={{ color: "white", fontSize: 12 }}
                                      />
                                    </div>
                                  )}
                                </Card>
                              </Badge.Ribbon>
                            )}

                            {/* Regular Card (No Promotion) */}
                            {!hasPromotions && (
                              <Card
                                hoverable
                                className={isSelected ? "selected-court" : ""}
                                onClick={() => handleCourtSelect(court.id)}
                                style={{
                                  textAlign: "center",
                                  border: isSelected
                                    ? "2px solid #1890ff"
                                    : "1px solid #f0f0f0",
                                  background: isSelected ? "#e6f7ff" : "white",
                                  position: "relative",
                                }}
                                bodyStyle={{ padding: "12px 8px" }}
                              >
                                <Meta
                                  title={court.courtName}
                                  description={
                                    <div>{court.sportName || "Thể thao"}</div>
                                  }
                                />
                                {isSelected && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      backgroundColor: "#1890ff",
                                      borderRadius: "50%",
                                      width: 20,
                                      height: 20,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CheckOutlined
                                      style={{ color: "white", fontSize: 12 }}
                                    />
                                  </div>
                                )}
                              </Card>
                            )}
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </div>

                {/* Time Slot Selection - Updated for multiple courts */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Khung giờ khả dụng</Title>
                  <Alert
                    message={
                      <span>
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        Ngày đã chọn:{" "}
                        {selectedDate.isSame(dayjs(), "day") && (
                          <Alert
                            message="Đặt sân cho hôm nay"
                            description="Các khung giờ đã qua không khả dụng để đặt sân."
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                        )}
                        <Text strong>{formatDate(selectedDate)}</Text>
                      </span>
                    }
                    type="info"
                    showIcon={false}
                    style={{ marginBottom: 16 }}
                  />

                  {selectedCourtIds.length === 0 ? (
                    <Alert
                      message="Vui lòng chọn ít nhất một sân để xem khung giờ khả dụng"
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">
                          <InfoCircleOutlined style={{ marginRight: 8 }} />
                          Chọn nhiều khung giờ để đặt với thời lượng dài hơn
                        </Text>
                      </div>

                      {loadingSlots ? (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <Spin size="default">
                            <div style={{ padding: "20px" }}>
                              <div style={{ marginTop: 8 }}>
                                Đang tải khung giờ khả dụng...
                              </div>
                            </div>
                          </Spin>
                        </div>
                      ) : (
                        // Show time slots for each selected court
                        (selectedCourtIds.map((courtId) => {
                          const court = courts.find((c) => c.id === courtId);
                          const courtSlots = availableSlotsMap[courtId] || [];

                          return (
                            <div key={courtId} style={{ marginBottom: 24 }}>
                              <Divider orientation="left">
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                  }}
                                >
                                  {court?.courtName || "Sân"}
                                </span>
                              </Divider>

                              {courtSlots.length === 0 ? (
                                <Empty description="Không có khung giờ khả dụng cho sân này" />
                              ) : (
                                <Row gutter={[8, 8]}>
                                  {courtSlots.map((slot, index) => {
                                    const isSelected = selectedTimeSlots[
                                      courtId
                                    ]?.some(
                                      (s) =>
                                        s.startTime === slot.startTime &&
                                        s.endTime === slot.endTime
                                    );

                                    // Check if this is a past slot (today only)
                                    const isPastSlot = slot.isPastSlot;

                                    return (
                                      <Col key={index} xs={12} sm={8} md={6}>
                                        <Tooltip
                                          title={
                                            isPastSlot
                                              ? "Khung giờ này đã qua"
                                              : !slot.isAvailable
                                              ? "Khung giờ này không khả dụng"
                                              : null
                                          }
                                        >
                                          <Button
                                            type={
                                              isSelected ? "primary" : "default"
                                            }
                                            disabled={!slot.isAvailable}
                                            onClick={() => toggleTimeSlot(slot)}
                                            style={{
                                              width: "100%",
                                              position: "relative",
                                              overflow: "hidden",
                                            }}
                                            className={
                                              !slot.isAvailable
                                                ? isPastSlot
                                                  ? "time-slot-past"
                                                  : "time-slot-unavailable"
                                                : "time-slot"
                                            }
                                          >
                                            <div
                                              style={{
                                                position: "relative",
                                                zIndex: 2,
                                              }}
                                            >
                                              {slot.startTime} - {slot.endTime}
                                              {slot.price && (
                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  {new Intl.NumberFormat(
                                                    "vi-VN"
                                                  ).format(slot.price)}{" "}
                                                  VND/giờ
                                                </div>
                                              )}
                                            </div>

                                            {isPastSlot && (
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  top: 0,
                                                  left: 0,
                                                  right: 0,
                                                  bottom: 0,
                                                  background:
                                                    "rgba(0,0,0,0.05)",
                                                  borderLeft:
                                                    "4px solid #ff4d4f",
                                                  zIndex: 1,
                                                }}
                                              />
                                            )}
                                          </Button>
                                        </Tooltip>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              )}
                            </div>
                          );
                        }))
                      )}
                    </>
                  )}

                  {Object.keys(selectedTimeSlots).length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <Alert
                        type="success"
                        message="Khung giờ đã chọn"
                        description={
                          <div>
                            {Object.entries(selectedTimeSlots).map(
                              ([courtId, slots]) => {
                                const court = courts.find(
                                  (c) => c.id === courtId
                                );
                                return (
                                  <div
                                    key={courtId}
                                    style={{ marginBottom: 16 }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        marginBottom: 8,
                                      }}
                                    >
                                      {court.courtName}:
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 8,
                                      }}
                                    >
                                      {slots.map((slot, index) => (
                                        <Tag
                                          key={index}
                                          color="blue"
                                          closable
                                          onClose={() => toggleTimeSlot(slot)}
                                        >
                                          {slot.displayTime}
                                        </Tag>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div style={{ marginTop: 24, textAlign: "right" }}>
                  <Button
                    type="primary"
                    onClick={next}
                    disabled={Object.keys(selectedTimeSlots).length === 0}
                  >
                    Tiếp tục
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2 - Booking Summary (redesigned with rows instead of tables) */}
            {current === 1 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    <span>Tóm tắt đặt sân</span>
                  </div>
                }
                variant={false}
                className="step-card"
              >
                <Alert
                  message="Chi tiết đặt sân"
                  description={
                    <div>
                      Bạn sắp đặt {Object.keys(selectedTimeSlots).length} sân
                      tại <strong>{sportCenter?.name}</strong> vào ngày{" "}
                      <strong>{formatDate(selectedDate)}</strong>. Tổng thời
                      gian là{" "}
                      <strong>
                        {Object.values(selectedTimeSlots).reduce(
                          (total, slots) => {
                            let minutes = 0;
                            slots.forEach((slot) => {
                              const start = dayjs(
                                `2023-01-01 ${slot.startTime}`
                              );
                              const end = dayjs(`2023-01-01 ${slot.endTime}`);
                              minutes += end.diff(start, "minute");
                            });
                            return total + minutes;
                          },
                          0
                        )}
                      </strong>{" "}
                      phút.
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />

                {/* Booking Information - Row Layout */}
                <div
                  className="booking-info-container"
                  style={{ marginBottom: 24 }}
                >
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <CalendarOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Ngày:</Text>
                        </div>
                        <div className="info-value">
                          {formatDate(selectedDate)}
                        </div>
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <TeamOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Trung tâm thể thao:</Text>
                        </div>
                        <div className="info-value">{sportCenter?.name}</div>
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <EnvironmentOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Địa điểm:</Text>
                        </div>
                        <div className="info-value">
                          {formatAddress(sportCenter)}
                        </div>
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <ClockCircleOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Tổng thời gian:</Text>
                        </div>
                        <div className="info-value">
                          {Object.values(selectedTimeSlots).reduce(
                            (total, slots) => {
                              let minutes = 0;
                              slots.forEach((slot) => {
                                const start = dayjs(
                                  `2023-01-01 ${slot.startTime}`
                                );
                                const end = dayjs(`2023-01-01 ${slot.endTime}`);
                                minutes += end.diff(start, "minute");
                              });
                              return total + minutes;
                            },
                            0
                          )}{" "}
                          phút
                        </div>
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <AppstoreOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Tổng số sân:</Text>
                        </div>
                        <div className="info-value">
                          {Object.keys(selectedTimeSlots).length}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* Note input - Add this in Step 2, before the navigation buttons */}
                <div style={{ marginTop: 24 }}>
                  <Title level={5}>Yêu cầu đặc biệt hoặc ghi chú</Title>
                  <Form.Item>
                    <Input.TextArea
                      placeholder="Thêm yêu cầu đặc biệt hoặc ghi chú cho việc đặt sân của bạn (tùy chọn)"
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                      maxLength={500}
                      showCount
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <List
                  header={
                    <div style={{ fontWeight: "bold" }}>Khung giờ đã chọn</div>
                  }
                  bordered
                  dataSource={Object.entries(selectedTimeSlots)}
                  renderItem={([courtId, slots]) => {
                    const court = courts.find((c) => c.id === courtId);
                    const courtTotal = slots.reduce(
                      (total, slot) => total + (slot.price || 0),
                      0
                    );

                    return (
                      <List.Item
                        extra={
                          <Text strong>
                            {new Intl.NumberFormat("vi-VN").format(courtTotal)}{" "}
                            VND/giờ
                          </Text>
                        }
                      >
                        <List.Item.Meta
                          title={court.courtName}
                          description={
                            <div>
                              {slots.map((slot, index) => (
                                <Tag key={index} color="blue">
                                  {slot.displayTime}
                                </Tag>
                              ))}
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary">
                                  {slots.reduce((total, slot) => {
                                    const start = dayjs(
                                      `2023-01-01 ${slot.startTime}`
                                    );
                                    const end = dayjs(
                                      `2023-01-01 ${slot.endTime}`
                                    );
                                    return total + end.diff(start, "minute");
                                  }, 0)}{" "}
                                  phút
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />

                {/* Price Summary - Updated to use API pricing */}
                <div
                  style={{
                    marginTop: 24,
                    background: "#f9f9f9",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {priceLoading ? (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <Spin size="small" />
                      <div style={{ marginTop: 8 }}>Đang tính giá...</div>
                    </div>
                  ) : priceDetails ? (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>Tạm tính:</Col>
                        <Col>
                          {new Intl.NumberFormat("vi-VN").format(
                            priceDetails.totalPrice
                          )}{" "}
                          VND
                        </Col>
                      </Row>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>Đặt cọc tối thiểu (30%):</Col>
                        <Col>
                          {new Intl.NumberFormat("vi-VN").format(
                            priceDetails.minimumDeposit
                          )}{" "}
                          VND
                        </Col>
                      </Row>
                      <Divider style={{ margin: "12px 0" }} />
                      <Row
                        justify="space-between"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        <Col>Tổng cộng:</Col>
                        <Col>
                          {new Intl.NumberFormat("vi-VN").format(
                            priceDetails.totalPrice
                          )}{" "}
                          VND
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <InfoCircleOutlined style={{ marginRight: 8 }} />
                      Chọn khung giờ để xem giá
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button onClick={prev}>Quay lại</Button>
                  <Button type="primary" onClick={next}>
                    Tiếp tục thanh toán
                  </Button>
                </div>
              </Card>
            )}
            {/* Price Breakdown - Using API price details */}
            {priceDetails?.courtPrices &&
              priceDetails.courtPrices.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <Card title="Chi tiết giá" variant={false}>
                    <List
                      dataSource={priceDetails.courtPrices}
                      renderItem={(item) => (
                        <List.Item
                          extra={
                            <>
                              {item.discountedPrice !== item.originalPrice && (
                                <Text delete style={{ marginRight: 8 }}>
                                  {new Intl.NumberFormat("vi-VN").format(
                                    item.originalPrice
                                  )}{" "}
                                  VND
                                </Text>
                              )}
                              <Text strong>
                                {new Intl.NumberFormat("vi-VN").format(
                                  item.discountedPrice
                                )}{" "}
                                VND
                              </Text>
                            </>
                          }
                        >
                          <List.Item.Meta
                            title={item.courtName}
                            description={
                              <>
                                <div>{`${item.startTime} - ${item.endTime}`}</div>
                                {item.promotionName && (
                                  <Tag color="volcano" style={{ marginTop: 4 }}>
                                    {item.promotionName}:{" "}
                                    {item.discountType === "Percentage"
                                      ? `Giảm ${item.discountValue}%`
                                      : `Giảm ${new Intl.NumberFormat(
                                          "vi-VN"
                                        ).format(item.discountValue)} VND`}
                                  </Tag>
                                )}
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <Divider />
                    <Row justify="space-between" style={{ fontWeight: "bold" }}>
                      <Col>Tổng cộng:</Col>
                      <Col>
                        {new Intl.NumberFormat("vi-VN").format(
                          priceDetails.totalPrice
                        )}{" "}
                        VND
                      </Col>
                    </Row>
                  </Card>
                </div>
              )}
            {/* Step 3 - Payment (redesigned for better user experience) */}
            {current === 2 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CreditCardOutlined style={{ marginRight: 8 }} />
                    <span>Chi tiết thanh toán</span>
                  </div>
                }
                bordered={false}
                className="step-card"
              >
                <Alert
                  message="Thông tin thanh toán"
                  description="Thanh toán sẽ được xử lý tại địa điểm. Đặt sân này giữ chỗ cho bạn."
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                <div className="booking-summary-section">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <CalendarOutlined
                      style={{ fontSize: 18, marginRight: 8, color: "#1890ff" }}
                    />
                    <Title level={5} style={{ margin: 0 }}>
                      Tóm tắt đặt sân
                    </Title>
                  </div>

                  <div
                    className="summary-container"
                    style={{
                      background: "#f5f7fa",
                      padding: 16,
                      borderRadius: 8,
                      marginBottom: 24,
                    }}
                  >
                    <Row gutter={[0, 12]}>
                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Ngày:</Text>
                          <Text>{formatDate(selectedDate)}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Trung tâm thể thao:</Text>
                          <Text>{sportCenter?.name}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Địa điểm:</Text>
                          <Text>{formatAddress(sportCenter)}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Tổng thời gian:</Text>
                          <Text>
                            {Object.values(selectedTimeSlots).reduce(
                              (total, slots) => {
                                let minutes = 0;
                                slots.forEach((slot) => {
                                  const start = dayjs(
                                    `2023-01-01 ${slot.startTime}`
                                  );
                                  const end = dayjs(
                                    `2023-01-01 ${slot.endTime}`
                                  );
                                  minutes += end.diff(start, "minute");
                                });
                                return total + minutes;
                              },
                              0
                            )}{" "}
                            phút
                          </Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Tổng số sân:</Text>
                          <Text>{Object.keys(selectedTimeSlots).length}</Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <List
                  header={
                    <div style={{ fontWeight: "bold" }}>Khung giờ đã chọn</div>
                  }
                  bordered
                  dataSource={Object.entries(selectedTimeSlots)}
                  renderItem={([courtId, slots]) => {
                    const court = courts.find((c) => c.id === courtId);
                    const courtTotal = slots.reduce(
                      (total, slot) => total + (slot.price || 0),
                      0
                    );

                    return (
                      <List.Item
                        extra={
                          <Text strong>
                            {new Intl.NumberFormat("vi-VN").format(courtTotal)}{" "}
                            VND
                          </Text>
                        }
                      >
                        <List.Item.Meta
                          title={court.courtName}
                          description={
                            <div>
                              {slots.map((slot, index) => (
                                <Tag key={index} color="blue">
                                  {slot.displayTime}
                                </Tag>
                              ))}
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary">
                                  {slots.reduce((total, slot) => {
                                    const start = dayjs(
                                      `2023-01-01 ${slot.startTime}`
                                    );
                                    const end = dayjs(
                                      `2023-01-01 ${slot.endTime}`
                                    );
                                    return total + end.diff(start, "minute");
                                  }, 0)}{" "}
                                  phút
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
                {bookingNote && (
                  <div style={{ marginTop: 16, marginBottom: 16 }}>
                    <Divider>Ghi chú của bạn</Divider>
                    <Alert
                      message="Ghi chú của bạn"
                      description={bookingNote}
                      type="info"
                      showIcon
                    />
                  </div>
                )}
                {/* Payment amount selection - New feature */}
                <Divider>Số tiền thanh toán</Divider>
                <Radio.Group
                  value={paymentChoice}
                  onChange={(e) => setPaymentChoice(e.target.value)}
                  style={{ width: "100%", marginBottom: 24 }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio value="deposit">
                      <Card
                        size="small"
                        style={{ marginLeft: 8, marginBottom: 8 }}
                        styles={{ body: { padding: 12 } }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Chỉ thanh toán đặt cọc (
                              {priceDetails?.minimumDeposit
                                ? new Intl.NumberFormat("vi-VN").format(
                                    priceDetails.minimumDeposit
                                  )
                                : "30%"}
                              ) VND
                            </div>
                            <div
                              style={{
                                color: "rgba(0, 0, 0, 0.45)",
                                fontSize: "12px",
                              }}
                            >
                              Chỉ thanh toán số tiền tối thiểu để đảm bảo đặt
                              sân
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Radio>

                    <Radio value="full">
                      <Card
                        size="small"
                        style={{ marginLeft: 8 }}
                        bodyStyle={{ padding: 12 }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Thanh toán toàn bộ (
                              {priceDetails?.totalPrice
                                ? new Intl.NumberFormat("vi-VN").format(
                                    priceDetails.totalPrice
                                  )
                                : "0"}
                              ) VND
                            </div>
                            <div
                              style={{
                                color: "rgba(0, 0, 0, 0.45)",
                                fontSize: "12px",
                              }}
                            >
                              Thanh toán toàn bộ số tiền ngay bây giờ (khuyến
                              nghị)
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Radio>
                  </Space>
                </Radio.Group>
                {/* Payment summary section with VND currency */}
                <div
                  style={{
                    marginTop: 24,
                    background: "#f9f9f9",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>Tạm tính:</Col>
                    <Col>
                      {new Intl.NumberFormat("vi-VN").format(
                        priceDetails.totalPrice
                      )}{" "}
                      VND
                    </Col>
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                  <Row
                    justify="space-between"
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    <Col>Tổng cộng:</Col>
                    <Col>
                      {priceDetails?.totalPrice
                        ? new Intl.NumberFormat("vi-VN").format(
                            priceDetails.totalPrice
                          )
                        : "0"}
                      VND
                    </Col>
                  </Row>
                </div>

                {current === 2 && (
                  <div style={{ marginBottom: 24 }}>
                    <Alert
                      type="info"
                      message={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            <WalletOutlined style={{ marginRight: 8 }} /> Số dư
                            ví của bạn
                          </span>
                          {walletLoading ? (
                            <Spin size="small" />
                          ) : (
                            <span style={{ fontWeight: "bold" }}>
                              {walletBalance
                                ? new Intl.NumberFormat("vi-VN").format(
                                    walletBalance.balance
                                  ) + " VND"
                                : "Không khả dụng"}
                              <Button
                                type="link"
                                size="small"
                                icon={<ReloadOutlined />}
                                onClick={fetchWalletBalance}
                                style={{ marginLeft: 8 }}
                              >
                                Làm mới
                              </Button>
                            </span>
                          )}
                        </div>
                      }
                      description={
                        <div>
                          {walletBalance && priceDetails && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: 8,
                                }}
                              >
                                <span>Yêu cầu cho đặt cọc:</span>
                                <span>
                                  {new Intl.NumberFormat("vi-VN").format(
                                    priceDetails.minimumDeposit
                                  )}{" "}
                                  VND
                                  {walletBalance.balance <
                                    priceDetails.minimumDeposit && (
                                    <Tag
                                      color="error"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Không đủ
                                    </Tag>
                                  )}
                                  {walletBalance.balance >=
                                    priceDetails.minimumDeposit && (
                                    <Tag
                                      color="success"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Khả dụng
                                    </Tag>
                                  )}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: 4,
                                }}
                              >
                                <span>Yêu cầu cho thanh toán toàn bộ:</span>
                                <span>
                                  {new Intl.NumberFormat("vi-VN").format(
                                    priceDetails.totalPrice
                                  )}{" "}
                                  VND
                                  {walletBalance.balance <
                                    priceDetails.totalPrice && (
                                    <Tag
                                      color="warning"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Không đủ
                                    </Tag>
                                  )}
                                  {walletBalance.balance >=
                                    priceDetails.totalPrice && (
                                    <Tag
                                      color="success"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Khả dụng
                                    </Tag>
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                          {walletError && (
                            <div style={{ color: "#ff4d4f", marginTop: 8 }}>
                              <InfoCircleOutlined style={{ marginRight: 8 }} />
                              {walletError}
                            </div>
                          )}

                          <Button
                            type="primary"
                            icon={<WalletOutlined />}
                            style={{ marginTop: 12 }}
                            onClick={() => navigate("/user/wallet")}
                          >
                            Đi tới ví
                          </Button>
                        </div>
                      }
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button onClick={prev}>Quay lại</Button>
                  <Button
                    type="primary"
                    onClick={handleBooking}
                    size="large"
                    icon={<CheckCircleOutlined />}
                  >
                    Hoàn tất đặt sân
                  </Button>
                </div>
              </Card>
            )}
          </Col>

          {/* Right Column - Booking Summary */}
          <Col xs={24} lg={8}>
            {/* Court/Sport Center Information Card */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  <span>
                    {getSelectedCourt()
                      ? "Thông tin sân"
                      : "Thông tin trung tâm thể thao"}
                  </span>
                </div>
              }
              className="summary-card"
              style={{ marginBottom: 24 }}
              variant={false}
            >
              {getSelectedCourt() ? (
                // Court Information
                (<>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: "#f0f5ff",
                        marginBottom: 12,
                        fontSize: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getSelectedCourt().sportName?.charAt(0) || "C"}
                    </Avatar>
                    <Title level={4} style={{ margin: 0 }}>
                      {getSelectedCourt().courtName}
                    </Title>
                    <Text type="secondary">{getSelectedCourt().sportName}</Text>
                  </div>
                  <Divider style={{ margin: "16px 0" }} />
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: "Loại sân",
                        description: formatCourtType(
                          getSelectedCourt().courtType
                        ),
                        icon: <AppstoreOutlined style={{ color: "#1890ff" }} />,
                      },
                      {
                        title: "Thời lượng",
                        description:
                          getSelectedCourt().slotDuration?.replace(
                            "00:00:00",
                            ""
                          ) || "1 giờ",
                        icon: (
                          <ClockCircleOutlined style={{ color: "#52c41a" }} />
                        ),
                      },
                      {
                        title: "Trạng thái",
                        description: getCourtStatusBadge(
                          getSelectedCourt().status
                        ),
                        icon: (
                          <InfoCircleOutlined style={{ color: "#faad14" }} />
                        ),
                      },
                      {
                        title: "Trung tâm thể thao",
                        description: sportCenter?.name,
                        icon: <TeamOutlined style={{ color: "#722ed1" }} />,
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={item.icon}
                              style={{ backgroundColor: "transparent" }}
                            />
                          }
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                  {getSelectedCourt().facilities &&
                    getSelectedCourt().facilities.length > 0 && (
                      <>
                        <Divider
                          orientation="left"
                          plain
                          style={{ fontSize: 14 }}
                        >
                          Tiện ích
                        </Divider>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {getSelectedCourt().facilities.map(
                            (facility, index) => (
                              <Tag
                                key={index}
                                color="blue"
                                title={facility.description}
                              >
                                {facility.name}
                              </Tag>
                            )
                          )}
                        </div>
                      </>
                    )}
                  <CourtReviewsSection />
                </>)
              ) : (
                // Sport Center Information
                (sportCenter && (<>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Avatar
                      size={80}
                      src={sportCenter.avatar}
                      style={{
                        backgroundColor: "#f0f5ff",
                        marginBottom: 12,
                      }}
                    >
                      {sportCenter.name?.charAt(0)}
                    </Avatar>
                    <Title level={4} style={{ margin: 0 }}>
                      {sportCenter.name}
                    </Title>
                    <Text type="secondary">{formatAddress(sportCenter)}</Text>
                  </div>
                  <Divider style={{ margin: "16px 0" }} />
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: "Địa chỉ",
                        description: formatAddress(sportCenter),
                        icon: (
                          <EnvironmentOutlined style={{ color: "#1890ff" }} />
                        ),
                      },
                      {
                        title: "Số điện thoại",
                        description:
                          sportCenter.phoneNumber || "Không khả dụng",
                        icon: <PhoneOutlined style={{ color: "#52c41a" }} />,
                      },
                      {
                        title: "Sân khả dụng",
                        description: `${courts.length} sân`,
                        icon: (
                          <AppstoreOutlined style={{ color: "#faad14" }} />
                        ),
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={item.icon}
                              style={{ backgroundColor: "transparent" }}
                            />
                          }
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                  {sportCenter.description && (
                    <>
                      <Divider
                        orientation="left"
                        plain
                        style={{ fontSize: 14 }}
                      >
                        Mô tả
                      </Divider>
                      <Paragraph>{sportCenter.description}</Paragraph>
                    </>
                  )}
                </>))
              )}
            </Card>

            {/* Booking Summary Card */}
            {current > 0 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    <span>Đặt sân của bạn</span>
                  </div>
                }
                className="summary-card"
                variant={false}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      title: "Ngày",
                      description: formatDate(selectedDate),
                      icon: <CalendarOutlined style={{ color: "#1890ff" }} />,
                    },
                    {
                      title: "Sân",
                      description: `${
                        Object.keys(selectedTimeSlots).length
                      } đã chọn`,
                      icon: <AppstoreOutlined style={{ color: "#1890ff" }} />,
                    },
                    {
                      title: "Tổng thời gian",
                      description: `${Object.values(selectedTimeSlots).reduce(
                        (total, slots) => {
                          let minutes = 0;
                          slots.forEach((slot) => {
                            const start = dayjs(`2023-01-01 ${slot.startTime}`);
                            const end = dayjs(`2023-01-01 ${slot.endTime}`);
                            minutes += end.diff(start, "minute");
                          });
                          return total + minutes;
                        },
                        0
                      )} phút`,
                      icon: (
                        <ClockCircleOutlined style={{ color: "#1890ff" }} />
                      ),
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={item.icon}
                            style={{ backgroundColor: "transparent" }}
                          />
                        }
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />

                {Object.keys(selectedTimeSlots).length > 0 && (
                  <>
                    <Divider orientation="left" plain style={{ fontSize: 14 }}>
                      Khung giờ
                    </Divider>
                    {Object.entries(selectedTimeSlots).map(
                      ([courtId, slots]) => {
                        const court = courts.find((c) => c.id === courtId);
                        return (
                          <div key={courtId} style={{ marginBottom: 16 }}>
                            <Text strong>{court.courtName}:</Text>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                                marginTop: 4,
                              }}
                            >
                              {slots.map((slot, index) => (
                                <Tag key={index} color="blue">
                                  {slot.displayTime}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                    <Divider style={{ margin: "16px 0" }} />
                    {current === 2 ? (
                      <>
                        <Statistic
                          title={
                            paymentChoice === "deposit"
                              ? "Số tiền thanh toán (Đặt cọc)"
                              : "Số tiền thanh toán (Toàn bộ)"
                          }
                          value={
                            paymentChoice === "deposit"
                              ? priceDetails?.minimumDeposit || 0
                              : priceDetails?.totalPrice || 0
                          }
                          suffix="VND"
                          valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                        />
                        {paymentChoice === "deposit" && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              Số dư còn lại:{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                (priceDetails?.totalPrice || 0) -
                                  (priceDetails?.minimumDeposit || 0)
                              )}{" "}
                              VND
                            </Text>
                          </div>
                        )}
                      </>
                    ) : (
                      <Statistic
                        title="Tổng giá"
                        value={priceDetails?.totalPrice || calculateTotal()}
                        suffix="VND"
                        valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                      />
                    )}
                  </>
                )}
              </Card>
            )}
          </Col>
        </Row>

        {/* Custom CSS */}
        <style>{`
          .booking-info-item,
          .summary-item {
            display: flex;
            gap: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
          }

          .info-label {
            display: flex;
            align-items: center;
            min-width: 150px;
          }

          .info-value {
            flex: 1;
          }

          .booking-info-container {
            background: #f5f7fa;
            padding: 16px;
            border-radius: 8px;
          }

          .booking-info-container .booking-info-item:last-child {
            border-bottom: none;
          }

          .summary-container .summary-item:last-child {
            border-bottom: none;
          }
          .step-card {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            border-radius: 8px;
            transition: all 0.3s;
          }
          .step-card:hover {
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          }
          .summary-card {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            border-radius: 8px;
            transition: all 0.3s;
            background: #fafafa;
          }
  .time-slot-past {
    background-color: #fafafa;
    color: #bfbfbf;
    border-left: 4px solid #ff4d4f;
    cursor: not-allowed;
  }
    .time-slot-past::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.05);
    pointer-events: none;
  }
          .summary-card:hover {
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          }
          .time-slot {
            transition: all 0.2s;
          }
          .time-slot:hover {
            transform: translateY(-2px);
          }
          .time-slot-unavailable {
    background-color: #f5f5f5;
    color: #bfbfbf;
    cursor: not-allowed;
  }

          .selected-court {
            transition: all 0.3s;
          }
          .selected-court:hover {
            transform: translateY(-3px);
          }
             .reviews-section {
    border-top: 1px dashed #f0f0f0;
    padding-top: 16px;
    margin-top: 16px;
  }
  
  .review-card {
    border-radius: 8px;
    transition: all 0.3s;
  }
  
  .review-card:hover {
    transform: translateY(-2px);
  }
  
  .ant-rate-star {
    margin-right: 2px !important;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .rating-badge {
    animation: pulse 2s infinite;
  }
  
  /* Radial progress animation */
  @keyframes circle-fill {
    from { stroke-dasharray: 0 100; }
  }
  
  .rating-circle circle:last-child {
    animation: circle-fill 1s ease-out forwards;
  }
        `}</style>
      </Content>
    </Layout>
  );
};

export default BookCourtView;
