import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Client } from "../../API/CourtApi";
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
  Input,
  Select,
  Checkbox,
  Radio,
  Alert,
  Divider,
  Tabs,
  List,
  Skeleton,
  Avatar,
  Result,
  Spin,
  Empty,
  Descriptions,
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
  DollarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  TagOutlined,
  BankOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

// API client instance
const apiClient = new Client();

// Helper function to format date
const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY");
};

// Helper function to format time
const formatTime = (time) => {
  return dayjs(`2023-01-01 ${time}`).format("hh:mm A");
};

const BookCourtView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Court data
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(id || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking states
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate ? dayjs(location.state.selectedDate) : dayjs()
  );
  const [availableSlotsMap, setAvailableSlotsMap] = useState({});
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

  // Fetch court data and available slots
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);

        // In a real app, fetch from the API
        const courtsData = [
          {
            id: "e6e10ea7-2dc2-4700-b59a-7cf85036487e",
            courtName: "Court 1",
            sportId: "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
            sportCenterId: "a735b48c-a177-43d9-b467-4e2543f1dfd3",
            description: "Main tennis court with professional surface",
            facilities: [
              { name: "WiFi", description: "High-speed internet" },
              { name: "Lighting", description: "Bright LED lights" },
            ],
            slotDuration: "00:30:00",
            status: 0,
            courtType: 1,
            minDepositPercentage: 0,
            sportName: "Tennis",
            sportCenterName: "Sport Center 1",
            createdAt: "2025-03-19T21:03:39.405585Z",
            lastModified: null,
            price: 25,
            pricePerHour: 50,
            address: "123 Sports Way, Tennis City",
            maxPeople: 4,
          },
          {
            id: "f7e10ea7-2dc2-4700-b59a-7cf85036488f",
            courtName: "Court 2",
            sportId: "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
            sportCenterId: "a735b48c-a177-43d9-b467-4e2543f1dfd3",
            description: "Secondary tennis court with clay surface",
            facilities: [
              { name: "WiFi", description: "High-speed internet" },
              { name: "Lighting", description: "Bright LED lights" },
              { name: "Showers", description: "Clean shower facilities" },
            ],
            slotDuration: "00:30:00",
            status: 0,
            courtType: 2,
            minDepositPercentage: 0,
            sportName: "Tennis",
            sportCenterName: "Sport Center 1",
            createdAt: "2025-03-19T21:03:39.405585Z",
            lastModified: null,
            price: 20,
            pricePerHour: 40,
            address: "123 Sports Way, Tennis City",
            maxPeople: 4,
          },
          {
            id: "g8e10ea7-2dc2-4700-b59a-7cf85036489g",
            courtName: "Court 3",
            sportId: "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
            sportCenterId: "a735b48c-a177-43d9-b467-4e2543f1dfd3",
            description: "Indoor tennis court with premium surface",
            facilities: [
              { name: "WiFi", description: "High-speed internet" },
              { name: "Lighting", description: "Bright LED lights" },
              {
                name: "Air Conditioning",
                description: "Climate controlled environment",
              },
            ],
            slotDuration: "00:30:00",
            status: 0,
            courtType: 3,
            minDepositPercentage: 0,
            sportName: "Tennis",
            sportCenterName: "Sport Center 1",
            createdAt: "2025-03-19T21:03:39.405585Z",
            lastModified: null,
            price: 30,
            pricePerHour: 60,
            address: "123 Sports Way, Tennis City",
            maxPeople: 4,
          },
          {
            id: "h9e10ea7-2dc2-4700-b59a-7cf85036490h",
            courtName: "Court 4",
            sportId: "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
            sportCenterId: "a735b48c-a177-43d9-b467-4e2543f1dfd3",
            description: "Outdoor tennis court with standard surface",
            facilities: [
              { name: "Lighting", description: "Bright LED lights" },
              { name: "Seating", description: "Spectator seating available" },
            ],
            slotDuration: "00:30:00",
            status: 0,
            courtType: 1,
            minDepositPercentage: 0,
            sportName: "Tennis",
            sportCenterName: "Sport Center 1",
            createdAt: "2025-03-19T21:03:39.405585Z",
            lastModified: null,
            price: 22,
            pricePerHour: 44,
            address: "123 Sports Way, Tennis City",
            maxPeople: 4,
          },
        ];

        setCourts(courtsData);

        // Generate time slots for all courts at once
        const slotsMap = {};
        courtsData.forEach((court) => {
          slotsMap[court.id] = generateTimeSlotsForCourt(court);
        });

        setAvailableSlotsMap(slotsMap);

        // Set the ID from the URL param as the selected court, or default to the first court
        if (id && courtsData.some((court) => court.id === id)) {
          setSelectedCourtId(id);
        } else if (courtsData.length > 0) {
          setSelectedCourtId(courtsData[0].id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching court data:", err);
        setError("Failed to load court details. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourts();
  }, [id]);

  // Create a function to generate time slots for a specific court
  const generateTimeSlotsForCourt = (court) => {
    // In real app, this would be fetched from backend
    const startHour = 8; // 8 AM
    const endHour = 22; // 10 PM
    const slotInterval = 30; // 30 minutes

    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const hourFormatted = hour.toString().padStart(2, "0");
        const minuteFormatted = minute.toString().padStart(2, "0");

        // Calculate end time
        let endHour = hour;
        let endMinute = minute + slotInterval;

        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }

        const endHourFormatted = endHour.toString().padStart(2, "0");
        const endMinuteFormatted = endMinute.toString().padStart(2, "0");

        const time = `${hourFormatted}:${minuteFormatted}`;
        const endTime = `${endHourFormatted}:${endMinuteFormatted}`;
        const displayTime = `${hourFormatted}:${minuteFormatted} - ${endHourFormatted}:${endMinuteFormatted}`;

        // Random availability for demo - unique to this court
        // In a real app, this would be based on court's actual bookings
        const isAvailable =
          Math.random() >
          (court.courtName === "Court 1"
            ? 0.4
            : court.courtName === "Court 2"
            ? 0.3
            : court.courtName === "Court 3"
            ? 0.2
            : 0.1);

        slots.push({
          time,
          endTime,
          displayTime,
          isAvailable,
          slotIndex: slots.length,
          courtId: court.id, // Attach the court ID to the slot
        });
      }
    }

    return slots;
  };

  // Regenerate time slots when date changes
  useEffect(() => {
    if (courts.length > 0) {
      // When date changes, regenerate slots for all courts
      const slotsMap = {};
      courts.forEach((court) => {
        slotsMap[court.id] = generateTimeSlotsForCourt(court);
      });

      setAvailableSlotsMap(slotsMap);

      // Clear selected time slots when date changes
      setSelectedTimeSlots({});
    }
  }, [selectedDate, courts]);

  // Toggle time slot selection
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
      const slotIndex = courtSlots.findIndex((s) => s.time === slot.time);

      if (slotIndex >= 0) {
        // Remove slot if already selected
        courtSlots.splice(slotIndex, 1);
        // Remove court entirely if no slots left
        if (courtSlots.length === 0) {
          delete newSlots[slot.courtId];
        }
      } else {
        // Add slot, maintaining chronological order
        courtSlots.push(slot);
        courtSlots.sort((a, b) => a.time.localeCompare(b.time));
      }

      return newSlots;
    });
  };

  // Calculate pricing
  const calculateSubtotal = () => {
    let total = 0;

    Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
      const court = courts.find((c) => c.id === courtId);
      if (court) {
        // Each slot is 30 minutes (0.5 hours)
        total += slots.length * 0.5 * court.pricePerHour;
      }
    });

    return total;
  };

  const calculateTaxes = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  // Get the currently selected court
  const getSelectedCourt = () => {
    return courts.find((court) => court.id === selectedCourtId) || null;
  };

  // Get available slots for the current court
  const getAvailableSlotsForSelectedCourt = () => {
    return availableSlotsMap[selectedCourtId] || [];
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
  const handleBooking = async (values) => {
    if (Object.keys(selectedTimeSlots).length === 0) {
      message.error("Please select at least one time slot");
      return;
    }

    try {
      // Display loading message
      const loadingMessage = message.loading("Processing your booking...", 0);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove loading message
      loadingMessage();

      // Show success message
      message.success("Booking completed successfully!");

      // In a real app, you would send the booking data to your API here
      // Navigate to success page
      navigate("/booking-success", {
        state: {
          bookingId:
            "BK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          courtName: getSelectedCourt()?.courtName,
          sportCenter: getSelectedCourt()?.sportCenterName,
          date: selectedDate.toDate(),
          timeSlots: selectedTimeSlots,
          totalMinutes: Object.values(selectedTimeSlots).reduce(
            (total, slots) => total + slots.length * 30,
            0
          ),
          total: calculateTotal(),
          customerName: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone,
        },
      });
    } catch (error) {
      message.error("Failed to complete booking. Please try again.");
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
                  Book {getSelectedCourt()?.courtName} -{" "}
                  {getSelectedCourt()?.sportName}
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

                {/* Court Selection */}
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Select Court</Title>
                  <Row gutter={[16, 16]}>
                    {courts.map((court) => (
                      <Col key={court.id} xs={12} sm={8} md={6}>
                        <Card
                          hoverable
                          className={
                            selectedCourtId === court.id ? "selected-court" : ""
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
                            description={`$${court.pricePerHour}/hour`}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
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

                  <Row gutter={[8, 8]}>
                    {getAvailableSlotsForSelectedCourt().map((slot, index) => (
                      <Col key={index} xs={12} sm={8} md={6}>
                        <Button
                          type={
                            selectedTimeSlots[slot.courtId]?.some(
                              (s) => s.time === slot.time
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
                        </Button>
                      </Col>
                    ))}
                  </Row>

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

            {/* Step 2 - Your Information */}
            {current === 1 && (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    <span>Your Information</span>
                  </div>
                }
                bordered={false}
                className="step-card"
              >
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={next}
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    specialRequests: "",
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your first name",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="First Name"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your last name",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Last Name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your email",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid email",
                          },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your phone number",
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined />}
                          placeholder="Phone Number"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="specialRequests"
                    label="Special Requests (Optional)"
                  >
                    <TextArea
                      placeholder="Any special requirements or requests..."
                      rows={4}
                    />
                  </Form.Item>

                  <div
                    style={{
                      marginTop: 24,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={prev}>Back</Button>
                    <Button type="primary" htmlType="submit">
                      Continue to Payment
                    </Button>
                  </div>
                </Form>
              </Card>
            )}

            {/* Step 3 - Payment */}
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
                <Divider>Booking Summary</Divider>
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 2 }}
                  style={{ marginBottom: 24 }}
                >
                  <Descriptions.Item label="Date" span={2}>
                    {formatDate(selectedDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Duration" span={2}>
                    {Object.values(selectedTimeSlots).reduce(
                      (total, slots) => total + slots.length * 30,
                      0
                    )}{" "}
                    minutes
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Courts" span={2}>
                    {Object.keys(selectedTimeSlots).length}
                  </Descriptions.Item>
                  <Descriptions.Item label="Your Information" span={2}>
                    <div>
                      <div>
                        {form.getFieldValue("firstName")}{" "}
                        {form.getFieldValue("lastName")}
                      </div>
                      <div>{form.getFieldValue("email")}</div>
                      <div>{form.getFieldValue("phone")}</div>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
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
                    const courtTotal = slots.length * 0.5 * court.pricePerHour;

                    return (
                      <List.Item
                        extra={<Text strong>${courtTotal.toFixed(2)}</Text>}
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
                                  {slots.length * 30} minutes (
                                  {slots.length * 0.5} hours)
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
                // Completing the payment section and enhancing UI/UX //
                Complete the payment summary section
                <div
                  style={{
                    marginTop: 24,
                    background: "#f9f9f9",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>Subtotal:</Col>
                    <Col>${calculateSubtotal().toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>Tax (10%):</Col>
                    <Col>${calculateTaxes().toFixed(2)}</Col>
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                  <Row
                    justify="space-between"
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    <Col>Total:</Col>
                    <Col>${calculateTotal().toFixed(2)}</Col>
                  </Row>
                </div>
                {/* Payment method selection */}
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

                    <Radio value="online">
                      <Card
                        size="small"
                        style={{ marginLeft: 8, opacity: 0.6 }}
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
                              Secure payment via bank
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
                    onClick={() => {
                      // Get booking information for the description
                      const selectedCourt = getSelectedCourt();
                      const description = `Booking ${
                        selectedCourt?.courtName
                      } on ${formatDate(selectedDate)} for ${Object.values(
                        selectedTimeSlots
                      ).reduce(
                        (total, slots) => total + slots.length * 30,
                        0
                      )} minutes`;
                      const amount = calculateTotal().toFixed(2);
                      const account = "999923062003"; // Replace with your account number
                      const bank = "MBBank"; // Replace with your bank code

                      // Open QR code in a new window
                      const qrUrl = `https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${amount}&des=${encodeURIComponent(
                        description
                      )}`;
                      window.open(qrUrl, "_blank", "width=400,height=400");

                      // Continue with booking process
                      handleBooking(form.getFieldsValue());
                    }}
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
            {/* Court Information Card */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  <span>Court Information</span>
                </div>
              }
              className="summary-card"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              {getSelectedCourt() && (
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
                      {getSelectedCourt().sportName?.charAt(0)}
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
                        title: "Price",
                        description: `$${getSelectedCourt().pricePerHour}/hour`,
                        icon: <DollarOutlined style={{ color: "#52c41a" }} />,
                      },
                      {
                        title: "Address",
                        description: getSelectedCourt().address,
                        icon: (
                          <EnvironmentOutlined style={{ color: "#faad14" }} />
                        ),
                      },
                      {
                        title: "Max Capacity",
                        description: `${getSelectedCourt().maxPeople} people`,
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
                        {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {getSelectedCourt().facilities.map((facility, index) => (
                          // <Tooltip key={index} title={facility.description}>
                          //   <Tag color="blue">{facility.name}</Tag>
                          // </Tooltip>
                        ))}
                      </div> */}
                      </>
                    )}
                </>
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
                        (total, slots) => total + slots.length * 30,
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
                      value={calculateTotal()}
                      precision={2}
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
        <style jsx>{`
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
