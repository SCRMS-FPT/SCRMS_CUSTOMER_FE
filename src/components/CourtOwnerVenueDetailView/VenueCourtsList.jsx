import React from "react";
import { Table, Button, Tag, Card, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const VenueCourtsList = ({ courts }) => {
  const navigate = useNavigate();

  // Helper function to render boolean values as Yes/No Tags
  const renderBooleanTag = (value) => (
    <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
  );

  // Helper function to get facility by name
  const getFacility = (courtData, facilityName) => {
    if (!courtData.facilities || !Array.isArray(courtData.facilities)) {
      return null;
    }
    return courtData.facilities.find((f) => f.name === facilityName);
  };

  // Helper function to extract facility value
  const getFacilityValue = (courtData, facilityName) => {
    const facility = getFacility(courtData, facilityName);
    return facility ? facility.description : null;
  };

  // Helper function to check if a facility exists
  const hasFacility = (courtData, facilityName) => {
    return getFacility(courtData, facilityName) !== undefined;
  };

  const columns = [
    {
      title: "Court Name",
      dataIndex: "courtName",
      key: "courtName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Sport Type",
      dataIndex: "sportName",
      key: "sportName",
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    {
      title: "Surface Type",
      key: "surface_type",
      render: (_, record) => {
        const surfaceType = getFacilityValue(record, "surface_type");
        return surfaceType ? (
          <Tag color="green">{surfaceType}</Tag>
        ) : (
          <span className="text-gray-400">Not specified</span>
        );
      },
    },
    {
      title: "Court Type",
      dataIndex: "courtType",
      key: "courtType",
      render: (type) => {
        let label = "Unknown";
        let color = "default";

        switch (type) {
          case 1:
            label = "Indoor";
            color = "volcano";
            break;
          case 2:
            label = "Outdoor";
            color = "geekblue";
            break;
          case 3:
            label = "Mixed";
            color = "purple";
            break;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Features",
      key: "features",
      render: (_, record) => {
        const hasLighting = hasFacility(record, "lighting");
        const hasShowers = hasFacility(record, "has_showers");
        const hasParking = hasFacility(record, "has_parking");

        return (
          <div className="flex flex-wrap gap-1">
            {hasLighting && <Tag color="gold">Lighting</Tag>}
            {hasShowers && <Tag color="cyan">Showers</Tag>}
            {hasParking && <Tag color="lime">Parking</Tag>}
            {!hasLighting && !hasShowers && !hasParking && (
              <span className="text-gray-400">None specified</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Min Deposit",
      dataIndex: "minDepositPercentage",
      key: "minDepositPercentage",
      render: (value) => (value ? `${value}%` : "Not set"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => navigate(`/court-owner/courts/${record.id}`)}
          >
            Manage
          </Button>
          <Button
            type="default"
            onClick={() => navigate(`/court-owner/courts/${record.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (!courts || courts.length === 0) {
    return (
      <Card title="Courts" className="mb-6">
        <Empty description="No courts available for this venue" />
      </Card>
    );
  }

  return (
    <Card title="Courts" className="mb-6">
      <Table
        dataSource={courts}
        rowKey="id"
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
    </Card>
  );
};

VenueCourtsList.propTypes = {
  courts: PropTypes.array,
};

export default VenueCourtsList;
