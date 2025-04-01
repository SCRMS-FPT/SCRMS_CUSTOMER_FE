import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Tag,
  Button,
  Modal,
  Rate,
  Input,
  Space,
  Alert,
  Typography,
  DatePicker,
  Select,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Client } from "../../API/CoachApi";
import {
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const UserCoachBookingsView = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchParams] = useSearchParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || "1";
  const client = new Client();

  // Update useEffect to include pageIndex
  useEffect(() => {
    fetchBookings();
  }, [dateRange, statusFilter, pageIndex]);

  // Update the fetchBookings function to use proper date formatting
  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Format dates properly for API
      let formattedStartDate = undefined;
      let formattedEndDate = undefined;

      if (dateRange[0]) {
        formattedStartDate = dateRange[0].format("YYYY-MM-DD");
      }

      if (dateRange[1]) {
        formattedEndDate = dateRange[1].format("YYYY-MM-DD");
      }

      // Call API to get user bookings
      const response = await client.getUserBookings(
        formattedStartDate ? new Date(formattedStartDate) : undefined,
        formattedEndDate ? new Date(formattedEndDate) : undefined,
        statusFilter || undefined,
        pageIndex, // pageIndex
        10, // pageSize
        undefined, // sportId (optional)
        undefined, // coachId (optional)
        undefined // packageId (optional)
      );
      setBookings(response.data || []);
      setTotalCount(response.count || 0);
      setError(null);
      setError(null);

      console.log("Fetched bookings with params:", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: statusFilter,
        pageIndex: 0,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="orange">Pending</Tag>;
      case "CONFIRMED":
        return <Tag color="blue">Confirmed</Tag>;
      case "COMPLETED":
        return <Tag color="green">Completed</Tag>;
      case "CANCELLED":
        return <Tag color="red">Cancelled</Tag>;
      case "NO_SHOW":
        return <Tag color="gray">No-show</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const handleFeedbackSubmit = async () => {
    // This would normally call an API to submit feedback
    console.log("Feedback submitted:", {
      bookingId: selectedBooking.id,
      rating,
      feedback,
    });

    // Close modal and reset form
    setFeedbackModalVisible(false);
    setRating(0);
    setFeedback("");

    // Show success message
    Modal.success({
      title: "Feedback Submitted",
      content:
        "Thank you for your feedback! Your coach will appreciate your input.",
    });
  };

  const columns = [
    {
      title: "Coach & Session",
      dataIndex: "coachName",
      key: "coachInfo",
      render: (_, record) => (
        <Space direction="vertical">
          <Space>
            <UserOutlined />
            <Text strong>{record.coachName}</Text>
          </Space>
          <Text type="secondary">{record.packageName || "Single Session"}</Text>
        </Space>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "bookingDate",
      key: "dateTime",
      render: (_, record) => (
        <Space direction="vertical">
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(record.bookingDate).format("MMM D, YYYY")}</Text>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <Text>
              {record.startTime} - {record.endTime}
            </Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => {
        const dateA = dayjs(a.bookingDate).valueOf();
        const dateB = dayjs(b.bookingDate).valueOf();
        return dateA - dateB;
      },
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Pending", value: "PENDING" },
        { text: "Confirmed", value: "CONFIRMED" },
        { text: "Completed", value: "COMPLETED" },
        { text: "Cancelled", value: "CANCELLED" },
        { text: "No-show", value: "NO_SHOW" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isPast = dayjs(record.bookingDate).isBefore(dayjs(), "day");
        const isCompleted = record.status === "COMPLETED";

        return (
          <Space>
            <Button
              type="primary"
              onClick={() => navigate(`/user/coachings/${record.id}`)} // Navigate to the new route
            >
              View Details
            </Button>

            {isCompleted && (
              <Button
                onClick={() => {
                  setSelectedBooking(record);
                  setFeedbackModalVisible(true);
                }}
              >
                Leave Feedback
              </Button>
            )}

            {!isPast && record.status === "CONFIRMED" && (
              <Button danger>Cancel</Button>
            )}
          </Space>
        );
      },
    },
  ];

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleResetFilters = () => {
    setDateRange([null, null]);
    setStatusFilter(null);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Title level={4}>Your Booking History</Title>

        {/* Filters */}
        <Space wrap style={{ marginBottom: 16 }}>
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            placeholder={["Start Date", "End Date"]}
          />

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

          <Button onClick={handleResetFilters} icon={<FilterOutlined />}>
            Reset Filters
          </Button>
        </Space>
      </Space>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            total: totalCount,
            current: pageIndex + 1, // API uses 0-based indexing, UI uses 1-based
            onChange: (page, pageSize) => {
              // Update pageIndex when pagination changes
              setPageIndex(page - 1); // Convert 1-based to 0-based
            },
          }}
        />
      )}

      {/* Feedback Modal */}
      <Modal
        title="Leave Feedback for Your Session"
        open={feedbackModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={() => setFeedbackModalVisible(false)}
        okText="Submit Feedback"
      >
        <div style={{ marginBottom: 16 }}>
          <p>
            How would you rate your session with {selectedBooking?.coachName}?
          </p>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            style={{ fontSize: 36 }}
          />
        </div>

        <div>
          <p>Share your experience (optional):</p>
          <TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience with the coach..."
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserCoachBookingsView;
