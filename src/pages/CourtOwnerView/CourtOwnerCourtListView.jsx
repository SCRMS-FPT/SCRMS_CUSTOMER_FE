import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Tooltip,
  Input,
  Select,
  Space,
  message,
  Spin,
  Empty,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Client } from "@/API/CourtApi";

const { Option } = Select;
const MAX_AMENITIES_DISPLAY = 3;

const CourtOwnerCourtListView = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState(undefined);
  const [selectedCourtType, setSelectedCourtType] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState([]);
  const [totalCourts, setTotalCourts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sports, setSports] = useState([]);
  const [error, setError] = useState(null);

  const client = new Client();

  // Fetch courts data from API
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const response = await client.getCourtsByOwner(
          currentPage,
          pageSize,
          selectedSport,
          selectedCourtType
        );

        if (response && response.courts) {
          setCourts(response.courts.data || []);
          setTotalCourts(response.courts.count || 0);
        } else {
          setCourts([]);
          setTotalCourts(0);
        }
      } catch (err) {
        console.error("Error fetching courts:", err);
        setError("Failed to load courts data. Please try again.");
        message.error("Không thể tải dữ liệu sân. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [currentPage, pageSize, selectedSport, selectedCourtType]);

  // Fetch sports for filtering
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await client.getSports();
        if (response && response.sports) {
          setSports(response.sports);
        }
      } catch (err) {
        console.error("Error fetching sports:", err);
      }
    };

    fetchSports();
  }, []);

  // Handle search filtering
  const filteredCourts = courts.filter((court) => {
    if (!searchText) return true;
    return court.courtName.toLowerCase().includes(searchText.toLowerCase());
  });

  // Map court type to user-friendly string
  const getCourtTypeString = (typeValue) => {
    switch (typeValue) {
      case 1:
        return "Trong nhà";
      case 2:
        return "Ngoài trời";
      case 3:
        return "Hỗn hợp";
      default:
        return "Không có thông tin";
    }
  };

  // Map court status to user-friendly string and color
  const getStatusTag = (statusValue) => {
    switch (statusValue) {
      case 1:
        return <Tag color="red">Không hoạt động</Tag>;
      case 0:
        return <Tag color="green">Hoạt động</Tag>;
      case 2:
        return <Tag color="orange">Đang bảo trì</Tag>;
      default:
        return <Tag color="default">Không có thông tin</Tag>;
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedSport(undefined);
    setSelectedCourtType(undefined);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Tên sân",
      dataIndex: "courtName",
      key: "name",
      sorter: (a, b) => a.courtName.localeCompare(b.courtName),
      render: (text) => (
        <span className="font-semibold text-indigo-600">{text}</span>
      ),
    },
    {
      title: "Môn thể thao",
      dataIndex: "sportName",
      key: "sport",
      sorter: (a, b) => a.sportName.localeCompare(b.sportName),
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    {
      title: "Trung tâm thể thao",
      dataIndex: "sportCenterName",
      key: "venue",
      sorter: (a, b) => a.sportCenterName.localeCompare(b.sportCenterName),
      render: (venueName) => (
        <span>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {venueName}
        </span>
      ),
    },
    {
      title: "Cơ sở vật chất",
      dataIndex: "facilities",
      key: "amenities",
      render: (facilities) => {
        if (!facilities || facilities.length === 0) {
          return <span>-</span>;
        }

        const limitedFacilities = facilities.slice(0, MAX_AMENITIES_DISPLAY);
        const remainingFacilities =
          facilities.length > MAX_AMENITIES_DISPLAY
            ? facilities.slice(MAX_AMENITIES_DISPLAY)
            : [];

        return (
          <>
            {limitedFacilities.map((facility) => (
              <Tag color="green" key={facility.name}>
                {facility.name}
              </Tag>
            ))}
            {remainingFacilities.length > 0 && (
              <Tooltip
                title={
                  <div>
                    {remainingFacilities.map((facility) => (
                      <div key={facility.name}>{facility.name}</div>
                    ))}
                  </div>
                }
              >
                <Tag color="default" className="cursor-pointer">
                  +{remainingFacilities.length} thêm
                </Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Loại sân",
      dataIndex: "courtType",
      key: "courtType",
      render: (type) => <Tag color="purple">{getCourtTypeString(type)}</Tag>,
      filters: [
        { text: "Trong nhà", value: 1 },
        { text: "Ngoài trời", value: 2 },
        { text: "Hỗn hợp", value: 3 },
      ],
      onFilter: (value, record) => record.courtType === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Hoạt động", value: 0 },
        { text: "Không hoạt động", value: 1 },
        { text: "Đang bảo trì", value: 2 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/court-owner/courts/${record.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            onClick={() => navigate(`/court-owner/courts/update/${record.id}`)}
          >
            Cập nhật thông tin
          </Button>
        </Space>
      ),
    },
  ];

  // Error display
  if (error) {
    return (
      <Card title="Danh sach sân của tôi" className="mt-5">
        <div className="text-center py-5">
          <InfoCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
          <h3 className="mt-3 text-red-600">{error}</h3>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            Tải lại
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>Danh sách sân của tôi</span>
          <Badge count={totalCourts} style={{ backgroundColor: "#52c41a" }} />
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/court-owner/courts/create")}
        >
          Thêm mới
        </Button>
      }
    >
      {/* Search & Filter Controls */}
      <Space className="mb-4" wrap>
        <Input
          placeholder="Tìm kiếm theo tên sân"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Select
          value={selectedSport}
          onChange={(value) => {
            setSelectedSport(value);
            setCurrentPage(1);
          }}
          style={{ width: 200 }}
          placeholder="Lọc theo môn thể thao"
          allowClear
        >
          {sports.map((sport) => (
            <Option key={sport.id} value={sport.id}>
              {sport.name}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedCourtType}
          onChange={(value) => {
            setSelectedCourtType(value);
            setCurrentPage(1);
          }}
          style={{ width: 180 }}
          placeholder="Lọc theo loại sân"
          allowClear
        >
          <Option value={1}>Trong nhà</Option>
          <Option value={2}>Ngoài trời</Option>
          <Option value={3}>Hỗn hợp</Option>
        </Select>
        {(searchText || selectedSport || selectedCourtType) && (
          <Button icon={<FilterOutlined />} onClick={resetFilters}>
            Xóa bộ lọc
          </Button>
        )}
      </Space>

      {/* Courts Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải sân...</p>
        </div>
      ) : courts.length === 0 ? (
        <Empty
          description={
            <span>
              Không có sân nào khả dụng trong danh sách của bạn. Vui lòng tạo
              sân bằng việc bấm vào nút "Thêm mới".
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Table
          dataSource={filteredCourts}
          rowKey="id"
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCourts,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sân`,
          }}
        />
      )}
    </Card>
  );
};

export default CourtOwnerCourtListView;
