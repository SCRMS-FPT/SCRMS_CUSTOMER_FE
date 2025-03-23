import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams  } from "react-router-dom";
import { Card, Descriptions, Tag, Spin, Button, Typography, Row, Col, message, List, Avatar, Modal, Input, Rate, Table  } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

// Sample match data (Replace with API fetch)
const matchData = [
  {
    id: "1",
    sport: "Tennis",
    date: "2025-03-14",
    time: "17:00",
    location: "Court A",
    status: "Completed",
    teams: [
      { name: "Team Aces", players: ["Alice", "Bob", "Bob", "Bob"] },
      { name: "Team Thunder", players: ["Charlie", "Bob", "Bob", "Bob", "Bob"] },
    ],
    format: "Singles",
    duration: "1 hour",
    bookingReference: "BK12345",
    paymentStatus: "Paid",
    matchFee: "$20",
    score: "6-3, 4-6, 7-5",
    winner: "Team Aces",
    createdAt: "2025-03-10 10:00",
    updatedAt: "2025-03-12 15:30",
  },
  {
    id: "2",
    sport: "Basketball",
    date: "2025-03-20",
    time: "19:00",
    location: "Court B",
    status: "Looking for Opponent",
    teams: [{ name: "Team Raptors", players: ["David", "Eve", "Frank"] }, { name: "TBD", players: [] }],
    format: "5v5",
    duration: "2 hours",
    bookingReference: "BK67890",
    paymentStatus: "Unpaid",
    matchFee: "$15",
    score: null,
    winner: null,
    createdAt: "2025-03-12 12:00",
    updatedAt: "2025-03-14 09:45",
  },
];

const UserMatchingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previousTab = searchParams.get("tab") || "1";
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const foundMatch = matchData.find((m) => m.id === id);
      if (foundMatch) setMatch(foundMatch);
      else {
        message.error("Match not found");
        navigate("/user/matching");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleReviewSubmit = () => {
    message.success("Review submitted successfully!");
    setIsReviewModalOpen(false);
  };

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;

  // Function to open modal and set selected team
  const handleViewAll = (team) => {
    setSelectedTeam(team);
    setModalVisible(true);
  };

  return (
    <div className="container mx-auto p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeftOutlined onClick={() => navigate(`/user/matching?tab=${previousTab}`)} style={{ cursor: "pointer" }} />
            <Title level={4} style={{ margin: 0 }}>Match Details</Title>
          </div>
        }
        className="shadow-lg rounded-lg"
      >
        <Row gutter={[16, 16]}>
          {/* Match Information */}
          <Col span={12}>
            <Title level={5}><ClockCircleOutlined /> Match Info</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Sport">{match.sport}</Descriptions.Item>
              <Descriptions.Item label="Date & Time">{match.date} - {match.time}</Descriptions.Item>
              <Descriptions.Item label="Location">{match.location}</Descriptions.Item>
              <Descriptions.Item label="Format">{match.format}</Descriptions.Item>
              <Descriptions.Item label="Duration">{match.duration}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={match.status === "Upcoming" ? "green" : match.status === "Looking for Opponent" ? "orange" : "red"}>
                  {match.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Teams & Players */}
          <Col span={12}>
            <Title level={5}><TeamOutlined /> Participants</Title>
            {match.teams.map((team, index) => (
              <Card key={index} title={team.name} className="mb-2">
                <List
                  dataSource={team.players.slice(0, 2)} // Show only the first 2 players
                  renderItem={(player) => (
                    <List.Item>
                      <Avatar icon={<UserOutlined />} style={{ marginRight: "10px" }} />
                      {player}
                    </List.Item>
                  )}
                />
                {team.players.length > 2 && (
                  <Button type="link" onClick={() => handleViewAll(team)}>
                    View All ({team.players.length} Players)
                  </Button>
                )}
                {team.players.length === 0 && <Tag color="orange">Looking for Players</Tag>}
              </Card>
            ))}
            {match.status === "Looking for Opponent" && (
              <Button type="primary" block onClick={() => message.success("Joined the match!")}>
                Join Match
              </Button>
            )}
          </Col>
        </Row>

        {/* Booking & Payment */}
        <div className="mt-4">
          <Title level={5}><TrophyOutlined /> Booking & Payment</Title>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Booking Reference">{match.bookingReference}</Descriptions.Item>
            <Descriptions.Item label="Match Fee">{match.matchFee}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={match.paymentStatus === "Paid" ? "green" : "red"}>{match.paymentStatus}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Match Results */}
        {match.status === "Completed" && (
          <div className="mt-4">
            <Title level={5}><TrophyOutlined /> Results</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Final Score">{match.score || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Winner">{match.winner || "N/A"}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" block className="mt-4" onClick={() => setIsReviewModalOpen(true)}>
              Write Review
            </Button>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-4 flex justify-end">
          <Button type="primary" onClick={() => navigate(`/user/matching?tab=${previousTab}`)}>Back</Button>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        title="Submit Your Review"
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleReviewSubmit} disabled={!rating || !feedback.trim()}>
            Submit
          </Button>,
        ]}
      >
        <div className="mb-4">
          <span>Rate the match: </span>
          <Rate allowHalf value={rating} onChange={setRating} />
        </div>
        <TextArea
          rows={4}
          placeholder="Share your thoughts on the match..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Modal>

      {/* Modal for Viewing All Players */}
      <Modal
        title={`Players in ${selectedTeam?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedTeam?.players.map((player, index) => ({ key: index, name: player }))}
          columns={[
            { title: "Player Name", dataIndex: "name", key: "name" },
          ]}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default UserMatchingDetailView;
