import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Client as CourtClient } from "../../API/CourtApi";
import { Client as PaymentClient } from "../../API/PaymentApi";
import {
  Layout,
  Typography,
  Steps,
  Card,
  Button,
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
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TagOutlined,
  BankOutlined,
  AppstoreOutlined,
  TeamOutlined,
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
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  // Booking states
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate ? dayjs(location.state.selectedDate) : dayjs()
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

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

          // Set the first court as selected by default
          setSelectedCourtId(courtsResponse.courts.data[0].id);
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
      if (!selectedCourtId || !selectedDate) return;

      try {
        setLoadingSlots(true);

        // Format date for API
        const startDate = selectedDate.startOf("day").toDate();
        const endDate = selectedDate.startOf("day").add(1, "day").toDate();

        // Fetch availability for the selected court and date
        const availabilityResponse = await apiClient.getCourtAvailability(
          selectedCourtId,
          startDate,
          endDate
        );

        // Check if we have schedule data for the selected date
        if (
          availabilityResponse &&
          availabilityResponse.schedule &&
          availabilityResponse.schedule.length > 0
        ) {
          // Find the schedule for the selected date
          const daySchedule = availabilityResponse.schedule.find((day) =>
            dayjs(day.date).isSame(selectedDate, "day")
          );

          if (daySchedule && daySchedule.timeSlots) {
            setAvailableSlots(
              daySchedule.timeSlots.map((slot) => ({
                ...slot,
                isAvailable: slot.status === "AVAILABLE",
                courtId: selectedCourtId,
                displayTime: `${slot.startTime} - ${slot.endTime}`,
              }))
            );
          } else {
            setAvailableSlots([]);
          }
        } else {
          setAvailableSlots([]);
        }

        setLoadingSlots(false);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAvailableSlots([]);
        setLoadingSlots(false);
        message.error("Failed to load available time slots");
      }
    };

    fetchAvailableSlots();
    // Clear selected time slots when court or date changes
    setSelectedTimeSlots({});
  }, [selectedCourtId, selectedDate]);

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
  // Get the currently selected court
  const getSelectedCourt = () => {
    return courts.find((court) => court.id === selectedCourtId) || null;
  };

  // Handle court selection
  const handleCourtSelect = (courtId) => {
    setSelectedCourtId(courtId);
  };

  // Steps navigation
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // Handle booking submission
  // Update the handleBooking function to implement the booking flow
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

      const bookingRequest = {
        booking: {
          bookingDate: selectedDate.format("YYYY-MM-DD"),
          totalPrice: calculateTotal(),
          note: "",
          depositAmount: calculateTotal() * 0.3, // 30% deposit
          bookingDetails: bookingDetails,
        },
      };

      // Step 1: Create booking via Court API
      const bookingResponse = await apiClient.createBooking(bookingRequest);

      if (bookingResponse && bookingResponse.id) {
        // Step 2: Process payment via Payment API
        const paymentRequest = new ProcessPaymentRequest({
          amount: calculateTotal(),
          description: `Booking at ${sportCenter.name} on ${formatDate(
            selectedDate
          )}`,
          paymentType: "Wallet",
          referenceId: bookingResponse.id,
          bookingId: bookingResponse.id,
          status: "Completed",
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
              bordered={false}
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
                  Book a Court at {sportCenter?.name}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Progress Steps */}
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Card bordered={false} style={{ marginBottom: 16 }}>
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
                bordered={false}
                className="step-card"
              >
                {/* Date Selection */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Select Date</Title>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      // Can't select days before today
                      return current && current < dayjs().startOf("day");
                    }}
                    size="large"
                  />
                </div>

                {/* Court Selection with Promotions */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Select Court</Title>
                  {courts.length === 0 ? (
                    <Empty description="No courts available" />
                  ) : (
                    <Row gutter={[16, 16]}>
                      {courts.map((court) => {
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
                                  top: "-4px", // Move the ribbon higher up
                                  marginTop: "-8px", // Add negative margin to raise it further
                                  zIndex: 2, // Ensure it stays above other elements
                                }}
                              >
                                <Card
                                  hoverable
                                  className={
                                    selectedCourtId === court.id
                                      ? "selected-court"
                                      : ""
                                  }
                                  onClick={() => handleCourtSelect(court.id)}
                                  style={{
                                    textAlign: "center",
                                    border:
                                      selectedCourtId === court.id
                                        ? "2px solid #1890ff"
                                        : "1px solid #f0f0f0",
                                    background:
                                      selectedCourtId === court.id
                                        ? "#e6f7ff"
                                        : "white",
                                    position: "relative",
                                    paddingTop: "16px", // Add padding at the top to make room for the badge
                                    marginTop: "8px", // Add margin to give space for the ribbon
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
                                </Card>
                              </Badge.Ribbon>
                            )}

                            {/* Regular Card (No Promotion) */}
                            {!hasPromotions && (
                              <Card
                                hoverable
                                className={
                                  selectedCourtId === court.id
                                    ? "selected-court"
                                    : ""
                                }
                                onClick={() => handleCourtSelect(court.id)}
                                style={{
                                  textAlign: "center",
                                  border:
                                    selectedCourtId === court.id
                                      ? "2px solid #1890ff"
                                      : "1px solid #f0f0f0",
                                  background:
                                    selectedCourtId === court.id
                                      ? "#e6f7ff"
                                      : "white",
                                }}
                                bodyStyle={{ padding: "12px 8px" }}
                              >
                                <Meta
                                  title={court.courtName}
                                  description={
                                    <div>{court.sportName || "Sport"}</div>
                                  }
                                />
                              </Card>
                            )}
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </div>

                {/* Time Slot Selection */}
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
                  ) : availableSlots.length === 0 ? (
                    <Empty description="No time slots available for this date" />
                  ) : (
                    <Row gutter={[8, 8]}>
                      {availableSlots.map((slot, index) => (
                        <Col key={index} xs={12} sm={8} md={6}>
                          {/* Inside the time slot button */}
                          <Button
                            type={
                              selectedTimeSlots[slot.courtId]?.some(
                                (s) =>
                                  s.startTime === slot.startTime &&
                                  s.endTime === slot.endTime
                              )
                                ? "primary"
                                : "default"
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
                                    {new Intl.NumberFormat("vi-VN").format(
                                      slot.price
                                    )}{" "}
                                    VND
                                  </div>
                                  {getActivePromotions(getSelectedCourt())
                                    .length > 0 && (
                                    <div style={{ color: "#f50" }}>
                                      {new Intl.NumberFormat("vi-VN").format(
                                        calculateDiscountedPrice(
                                          slot.price,
                                          getActivePromotions(
                                            getSelectedCourt()
                                          )[0]
                                        )
                                      )}{" "}
                                      VND
                                    </div>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </Button>
                        </Col>
                      ))}
                    </Row>
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
                bordered={false}
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

                {/* Price Summary */}
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

                {/* Payment method selection - Pay Online disabled */}
                <Divider>Payment Method</Divider>
                <Radio.Group
                  defaultValue="venue"
                  style={{ width: "100%", marginBottom: 24 }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio value="venue">
                      <Card
                        size="small"
                        style={{ marginLeft: 8, marginBottom: 8 }}
                        bodyStyle={{ padding: 12 }}
                        hoverable
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <BankOutlined
                            style={{
                              fontSize: 20,
                              marginRight: 12,
                              color: "#1890ff",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              Pay with wallet
                            </div>
                            <div
                              style={{
                                color: "rgba(0, 0, 0, 0.45)",
                                fontSize: "12px",
                              }}
                            >
                              Pay in app with your wallet
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Radio>

                    <Radio value="online" disabled>
                      <Card
                        size="small"
                        style={{ marginLeft: 8, opacity: 0.5 }}
                        bodyStyle={{ padding: 12 }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CreditCardOutlined
                            style={{
                              fontSize: 20,
                              marginRight: 12,
                              color: "#52c41a",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: "bold" }}>Pay Online</div>
                            <div
                              style={{
                                color: "rgba(0, 0, 0, 0.45)",
                                fontSize: "12px",
                              }}
                            >
                              Coming soon - Currently in development
                            </div>
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
              bordered={false}
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
                bordered={false}
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

                    <Statistic
                      title="Total Price"
                      value={(calculateTotal() / 1000).toFixed(2)}
                      prefix="$"
                      valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                    />
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
