import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Tag, List, Typography, Image, Divider, Button, Rate, Row, Col, Avatar, Space, Table } from "antd";
import { LeftOutlined, EditOutlined, EnvironmentOutlined, StarOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, ClockCircleOutlined, SnippetsOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const mockCourtData = {
    court_id: "court_003",
    name: "Court 3",
    sport_type: "Soccer",
    venue: {
        venue_id: "V003",
        name: "City Soccer Park",
        address: {
            street: "789 Greenway Dr",
            city: "Chicago",
            state: "IL",
            zip_code: "60601",
            country: "USA",
            latitude: 41.8781,
            longitude: -87.6298,
        },
        contact: {
            phone: "+1-555-7890",
            email: "contact@citysoccer.com",
            website: "https://citysoccer.com",
        },
    },
    features: {
        indoor: false,
        lighting: true,
        surface_type: "Grass",
        seating_capacity: 100,
        has_parking: true,
        has_showers: false,
    },
    amenities: ["Parking", "Locker Rooms", "Refreshments", "Pro Shop"],
    images: [
        "https://example.com/images/court1.jpg",
        "https://example.com/images/court2.jpg",
        "https://example.com/images/court3.jpg",
    ],
    rules: ["No metal cleats", "Use designated entry points"],
    rating: 4.7,
    reviews: [
        {
            user_id: "player_111",
            rating: 5,
            comment: "Excellent facilities and well-maintained courts.",
            date: "2024-03-15T14:30:00Z",
        },
        {
            user_id: "player_222",
            rating: 4,
            comment: "Great place, but parking is limited.",
            date: "2024-03-12T10:00:00Z",
        },
    ],
    pricing_model: {
        hourly_rate: {
            Soccer: 25,
        },
        membership_discount: 10, // 10% off for members
    },
    booking_policy: {
        cancellation_period: "24 hours",
        modification_allowed: true,
        advance_booking_limit: "30 days",
    },
    operating_hours: {
        monday: { open: "07:00", close: "22:00" },
        tuesday: { open: "07:00", close: "22:00" },
        wednesday: { open: "07:00", close: "22:00" },
        thursday: { open: "07:00", close: "22:00" },
        friday: { open: "07:00", close: "23:00" },
        saturday: { open: "08:00", close: "23:00" },
        sunday: { open: "08:00", close: "20:00" },
    },
};

const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.zip_code}, ${address.country}`;
};

// Format operating hours display
const formatOperatingHours = (hours) => {
    return Object.entries(hours).map(([day, time]) => (
        <List.Item key={day}>
            <Text strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text> {time.open} - {time.close}
        </List.Item>
    ));
};

const CourtOwnerCourtDetailView = () => {
    const { courtId } = useParams(); // Get court ID from URL (Dynamic)
    const navigate = useNavigate(); // Navigation hook
    const court = mockCourtData; // Replace with API data in real implementation

    return (
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: "20px" }}>{court.name}</Text>
                    <Space>
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/court-owner/courts/update/${court.court_id}`)}
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
                                <Title level={4}>{court.name}</Title>
                                <Text type="secondary">{court.venue.name}</Text>
                                <Divider />

                                <List>
                                    <List.Item>
                                        <Text strong>Sport Type:</Text> <Tag color="blue">{court.sport_type}</Tag>
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Surface Type:</Text> <Tag color="green">{court.features.surface_type}</Tag>
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Seating Capacity:</Text> {court.features.seating_capacity} people
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Indoor:</Text> {court.features.indoor ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Lighting Available:</Text> {court.features.lighting ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Rating:</Text> <Rate disabled allowHalf value={court.rating} /> ({court.rating})
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
                                <Title level={5}>Court Features</Title>
                                <List>
                                    <List.Item>
                                        <Text strong>Parking Available:</Text> {court.features.has_parking ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Showers Available:</Text> {court.features.has_showers ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                                    </List.Item>
                                </List>

                                <Divider />

                                <Title level={5}>Amenities</Title>
                                {court.amenities.length > 0 ? (
                                    court.amenities.map((amenity) => (
                                        <Tag color="purple" key={amenity}>
                                            {amenity}
                                        </Tag>
                                    ))
                                ) : (
                                    <Text>No amenities available.</Text>
                                )}
                            </>
                        ),
                    },
                    {
                        key: "3",
                        label: "Pricing",
                        children: (
                            <>
                                <Title level={5}><DollarOutlined /> Pricing Model</Title>
                                <List>
                                    <List.Item>
                                        <Text strong>Hourly Rate:</Text> ${court.pricing_model.hourly_rate.Soccer} per hour
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Membership Discount:</Text> {court.pricing_model.membership_discount}%
                                    </List.Item>
                                </List>
                            </>
                        ),
                    },
                    {
                        key: "4",
                        label: "Rules & Booking Policy",
                        children: (
                            <Row gutter={24}>
                                {/* Court Rules Column */}
                                <Col xs={24} md={12}>
                                    <Title level={5}>
                                        <SnippetsOutlined /> Court Rules
                                    </Title>
                                    <List
                                        dataSource={court.rules}
                                        renderItem={(rule) => (
                                            <List.Item>
                                                <Text>• {rule}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </Col>

                                {/* Booking Policy Column */}
                                <Col xs={24} md={12}>
                                    <Title level={5}>
                                        <ClockCircleOutlined /> Booking Rules
                                    </Title>
                                    <List>
                                        <List.Item>
                                            <Text strong>Cancellation Period:</Text> {court.booking_policy.cancellation_period}
                                        </List.Item>
                                        <List.Item>
                                            <Text strong>Modification Allowed:</Text> {court.booking_policy.modification_allowed ? "Yes" : "No"}
                                        </List.Item>
                                        <List.Item>
                                            <Text strong>Advance Booking Limit:</Text> {court.booking_policy.advance_booking_limit}
                                        </List.Item>
                                    </List>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: "5",
                        label: "Operating Hours",
                        children: (
                            <>
                                <Title level={5}>
                                    <ClockCircleOutlined /> Opening Hours
                                </Title>
                                <Table
                                    dataSource={Object.entries(court.operating_hours).map(([day, hours]) => ({
                                        key: day,
                                        day,
                                        open: hours.open,
                                        close: hours.close,
                                    }))}
                                    columns={[
                                        {
                                            title: "Day",
                                            dataIndex: "day",
                                            key: "day",
                                            render: (text) => (
                                                <Text strong={text.toLowerCase() === new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase()}>
                                                    {text.charAt(0).toUpperCase() + text.slice(1)}
                                                </Text>
                                            ),
                                        },
                                        {
                                            title: "Open",
                                            dataIndex: "open",
                                            key: "open",
                                            render: (text) => <Tag color="green">{text}</Tag>,
                                        },
                                        {
                                            title: "Close",
                                            dataIndex: "close",
                                            key: "close",
                                            render: (text) => <Tag color="red">{text}</Tag>,
                                        },
                                    ]}
                                    pagination={false} // No pagination needed for a short list
                                    bordered
                                />
                            </>
                        ),
                    }
                    ,
                    {
                        key: "6",
                        label: "Reviews",
                        children: (
                            <>
                                <Title level={5}>
                                    <StarOutlined /> Customer Reviews
                                </Title>
                                <List
                                    dataSource={court.reviews}
                                    pagination={{ pageSize: 5 }} // ✅ Added pagination (5 per page)
                                    renderItem={(review) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar>{review.user_id.charAt(0).toUpperCase()}</Avatar>}
                                                title={
                                                    <Space>
                                                        <Text strong>{review.user_id}</Text>
                                                        <Rate disabled value={review.rating} />
                                                    </Space>
                                                }
                                                description={
                                                    <>
                                                        <Text>{review.comment}</Text>
                                                        <br />
                                                        <Text type="secondary">{new Date(review.date).toLocaleDateString()}</Text>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </>
                        ),
                    },
                    {
                        key: "7",
                        label: "Location",
                        children: (
                            <>
                                <Title level={5}>
                                    <EnvironmentOutlined /> Address
                                </Title>
                                <Paragraph>{formatAddress(court.venue.address)}</Paragraph>

                                {/* Google Maps Embed */}
                                <iframe
                                    width="100%"
                                    height="300"
                                    style={{ border: "none", borderRadius: "8px" }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(formatAddress(court.venue.address))}`}
                                />
                            </>
                        ),
                    },
                    {
                        key: "8",
                        label: "Images",
                        children: (
                            <>
                                <Title level={5}>Court Images</Title>
                                <Image.PreviewGroup>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {court.images.slice(0, 10).map((image, index) => (
                                            <Image key={index} width={100} height={100} src={image} style={{ borderRadius: "8px" }} />
                                        ))}
                                    </div>
                                </Image.PreviewGroup>
                            </>
                        ),
                    },
                ]}
            />
        </Card>
    );
};

export default CourtOwnerCourtDetailView;
