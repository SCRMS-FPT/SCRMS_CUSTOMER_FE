import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Spin,
  Button,
  message,
  Row,
  Col,
  Divider,
  Tag,
  Descriptions,
  Typography,
  Image,
  Space,
} from "antd";
import {
  LeftOutlined,
  PlusOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TagOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";

import VenueOverview from "@/components/CourtOwnerVenueDetailView/VenueOverview";
import VenueDetails from "@/components/CourtOwnerVenueDetailView/VenueDetails";
import VenueOperatingHoursTable from "@/components/CourtOwnerVenueDetailView/VenueOperatingHoursTable";
import VenuePricingMembership from "@/components/CourtOwnerVenueDetailView/VenuePricingMembership";
import VenueBookingPolicy from "@/components/CourtOwnerVenueDetailView/VenueBookingPolicy";
import VenueCourtsList from "@/components/CourtOwnerVenueDetailView/VenueCourtsList";

const { Title, Text } = Typography;
const client = new Client();

const CourtOwnerVenueDetailView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch venue details
        const venueData = await client.getSportCenterById(venueId);
        console.log("📊 Venue data from API:", venueData);
        setVenue(venueData);

        // Fetch courts for this venue
        const courtsResponse = await client.getCourts(
          0,
          50,
          venueId,
          undefined,
          undefined
        );
        console.log("🎾 Courts data from API:", courtsResponse);
        setCourts(courtsResponse.courts?.data || []);
      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError("Failed to load venue data. Please try again.");
        message.error("Không thể tải thông tin trung tâm thể thao. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueData();
    }
  }, [venueId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-red-500 text-xl">{error || "Venue not found."}</p>
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/venues")}
          className="mt-4"
        >
          Quay trở lại danh sách trung tâm thể thao
        </Button>
      </div>
    );
  }

  // Convert API data structure to component format if needed
  const venueForComponents = {
    ...venue,
    // Map any fields needed by child components
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
    <Card
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => navigate("/court-owner/venues")}
              className="mr-2"
            >
              Quay trở lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Thông tin trung tâm thể thao
            </Title>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/court-owner/venues/update/${venueId}`)}
            >
              Cập nhật thông tin
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/court-owner/venues/create`)}
            >
              Tạo mới
            </Button>
          </Space>
        </div>
      }
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card bordered={false} className="venue-overview-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    src={
                      venue.avatar ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={venue.name}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                    fallback="https://via.placeholder.com/300x200?text=No+Image"
                  />
                </div>
              </Col>
              <Col xs={24} md={16}>
                <Title level={3}>{venue.name}</Title>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    {venue.address ? venue.address : "Địa chỉ không khả dụng"}
                  </Text>
                  <Text>
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {venue.phoneNumber ? venue.phoneNumber : "Số điện thoại không khả dụng"}
                  </Text>

                  <div style={{ marginTop: 12 }}>
                    <Text strong style={{ marginRight: 8 }}>
                      <TagOutlined style={{ marginRight: 4 }} />
                      Môn thể thao:
                    </Text>
                    <Space size={[0, 8]} wrap>
                      {sportsList.length > 0 ? (
                        sportsList.map((sport) => (
                          <Tag color="blue" key={sport}>
                            {sport}
                          </Tag>
                        ))
                      ) : (
                        <Text type="secondary">Không có môn thể thao nào khả dụng</Text>
                      )}
                    </Space>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Text strong style={{ marginRight: 8 }}>
                      <InfoCircleOutlined style={{ marginRight: 4 }} />
                      Amenities:
                    </Text>
                    <Space size={[0, 8]} wrap>
                      {facilitiesList.length > 0 ? (
                        facilitiesList.map((facility) => (
                          <Tag color="green" key={facility}>
                            {facility}
                          </Tag>
                        ))
                      ) : (
                        <Text type="secondary">Chưa có tiện ích nào khả dụng</Text>
                      )}
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thông tin mô tả" bordered={false}>
            <Text>{venue.description || "Chưa có thông tin mô tả."}</Text>
          </Card>
        </Col>

        {venue.imageUrl && venue.imageUrl.length > 0 && (
          <Col span={24}>
            <Card title="Ảnh" bordered={false}>
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "16px",
                  padding: "8px 0",
                }}
              >
                {venue.imageUrl.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Ảnh số ${index + 1}`}
                    style={{
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    fallback="https://via.placeholder.com/150x150?text=No+Image"
                  />
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Divider />

      {/* <VenueDetails venue={venueForComponents} /> */}

      {/* Conditionally render these components if the data exists */}
      {venueForComponents.operating_hours &&
        venueForComponents.operating_hours.length > 0 && (
          <>
            <Divider />
            <VenueOperatingHoursTable
              operatingHours={venueForComponents.operating_hours}
            />
          </>
        )}

      {venueForComponents.pricing_model &&
        Object.keys(venueForComponents.pricing_model).length > 0 && (
          <>
            <Divider />
            <VenuePricingMembership
              pricing={venueForComponents.pricing_model}
            />
          </>
        )}

      {venueForComponents.booking_policy &&
        Object.keys(venueForComponents.booking_policy).length > 0 && (
          <>
            <Divider />
            <VenueBookingPolicy policy={venueForComponents.booking_policy} />
          </>
        )}

      <Divider />

      <Row className="mb-4">
        <Col span={24}>
          <div className="flex justify-between items-center">
            <Title level={4}>Sân thể thao ({courts.length})</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/court-owner/courts/create/${venueId}`)}
            >
              Thêm sân mới
            </Button>
          </div>
        </Col>
      </Row>

      <VenueCourtsList courts={courts} />
    </Card>
  );
};

export default CourtOwnerVenueDetailView;
