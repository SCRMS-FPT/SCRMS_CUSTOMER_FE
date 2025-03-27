import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tabs,
  Tag,
  List,
  Typography,
  Image,
  Divider,
  Button,
  Rate,
  Row,
  Col,
  Avatar,
  Space,
  Table,
  Spin,
  Empty,
  message,
  Alert,
  Skeleton,
} from "antd";
import {
  LeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  SnippetsOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";

const { Title, Text, Paragraph } = Typography;

// Define enums according to backend
const CourtStatus = {
  Open: 0,
  Closed: 1,
  Maintenance: 2,
};

const CourtType = {
  Indoor: 1,
  Outdoor: 2,
  Covered: 3,
};

const CourtScheduleStatus = {
  Available: 0,
  Booked: 1,
  Maintenance: 2,
};

const CourtOwnerCourtDetailView = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [court, setCourt] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [courtSchedules, setCourtSchedules] = useState([]); // New state for court schedules

  // Fetch court data when component mounts
  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = new Client();

        // Fetch court details
        const courtResponse = await client.getCourtDetails(courtId);
        setCourt(courtResponse.court);

        // Fetch court schedules
        const schedulesResponse = await client.getCourtSchedulesByCourtId(
          courtId
        );
        setCourtSchedules(schedulesResponse);

        // Fetch court availability (schedules)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const availabilityResponse = await client.getCourtAvailability(
          courtId,
          today,
          nextWeek
        );
        setAvailability(availabilityResponse);
      } catch (err) {
        console.error("Error fetching court details:", err);
        setError("Failed to load court details. Please try again later.");
        message.error("Failed to load court details");
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchCourtDetails();
    }
  }, [courtId]);

  // Format address display
  const formatAddress = (sportCenter) => {
    if (!sportCenter) return "";
    return `${sportCenter.addressLine || ""}, ${sportCenter.city || ""}, ${
      sportCenter.district || ""
    }, ${sportCenter.commune || ""}`;
  };

  // Format operating hours from court schedules
  const formatOperatingHours = () => {
    if (!courtSchedules || courtSchedules.length === 0) return [];

    // Group schedules by day
    const schedulesByDay = {};
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    courtSchedules.forEach((schedule) => {
      schedule.dayOfWeek.forEach((day) => {
        const dayName = dayNames[day - 1]; // Convert 1-based to 0-based index
        if (!schedulesByDay[dayName]) {
          schedulesByDay[dayName] = [];
        }

        schedulesByDay[dayName].push({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          price: schedule.priceSlot,
        });
      });
    });

    // Convert to array for Table component
    return Object.entries(schedulesByDay).map(([day, schedules]) => {
      // Sort schedules by start time
      schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // Combine consecutive schedules with the same price
      const combinedSchedules = [];
      let currentSchedule = null;

      schedules.forEach((schedule) => {
        if (!currentSchedule) {
          currentSchedule = { ...schedule };
        } else if (
          currentSchedule.endTime === schedule.startTime &&
          currentSchedule.price === schedule.price
        ) {
          // Extend the current schedule
          currentSchedule.endTime = schedule.endTime;
        } else {
          // Save the current schedule and start a new one
          combinedSchedules.push(currentSchedule);
          currentSchedule = { ...schedule };
        }
      });

      if (currentSchedule) {
        combinedSchedules.push(currentSchedule);
      }

      return {
        key: day,
        day: day,
        schedules: combinedSchedules,
        hoursText: combinedSchedules
          .map(
            (s) =>
              `${s.startTime.substring(0, 5)} - ${s.endTime.substring(
                0,
                5
              )} (${(s.price || 0).toLocaleString()}₫)`
          )
          .join(", "),
      };
    });
  };

  // Get status text and color based on status code
  const getStatusDisplay = (status) => {
    switch (status) {
      case CourtStatus.Open:
        return { text: "Open", color: "green" };
      case CourtStatus.Closed:
        return { text: "Closed", color: "red" };
      case CourtStatus.Maintenance:
        return { text: "Maintenance", color: "orange" };
      default:
        return { text: "Unknown", color: "default" };
    }
  };

  // Get court type text based on type code
  const getCourtTypeDisplay = (type) => {
    switch (type) {
      case CourtType.Indoor:
        return { text: "Indoor", color: "blue" };
      case CourtType.Outdoor:
        return { text: "Outdoor", color: "green" };
      case CourtType.Covered:
        return { text: "Covered", color: "purple" };
      default:
        return { text: "Unknown", color: "default" };
    }
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Card>
        <Alert
          message="Error Loading Court Details"
          description={error}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/courts")}
          style={{ marginTop: 16 }}
        >
          Go Back to Courts
        </Button>
      </Card>
    );
  }

  // If no court data, show empty state
  if (!court) {
    return (
      <Card>
        <Empty description="No court information available" />
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/courts")}
          style={{ marginTop: 16, textAlign: "center" }}
        >
          Go Back to Courts
        </Button>
      </Card>
    );
  }

  // Format facilities for display
  const facilities = court.facilities || [];
  const operatingHours = formatOperatingHours();
  const statusDisplay = getStatusDisplay(court.status);
  const courtTypeDisplay = getCourtTypeDisplay(court.courtType);

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: "20px" }}>
            {court.courtName}
          </Text>
          <Space>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => navigate(`/court-owner/courts/update/${court.id}`)}
            >
              Edit Court
            </Button>

            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() => navigate("/court-owner/courts")}
            >
              Go Back
            </Button>
          </Space>
        </div>
      }
      style={{ width: "100%" }}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Overview",
            children: (
              <>
                <Title level={4}>{court.courtName}</Title>
                <Text type="secondary">{court.sportCenterName}</Text>
                <Divider />

                <List>
                  <List.Item>
                    <Text strong>Sport Type:</Text>{" "}
                    <Tag color="blue">{court.sportName}</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Court Type:</Text>
                    <Tag color={courtTypeDisplay.color}>
                      {courtTypeDisplay.text}
                    </Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Status:</Text>
                    <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>Minimum Deposit:</Text>{" "}
                    {court.minDepositPercentage}%
                  </List.Item>
                  <List.Item>
                    <Text strong>Slot Duration:</Text> {court.slotDuration}
                  </List.Item>
                  <List.Item>
                    <Text strong>Cancellation Window:</Text>{" "}
                    {court.cancellationWindowHours} hours
                  </List.Item>
                  <List.Item>
                    <Text strong>Refund Percentage:</Text>{" "}
                    {court.refundPercentage}%
                  </List.Item>
                </List>
              </>
            ),
          },
          {
            key: "2",
            label: "Features & Amenities",
            children: (
              <>
                <Title level={5}>Court Facilities</Title>
                {facilities.length > 0 ? (
                  facilities.map((facility, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <Tag color="blue" style={{ marginRight: 8 }}>
                        {facility.name}
                      </Tag>
                      {facility.description && (
                        <Text type="secondary">{facility.description}</Text>
                      )}
                    </div>
                  ))
                ) : (
                  <Text>No facilities information available.</Text>
                )}

                <Divider />

                <Title level={5}>Description</Title>
                <Paragraph>
                  {court.description || "No description available."}
                </Paragraph>
              </>
            ),
          },
          {
            key: "3",
            label: "Pricing & Schedules",
            children: (
              <>
                <Title level={5}>
                  <DollarOutlined /> Pricing & Schedules
                </Title>

                {operatingHours.length > 0 ? (
                  <Table
                    dataSource={operatingHours}
                    columns={[
                      {
                        title: "Day",
                        dataIndex: "day",
                        key: "day",
                        render: (text) => <Text strong>{text}</Text>,
                      },
                      {
                        title: "Hours & Pricing",
                        dataIndex: "hoursText",
                        key: "hoursText",
                        render: (text, record) => (
                          <div>
                            {record.schedules.map((schedule, index) => (
                              <Tag
                                key={index}
                                color="blue"
                                style={{ marginBottom: 4 }}
                              >
                                {schedule.startTime.substring(0, 5)} -{" "}
                                {schedule.endTime.substring(0, 5)}
                                <span style={{ marginLeft: 8 }}>
                                  {(schedule.price || 0).toLocaleString()}₫
                                </span>
                              </Tag>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                    pagination={false}
                    bordered
                  />
                ) : (
                  <Empty description="No schedule information available" />
                )}
              </>
            ),
          },
          {
            key: "4",
            label: "Booking Policies",
            children: (
              <>
                <Title level={5}>
                  <SnippetsOutlined /> Booking Policies
                </Title>
                <List>
                  <List.Item>
                    <Text strong>Minimum Deposit Required:</Text>{" "}
                    {court.minDepositPercentage}% of total booking cost
                  </List.Item>
                  <List.Item>
                    <Text strong>Cancellation Window:</Text>{" "}
                    {court.cancellationWindowHours} hours before booking time
                  </List.Item>
                  <List.Item>
                    <Text strong>Refund Amount:</Text> {court.refundPercentage}%
                    of deposit amount if cancelled within window
                  </List.Item>
                </List>
              </>
            ),
          },
          {
            key: "5",
            label: "Availability",
            children: (
              <>
                <Title level={5}>
                  <CalendarOutlined /> Court Availability
                </Title>

                {availability && availability.schedule ? (
                  <div>
                    {availability.schedule.map((day, dayIndex) => (
                      <div key={dayIndex} style={{ marginBottom: 24 }}>
                        <Title level={5}>
                          {new Date(day.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Title>

                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {day.timeSlots &&
                            day.timeSlots.map((slot, slotIndex) => (
                              <Tag
                                key={slotIndex}
                                color={
                                  slot.status === "Available" ? "green" : "red"
                                }
                                style={{ padding: "4px 8px", marginBottom: 8 }}
                              >
                                {slot.startTime.substring(0, 5)} -{" "}
                                {slot.endTime.substring(0, 5)}
                                <div>
                                  <small>{slot.status}</small>
                                  {slot.price && (
                                    <div>{slot.price.toLocaleString()}₫</div>
                                  )}
                                </div>
                              </Tag>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No availability information" />
                )}
              </>
            ),
          },
          {
            key: "6",
            label: "Promotions",
            children: (
              <>
                <Title level={5}>
                  <StarOutlined /> Promotions
                </Title>

                {court.promotions && court.promotions.length > 0 ? (
                  <List
                    dataSource={court.promotions}
                    renderItem={(promotion) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div>
                              <Tag color="orange">
                                {promotion.discountType === "Percentage"
                                  ? `${promotion.discountValue}% OFF`
                                  : `${promotion.discountValue.toLocaleString()}₫ OFF`}
                              </Tag>
                              <Text style={{ marginLeft: 8 }}>
                                {promotion.description}
                              </Text>
                            </div>
                          }
                          description={
                            <Text type="secondary">
                              Valid from{" "}
                              {new Date(
                                promotion.validFrom
                              ).toLocaleDateString()}
                              to{" "}
                              {new Date(promotion.validTo).toLocaleDateString()}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No active promotions for this court" />
                )}

                <div style={{ marginTop: 16, textAlign: "right" }}>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate("/court-owner/promotions/create", {
                        state: { courtId: court.id },
                      })
                    }
                  >
                    Add Promotion
                  </Button>
                </div>
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default CourtOwnerCourtDetailView;
