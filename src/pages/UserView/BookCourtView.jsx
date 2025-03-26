import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Client as CourtClient } from "../../API/CourtApi";
import { Client as PaymentClient } from "../../API/PaymentApi";
import { Button, Modal } from "antd";
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

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;

// API client instance
const apiClient = new CourtClient();

// Helper function to format date
const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY");
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
  // Add this state variable
  const [paymentChoice, setPaymentChoice] = useState("deposit"); // 'deposit' or 'full'
  // UI states
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: "Select Time",
      icon: <CalendarOutlined />,
    },
    {
      title: "Your Info",
      icon: <UserOutlined />,
    },
    {
      title: "Payment",
      icon: <CreditCardOutlined />,
    },
  ];
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
    const fetchAvailableSlots = async () => {
      if (selectedCourtIds.length === 0 || !selectedDate) return;

      try {
        setLoadingSlots(true);
        const newAvailableSlotsMap = {};

        // FIX: Create UTC date strings for the selected date to avoid timezone issues
        // Use the YYYY-MM-DD format directly instead of Date objects
        const dateStr = selectedDate.format("YYYY-MM-DD");
        const startDateStr = `${dateStr}T00:00:00.000Z`;
        const endDateStr = `${dateStr}T23:59:59.999Z`;

        // Fetch availability for each selected court
        for (const courtId of selectedCourtIds) {
          // Use the formatted strings directly in the API call
          const availabilityResponse = await apiClient.getCourtAvailability(
            courtId,
            new Date(startDateStr),
            new Date(endDateStr)
          );

          // Check if we have schedule data for the selected date
          if (
            availabilityResponse &&
            availabilityResponse.schedule &&
            availabilityResponse.schedule.length > 0
          ) {
            // Find the schedule for the selected date
            const daySchedule = availabilityResponse.schedule.find(
              (day) =>
                dayjs(day.date).format("YYYY-MM-DD") ===
                selectedDate.format("YYYY-MM-DD")
            );

            if (daySchedule && daySchedule.timeSlots) {
              newAvailableSlotsMap[courtId] = daySchedule.timeSlots.map(
                (slot) => ({
                  ...slot,
                  isAvailable: slot.status === "AVAILABLE",
                  courtId: courtId,
                  displayTime: `${slot.startTime} - ${slot.endTime}`,
                })
              );
            }
          }
        }

        setAvailableSlotsMap(newAvailableSlotsMap);
        setLoadingSlots(false);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAvailableSlotsMap({});
        setLoadingSlots(false);
        message.error("Failed to load available time slots");
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

  const calculateTaxes = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
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
          content: "Checking wallet balance...",
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
            content: "Insufficient funds in your wallet for the deposit",
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
          content: "Wallet check successful",
          key: "walletCheck",
        });
        setCurrent(current + 1);
      } catch (error) {
        message.error({
          content: "Error checking wallet balance. Please try again.",
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
      message.error("Please select at least one time slot");
      return;
    }

    try {
      // Show loading
      message.loading({
        content: "Processing your booking...",
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
          content:
            "Insufficient funds in your wallet. Please add funds to continue.",
          key: "bookingMessage",
        });

        Modal.confirm({
          title: "Insufficient Wallet Balance",
          icon: <InfoCircleOutlined style={{ color: "#ff4d4f" }} />,
          content: (
            <div>
              <p>
                Your wallet balance (
                {new Intl.NumberFormat("vi-VN").format(balanceData.balance)}{" "}
                VND) is not enough for the{" "}
                {paymentChoice === "deposit" ? "deposit" : "full payment"} (
                {new Intl.NumberFormat("vi-VN").format(paymentAmount)} VND).
              </p>
              <p>Would you like to add funds to your wallet?</p>
            </div>
          ),
          okText: "Go to Wallet",
          cancelText: "Cancel",
          onOk() {
            navigate("/user/wallet");
          },
        });
        return;
      }

      // 1. Create booking request for Court API
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

      // Set deposit amount based on user choice
      const depositAmount =
        paymentChoice === "deposit"
          ? priceDetails?.minimumDeposit ||
            (priceDetails?.totalPrice ? priceDetails.totalPrice * 0.3 : 0)
          : 0;

      const bookingRequest = {
        booking: {
          bookingDate: selectedDate.format("YYYY-MM-DD"),
          totalPrice: priceDetails?.totalPrice || 0,
          note: bookingNote,
          depositAmount: depositAmount,
          bookingDetails: bookingDetails,
        },
      };

      // Step 1: Create booking via Court API
      const bookingResponse = await apiClient.createBooking(bookingRequest);

      if (bookingResponse && bookingResponse.id) {
        // Create detailed description of the booking
        let detailedDescription = `Booking at ${
          sportCenter.name
        } on ${formatDate(selectedDate)}:\n`;

        // Add court and slot details
        Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
          const court = courts.find((c) => c.id === courtId);
          if (court) {
            detailedDescription += `\n• ${court.courtName} (${
              court.sportName || "Sport"
            }): `;
            const slotTimes = slots.map((slot) => slot.displayTime).join(", ");
            detailedDescription += slotTimes;
          }
        });

        // Add payment choice information
        detailedDescription += `\n\nPayment Type: ${
          paymentChoice === "deposit" ? "Deposit Only" : "Full Amount"
        }`;
        // Add note if provided
        if (bookingNote) {
          detailedDescription += `\n\nNote: ${bookingNote}`;
        }
        // Step 2: Process payment via Payment API with improved description
        const paymentAmount =
          paymentChoice === "deposit"
            ? priceDetails?.minimumDeposit || priceDetails?.totalPrice * 0.3
            : priceDetails?.totalPrice;

        const paymentRequest = new ProcessPaymentRequest({
          amount: paymentAmount,
          description: detailedDescription,
          paymentType: "CourtBooking",
          referenceId: bookingResponse.id,
          bookingId: bookingResponse.id,
          status: bookingResponse.status,
        });

        // Call payment API
        const paymentClient = new PaymentClient(API_PAYMENT_URL);
        await paymentClient.processBookingPayment(paymentRequest);

        // Show success message
        message.success({
          content: "Booking completed successfully!",
          key: "bookingMessage",
          duration: 3,
        });

        // Navigate to booking details or confirmation page
        setTimeout(() => {
          navigate("/user/bookings/" + bookingResponse.id, {
            state: {
              bookingSuccess: true,
              bookingId: bookingResponse.id,
            },
          });
        }, 1500);
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error during booking process:", error);

      // Handle specific error types
      if (error.status === 400) {
        message.error({
          content:
            "Invalid booking information. Please check your selection and try again.",
          key: "bookingMessage",
        });
      } else if (error.status === 403 || error.status === 401) {
        message.error({
          content: "You need to login to complete this booking.",
          key: "bookingMessage",
        });
        // Redirect to login
        setTimeout(() => navigate("/login"), 1500);
      } else if (
        error.status === 402 ||
        error.message?.includes("insufficient")
      ) {
        message.error({
          content:
            "Insufficient funds in your wallet. Please add funds to continue.",
          key: "bookingMessage",
        });
        // Redirect to wallet page
        setTimeout(() => navigate("/user/wallet"), 1500);
      } else {
        message.error({
          content: "Failed to complete your booking. Please try again later.",
          key: "bookingMessage",
        });
      }
    }
  };

  // Format court type
  const formatCourtType = (type) => {
    switch (type) {
      case 1:
        return "Indoor";
      case 2:
        return "Outdoor";
      case 3:
        return "Hybrid";
      default:
        return "Standard";
    }
  };

  // Get court status badge
  const getCourtStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <Badge status="success" text="Available" />;
      case 1:
        return <Badge status="warning" text="Busy" />;
      case 2:
        return <Badge status="error" text="Maintenance" />;
      default:
        return <Badge status="default" text="Unknown" />;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to Load"
        subTitle={error}
        extra={[
          <Button
            type="primary"
            key="back"
            onClick={() => navigate(-1)}
            icon={<ArrowLeftOutlined />}
          >
            Go Back
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
              bodyStyle={{ padding: "16px 24px" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  style={{ marginRight: 16 }}
                >
                  Back
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                  {location.state?.courtName
                    ? `Book ${location.state.courtName} at ${sportCenter?.name}`
                    : `Book a Court at ${sportCenter?.name}`}
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
                    <span>Select Date & Time</span>
                  </div>
                }
                variant={false}
                className="step-card"
              >
                {/* Date Selection */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Select Date</Title>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) =>
                      setSelectedDate(date.format("YYYY-MM-DD"))
                    }
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      // Can't select days before today
                      return current && current < dayjs().startOf("day");
                    }}
                    size="large"
                  />
                </div>

                {/* Court Selection with Promotions - Updated for multiple selection */}
                <div id="court-selection-area" style={{ marginBottom: 24 }}>
                  <Title level={5}>Select Courts</Title>
                  <Text
                    type="secondary"
                    style={{ marginBottom: 12, display: "block" }}
                  >
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    You can select multiple courts for booking
                  </Text>

                  {courts.length === 0 ? (
                    <Empty description="No courts available" />
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
                                      ? `SALE ${promotion.discountValue}%`
                                      : `SAVE ${new Intl.NumberFormat(
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
                                  bodyStyle={{ padding: "12px 8px" }}
                                >
                                  <Meta
                                    title={court.courtName}
                                    description={
                                      <div>
                                        <div>{court.sportName || "Sport"}</div>
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
                                    <div>{court.sportName || "Sport"}</div>
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
                  <Title level={5}>Available Time Slots</Title>
                  <Alert
                    message={
                      <span>
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        Selected Date:{" "}
                        <Text strong>{formatDate(selectedDate)}</Text>
                      </span>
                    }
                    type="info"
                    showIcon={false}
                    style={{ marginBottom: 16 }}
                  />

                  {selectedCourtIds.length === 0 ? (
                    <Alert
                      message="Please select at least one court to see available time slots"
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">
                          <InfoCircleOutlined style={{ marginRight: 8 }} />
                          Select multiple slots for longer booking durations
                        </Text>
                      </div>

                      {loadingSlots ? (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <Spin size="default" />
                          <div style={{ marginTop: 8 }}>
                            Loading available slots...
                          </div>
                        </div>
                      ) : (
                        // Show time slots for each selected court
                        selectedCourtIds.map((courtId) => {
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
                                  {court?.courtName || "Court"}
                                </span>
                              </Divider>

                              {courtSlots.length === 0 ? (
                                <Empty description="No time slots available for this court" />
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

                                    return (
                                      <Col key={index} xs={12} sm={8} md={6}>
                                        <Button
                                          type={
                                            isSelected ? "primary" : "default"
                                          }
                                          disabled={!slot.isAvailable}
                                          onClick={() => toggleTimeSlot(slot)}
                                          style={{ width: "100%" }}
                                          className={
                                            !slot.isAvailable
                                              ? "time-slot-unavailable"
                                              : "time-slot"
                                          }
                                        >
                                          {slot.displayTime}
                                          <div style={{ fontSize: "10px" }}>
                                            {slot.price ? (
                                              <>
                                                <div>
                                                  {new Intl.NumberFormat(
                                                    "vi-VN"
                                                  ).format(slot.price)}{" "}
                                                  VND/giờ
                                                </div>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </Button>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              )}
                            </div>
                          );
                        })
                      )}
                    </>
                  )}

                  {Object.keys(selectedTimeSlots).length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <Alert
                        type="success"
                        message="Selected Time Slots"
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
                    Continue
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
                    <span>Booking Summary</span>
                  </div>
                }
                variant={false}
                className="step-card"
              >
                <Alert
                  message="Booking Details"
                  description={
                    <div>
                      You&#39;re about to book{" "}
                      {Object.keys(selectedTimeSlots).length} court(s) at{" "}
                      <strong>{sportCenter?.name}</strong> on{" "}
                      <strong>{formatDate(selectedDate)}</strong>. Total
                      duration is{" "}
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
                      minutes.
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
                          <Text strong>Date:</Text>
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
                          <Text strong>Sport Center:</Text>
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
                          <Text strong>Location:</Text>
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
                          <Text strong>Total Duration:</Text>
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
                          minutes
                        </div>
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="booking-info-item">
                        <div className="info-label">
                          <AppstoreOutlined
                            style={{ marginRight: 8, color: "#1890ff" }}
                          />
                          <Text strong>Total Courts:</Text>
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
                  <Title level={5}>Special Requests or Notes</Title>
                  <Form.Item>
                    <Input.TextArea
                      placeholder="Add any special requests or notes for your booking (optional)"
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
                    <div style={{ fontWeight: "bold" }}>
                      Selected Time Slots
                    </div>
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
                                  minutes
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
                      <div style={{ marginTop: 8 }}>Calculating price...</div>
                    </div>
                  ) : priceDetails ? (
                    <>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>Subtotal:</Col>
                        <Col>
                          {new Intl.NumberFormat("vi-VN").format(
                            priceDetails.totalPrice
                          )}{" "}
                          VND
                        </Col>
                      </Row>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>Minimum Deposit (30%):</Col>
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
                        <Col>Total:</Col>
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
                      Select time slots to see pricing
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
                  <Button onClick={prev}>Back</Button>
                  <Button type="primary" onClick={next}>
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}
            {/* Price Breakdown - Using API price details */}
            {priceDetails?.courtPrices &&
              priceDetails.courtPrices.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <Card title="Detailed Price Breakdown" variant={false}>
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
                                      ? `${item.discountValue}% off`
                                      : `${new Intl.NumberFormat(
                                          "vi-VN"
                                        ).format(item.discountValue)} VND off`}
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
                      <Col>Total:</Col>
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
                    <span>Payment Details</span>
                  </div>
                }
                bordered={false}
                className="step-card"
              >
                <Alert
                  message="Payment Information"
                  description="Payment will be processed at the venue. This booking reserves your spot."
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
                      Booking Summary
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
                          <Text strong>Date:</Text>
                          <Text>{formatDate(selectedDate)}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Sport Center:</Text>
                          <Text>{sportCenter?.name}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Location:</Text>
                          <Text>{formatAddress(sportCenter)}</Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Total Duration:</Text>
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
                            minutes
                          </Text>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="summary-item">
                          <Text strong>Total Courts:</Text>
                          <Text>{Object.keys(selectedTimeSlots).length}</Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <List
                  header={
                    <div style={{ fontWeight: "bold" }}>
                      Selected Time Slots
                    </div>
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
                                  minutes
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
                    <Divider>Your Note</Divider>
                    <Alert
                      message="Your Note"
                      description={bookingNote}
                      type="info"
                      showIcon
                    />
                  </div>
                )}
                {/* Payment amount selection - New feature */}
                <Divider>Payment Amount</Divider>
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
                        bodyStyle={{ padding: 12 }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Pay Deposit Only (
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
                              Pay the minimum required amount to secure your
                              booking
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
                              Pay Full Amount (
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
                              Pay the entire amount now (recommended)
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
                    <Col>Subtotal:</Col>
                    <Col>
                      {new Intl.NumberFormat("vi-VN").format(
                        calculateSubtotal()
                      )}{" "}
                      VND
                    </Col>
                  </Row>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>Tax (10%):</Col>
                    <Col>
                      {new Intl.NumberFormat("vi-VN").format(calculateTaxes())}{" "}
                      VND
                    </Col>
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                  <Row
                    justify="space-between"
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    <Col>Total:</Col>
                    <Col>
                      {new Intl.NumberFormat("vi-VN").format(calculateTotal())}{" "}
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
                            <WalletOutlined style={{ marginRight: 8 }} /> Your
                            Wallet Balance
                          </span>
                          {walletLoading ? (
                            <Spin size="small" />
                          ) : (
                            <span style={{ fontWeight: "bold" }}>
                              {walletBalance
                                ? new Intl.NumberFormat("vi-VN").format(
                                    walletBalance.balance
                                  ) + " VND"
                                : "Not available"}
                              <Button
                                type="link"
                                size="small"
                                icon={<ReloadOutlined />}
                                onClick={fetchWalletBalance}
                                style={{ marginLeft: 8 }}
                              >
                                Refresh
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
                                <span>Required for deposit:</span>
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
                                      Insufficient
                                    </Tag>
                                  )}
                                  {walletBalance.balance >=
                                    priceDetails.minimumDeposit && (
                                    <Tag
                                      color="success"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Available
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
                                <span>Required for full payment:</span>
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
                                      Insufficient
                                    </Tag>
                                  )}
                                  {walletBalance.balance >=
                                    priceDetails.totalPrice && (
                                    <Tag
                                      color="success"
                                      style={{ marginLeft: 8 }}
                                    >
                                      Available
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
                            Go to Wallet
                          </Button>
                        </div>
                      }
                    />
                  </div>
                )}
                {/* Payment method selection - Pay Online disabled */}
                <Divider>Payment Amount</Divider>
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
                        bodyStyle={{ padding: 12 }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Pay Deposit Only (
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
                              Pay the minimum required amount to secure your
                              booking
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Radio>

                    <Radio
                      value="full"
                      disabled={
                        walletBalance &&
                        priceDetails &&
                        walletBalance.balance < priceDetails.totalPrice
                      }
                      onClick={() => {
                        // If already selected or not disabled, don't show modal
                        if (
                          paymentChoice === "full" ||
                          !(
                            walletBalance &&
                            priceDetails &&
                            walletBalance.balance < priceDetails.totalPrice
                          )
                        ) {
                          return;
                        }

                        // Show modal for insufficient funds for full payment
                        Modal.info({
                          title: "Insufficient Wallet Balance for Full Payment",
                          icon: <WalletOutlined style={{ color: "#faad14" }} />,
                          content: (
                            <div>
                              <p>
                                Your wallet balance (
                                {new Intl.NumberFormat("vi-VN").format(
                                  walletBalance?.balance || 0
                                )}{" "}
                                VND) is not enough for full payment (
                                {new Intl.NumberFormat("vi-VN").format(
                                  priceDetails?.totalPrice || 0
                                )}{" "}
                                VND).
                              </p>
                              <p>You can either:</p>
                              <ul>
                                <li>Pay the deposit only</li>
                                <li>Add funds to your wallet</li>
                              </ul>
                            </div>
                          ),
                          okText: "Add Funds",
                          cancelText: "Use Deposit",
                          onOk() {
                            navigate("/user/wallet");
                          },
                          onCancel() {
                            setPaymentChoice("deposit");
                          },
                        });
                      }}
                    >
                      <Card
                        size="small"
                        style={{
                          marginLeft: 8,
                          opacity:
                            walletBalance &&
                            priceDetails &&
                            walletBalance.balance < priceDetails.totalPrice
                              ? 0.6
                              : 1,
                        }}
                        bodyStyle={{ padding: 12 }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Pay Full Amount (
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
                              Pay the entire amount now (recommended)
                            </div>
                            {walletBalance &&
                              priceDetails &&
                              walletBalance.balance <
                                priceDetails.totalPrice && (
                                <div
                                  style={{
                                    color: "#ff4d4f",
                                    fontSize: "12px",
                                    marginTop: "6px",
                                  }}
                                >
                                  <InfoCircleOutlined
                                    style={{ marginRight: "4px" }}
                                  />
                                  Insufficient funds in wallet
                                </div>
                              )}
                          </div>
                        </div>
                      </Card>
                    </Radio>
                  </Space>
                </Radio.Group>
                {/* Terms & Conditions */}
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Please accept the terms and conditions"
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the <a href="#terms">terms and conditions</a> and{" "}
                    <a href="#privacy">privacy policy</a>
                  </Checkbox>
                </Form.Item>
                {/* Action Buttons */}
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button onClick={prev}>Back</Button>
                  <Button
                    type="primary"
                    onClick={handleBooking}
                    size="large"
                    icon={<CheckCircleOutlined />}
                  >
                    Complete Booking
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
                      ? "Court Information"
                      : "Sport Center Information"}
                  </span>
                </div>
              }
              className="summary-card"
              style={{ marginBottom: 24 }}
              variant={false}
            >
              {getSelectedCourt() ? (
                // Court Information
                <>
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
                        title: "Court Type",
                        description: formatCourtType(
                          getSelectedCourt().courtType
                        ),
                        icon: <AppstoreOutlined style={{ color: "#1890ff" }} />,
                      },
                      {
                        title: "Duration",
                        description:
                          getSelectedCourt().slotDuration?.replace(
                            "00:00:00",
                            ""
                          ) || "1 hour",
                        icon: (
                          <ClockCircleOutlined style={{ color: "#52c41a" }} />
                        ),
                      },
                      {
                        title: "Status",
                        description: getCourtStatusBadge(
                          getSelectedCourt().status
                        ),
                        icon: (
                          <InfoCircleOutlined style={{ color: "#faad14" }} />
                        ),
                      },
                      {
                        title: "Sport Center",
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
                          Facilities
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
                </>
              ) : (
                // Sport Center Information
                sportCenter && (
                  <>
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
                          title: "Address",
                          description: formatAddress(sportCenter),
                          icon: (
                            <EnvironmentOutlined style={{ color: "#1890ff" }} />
                          ),
                        },
                        {
                          title: "Phone",
                          description:
                            sportCenter.phoneNumber || "Not available",
                          icon: <PhoneOutlined style={{ color: "#52c41a" }} />,
                        },
                        {
                          title: "Available Courts",
                          description: `${courts.length} courts`,
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
                          Description
                        </Divider>
                        <Paragraph>{sportCenter.description}</Paragraph>
                      </>
                    )}
                  </>
                )
              )}
            </Card>

            {/* Booking Summary Card */}
            {current > 0 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    <span>Your Booking</span>
                  </div>
                }
                className="summary-card"
                variant={false}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      title: "Date",
                      description: formatDate(selectedDate),
                      icon: <CalendarOutlined style={{ color: "#1890ff" }} />,
                    },
                    {
                      title: "Courts",
                      description: `${
                        Object.keys(selectedTimeSlots).length
                      } selected`,
                      icon: <AppstoreOutlined style={{ color: "#1890ff" }} />,
                    },
                    {
                      title: "Total Duration",
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
                      )} minutes`,
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
                      Time Slots
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
                              ? "Payment Amount (Deposit)"
                              : "Payment Amount (Full)"
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
                              Remaining balance:{" "}
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
                        title="Total Price"
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
            color: #d9d9d9;
          }
          .selected-court {
            transition: all 0.3s;
          }
          .selected-court:hover {
            transform: translateY(-3px);
          }
        `}</style>
      </Content>
    </Layout>
  );
};

export default BookCourtView;
