import React, { useState, useEffect } from "react";
import { Card, Button, Spin, Tag, Row, Col, Divider, Avatar, Tooltip, Tabs, Modal, Rate, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { StarFilled } from "@ant-design/icons";

const { TabPane } = Tabs;

const UserCoachScheduleDetailView = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, review: "" });

  useEffect(() => {
    setTimeout(() => {
      const scheduleData = {
        101: {
          id: 101,
          title: "Morning Training",
          date: "2024-03-25",
          time: "10:00 AM",
          duration: "60 minutes",
          coach: "Coach John Doe",
          sport: "Football",
          location: "Field A",
          description: "A comprehensive football training session focusing on dribbling and passing.",
          price: "$50",
          status: "Complete",  // Training session is complete
          coachProfile: {
            image: "https://randomuser.me/api/portraits/men/21.jpg",
            bio: "Coach John Doe is a seasoned football coach with over 10 years of experience.",
            ratings: 4.8,
          },
          curriculum: "1. Warm-up Drills\n2. Passing Exercises\n3. Dribbling Drills\n4. Mini-Match",
        },
        102: {
          id: 102,
          title: "Evening Training",
          date: "2024-03-26",
          time: "6:00 PM",
          duration: "90 minutes",
          coach: "Coach Jane Smith",
          sport: "Swimming",
          location: "Pool B",
          description: "Endurance training for swimming with a focus on strokes and breathing techniques.",
          price: "$60",
          status: "Pending",  // Training session is pending
          coachProfile: {
            image: "https://randomuser.me/api/portraits/women/31.jpg",
            bio: "Coach Jane Smith has been a competitive swimmer for over 8 years and is passionate about teaching.",
            ratings: 4.9,
          },
          curriculum: "",
        },
      };

      const foundSchedule = scheduleData[scheduleId];
      if (foundSchedule) {
        setSchedule(foundSchedule);
      } else {
        navigate("/404");
      }
      setLoading(false);
    }, 1000);
  }, [scheduleId, navigate]);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  }

  if (!schedule) {
    return null;
  }

  // Status styling based on the session status
  const getStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return <Tag color="orange">Pending</Tag>;
      case "Cancelled":
        return <Tag color="red">Cancelled</Tag>;
      case "Complete":
        return <Tag color="green">Completed</Tag>;
      case "No-show":
        return <Tag color="grey">No-show</Tag>;
      default:
        return <Tag color="blue">Unknown</Tag>;
    }
  };

  // Show the feedback modal
  const showFeedbackModal = () => {
    setIsModalVisible(true);
  };

  // Handle the feedback form submission
  const handleFeedbackSubmit = () => {
    // Handle the feedback submission here (send to the server, etc.)
    console.log("Feedback submitted:", feedback);
    setIsModalVisible(false);
    setFeedback({ rating: 0, review: "" });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card
        title={<h2>{schedule.title}</h2>}
        bordered={false}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "100%" }}
        extra={
          <Button type="primary" onClick={() => navigate("/user/coachings")}>
            Back to Schedules
          </Button>
        }
      >
        {/* Coach Profile Section */}
        <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
          <Col span={6}>
            <Avatar size={64} src={schedule.coachProfile.image} />
          </Col>
          <Col span={18}>
            <h3>{schedule.coach}</h3>
            <Tooltip title={schedule.coachProfile.bio}>
              <p style={{ color: "#555" }}>{schedule.coachProfile.bio}</p>
            </Tooltip>
            <div>
              <StarFilled style={{ color: "#fadb14" }} />
              <span style={{ marginLeft: "8px" }}>{schedule.coachProfile.ratings} / 5</span>
            </div>
          </Col>
        </Row>

        {/* Status Section */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <h4>Status:</h4>
            {getStatusTag(schedule.status)} {/* Display booking status */}
            <p style={{ marginTop: "10px" }}>
              {schedule.status === "Pending" && "Your booking is pending confirmation."}
              {schedule.status === "Cancelled" && "This session has been cancelled."}
              {schedule.status === "Complete" && "Your session has been completed. We hope you enjoyed!"}
              {schedule.status === "No-show" && "You missed your session. Please contact support for more details."}
            </p>
          </Col>
        </Row>

        {/* Tabs for Training Content, Price, and Location */}
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Training Session" key="1">
            {/* Session Details */}
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong><CalendarOutlined /> Date:</strong> {schedule.date}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong><ClockCircleOutlined /> Time:</strong> {schedule.time}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong><ClockCircleOutlined /> Duration:</strong> {schedule.duration}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong><EnvironmentOutlined /> Location:</strong> {schedule.location}
                </p>
              </Col>
            </Row>
            <Divider />
            <h4>Description:</h4>
            <p>{schedule.description}</p>

            {/* Feedback Button - Visible only when status is Complete */}
            {schedule.status === "Complete" && (
              <Button
                type="primary"
                style={{ marginTop: "20px" }}
                onClick={showFeedbackModal}
              >
                Provide Feedback
              </Button>
            )}
          </TabPane>

          <TabPane tab="Pricing" key="2">
            <Row>
              <Col span={24}>
                <p>
                  <strong>Price:</strong> {schedule.price}
                </p>
              </Col>
            </Row>
            <Button
              type="primary"
              style={{ marginTop: "20px" }}
              onClick={() => alert("Booking feature coming soon!")}
            >
              Book Session
            </Button>
          </TabPane>

          <TabPane tab="Curriculum" key="3">
            {/* Training Curriculum */}
            <h4>Curriculum</h4>
            {schedule.curriculum ? (
              <pre>{schedule.curriculum}</pre>
            ) : (
              <p>No training content right now.</p>
            )}
          </TabPane>

          <TabPane tab="Location" key="4">
            <h4>Location Map</h4>
            <p>View the training session location on Google Maps:</p>
            <div style={{ height: "300px", width: "100%" }}>
              <iframe
                width="100%"
                height="100%"
                src="https://maps.google.com/maps?q=Field%20A&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                style={{ border: "0" }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </TabPane>
        </Tabs>


      </Card>

      {/* Feedback Modal */}
      <Modal
        title="Provide Feedback"
        visible={isModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Row>
          <Col span={24}>
            <h4>Rate the Session:</h4>
            <Rate
              value={feedback.rating}
              onChange={(value) => setFeedback({ ...feedback, rating: value })}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col span={24}>
            <h4>Your Review:</h4>
            <Input.TextArea
              value={feedback.review}
              onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
              placeholder="Write your review here..."
              rows={4}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default UserCoachScheduleDetailView;
