import React from "react";
import { Table, Tag, Typography } from "antd";

const { Title } = Typography;

const AvailabilityTab = ({ schedule }) => {
  // Define table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span className="font-medium">{date}</span>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => <span className="font-medium">{time}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.booked ? (
          <Tag color="red">Booked</Tag>
        ) : (
          <Tag color="green">Available</Tag>
        ),
    },
  ];

  return (
    <div>
      <Title level={4} className="mb-4">Available Time Slots</Title>
      {schedule && schedule.length > 0 ? (
        <Table
          dataSource={schedule}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
          bordered
          size="middle"
        />
      ) : (
        <p className="text-gray-500">No available time slots.</p>
      )}
    </div>
  );
};

export default AvailabilityTab;
