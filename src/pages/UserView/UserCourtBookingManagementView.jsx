import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Space,
  Input,
  message,
  DatePicker,
  Form,
  Col,
  Row,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Client } from "../../API/CourtApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColors = {
  Pending: "orange",
  Confirmed: "green",
  Completed: "blue",
  Cancelled: "red",
  NoShow: "black",
  Expired: "volcano",
};

// Map API booking status codes to user-friendly names
const statusMap = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Cancelled",
  4: "NoShow",
  5: "Expired",
};

const UserCourtBookingManagementView = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userProfile);
  const courtClient = new Client();

  // State for bookings and pagination
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  // State for filters
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [courtId, setCourtId] = useState(undefined);
  const [sportsCenterId, setSportsCenterId] = useState(undefined);

  // Function to fetch bookings with filters
  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Format dates if set
      const startDate = dateRange?.[0]?.toDate();
      const endDate = dateRange?.[1]?.toDate();

      // Call the API with filters
      const response = await courtClient.getBookings(
        undefined,
        courtId,
        sportsCenterId,
        statusFilter !== undefined ? parseInt(statusFilter) : undefined,
        startDate,
        endDate,
        currentPage,
        pageSize
      );

      if (response && response.bookings) {
        // Transform API data to the format needed for the table
        const formattedBookings = response.bookings.map((booking) => ({
          key: booking.id,
          id: booking.id,
          date: dayjs(booking.bookingDate).format("YYYY-MM-DD"),
          totalPrice: booking.totalPrice,
          status: statusMap[booking.status] || booking.status,
          createdAt: dayjs(booking.createdAt).format("YYYY-MM-DD HH:mm"),
          lastModified: booking.lastModified
            ? dayjs(booking.lastModified).format("YYYY-MM-DD HH:mm")
            : "-",
          // Extract information from the first booking detail if available
          court: booking.bookingDetails?.[0]?.courtName || "-",
          time: booking.bookingDetails?.[0]?.startTime || "-",
          sportsCenter: booking.bookingDetails?.[0]?.sportsCenterName || "-",
          // Store all booking details for reference
          details: booking.bookingDetails || [],
        }));

        setBookings(formattedBookings);
        setTotalCount(response.totalCount);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings when component mounts or filters change
  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize, statusFilter]); // Only auto-fetch on these changes

  // Handler for manual search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchBookings();
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setDateRange(null);
    setCourtId(undefined);
    setSportsCenterId(undefined);
    setCurrentPage(1);
  };

  // Handler for cancelling a booking
  const handleCancelBooking = (bookingId) => {
    Modal.confirm({
      title: "Cancel Booking",
      content:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      okText: "Yes, Cancel Booking",
      okButtonProps: { danger: true },
      cancelText: "No",
      onOk: async () => {
        try {
          // Call the cancel booking API
          await courtClient.cancelBooking(bookingId, {
            cancellationReason: "User cancelled booking",
            requestedAt: new Date(),
          });

          message.success("Booking has been cancelled successfully");
          fetchBookings(); // Refresh the list
        } catch (error) {
          console.error("Error cancelling booking:", error);
          message.error("Failed to cancel booking. Please try again later.");
        }
      },
    });
  };

  // Table columns definition
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
      width: 110,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 100,
    },
    {
      title: "Court",
      dataIndex: "court",
      key: "court",
      ellipsis: true,
    },
    {
      title: "Sports Center",
      dataIndex: "sportsCenter",
      key: "sportsCenter",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price?.toLocaleString()} VND`,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/user/bookings/${record.id}`)}
          >
            View Details
          </Button>
          {(record.status === "Pending" || record.status === "Confirmed") && (
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => handleCancelBooking(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <Card
      title="My Court Bookings"
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => fetchBookings()}
        >
          Refresh
        </Button>
      }
    >
      <div className="mb-4">
        <p>View and manage all your court bookings.</p>
      </div>

      {/* Search & Filter Section */}
      <Form layout="vertical" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Search by Court Name">
              <Input
                placeholder="Enter court name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Date Range">
              <RangePicker
                style={{ width: "100%" }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Status">
              <Select
                placeholder="Select status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
                style={{ width: "100%" }}
              >
                {Object.entries(statusMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={handleClearFilters}>Clear Filters</Button>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
              >
                Apply Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* Booking Table */}
      <Spin spinning={loading}>
        <Table
          dataSource={bookings}
          columns={columns}
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: totalCount,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
          }}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Spin>
    </Card>
  );
};

export default UserCourtBookingManagementView;
