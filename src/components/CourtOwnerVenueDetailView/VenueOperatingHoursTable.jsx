import React from "react";
import { Table, Card } from "antd";

const VenueOperatingHoursTable = ({ operatingHours }) => {
  const columns = [
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "Opening Time", dataIndex: "open", key: "open" },
    { title: "Closing Time", dataIndex: "close", key: "close" },
  ];

  const data = Object.entries(operatingHours).map(([day, hours]) => ({
    key: day,
    day: day.charAt(0).toUpperCase() + day.slice(1),
    open: hours.open,
    close: hours.close,
  }));

  return (
    <Card title="Opening Hours" className="mb-6">
      <Table columns={columns} dataSource={data} pagination={false} />
    </Card>
  );
};

export default VenueOperatingHoursTable;
