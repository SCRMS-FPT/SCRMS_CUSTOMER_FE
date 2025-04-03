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
        return <Tag color="orange">Đang chờ</Tag>;
      case "CONFIRMED":
        return <Tag color="blue">Đã xác nhận</Tag>;
      case "COMPLETED":
        return <Tag color="green">Hoàn thành</Tag>;
      case "CANCELLED":
        return <Tag color="red">Đã hủy</Tag>;
      case "NO_SHOW":
        return <Tag color="gray">Không đến</Tag>;
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
      title: "Đánh giá đã được gửi đi!",
      content:
        "Cảm ơn bạn vì phản hồi! Huấn luyện viên của bạn sẽ trân trọng ý kiến của bạn.",
    });
  };

  const columns = [
    {
      title: "Huấn luyện viên & Buổi tập",
      dataIndex: "coachName",
      key: "coachInfo",
      render: (_, record) => (
        <Space direction="vertical">
          <Space>
            <UserOutlined />
            <Text strong>{record.coachName}</Text>
          </Space>
          <Text type="secondary">{record.packageName || "Buổi tập đơn"}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày & Giờ",
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
      title: "Giá tiền",
      dataIndex: "totalPrice",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Đang chờ", value: "PENDING" },
        { text: "Đã xác nhận", value: "CONFIRMED" },
        { text: "Hoàn thành", value: "COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
        { text: "Không đến", value: "NO_SHOW" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
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
              Xem chi tiết
            </Button>

            {isCompleted && (
              <Button
                onClick={() => {
                  setSelectedBooking(record);
                  setFeedbackModalVisible(true);
                }}
              >
                Để lại đánh giá
              </Button>
            )}

            {!isPast && record.status === "CONFIRMED" && (
              <Button danger>Hủy</Button>
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
        <Title level={4}>Lịch sử đặt lịch huấn luyện của bạn</Title>

        {/* Filters */}
        <Space wrap style={{ marginBottom: 16 }}>
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
            onChange={handleFilterChange}
            value={statusFilter}
            allowClear
          >
            <Option value="PENDING">Đang chờ</Option>
            <Option value="CONFIRMED">Đã xác nhận</Option>
            <Option value="COMPLETED">Hoàn thành</Option>
            <Option value="CANCELLED">Đã hủy</Option>
            <Option value="NO_SHOW">Không đến</Option>
          </Select>

          <Button onClick={handleResetFilters} icon={<FilterOutlined />}>
            Làm mới bộ lọc
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
          Bạn sẽ đánh giá buổi tập của mình với huấn luyện viên {selectedBooking?.coachName} như thế nào?
          </p>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            style={{ fontSize: 36 }}
          />
        </div>

        <div>
          <p>Chia sẻ trải nghiệm của bạn (tùy chọn):</p>
          <TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Hãy chia sẻ với chúng tôi về trải nghiệm của bạn với huấn luyện viên..."
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserCoachBookingsView;
