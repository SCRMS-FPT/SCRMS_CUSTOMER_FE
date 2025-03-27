import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  List,
  Badge,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  Descriptions,
  Avatar,
  Rate,
  Tabs,
} from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

// Example data for coaches (this would normally come from an API)
const coachesData = [
  {
    id: "1",
    name: "Coach John Doe",
    bio: "A passionate coach with 10+ years of experience in coaching various teams.",
    specialties: ["Football", "Basketball", "Athletics"],
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/men/21.jpg",
    curriculum: "1. Warm-up Drills\n2. Passing Exercises\n3. Dribbling Drills\n4. Mini-Match",
    price: "$50 per session",
    terms: "No refunds for cancellations within 24 hours of the session.",
    availability: {
      "2025-03-10": [{ key: "1", type: "success", content: "Training Session - Football", status: "Scheduled" }],
      "2025-03-12": [{ key: "2", type: "processing", content: "Training Session - Basketball", status: "Upcoming" }],
    },
  },
  {
    id: "2",
    name: "Coach Jane Smith",
    bio: "Expert coach specializing in tennis, with a focus on developing young talent.",
    specialties: ["Tennis", "Badminton"],
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/women/31.jpg",
    curriculum: "1. Warm-up \n2. Serve & Return Drills\n3. Footwork Techniques\n4. Match Simulation",
    price: "$60 per session",
    terms: "Session must be booked at least 48 hours in advance.",
    availability: {
      "2025-03-15": [{ key: "3", type: "warning", content: "Training Session - Tennis", status: "Scheduled" }],
    },
  },
];

const UserCoachDetailView = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previousTab = searchParams.get("tab") || "1";
  const [coach, setCoach] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  useEffect(() => {
    const foundCoach = coachesData.find((c) => c.id === coachId);
    if (foundCoach) {
      setCoach(foundCoach);
    } else {
      navigate("/user/coachings");
    }
  }, [coachId, navigate]);

  const handleDateSelect = (date) => {
    const availabilityList = coach.availability[date] || [];
    if (availabilityList.length > 0) {
      setSelectedDate(date);
      setSelectedAvailability(availabilityList);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewBookingDetails = (sessionId) => {
    navigate(`/user/booking/${sessionId}`);
    setIsModalOpen(false);
  };

  if (!coach) {
    return null;
  }

  const tabItems = [
    {
      key: "1",
      label: "Personal Info",
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Biography">{coach.bio}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "2",
      label: "Specialties",
      children: (
        <Row gutter={[8, 8]}>
          {coach.specialties.map((specialty, index) => (
            <Col key={index}>
              <Tag color="blue">{specialty}</Tag>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: "3",
      label: "Curriculum",
      children: <pre>{coach.curriculum}</pre>,
    },
    {
      key: "4",
      label: "Pricing & Terms",
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Price">{coach.price}</Descriptions.Item>
          <Descriptions.Item label="Terms">{coach.terms}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "5",
      label: "Availability",
      children: (
        <List
          bordered
          dataSource={Object.keys(coach.availability)}
          renderItem={(date) => (
            <List.Item key={date}>
              <Badge status="processing" text={`Available on ${date}`} />
              <Button type="link" onClick={() => handleDateSelect(date)}>
                View Sessions
              </Button>
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Card
      title={coach.name}
      extra={<Button type="primary" onClick={() => navigate(`/user/coachings?tab=${previousTab}`)}>Back to Coaches</Button>}
      style={{margin: "auto"}}
    >
      <Row gutter={16} align="middle">
        <Col span={3}>
          <Avatar size={100} src={coach.image} />
        </Col>
        <Col span={18}>
          <Title level={3}>{coach.name}</Title>
          <Paragraph>{coach.bio}</Paragraph>
          <Rate allowHalf value={coach.rating} disabled />
          <span style={{ marginLeft: 10 }}>{coach.rating} / 5</span>
        </Col>
      </Row>

      <Divider />

      <Tabs defaultActiveKey="1" size="large" items={tabItems} />

      {/* 🟢 Availability Modal */}
      <Modal
        title={`Sessions on ${selectedDate}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <List
          bordered
          dataSource={selectedAvailability}
          renderItem={(session) => (
            <List.Item>
              <Badge status={session.type} text={session.content} />
              <Button type="link" onClick={() => handleViewBookingDetails(session.key)}>
                View Details
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default UserCoachDetailView;
