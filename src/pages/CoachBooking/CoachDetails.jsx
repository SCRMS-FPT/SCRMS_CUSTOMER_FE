import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tabs, Divider, Button, Spin } from "antd";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CoachImageCarousel from "../../components/CoachComponents/CoachImageCarousel";
import CoachInfo from "../../components/CoachComponents/CoachInfo";
import CoachSpecialties from "../../components/CoachComponents/CoachSpecialties";
import CoachDescription from "../../components/CoachComponents/CoachDescription";
import CoachContact from "../../components/CoachComponents/CoachContact";
import CoachFeedback from "../../components/CoachComponents/CoachFeedback";
import coachesData from "../../data/coachesData";
import AvailabilityTab from "../../components/CoachComponents/AvailabilityTab";

const { TabPane } = Tabs;

const CoachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previousTab = searchParams.get("tab") || "1";
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch coach data from mock data
  useEffect(() => {
    const foundCoach = coachesData.find((c) => c.id.toString() === id);
    if (foundCoach) {
      setCoach(foundCoach);
    } else {
      navigate("/404");
    }
    setLoading(false);
  }, [id, navigate]);

  const handleAddFeedback = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]);
  };

  const handleBookSession = () => {
    navigate(`/book-coach/${id}`);
  };

  if (loading || !coach) {
    return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <div className="container mx-auto p-6">
      <Card
        title={<h2 className="text-3xl font-bold">{coach.name}</h2>}
        extra={
          <Button type="primary" onClick={() => navigate(`/user/coachings?tab=${previousTab}`)}>
            Back to Coaches
          </Button>
        }
        bordered={false}
        className="shadow-lg"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Tabs defaultActiveKey="1" size="large" type="line">
          {/* Overview Tab */}
          <TabPane tab="Overview" key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <CoachImageCarousel images={coach.image_details} name={coach.name} />
              </Col>
              <Col xs={24} md={12}>
                <CoachInfo
                  name={coach.name}
                  location={coach.location}
                  availableHours={coach.availableHours}
                  fee={coach.fee}
                  rating={coach.rating}
                />
                <div className="mt-4">
                  <Button type="primary" onClick={handleBookSession}>
                    Book Now
                  </Button>
                </div>
                <Divider />
                <CoachSpecialties specialties={coach.specialties} />
                <Divider />
                <CoachDescription description={coach.description} />
              </Col>
            </Row>
          </TabPane>

          {/* Availability Tab */}
          <TabPane tab="Availability" key="2">
            <AvailabilityTab schedule={coach.schedule} />
          </TabPane>

          {/* Location & Contact Tab */}
          <TabPane tab="Location & Contact" key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <div style={{ height: "300px", width: "100%" }}>
                  <iframe
                    title="Coach Location"
                    width="100%"
                    height="100%"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      coach.location
                    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    frameBorder="0"
                    style={{ border: "0" }}
                    allowFullScreen
                  ></iframe>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <CoachContact
                  email={coach.contact.email}
                  phone={coach.contact.phone}
                  website={coach.contact.website}
                />
              </Col>
            </Row>
          </TabPane>

          {/* Feedback Tab */}
          <TabPane tab="Feedback" key="4">
            <CoachFeedback feedbacks={feedbacks} onAddFeedback={handleAddFeedback} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CoachDetails;
