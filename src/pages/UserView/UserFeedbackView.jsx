import React, { useState } from "react";
import { Card, Tabs, List, Typography, Rate, Row, Col, Tag, Divider } from "antd";
import { CommentOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

// Sample feedback data (Normally fetched from an API)
const feedbackData = [
  {
    id: "1",
    category: "Court Booking",
    title: "Great Experience at City Tennis Court",
    date: "2025-03-10",
    location: "City Tennis Court",
    rating: 4.5,
    comment: "The court was well-maintained, and the booking process was smooth.",
  },
  {
    id: "2",
    category: "Match Making",
    title: "Exciting Football Match",
    date: "2025-03-08",
    location: "Downtown Sports Arena",
    rating: 4.8,
    comment: "Had an amazing match! The skill levels were well-matched.",
  },
  {
    id: "3",
    category: "Coaching Session",
    title: "Excellent Basketball Training",
    date: "2025-03-05",
    location: "West Side Gym",
    rating: 5,
    comment: "Coach was very professional, and I improved a lot in just one session.",
  },
  {
    id: "4",
    category: "Coaching Session",
    title: "Excellent Basketball Training",
    date: "2025-03-05",
    location: "West Side Gym",
    rating: 5,
    comment: "Coach was very professional, and I improved a lot in just one session.",
  },
];

const UserFeedbackView = () => {
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  // Tab Items
  const tabItems = [
    {
        key: "1",
        label: "Feedback List",
        children: (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={feedbackData}
            pagination={{ pageSize: 4 }} // ✅ Add pagination (4 items per page)
            renderItem={(feedback) => (
              <List.Item onClick={() => navigate(`/user/feedbacks/${feedback.id}`)} style={{ cursor: "pointer" }}>
                <Card hoverable style={{ borderRadius: 8 }}>
                  <Row gutter={16} align="middle">
                    <Col span={4}>
                      <Tag color="blue">{feedback.category}</Tag>
                    </Col>
                    <Col span={16}>
                      <Title level={5}>{feedback.title}</Title>
                      <Text type="secondary">
                        <CalendarOutlined /> {feedback.date} &nbsp;&nbsp;
                        <EnvironmentOutlined /> {feedback.location}
                      </Text>
                      <Paragraph style={{ marginTop: 8 }}>{feedback.comment}</Paragraph>
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                      <Rate allowHalf value={feedback.rating} disabled />
                      <br />
                      <Text>{feedback.rating} / 5</Text>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        ),
      },
      
    // {
    //   key: "2",
    //   label: "Blank Tab",
    //   children: <></>,
    // },
  ];

  return (
    <Card title={<><CommentOutlined /> User Feedback</>} bordered={false} style={{ margin: "auto", marginTop: 20 }}>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} items={tabItems} />
    </Card>
  );
};

export default UserFeedbackView;
