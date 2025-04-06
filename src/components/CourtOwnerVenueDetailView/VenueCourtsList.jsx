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
      title: "Tên sân",
      dataIndex: "courtName",
      key: "courtName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Môn thể thao",
      dataIndex: "sportName",
      key: "sportName",
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    {
      title: "Loại bề mặt",
      key: "surface_type",
      render: (_, record) => {
        const surfaceType = getFacilityValue(record, "surface_type");
        return surfaceType ? (
          <Tag color="green">{surfaceType}</Tag>
        ) : (
          <span className="text-gray-400">Không có thông tin</span>
        );
      },
    },
    {
      title: "Loại sân",
      dataIndex: "courtType",
      key: "courtType",
      render: (type) => {
        let label = "Không có thông tin";
        let color = "default";

        switch (type) {
          case 1:
            label = "Trong nhà";
            color = "volcano";
            break;
          case 2:
            label = "Ngoài trời";
            color = "geekblue";
            break;
          case 3:
            label = "Hỗn hợp";
            color = "purple";
            break;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Tiện ích",
      key: "features",
      render: (_, record) => {
        const hasLighting = hasFacility(record, "lighting");
        const hasShowers = hasFacility(record, "has_showers");
        const hasParking = hasFacility(record, "has_parking");

        return (
          <div className="flex flex-wrap gap-1">
            {hasLighting && <Tag color="gold">Đèn chiếu sáng</Tag>}
            {hasShowers && <Tag color="cyan">Phòng tắm</Tag>}
            {hasParking && <Tag color="lime">Bãi đỗ xe</Tag>}
            {!hasLighting && !hasShowers && !hasParking && (
              <span className="text-gray-400">Không có thông tin chi tiết</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Số tiền đặt cọc tối thiểu",
      dataIndex: "minDepositPercentage",
      key: "minDepositPercentage",
      render: (value) => (value ? `${value}%` : "Not set"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => navigate(`/court-owner/courts/${record.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            onClick={() => navigate(`/court-owner/courts/update/${record.id}`)}
          >
            Cập nhật thông tin
          </Button>
        </div>
      ),
    },
  ];

  if (!courts || courts.length === 0) {
    return (
      <Card title="Sân thể thao" className="mb-6">
        <Empty description="Trung tâm thể thao hiện tại chưa có sân nào" />
      </Card>
    );
  }

  return (
    <Card title="Sân thể thao" className="mb-6">
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
