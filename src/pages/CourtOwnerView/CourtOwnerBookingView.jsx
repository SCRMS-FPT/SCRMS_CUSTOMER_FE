import React from "react";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";
import { Card, Table, Button, Tag } from "antd";

const CourtOwnerBookingView = () => {
  const bookings = [
    { id: "101", court: "Champions Court", date: "2025-05-01", status: "Confirmed" },
    { id: "102", court: "Elite Sports Arena", date: "2025-05-02", status: "Pending" },
  ];

  return (
    <CourtOwnerSidebar>
      <Card title="Manage Bookings">
        <Table
          dataSource={bookings}
          rowKey="id"
          columns={[
            { title: "Court", dataIndex: "court", key: "court" },
            { title: "Date", dataIndex: "date", key: "date" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status) => <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>,
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => <Button>Manage</Button>,
            },
          ]}
        />
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerBookingView;
