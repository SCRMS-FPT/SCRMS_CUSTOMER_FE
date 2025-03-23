import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Tag, Image, Button, Divider, Row, Col } from "antd";
import { LeftOutlined, DollarCircleOutlined, TagOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

// Mock promotions data (Replace with API fetch)
const mockPromotions = [
    { id: "P001", title: "Spring Discount", discount: 20, status: "Active", start_date: "2025-03-10", end_date: "2025-04-10", description: "Spring season discount! Get 20% off on all bookings!", image: "https://via.placeholder.com/600x300" },
    { id: "P002", title: "Weekend Special", discount: 15, status: "Expired", start_date: "2025-02-01", end_date: "2025-02-28", description: "Special weekend offer! Enjoy 15% discount on selected courts.", image: "" },
];

const CourtOwnerPromotionDetailView = () => {
    const { promotionId } = useParams();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        const promo = mockPromotions.find((p) => p.id === promotionId);
        if (promo) setPromotion(promo);
    }, [promotionId]);

    if (!promotion) return <Card><Text type="danger">Promotion not found.</Text></Card>;

    return (
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title level={4} style={{ margin: 0 }}>{promotion.title}</Title>
                    <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate("/court-owner/promotions")}>
                        Back to Promotions
                    </Button>
                </div>
            }
            style={{ margin: "auto", backgroundColor: "#f8f9fa", borderRadius: "10px" }}
        >
            <Row gutter={[16, 16]} align="middle">
                {/* Promotion Details */}
                <Col xs={24} md={12}>
                    <Title level={5} style={{ marginBottom: 16 }}>
                        <TagOutlined style={{ color: "#1890ff", marginRight: 8 }} /> Promotion Details
                    </Title>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                        <DollarCircleOutlined style={{ fontSize: "18px", color: "#52c41a", marginRight: 8 }} />
                        <Tag color="green" style={{ fontSize: "14px", padding: "5px 10px", fontWeight: "bold" }}>
                            {promotion.discount}% Off
                        </Tag>
                        <Text strong style={{ marginLeft: 8 }}>Discount</Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                        <TagOutlined style={{ fontSize: "18px", color: promotion.status === "Active" ? "#52c41a" : "#ff4d4f", marginRight: 8 }} />
                        <Tag color={promotion.status === "Active" ? "green" : "red"} style={{ fontSize: "14px", padding: "5px 10px", fontWeight: "bold" }}>
                            {promotion.status}
                        </Tag>
                        <Text strong style={{ marginLeft: 8 }}>Status</Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                        <CalendarOutlined style={{ fontSize: "18px", color: "#faad14", marginRight: 8 }} />
                        <Text strong>Start Date:</Text>
                        <Text style={{ marginLeft: 8, color: "#333", fontSize: "15px" }}>
                            {dayjs(promotion.start_date).format("MMMM D, YYYY")}
                        </Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                        <ClockCircleOutlined style={{ fontSize: "18px", color: "#fa541c", marginRight: 8 }} />
                        <Text strong>End Date:</Text>
                        <Text style={{ marginLeft: 8, color: "#333", fontSize: "15px" }}>
                            {dayjs(promotion.end_date).format("MMMM D, YYYY")}
                        </Text>
                    </div>
                </Col>

                {/* Promotion Image */}
                <Col xs={24} md={12} style={{ textAlign: "center" }}>
                    {promotion.image ? (
                        <Image
                            width="100%"
                            height={200}
                            src={promotion.image}
                            style={{ borderRadius: "10px", objectFit: "cover", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)" }}
                        />
                    ) : (
                        <Text type="secondary">No Image Available</Text>
                    )}
                </Col>
            </Row>

            <Divider />

            {/* Description */}
            <Title level={5}>Description</Title>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
                {promotion.description || <Text type="secondary">No description provided.</Text>}
            </Paragraph>
        </Card>
    );
};

export default CourtOwnerPromotionDetailView;
