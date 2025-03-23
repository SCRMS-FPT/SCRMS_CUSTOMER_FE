import React, { useState, useEffect } from "react";
import { Card, Button, Modal, List, Badge, Row, Col, Typography, Tag, Divider, Descriptions } from "antd";
import { useNavigate, useParams } from "react-router-dom";

// Example data for coaches (this would normally come from an API)
const coachesData = [
  {
    id: "1",
    name: "Coach John Doe",
    bio: "A passionate coach with 10+ years of experience in coaching various teams.",
    specialties: ["Football", "Basketball", "Athletics"],
    availability: {
      "2025-03-10": [
        { key: "1", type: "success", content: "Training Session - Football", status: "Scheduled" },
      ],
      "2025-03-12": [
        { key: "2", type: "processing", content: "Training Session - Basketball", status: "Upcoming" },
      ],
    },
  },
  {
    id: "2",
    name: "Coach Jane Smith",
    bio: "Expert coach specializing in tennis, with a focus on developing young talent.",
    specialties: ["Tennis", "Badminton"],
    availability: {
      "2025-03-15": [
        { key: "3", type: "warning", content: "Training Session - Tennis", status: "Scheduled" },
      ],
    },
  },
];

const UserCoachDetailView = () => {
  const { coachId } = useParams(); // Fetching the coachId from the URL
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  // Fetching the coach details based on coachId
  useEffect(() => {
    const foundCoach = coachesData.find((coach) => coach.id === coachId);
    if (foundCoach) {
      setCoach(foundCoach);
    } else {
      // If coach not found, navigate to a 404 page or another view
      navigate("/404");
    }
  }, [coachId, navigate]);

  const handleDateSelect = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const availabilityList = coach.availability[dateStr] || [];

    if (availabilityList.length > 0) {
      setSelectedDate(dateStr);
      setSelectedAvailability(availabilityList);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewBookingDetails = (sessionId) => {
    // Redirect to the booking details page
    navigate(`/user/booking/${sessionId}`);
    setIsModalOpen(false);
  };

  if (!coach) {
    return null; // or a loading spinner while fetching the coach data
  }

  return (
    <Card
      title={coach.name}
      extra={<Button type="primary" onClick={() => navigate("/user/coachings")}>Back to Coaches</Button>}
      bordered={false}
      style={{ maxWidth: 1200, margin: "auto", marginTop: 20 }}
    >
      {/* Biography Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3}>Biography</Typography.Title>
          <Typography.Paragraph>{coach.bio}</Typography.Paragraph>
        </Col>
      </Row>

      {/* Specialties Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3}>Specialties</Typography.Title>
          <Row gutter={[8, 8]}>
            {coach.specialties.map((specialty, index) => (
              <Col key={index}>
                <Tag color="blue">{specialty}</Tag>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Availability Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3}>Availability</Typography.Title>
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
        </Col>
      </Row>

      {/* Availability Session Modal */}
      <Modal
        title={`Sessions on ${selectedDate}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
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
    