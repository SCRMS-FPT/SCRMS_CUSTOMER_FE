import React from "react";
import { Card, Table, Button, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";
import venuesData from "@/data/venue_mock_data";

const CourtOwnerVenueListView = () => {
  const navigate = useNavigate();
  const MAX_SPORTS_DISPLAY = 3;
  const MAX_AMENITIES_DISPLAY = 4;

  const columns = [
    {
      title: "Venue Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="font-semibold text-indigo-600">{text}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "location",
      render: (address) => `${address.city}, ${address.state}`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <span className="font-bold text-yellow-500">{rating} ⭐</span>,
    },
    {
      title: "Sports",
      dataIndex: "sports_available",
      key: "sports",
      render: (sports) => {
        const limitedSports = sports.slice(0, MAX_SPORTS_DISPLAY);
        const remainingSports = sports.slice(MAX_SPORTS_DISPLAY);
        const remainingCount = remainingSports.length;

        return (
          <>
            {limitedSports.map((sport) => (
              <Tag color="blue" key={sport}>
                {sport}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tooltip title={remainingSports.join(", ")}>
                <Tag color="gray" className="cursor-pointer">{`+${remainingCount}`}</Tag>
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
        const remainingCount = remainingAmenities.length;

        return (
          <>
            {limitedAmenities.map((amenity) => (
              <Tag color="green" key={amenity}>
                {amenity}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tooltip title={remainingAmenities.join(", ")}>
                <Tag color="gray" className="cursor-pointer">{`+${remainingCount}`}</Tag>
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
    <CourtOwnerSidebar>
      <Card title="My Venues" extra={<Button type="primary" onClick={() => navigate("/court-owner/venues/create")}>
        Add New Venue
      </Button>}>
        <Table dataSource={venuesData} rowKey="id" columns={columns} pagination={{ pageSize: 10 }} />
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerVenueListView;
