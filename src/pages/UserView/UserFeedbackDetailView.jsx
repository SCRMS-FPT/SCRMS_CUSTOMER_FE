import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography, Tag, Rate, Divider, Image } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

// Sample Data (Now with real image URLs)
const feedbackData = [
  {
    id: "1",
    category: "Court Booking",
    title: "Great Experience at City Tennis Court",
    date: "2025-03-10",
    location: "City Tennis Court",
    rating: 4.5,
    comment: "The court was well-maintained, and the booking process was smooth.",
    user: "John Doe",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Tennis_court_at_sunset.jpg",
      "https://images.unsplash.com/photo-1617099446451-9389f3c3ac6e"
    ],
    suggestions: "It would be great if there were more water stations around."
  },
];

const { Title, Text, Paragraph } = Typography;

const UserFeedbackDetailView = () => {
  const { id } = useParams(); // Get feedback ID from URL
  const navigate = useNavigate(); // Navigation Hook

  // Find the feedback by ID
  const feedback = feedbackData.find((item) => item.id === id);

  if (!feedback) {
    return <Text type="danger">Feedback not found</Text>;
  }

  return (
    <Row justify="center" style={{ }}>
      <Col xs={24} sm={20} md={16} lg={24}>
        <Card bordered={false} style={{ borderRadius: 8, padding: 16, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          {/* Back Button */}
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/user/feedbacks")}>
            Back to Feedback List
          </Button>

          {/* Title & Category */}
          <Title level={4} style={{ marginTop: 10 }}>{feedback.title}</Title>
          <Tag color="blue">{feedback.category}</Tag>

          {/* Date & Location */}
          <Text type="secondary">
            <CalendarOutlined /> {feedback.date} &nbsp;&nbsp;
            <EnvironmentOutlined /> {feedback.location}
          </Text>

          {/* Divider */}
          <Divider />

          {/* User Name */}
          <Text strong><UserOutlined /> Given by: {feedback.user}</Text>

          {/* Rating */}
          <Row align="middle" style={{ marginTop: 10 }}>
            <Rate allowHalf value={feedback.rating} disabled />
            <Text style={{ marginLeft: 8 }}>{feedback.rating} / 5</Text>
          </Row>

          {/* Comment */}
          <Paragraph style={{ marginTop: 16 }}>{feedback.comment}</Paragraph>

          {/* Suggestions */}
          {feedback.suggestions && (
            <>
              <Divider />
              <Text strong>Suggestions for Improvement:</Text>
              <Paragraph>{feedback.suggestions}</Paragraph>
            </>
          )}

          {/* Images (if available) */}
          {feedback.images && feedback.images.length > 0 && (
            <>
              <Divider />
              <Text strong>Feedback Images:</Text>
              <Row gutter={16} style={{ marginTop: 8 }}>
                {feedback.images.map((img, index) => (
                  <Col key={index}>
                    <Image width={150} height={100} src={img} style={{ borderRadius: 8, objectFit: "cover" }} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default UserFeedbackDetailView;
