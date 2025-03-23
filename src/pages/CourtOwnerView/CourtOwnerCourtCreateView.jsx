import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Checkbox, Upload, Button, TimePicker, Row, Col, Card, Typography, Divider, message, Tabs, Tag } from "antd";
import { UploadOutlined, LeftOutlined, PlusOutlined, SnippetsOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

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

const mockVenues = [
    { id: "V001", name: "Elite Sports Center" },
    { id: "V002", name: "Grand Arena" },
    { id: "V003", name: "City Soccer Park" },
];

// Mock amenities list
const amenitiesOptions = ["Parking", "Locker Rooms", "Showers", "Cafeteria", "Wi-Fi", "Pro Shop"];

// Mock initial operating hours format
const defaultOperatingHours = {
    monday: ["07:00", "22:00"],
    tuesday: ["07:00", "22:00"],
    wednesday: ["07:00", "22:00"],
    thursday: ["07:00", "22:00"],
    friday: ["07:00", "23:00"],
    saturday: ["08:00", "23:00"],
    sunday: ["08:00", "20:00"],
};

const CourtOwnerCourtCreateView = () => {
    const { venueId, courtId } = useParams(); // Get venue ID (if provided)
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageList, setImageList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (courtId) {
            setIsEditMode(true);
            // **Fetch court details here instead of mockCourtData**
            const court = mockCourtData;
            form.setFieldsValue({
                ...court,
                features: Object.keys(court.features).filter((key) => court.features[key] === true), // Convert object to array for checkboxes
                operating_hours: Object.fromEntries(
                    Object.entries(court.operating_hours).map(([day, times]) => [
                        day,
                        [dayjs(times.open, "HH:mm"), dayjs(times.close, "HH:mm")],
                    ])
                ),
            });
        } else if (venueId) {
            form.setFieldsValue({ venue_id: venueId });
        }
    }, [venueId, courtId, form]);

    const handleSubmit = (values) => {
        const selectedFeatures = values.features || [];
        const featureObject = {
            indoor: selectedFeatures.includes("indoor"),
            lighting: selectedFeatures.includes("lighting"),
            has_parking: selectedFeatures.includes("has_parking"),
            has_showers: selectedFeatures.includes("has_showers"),
            floodlights: selectedFeatures.includes("floodlights"),
            scoreboard: selectedFeatures.includes("scoreboard"),
            audience_stands: selectedFeatures.includes("audience_stands"),
            climate_control: selectedFeatures.includes("climate_control"),
            water_fountains: selectedFeatures.includes("water_fountains"),
            wheelchair_accessible: selectedFeatures.includes("wheelchair_accessible"),
        };

        const formattedData = {
            ...values,
            features: featureObject,
            operating_hours: Object.fromEntries(
                Object.entries(values.operating_hours).map(([day, times]) => [
                    day,
                    { open: times[0].format("HH:mm"), close: times[1].format("HH:mm") },
                ])
            ),
            images: imageList.map(file => file.url || URL.createObjectURL(file.originFileObj)),
        };

        console.log(isEditMode ? "Updated Court Data:" : "Created Court Data:", formattedData);
        message.success(isEditMode ? "Court updated successfully!" : "Court created successfully!");
        navigate("/court-owner/courts");
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Card title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title level={4}>Create New Court</Title>
                    <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate("/court-owner/courts")}>
                        Go Back
                    </Button>
                </div>
            }>

                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: "1",
                            label: "General Info",
                            children: (
                                <>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="name" label="Court Name" rules={[{ required: true }]}>
                                                <Input placeholder="Enter court name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="sport_type" label="Sport Type" rules={[{ required: true }]}>
                                                <Select placeholder="Select a sport">
                                                    <Option value="Soccer">Soccer</Option>
                                                    <Option value="Tennis">Tennis</Option>
                                                    <Option value="Basketball">Basketball</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item name="venue_id" label="Venue" rules={[{ required: true }]}>
                                        <Select placeholder="Select a venue" disabled={Boolean(venueId)}>
                                            {mockVenues.map((venue) => (
                                                <Option key={venue.id} value={venue.id}>
                                                    {venue.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </>
                            ),
                        },
                        {
                            key: "2",
                            label: "Features & Amenities",
                            children: (
                                <>
                                    <Title level={5}>Court Features</Title>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name={["features", "surface_type"]} label="Surface Type">
                                                <Select placeholder="Select a surface type">
                                                    <Option value="Grass">Grass</Option>
                                                    <Option value="Clay">Clay</Option>
                                                    <Option value="Hardcourt">Hardcourt</Option>
                                                    <Option value="Astroturf">Astroturf</Option>
                                                    <Option value="Concrete">Concrete</Option>
                                                    <Option value="Wood">Wood</Option>
                                                    <Option value="Synthetic">Synthetic</Option>
                                                    <Option value="N/A">Not Applicable (N/A)</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="seating_capacity"
                                                label="Seating Capacity"
                                                rules={[{ required: true, message: "Please enter seating capacity" }]}
                                            >
                                                <Input type="number" min={0} placeholder="Enter seating capacity" />
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                    <Form.Item name="features" label="Additional Features">
                                        <Checkbox.Group>
                                            <Row gutter={[16, 8]}>
                                                <Col span={12}><Checkbox value="indoor">Indoor</Checkbox></Col>
                                                <Col span={12}><Checkbox value="lighting">Lighting Available</Checkbox></Col>
                                                <Col span={12}><Checkbox value="has_parking">Has Parking</Checkbox></Col>
                                                <Col span={12}><Checkbox value="has_showers">Has Showers</Checkbox></Col>
                                                <Col span={12}><Checkbox value="floodlights">Floodlights</Checkbox></Col>
                                                <Col span={12}><Checkbox value="scoreboard">Scoreboard</Checkbox></Col>
                                                <Col span={12}><Checkbox value="audience_stands">Audience Stands</Checkbox></Col>
                                                <Col span={12}><Checkbox value="climate_control">Climate Control (AC/Heating)</Checkbox></Col>
                                                <Col span={12}><Checkbox value="water_fountains">Water Fountains</Checkbox></Col>
                                                <Col span={12}><Checkbox value="wheelchair_accessible">Wheelchair Accessible</Checkbox></Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </>
                            ),
                        },
                        {
                            key: "3",
                            label: "Pricing",
                            children: (
                                <>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name={["pricing_model", "hourly_rate"]} label="Hourly Rate ($)">
                                                <Input type="number" placeholder="Enter hourly rate" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name={["pricing_model", "membership_discount"]} label="Membership Discount (%)">
                                                <Input type="number" placeholder="Enter discount percentage" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            ),
                        },
                        {
                            key: "4",
                            label: "Operating Hours",
                            children: (
                                <>
                                    {Object.keys(defaultOperatingHours).map((day) => (
                                        <Form.Item key={day} name={["operating_hours", day]} label={day.charAt(0).toUpperCase() + day.slice(1)}>
                                            <TimePicker.RangePicker format="HH:mm" />
                                        </Form.Item>
                                    ))}
                                </>
                            ),
                        },
                        {
                            key: "5",
                            label: "Rules & Policies",
                            children: (
                                <Row gutter={24}>
                                    {/* Court Rules Input */}
                                    <Col xs={24} md={12}>
                                        <Title level={5}>
                                            <SnippetsOutlined /> Court Rules
                                        </Title>
                                        <Form.Item name="rules" label="Enter Rules (comma-separated)">
                                            <Input.TextArea rows={3} placeholder="E.g., No metal cleats, Use designated entry points" />
                                        </Form.Item>
                                    </Col>

                                    {/* Booking Policy Fields */}
                                    <Col xs={24} md={12}>
                                        <Title level={5}>
                                            <ClockCircleOutlined /> Booking Rules
                                        </Title>
                                        <Form.Item name={["booking_policy", "cancellation_period"]} label="Cancellation Period">
                                            <Select placeholder="Select cancellation period">
                                                <Option value="24 hours">24 Hours</Option>
                                                <Option value="48 hours">48 Hours</Option>
                                                <Option value="72 hours">72 Hours</Option>
                                                <Option value="1 week">1 Week</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name={["booking_policy", "modification_allowed"]} label="Allow Booking Modification">
                                            <Select placeholder="Select">
                                                <Option value={true}>Yes</Option>
                                                <Option value={false}>No</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name={["booking_policy", "advance_booking_limit"]} label="Advance Booking Limit">
                                            <Select placeholder="Select booking limit">
                                                <Option value="7 days">7 Days</Option>
                                                <Option value="14 days">14 Days</Option>
                                                <Option value="30 days">30 Days</Option>
                                                <Option value="60 days">60 Days</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ),
                        },

                        {
                            key: "6",
                            label: "Images",
                            children: (
                                <>
                                    <Form.Item label="Court Images">
                                        <Upload
                                            listType="picture-card"
                                            fileList={imageList}
                                            onChange={({ fileList }) => setImageList(fileList)}
                                            beforeUpload={() => false} // Prevent auto-upload
                                        >
                                            {imageList.length < 5 && <PlusOutlined />}
                                        </Upload>
                                    </Form.Item>
                                </>
                            ),
                        },
                    ]}
                />
            </Card>
            {/* Submit Button */}
            <Form.Item style={{ marginTop: 16, marginLeft: 0 }}>
                <Button type="primary" htmlType="submit">
                    {isEditMode ? "Update Court" : "Create Court"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CourtOwnerCourtCreateView;
