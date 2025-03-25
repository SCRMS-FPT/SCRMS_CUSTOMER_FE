import React, { useState } from "react";
import { Card, Table, Button, Tag, Tooltip, Input, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import venuesData from "@/data/venue_mock_data";

const { Option } = Select;
const MAX_SPORTS_DISPLAY = 3;
const MAX_AMENITIES_DISPLAY = 4;

const CourtOwnerVenueListView = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAmenity, setSelectedAmenity] = useState("all");

  // Get all unique sports and amenities for filtering options
  const allSports = [...new Set(venuesData.flatMap(venue => venue.sports_available))];
  const allAmenities = [...new Set(venuesData.flatMap(venue => venue.amenities))];

  // Filter venues based on search & filters
  const filteredVenues = venuesData.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSport = selectedSport === "all" || venue.sports_available.includes(selectedSport);
    const matchesAmenity = selectedAmenity === "all" || venue.amenities.includes(selectedAmenity);
    return matchesSearch && matchesSport && matchesAmenity;
  });

  const columns = [
    {
      title: "Venue Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // ✅ Sort Alphabetically
      render: (text) => <span className="font-semibold text-indigo-600">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "location",
      sorter: (a, b) => a.address.city.localeCompare(b.address.city), // ✅ Sort by City Name
      render: (address) => `${address.city}, ${address.state}`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => b.rating - a.rating, // ✅ Sort Numerically (Highest First)
      render: (rating) => <span className="font-bold text-yellow-500">{rating} ⭐</span>,
    },
    {
      title: "Sports",
      dataIndex: "sports_available",
      key: "sports",
      render: (sports) => {
        const limitedSports = sports.slice(0, MAX_SPORTS_DISPLAY);
        const remainingSports = sports.slice(MAX_SPORTS_DISPLAY);
        return (
          <>
            {limitedSports.map((sport) => <Tag color="blue" key={sport}>{sport}</Tag>)}
            {remainingSports.length > 0 && (
              <Tooltip title={remainingSports.join(", ")}>
                <Tag color="gray" className="cursor-pointer">+{remainingSports.length}</Tag>
              </Tooltip>
            )}
          </>
        );
      },
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
      title: "Courts",
      dataIndex: "courts",
      key: "courts",
      render: (courts) => <span className="font-semibold">{courts.length}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/court-owner/venues/${record.id}`)}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="My Venues"
      extra={<Button type="primary" onClick={() => navigate("/court-owner/venues/create")}>Add New Venue</Button>}
    >
      {/* Search & Filter Controls */}
      <Space className="mb-4" wrap>
        <Input
          placeholder="Search Venue Name"
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
          style={{ width: 150 }}
          placeholder="Filter by Amenity"
        >
          <Option value="all">All Amenities</Option>
          {allAmenities.map((amenity) => (
            <Option key={amenity} value={amenity}>{amenity}</Option>
          ))}
        </Select>
      </Space>

      {/* Venues Table */}
      <Table
        dataSource={filteredVenues}
        rowKey="id"
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default CourtOwnerVenueListView;
