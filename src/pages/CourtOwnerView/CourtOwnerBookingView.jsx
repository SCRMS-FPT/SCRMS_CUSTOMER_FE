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
  Spin,
  Empty,
  Tooltip,
  Badge,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Client } from "@/API/CourtApi";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Status mapping between API values and UI display
const statusMapping = {
  Pending: { text: "Pending", color: "orange" },
  Confirmed: { text: "Confirmed", color: "green" },
  Cancelled: { text: "Cancelled", color: "red" },
  Completed: { text: "Completed", color: "blue" },
  Deposited: { text: "Deposited", color: "purple" },
  PendingPayment: { text: "Pending Payment", color: "gold" },
  PaymentFail: { text: "Payment Fail", color: "volcano" },
};

const CourtOwnerBookingView = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourtId, setSelectedCourtId] = useState(undefined);
  const [selectedCenterId, setSelectedCenterId] = useState(undefined);
  const [courts, setCourts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const client = new Client();

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
    fetchOwnedCourtsAndCenters();
  }, []);

  const fetchOwnedCourtsAndCenters = async () => {
    try {
      // Fetch owned sport centers
      const centersResponse = await client.getOwnedSportCenters(1, 100);
      if (centersResponse && centersResponse.sportCenters) {
        setCenters(centersResponse.sportCenters.data || []);
      }

      // Fetch courts
      const courtsResponse = await client.getCourtsByOwner(1, 100);
      if (courtsResponse && courtsResponse.courts) {
        setCourts(courtsResponse.courts.data || []);
      }
    } catch (err) {
      console.error("Error fetching courts and centers:", err);
    }
  };

  const fetchBookings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const {
        courtId = selectedCourtId,
        sportsCenterId = selectedCenterId,
        status = selectedStatus,
        startDate = dateRange?.[0]?.toDate(),
        endDate = dateRange?.[1]?.toDate(),
        page = pagination.current,
        limit = pagination.pageSize,
      } = filters;

      // Call API to get bookings
      const response = await client.getBookings(
        undefined, // user_id - not filtering by user
        courtId, // court_id
        sportsCenterId, // sports_center_id
        status, // status
        startDate, // start_date
        endDate, // end_date
        page, // page
        limit // limit
      );

      if (response) {
        setBookings(response.bookings || []);
        setPagination({
          ...pagination,
          total: response.totalCount || 0,
        });

        // Apply local filtering for search text
        const filtered = applySearchFilter(response.bookings || []);
        setFilteredBookings(filtered);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Apply local search filtering
  const applySearchFilter = (bookingsData) => {
    if (!searchText) return bookingsData;

    return bookingsData.filter((booking) =>
      booking.bookingDetails?.some(
        (detail) =>
          detail.courtName?.toLowerCase().includes(searchText.toLowerCase()) ||
          detail.sportsCenterName
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      )
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setFilteredBookings(applySearchFilter(bookings));
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case "status":
        setSelectedStatus(value);
        break;
      case "court":
        setSelectedCourtId(value);
        break;
      case "center":
        setSelectedCenterId(value);
        break;
      case "dateRange":
        setDateRange(value);
        break;
      default:
        break;
    }

    // Reset pagination to first page when filter changes
    setPagination({
      ...pagination,
      current: 0,
    });
  };

  // Apply all filters
  const applyFilters = () => {
    fetchBookings({
      courtId: selectedCourtId,
      sportsCenterId: selectedCenterId,
      status: selectedStatus,
      startDate: dateRange?.[0]?.toDate(),
      endDate: dateRange?.[1]?.toDate(),
      page: 0,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedStatus(undefined);
    setSelectedCourtId(undefined);
    setSelectedCenterId(undefined);
    setDateRange(null);
    setSearchText("");
    setPagination({
      ...pagination,
      current: 0,
    });

    fetchBookings({
      courtId: undefined,
      sportsCenterId: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 0,
    });
  };

  // Handle cancel booking
  const handleCancelBooking = (bookingId) => {
    Modal.confirm({
      title: "Cancel Booking",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      okText: "Yes, Cancel Booking",
      cancelText: "No",
      onOk: async () => {
        try {
          await client.cancelBooking(bookingId, {
            cancellationReason: "Cancelled by court owner",
            requestedAt: new Date(),
          });

          message.success("Booking has been cancelled successfully");
          fetchBookings(); // Refresh booking list
        } catch (err) {
          console.error("Error cancelling booking:", err);
          message.error(
            "Failed to cancel booking: " + (err.message || "Unknown error")
          );
        }
      },
    });
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchBookings({
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  // Format booking datetime for display
  const formatDateTime = (date, time) => {
    if (!date) return "N/A";

    const bookingDate = dayjs(date).format("MMM DD, YYYY");
    return time ? `${bookingDate} at ${time}` : bookingDate;
  };

  // Table columns definition
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Tooltip title="Click to view details">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate(`/court-owner/bookings/${id}`)}
          >
            #{id.substring(0, 8)}...
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Courts",
      key: "courts",
      render: (_, record) => (
        <div>
          {record.bookingDetails?.map((detail, index) => (
            <div key={index} className="mb-1">
              <Badge status="processing" color="blue" />
              <span>{detail.courtName}</span>
              <span className="text-gray-500 ml-2">
                ({dayjs(`2000-01-01T${detail.startTime}`).format("HH:mm")} -
                {dayjs(`2000-01-01T${detail.endTime}`).format("HH:mm")})
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Center",
      key: "center",
      render: (_, record) => {
        // Get the first sports center name (assuming all details have the same center)
        const centerName = record.bookingDetails?.[0]?.sportsCenterName;
        return centerName || "N/A";
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => `${price?.toLocaleString()} VND`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const mappedStatus = statusMapping[status] || {
          text: "Unknown",
          color: "default",
        };
        return <Tag color={mappedStatus.color}>{mappedStatus.text}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/court-owner/bookings/${record.id}`)}
          >
            View Details
          </Button>

          {/* Only show cancel option for bookings that can be cancelled */}
          {(record.status === 0 || record.status === 1) && (
            <Button
              type="link"
              danger
              onClick={() => handleCancelBooking(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Error display
  if (error) {
    return (
      <Card title="Manage Bookings">
        <div className="text-center py-5">
          <InfoCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
          <h3 className="mt-3 text-red-600">{error}</h3>
          <Button
            type="primary"
            onClick={() => fetchBookings()}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>Manage Bookings</span>
          <Badge
            count={pagination.total}
            style={{ backgroundColor: "#52c41a" }}
          />
        </div>
      }
    >
      {/* Search & Filter Section */}
      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space wrap>
            <Input
              placeholder="Search by Court or Center"
              value={searchText}
              onChange={handleSearchChange}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
              allowClear
            />

            <Select
              placeholder="Filter by Status"
              value={selectedStatus}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 180 }}
              allowClear
            >
              {Object.entries(statusMapping).map(([key, { text }]) => (
                <Option key={key} value={parseInt(key)}>
                  {text}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Court"
              value={selectedCourtId}
              onChange={(value) => handleFilterChange("court", value)}
              style={{ width: 180 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {courts.map((court) => (
                <Option key={court.id} value={court.id}>
                  {court.courtName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Sport Center"
              value={selectedCenterId}
              onChange={(value) => handleFilterChange("center", value)}
              style={{ width: 180 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {centers.map((center) => (
                <Option key={center.id} value={center.id}>
                  {center.name}
                </Option>
              ))}
            </Select>
          </Space>

          <Space wrap>
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              value={dateRange}
              onChange={(dates) => handleFilterChange("dateRange", dates)}
              style={{ width: 300 }}
              format="YYYY-MM-DD"
              allowClear
              presets={{
                Today: [dayjs(), dayjs()],
                "This Week": [dayjs().startOf("week"), dayjs().endOf("week")],
                "This Month": [
                  dayjs().startOf("month"),
                  dayjs().endOf("month"),
                ],
              }}
            />

            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={applyFilters}
            >
              Apply Filters
            </Button>

            {(selectedStatus !== undefined ||
              selectedCourtId !== undefined ||
              selectedCenterId !== undefined ||
              dateRange !== null) && (
              <Button onClick={resetFilters}>Reset Filters</Button>
            )}
          </Space>
        </Space>
      </div>

      {/* Booking Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Empty
          description={
            <span>
              No bookings found. Try adjusting your filters or check back later.
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
            current: pagination.current + 1, // Display 1-based index to user but use 0-based internally
          }}
          onChange={(paginationParam) => {
            // Ant Design Table gives 1-based pagination, so convert back to 0-based for API
            const apiPagination = {
              ...paginationParam,
              current: paginationParam.current - 1,
            };
            setPagination(apiPagination);
            fetchBookings({
              page: apiPagination.current,
              limit: apiPagination.pageSize,
            });
          }}
        />
      )}
    </Card>
  );
};

export default CourtOwnerBookingView;
