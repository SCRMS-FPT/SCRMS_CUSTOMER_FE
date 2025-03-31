import React, { useState, useEffect } from "react";
import {
  Calendar,
  Badge,
  Modal,
  List,
  Button,
  Spin,
  Alert,
  Space,
  Typography,
  Select,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client } from "../../API/CoachApi";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

const UserCoachCalendarView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "1";

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayBookings, setSelectedDayBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const client = new Client();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredBookings(
        bookings.filter(
          (booking) =>
            booking.status?.toUpperCase() === statusFilter.toUpperCase()
        )
      );
    } else {
      setFilteredBookings(bookings);
    }
  }, [bookings, statusFilter]);

  // Add this helper function to calculate duration between times
  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let durationMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);

    // Handle cases where end time is on the next day
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) {
      return `${minutes} mins`;
    } else if (minutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
        minutes > 1 ? "s" : ""
      }`;
    }
  };

  // Update the fetchBookings function in UserCoachCalendarView.jsx
  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Format dates properly for API - using YYYY-MM-DD format
      const startDateFormatted = dayjs()
        .subtract(3, "month")
        .format("YYYY-MM-DD");
      const endDateFormatted = dayjs().add(3, "month").format("YYYY-MM-DD");

      console.log("Fetching bookings with date range:", {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      });

      const response = await client.getUserBookings(
        new Date(startDateFormatted), // Convert to Date object using formatted string
        new Date(endDateFormatted), // Convert to Date object using formatted string
        statusFilter || undefined,
        0, // pageIndex should be 0 for first page, not 1
        100, // pageSize
        undefined, // sportId
        undefined, // coachId
        undefined // packageId
      );
      setBookings(response.data || []);
      setTotalCount(response.count || 0);

      console.log("Received bookings:", response);

      // Handle response properly
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusType = (status) => {
    const normalizedStatus = status?.toUpperCase();

    switch (normalizedStatus) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "processing";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "NO_SHOW":
        return "default";
      default:
        return "default";
    }
  };

  const getBookingListForDate = (date) => {
    // Get bookings for the selected date
    const dateStr = date.format("YYYY-MM-DD");
    return filteredBookings.filter(
      (booking) => dayjs(booking.bookingDate).format("YYYY-MM-DD") === dateStr
    );
  };

  const cellRender = (current) => {
    const bookingsForDay = getBookingListForDate(current);

    return bookingsForDay.length > 0 ? (
      <ul
        className="events"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {bookingsForDay.slice(0, 2).map((booking, index) => (
          <li
            key={booking.id}
            style={{
              marginBottom: "6px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor:
                booking.status?.toUpperCase() === "COMPLETED"
                  ? "#b7eb8f"
                  : booking.status?.toUpperCase() === "CONFIRMED"
                  ? "#91caff"
                  : booking.status?.toUpperCase() === "PENDING"
                  ? "#ffe58f"
                  : booking.status?.toUpperCase() === "CANCELLED"
                  ? "#ffccc7"
                  : "#d9d9d9",
              backgroundColor:
                booking.status?.toUpperCase() === "COMPLETED"
                  ? "#f6ffed"
                  : booking.status?.toUpperCase() === "CONFIRMED"
                  ? "#e6f7ff"
                  : booking.status?.toUpperCase() === "PENDING"
                  ? "#fffbe6"
                  : booking.status?.toUpperCase() === "CANCELLED"
                  ? "#fff2f0"
                  : "#fafafa",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedDate(current.format("YYYY-MM-DD"));
              setSelectedDayBookings(bookingsForDay);
              setIsModalOpen(true);
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "2px",
              }}
            >
              {booking.startTime.substring(0, 5)} -{" "}
              {booking.endTime.substring(0, 5)}
            </div>
            <div
              style={{
                fontSize: "11px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text ellipsis style={{ maxWidth: "70%" }}>
                {booking.coachName}
              </Text>
              <Badge
                status={getStatusType(booking.status)}
                text={
                  <span style={{ fontSize: "10px" }}>{booking.status}</span>
                }
              />
            </div>
          </li>
        ))}

        {bookingsForDay.length > 2 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              backgroundColor: "#f0f0f0",
              padding: "2px 4px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedDate(current.format("YYYY-MM-DD"));
              setSelectedDayBookings(bookingsForDay);
              setIsModalOpen(true);
            }}
          >
            <Text type="secondary">
              +{bookingsForDay.length - 2} more sessions
            </Text>
          </div>
        )}
      </ul>
    ) : null;
  };

  const handleDateSelect = (value) => {
    const bookingsForDay = getBookingListForDate(value);

    if (bookingsForDay.length > 0) {
      setSelectedDate(value.format("YYYY-MM-DD"));
      setSelectedDayBookings(bookingsForDay);
      setIsModalOpen(true);
    }
  };

  const handleViewDetails = (bookingId) => {
    setIsModalOpen(false);
    navigate(`/user/bookings/${bookingId}?tab=${activeTab}`);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Title level={4}>Your Booking Calendar</Title>

        <Space>
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            onChange={handleFilterChange}
            value={statusFilter}
            allowClear
          >
            <Option value="PENDING">Pending</Option>
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="NO_SHOW">No-show</Option>
          </Select>

          <Button
            onClick={() => setStatusFilter(null)}
            disabled={!statusFilter}
          >
            Clear Filter
          </Button>
        </Space>
      </Space>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {filteredBookings.length === 0 && (
            <Alert
              message="No bookings found"
              description="You don't have any bookings in the selected date range or matching your filter."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Calendar
            cellRender={cellRender}
            onSelect={handleDateSelect}
            className="user-coach-calendar"
          />
          {filteredBookings.length > 0 && totalCount > 100 && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Alert
                message={`Showing ${filteredBookings.length} of ${totalCount} bookings. Use filters to narrow down results.`}
                type="info"
                showIcon
              />
            </div>
          )}
        </>
      )}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined
              style={{ fontSize: "18px", marginRight: "8px", color: "#1890ff" }}
            />
            <span>
              Bookings on{" "}
              {selectedDate ? dayjs(selectedDate).format("MMMM D, YYYY") : ""}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={selectedDayBookings}
          renderItem={(booking) => (
            <List.Item
              key={booking.id}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleViewDetails(booking.id)}
                >
                  View Details
                </Button>,
              ]}
              style={{
                backgroundColor:
                  booking.status?.toUpperCase() === "COMPLETED"
                    ? "#f6ffed"
                    : booking.status?.toUpperCase() === "CONFIRMED"
                    ? "#e6f7ff"
                    : booking.status?.toUpperCase() === "PENDING"
                    ? "#fffbe6"
                    : booking.status?.toUpperCase() === "CANCELLED"
                    ? "#fff2f0"
                    : "#fafafa",
                borderRadius: "8px",
                marginBottom: "8px",
                padding: "12px",
              }}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#1890ff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {booking.coachName?.charAt(0) || <UserOutlined />}
                  </div>
                }
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Space>
                      <Text strong style={{ fontSize: "16px" }}>
                        {booking.coachName}
                      </Text>
                      <Badge
                        count={booking.status}
                        style={{
                          backgroundColor:
                            booking.status?.toUpperCase() === "COMPLETED"
                              ? "#52c41a"
                              : booking.status?.toUpperCase() === "CONFIRMED"
                              ? "#1890ff"
                              : booking.status?.toUpperCase() === "PENDING"
                              ? "#faad14"
                              : booking.status?.toUpperCase() === "CANCELLED"
                              ? "#f5222d"
                              : "#d9d9d9",
                        }}
                      />
                    </Space>
                    <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                      $
                      {parseFloat(booking.totalPrice).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </Text>
                  </div>
                }
                description={
                  <Space
                    direction="vertical"
                    style={{ width: "100%", marginTop: "8px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ClockCircleOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      <Text>
                        {booking.startTime.substring(0, 5)} -{" "}
                        {booking.endTime.substring(0, 5)}
                      </Text>
                      <div
                        style={{
                          marginLeft: "12px",
                          padding: "1px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#f0f0f0",
                          fontSize: "12px",
                        }}
                      >
                        {calculateDuration(booking.startTime, booking.endTime)}
                      </div>
                    </div>
                    {booking.packageName && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <CalendarOutlined
                          style={{ marginRight: "8px", color: "#722ed1" }}
                        />
                        <Text>
                          Package: <Text strong>{booking.packageName}</Text>
                        </Text>
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "6px 10px",
                        backgroundColor: "rgba(0,0,0,0.02)",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <Text type="secondary">Booking ID: {booking.id}</Text>
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
      <style jsx="true">{`
        .user-coach-calendar .events {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .user-coach-calendar .ant-badge-status {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .user-coach-calendar .ant-badge-status-text {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default UserCoachCalendarView;
