import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Divider,
  Modal,
  Radio,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { Client } from "../../API/CourtApi";
import "./CourtOwnerVenueDetailView.css";

const { Title, Text } = Typography;
const client = new Client();

const CourtOwnerVenueDetailView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteType, setDeleteType] = useState("soft");
  const [activeImage, setActiveImage] = useState(0);
  const [restoreLoading, setRestoreLoading] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const venueResponse = await client.getSportCenterById(venueId);
        setVenue(venueResponse);

        // Fetch courts for this venue
        const courtsResponse = await client.getAllCourtsOfSportCenter(venueId);
        setCourts(courtsResponse.courts || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching venue details:", err);
        setError(err.message || "Failed to load venue details");
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const handleDeleteVenue = async () => {
    try {
      setDeleteLoading(true);

      if (deleteType === "soft") {
        await client.softDeleteSportCenter(venueId);
      } else {
        await client.deleteSportCenter(venueId);
      }

      setDeleteLoading(false);
      setDeleteModalVisible(false);

      navigate("/court-owner/venues");
    } catch (err) {
      console.error("Error deleting venue:", err);
      setDeleteLoading(false);
    }
  };

  const handleRestoreVenue = async () => {
    try {
      setRestoreLoading(true);
      await client.restoreSportCenter(venueId);
      message.success("Trung tâm thể thao đã được khôi phục thành công");

      // Refresh venue data
      const venueResponse = await client.getSportCenterById(venueId);
      setVenue(venueResponse);
      setRestoreLoading(false);
    } catch (err) {
      console.error("Error restoring venue:", err);
      message.error("Khôi phục trung tâm thể thao thất bại");
      setRestoreLoading(false);
    }
  };

  const showDeleteConfirm = (type) => {
    setDeleteType(type);
    setDeleteModalVisible(true);
  };

  const formatAddress = (venue) => {
    if (!venue) return "Địa chỉ không khả dụng";

    const parts = [];
    if (venue.addressLine) parts.push(venue.addressLine);
    if (venue.commune) parts.push(venue.commune);
    if (venue.district) parts.push(venue.district);
    if (venue.city) parts.push(venue.city);

    return parts.length > 0 ? parts.join(", ") : "Địa chỉ không khả dụng";
  };

  const nextImage = () => {
    if (!venue?.imageUrls?.length) return;
    setActiveImage((prev) => (prev + 1) % (venue.imageUrls.length + 1));
  };

  const prevImage = () => {
    if (!venue?.imageUrls?.length) return;
    setActiveImage((prev) => (prev === 0 ? venue.imageUrls.length : prev - 1));
  };

  const selectImage = (index) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <Alert
        message="Lỗi"
        description={error || "Không thể tải thông tin địa điểm"}
        type="error"
        showIcon
      />
    );
  }

  // Convert API data structure to component format if needed
  const venueForComponents = {
    ...venue,
    operating_hours: venue.operatingHours || [],
    pricing_model: venue.pricingModel || {},
    booking_policy: venue.bookingPolicy || {},
  };

  // Extract unique sports from courts
  const sportsList = Array.from(
    new Set(courts.map((court) => court.sportName))
  ).filter(Boolean);

  // Extract unique amenities/facilities from courts
  const facilitiesList = Array.from(
    new Set(
      courts.flatMap(
        (court) => court.facilities?.map((facility) => facility.name) || []
      )
    )
  ).filter(Boolean);

  return (
    <div className="venue-detail-container p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/court-owner/venues")}
          className="mr-3 hover:text-blue-600 transition-colors"
        >
          Quay lại
        </Button>
        <Title level={2} className="mb-0 flex-1">
          {venue.name}
          {venue.isDeleted && (
            <Tag color="red" className="ml-2 text-sm">
              Đã xóa
            </Tag>
          )}
        </Title>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/court-owner/venues/update/${venueId}`)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
            disabled={venue.isDeleted}
          >
            Cập nhật
          </Button>

          {venue.isDeleted ? (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRestoreVenue}
              loading={restoreLoading}
              className="bg-green-600 hover:bg-green-700 transition-colors"
            >
              Khôi phục
            </Button>
          ) : (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm("soft")}
            >
              Xóa
            </Button>
          )}
        </div>
      </div>

      {venue.isDeleted && (
        <Alert
          message="Trung tâm thể thao này đã bị xóa"
          description="Trung tâm thể thao này hiện không hiển thị với người dùng. Bạn có thể khôi phục để tiếp tục hoạt động."
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Image Gallery */}
        <Col xs={24} xl={14}>
          <Card className="venue-gallery-card shadow-md rounded-xl overflow-hidden">
            <div className="image-gallery">
              <div
                className="main-image-container relative rounded-lg overflow-hidden"
                style={{ height: "400px" }}
              >
                <img
                  src={
                    activeImage === 0
                      ? venue.avatar
                      : venue.imageUrls[activeImage - 1]
                  }
                  className="main-image object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  alt={`${venue.name} - ${
                    activeImage === 0 ? "Avatar" : `Gallery ${activeImage}`
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button
                    shape="circle"
                    icon={<Icon icon="mdi:chevron-left" width="24" />}
                    onClick={prevImage}
                    className="gallery-nav-button hover:scale-110 transition-all"
                  />
                  <Button
                    shape="circle"
                    icon={<Icon icon="mdi:chevron-right" width="24" />}
                    onClick={nextImage}
                    className="gallery-nav-button hover:scale-110 transition-all"
                  />
                </div>
              </div>

              <div className="thumbnail-container mt-4 flex gap-2 overflow-x-auto pb-2">
                <div
                  className={`thumbnail-item cursor-pointer rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === 0
                      ? "border-blue-600 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ width: "80px", height: "60px" }}
                  onClick={() => selectImage(0)}
                >
                  <img
                    src={venue.avatar}
                    alt={`${venue.name} - Avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {venue.imageUrls?.map((url, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item cursor-pointer rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === index + 1
                        ? "border-blue-600 scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    style={{ width: "80px", height: "60px" }}
                    onClick={() => selectImage(index + 1)}
                  >
                    <img
                      src={url}
                      alt={`${venue.name} - Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Venue Details */}
        <Col xs={24} xl={10}>
          <Card className="venue-info-card shadow-md rounded-xl h-full">
            <div className="flex flex-col h-full">
              <div className="venue-detail-item mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <EnvironmentOutlined className="mr-2" />
                  <Text strong>Địa chỉ</Text>
                </div>
                <Text className="text-lg">{formatAddress(venue)}</Text>
              </div>

              <div className="venue-detail-item mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <PhoneOutlined className="mr-2" />
                  <Text strong>Số điện thoại</Text>
                </div>
                <Text className="text-lg">
                  {venue.phoneNumber || "Không có thông tin"}
                </Text>
              </div>

              <div className="venue-detail-item mb-4 flex-1">
                <div className="flex items-center text-gray-500 mb-1">
                  <Icon icon="clarity:note-line" className="mr-2" />
                  <Text strong>Mô tả</Text>
                </div>
                <Text className="text-lg venue-description">
                  {venue.description || "Không có mô tả"}
                </Text>
              </div>

              {sportsList.length > 0 && (
                <div className="venue-detail-item mb-4">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Icon
                      icon="fluent:sport-basketball-20-regular"
                      className="mr-2"
                      width="16"
                    />
                    <Text strong>Các môn thể thao</Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sportsList.map((sport, index) => (
                      <Tag
                        color="blue"
                        key={index}
                        className="text-sm py-1 px-3 rounded-full"
                      >
                        {sport}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {facilitiesList.length > 0 && (
                <div className="venue-detail-item">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Icon icon="mdi:facility" className="mr-2" width="16" />
                    <Text strong>Tiện ích</Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {facilitiesList.map((facility, index) => (
                      <Tag
                        color="green"
                        key={index}
                        className="text-sm py-1 px-3 rounded-full"
                      >
                        {facility}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Courts Section */}
      <div className="courts-section mt-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>Sân đã đăng ký ({courts.length})</Title>
          <Button
            type="primary"
            onClick={() => navigate(`/court-owner/courts/create/${venueId}`)}
            className="bg-green-600 hover:bg-green-700"
            icon={
              <Icon icon="material-symbols:add" width="20" className="mr-1" />
            }
            disabled={venue.isDeleted}
          >
            Thêm sân mới
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {courts.length > 0 ? (
            courts.map((court) => (
              <Col xs={24} md={12} xl={8} key={court.id}>
                <Card
                  className="court-card h-full shadow-sm hover:shadow-md transition-shadow rounded-xl cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/court-owner/courts/${court.id}`)}
                  bodyStyle={{ padding: "16px" }}
                  hoverable
                >
                  {/* Status and Sport tags in top row */}
                  <div className="flex justify-between items-center mb-2">
                    <Tag
                      color={
                        court.status === 0
                          ? "green"
                          : court.status === 1
                          ? "orange"
                          : "red"
                      }
                      className="rounded-full px-2 py-0.5"
                    >
                      {court.status === 0
                        ? "Đang hoạt động"
                        : court.status === 1
                        ? "Tạm đóng"
                        : "Đang bảo trì"}
                    </Tag>
                    <Tag color="blue" className="rounded-full px-2 py-0.5">
                      {court.sportName}
                    </Tag>
                  </div>

                  {/* Court name row */}
                  <div className="mb-2">
                    <Title level={4} className="mb-0 court-name">
                      {court.courtName}
                    </Title>
                  </div>

                  <Text
                    className="text-gray-500 block mb-3"
                    ellipsis={{ tooltip: court.description }}
                  >
                    {court.description || "Không có mô tả"}
                  </Text>

                  <div className="court-details flex flex-wrap gap-x-4 gap-y-2">
                    <div className="court-detail-item flex items-center">
                      <Icon
                        icon="ic:round-access-time"
                        className="mr-1 text-gray-500"
                        width="16"
                      />
                      <Text className="text-sm">
                        {court.slotDuration} phút/lượt
                      </Text>
                    </div>

                    <div className="court-detail-item flex items-center">
                      <Icon
                        icon="mdi:currency-usd"
                        className="mr-1 text-gray-500"
                        width="16"
                      />
                      <Text className="text-sm">
                        {court.minDepositPercentage}% đặt cọc tối thiểu
                      </Text>
                    </div>

                    <div className="court-detail-item flex items-center">
                      <Icon
                        icon="mdi:court"
                        className="mr-1 text-gray-500"
                        width="16"
                      />
                      <Text className="text-sm">
                        Loại:{" "}
                        {["", "Trong nhà", "Ngoài trời", "Hỗn hợp"][
                          court.courtType
                        ] || "Không xác định"}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg">
                <Icon
                  icon="clarity:court-line"
                  width="64"
                  className="text-gray-400 mb-4"
                />
                <Text className="text-lg text-gray-500 mb-4">
                  Chưa có sân nào được đăng ký
                </Text>
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(`/court-owner/courts/create/${venueId}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm sân mới ngay
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa địa điểm"
        open={deleteModalVisible}
        onOk={handleDeleteVenue}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <div className="py-4">
          <p className="mb-4">Bạn có chắc chắn muốn xóa địa điểm này?</p>
          <Radio.Group
            value={deleteType}
            onChange={(e) => setDeleteType(e.target.value)}
            className="mb-2"
          >
            <Space direction="vertical">
              <Radio value="soft">
                <div>
                  <div>
                    <strong>Xóa tạm thời</strong> (Recommended)
                  </div>
                  <div className="text-gray-500 text-sm">
                    Ẩn địa điểm khỏi danh sách nhưng có thể khôi phục sau.
                  </div>
                </div>
              </Radio>
              <Radio value="permanent">
                <div>
                  <div>
                    <strong className="text-red-600">Xóa vĩnh viễn</strong>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Xóa hoàn toàn địa điểm và mọi dữ liệu liên quan. Hành động
                    này không thể hoàn tác.
                  </div>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default CourtOwnerVenueDetailView;
