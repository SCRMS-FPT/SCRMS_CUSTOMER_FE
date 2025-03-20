import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Card } from "antd";
import { useNavigate } from "react-router-dom";
import courtsData from "@/data/court_mock_data";

const VenueCourtsList = ({ courts }) => {
  const navigate = useNavigate();
  const [venueCourts, setVenueCourts] = useState([]);

  useEffect(() => {
    // Fetch courts that match the given court IDs from the venue
    const filteredCourts = courtsData.filter((court) => courts.includes(court.court_id));
    setVenueCourts(filteredCourts);
  }, [courts]);

  const columns = [
    {
      title: "🎾 Court Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "🏆 Sport Type",
      dataIndex: "sport_type",
      key: "sport_type",
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    {
      title: "🏗 Surface Type",
      dataIndex: ["features", "surface_type"],
      key: "surface_type",
      render: (surface) => <Tag color="green">{surface}</Tag>,
    },
    {
      title: "🌍 Indoor/Outdoor",
      dataIndex: ["features", "indoor"],
      key: "indoor",
      render: (indoor) => <Tag color={indoor ? "volcano" : "geekblue"}>{indoor ? "Indoor" : "Outdoor"}</Tag>,
    },
    {
      title: "💡 Lighting",
      dataIndex: ["features", "lighting"],
      key: "lighting",
      render: (lighting) => <Tag color={lighting ? "gold" : "gray"}>{lighting ? "Yes" : "No"}</Tag>,
    },
    {
      title: "🪑 Seating Capacity",
      dataIndex: ["features", "seating_capacity"],
      key: "seating_capacity",
    },
    {
      title: "🅿 Parking",
      dataIndex: ["features", "has_parking"],
      key: "parking",
      render: (hasParking) => <Tag color={hasParking ? "green" : "red"}>{hasParking ? "Yes" : "No"}</Tag>,
    },
    {
      title: "🚿 Showers",
      dataIndex: ["features", "has_showers"],
      key: "showers",
      render: (hasShowers) => <Tag color={hasShowers ? "green" : "red"}>{hasShowers ? "Yes" : "No"}</Tag>,
    },
    {
      title: "💰 Price (Per Hour)",
      dataIndex: ["pricing", "hourly_rate"],
      key: "hourly_rate",
      render: (rate) => <Tag color="cyan">${rate}</Tag>,
    },
    {
      title: "⚙ Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/owner/courts/${record.court_id}`)}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Card title="🏟 List of Courts in Venue" className="mb-6">
      <Table dataSource={venueCourts} rowKey="court_id" columns={columns} />
    </Card>
  );
};

export default VenueCourtsList;
