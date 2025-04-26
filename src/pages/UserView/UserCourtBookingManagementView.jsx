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

// Updated status colors based on the actual API response values
const statusColors = {
  Cancelled: "red",
  Completed: "green",
  Deposited: "blue",
  PendingPayment: "orange",
  PaymentFail: "volcano",
};

// Updated status map based on the actual API response values
const statusMap = {
  Cancelled: "Đã hủy",
  Completed: "Hoàn thành",
  Deposited: "Đã đặt cọc",
  PendingPayment: "Chờ thanh toán",
  PaymentFail: "Thanh toán thất bại",
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
        "User",
        undefined,
        courtId,
        sportsCenterId,
        statusFilter,
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
          date: dayjs(booking.bookingDate).format("DD/MM/YYYY"),
          totalPrice: booking.totalPrice,
          remainingBalance: booking.remainingBalance,
          initialDeposit: booking.initialDeposit,
          // Use the actual status value directly from the API
          status: booking.status,
          // For displaying Vietnamese text in the UI
          statusText: statusMap[booking.status] || booking.status,
          createdAt: dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm"),
          lastModified: booking.lastModified
            ? dayjs(booking.lastModified).format("DD/MM/YYYY HH:mm")
            : "-",
          // Extract information from the first booking detail if available
          court: booking.bookingDetails?.[0]?.courtName || "-",
          time: booking.bookingDetails?.[0]?.startTime.substring(0, 5) || "-",
          sportsCenter: booking.bookingDetails?.[0]?.sportsCenterName || "-",
          // Store all booking details for reference
          details: booking.bookingDetails || [],
          // Store total time for reference
          totalTime: booking.totalTime,
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
      title: "Hủy đặt lịch",
      content:
        "Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này không thể hoàn tác.",
      okText: "Có, xác nhận hủy.",
      okButtonProps: { danger: true },
      cancelText: "Không",
      onOk: async () => {
        try {
          // Call the cancel booking API
          await courtClient.cancelBooking(bookingId, {
            cancellationReason: "User cancelled booking",
            requestedAt: new Date(),
          });

          message.success("Đặt lịch đã được hủy thành công.");
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
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
      width: 110,
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      width: 100,
    },
    {
      title: "Sân",
      dataIndex: "court",
      key: "court",
      ellipsis: true,
    },
    {
      title: "Trung tâm thể thao",
      dataIndex: "sportsCenter",
      key: "sportsCenter",
      ellipsis: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price?.toLocaleString()} VND`,
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusText",
      key: "status",
      render: (statusText, record) => (
        <Tag color={statusColors[record.status] || "default"}>{statusText}</Tag>
      ),
      width: 120,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/user/bookings/${record.id}`)}
          >
            Xem chi tiết
          </Button>
          {/* Show cancel button for any status that is not "Cancelled" */}
          {record.status !== "Cancelled" && (
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => handleCancelBooking(record.id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <Card
      title="Quản lý đặt sân"
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => fetchBookings()}
        >
          Làm mới
        </Button>
      }
    >
      <div className="mb-4">
        <p>Xem và quản lý lịch đặt sân của bạn.</p>
      </div>

      {/* Search & Filter Section */}
      <Form layout="vertical" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Tìm kiếm theo tên sân">
              <Input
                placeholder="Nhập tên sân"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Khoảng ngày">
              <RangePicker
                style={{ width: "100%" }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                allowClear
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Trạng Thái">
              <Select
                placeholder="Lựa chọn trạng thái"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
                style={{ width: "100%" }}
              >
                {Object.entries(statusMap).map(([status, displayName]) => (
                  <Option key={status} value={status}>
                    {displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={handleClearFilters}>Xóa bộ lọc</Button>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
              >
                Áp dụng bộ lọc
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
              setCurrentPage(page - 1); // API is 0-indexed, UI is 1-indexed
              setPageSize(pageSize);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} lịch đặt`,
          }}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Spin>
    </Card>
  );
};

export default UserCourtBookingManagementView;
