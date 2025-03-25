import React, { useState } from "react";
import { Card, Table, Button, Tag, Tooltip, Input, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const MAX_AMENITIES_DISPLAY = 3;

const CourtOwnerCourtListView = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAmenity, setSelectedAmenity] = useState("all");

  const courts = [
    {
      court_id: "court_001",
      name: "Champions Court",
      sport_type: "Tennis",
      venue: {
        venue_id: "V001",
        name: "Downtown Sports Complex",
        address: { city: "New York", state: "NY" },
      },
      features: {
        lighting: true,
        surface_type: "Clay",
        seating_capacity: 50,
        has_parking: true,
        has_showers: true,
      },
      amenities: ["Parking", "Locker Rooms", "Refreshments", "Pro Shop"],
    },
    {
      court_id: "court_002",
      name: "Elite Sports Arena",
      sport_type: "Badminton",
      venue: {
        venue_id: "V002",
        name: "Westside Arena",
        address: { city: "Los Angeles", state: "CA" },
      },
      features: {
        lighting: true,
        surface_type: "Wooden Floor",
        seating_capacity: 200,
        has_parking: false,
        has_showers: false,
      },
      amenities: ["Wi-Fi", "Refreshments", "Training Equipment", "Gym Access"],
    },
  ];

  // Extract all unique sports & amenities for filter dropdowns
  const allSports = [...new Set(courts.map((court) => court.sport_type))];
  const allAmenities = [...new Set(courts.flatMap((court) => court.amenities))];

  // Filter courts based on search & filter criteria
  const filteredCourts = courts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSport = selectedSport === "all" || court.sport_type === selectedSport;
    const matchesAmenity = selectedAmenity === "all" || court.amenities.includes(selectedAmenity);
    return matchesSearch && matchesSport && matchesAmenity;
  });

  const columns = [
    {
      title: "Court Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // ✅ Sort Alphabetically
      render: (text) => <span className="font-semibold text-indigo-600">{text}</span>,
    },
    {
      title: "Sport",
      dataIndex: "sport_type",
      key: "sport",
      sorter: (a, b) => a.sport_type.localeCompare(b.sport_type), // ✅ Sort Alphabetically
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    {
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
      sorter: (a, b) => a.venue.name.localeCompare(b.venue.name), // ✅ Sort Alphabetically
      render: (venue) => <span>{venue.name} ({venue.address.city}, {venue.address.state})</span>,
    },
    {
      title: "Amenities",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => {
        const limitedAmenities = amenities.slice(0, MAX_AMENITIES_DISPLAY);
        const remainingAmenities = amenities.slice(MAX_AMENITIES_DISPLAY);
        return (
          <>
            {limitedAmenities.map((amenity) => <Tag color="green" key={amenity}>{amenity}</Tag>)}
            {remainingAmenities.length > 0 && (
              <Tooltip title={remainingAmenities.join(", ")}>
                <Tag color="gray" className="cursor-pointer">+{remainingAmenities.length}</Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Surface Type",
      dataIndex: ["features", "surface_type"],
      key: "surface",
      sorter: (a, b) => a.features.surface_type.localeCompare(b.features.surface_type), // ✅ Sort Alphabetically
      render: (surface) => <Tag color="purple">{surface}</Tag>,
    },
    {
      title: "Seating Capacity",
      dataIndex: ["features", "seating_capacity"],
      key: "seating",
      sorter: (a, b) => a.features.seating_capacity - b.features.seating_capacity, // ✅ Sort Numerically
      render: (capacity) => <span className="font-semibold">{capacity}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/court-owner/courts/${record.court_id}`)}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="My Courts"
      extra={<Button type="primary" onClick={() => navigate("/court-owner/courts/create")}>Add New Court</Button>}
    >
      {/* Search & Filter Controls */}
      <Space className="mb-4" wrap>
        <Input
          placeholder="Search by Court Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          value={selectedSport}
          onChange={setSelectedSport}
          style={{ width: 150 }}
          placeholder="Filter by Sport"
        >
          <Option value="all">All Sports</Option>
          {allSports.map((sport) => (
            <Option key={sport} value={sport}>{sport}</Option>
          ))}
        </Select>
        <Select
          value={selectedAmenity}
          onChange={setSelectedAmenity}
          style={{ width: 200 }}
          placeholder="Filter by Amenities"
        >
          <Option value="all">All Amenities</Option>
          {allAmenities.map((amenity) => (
            <Option key={amenity} value={amenity}>{amenity}</Option>
          ))}
        </Select>
      </Space>

      {/* Courts Table */}
      <Table
        dataSource={filteredCourts}
        rowKey="court_id"
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default CourtOwnerCourtListView;
