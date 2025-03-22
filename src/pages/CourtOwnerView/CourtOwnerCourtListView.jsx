import React from "react";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import { Card, Table, Button } from "antd";
import { useNavigate } from "react-router-dom";

const CourtOwnerCourtListView = () => {
  const navigate = useNavigate();

  const courts = [
    {
      id: "1",
      name: "Champions Court",
      location: "Downtown",
      status: "Active",
    },
    {
      id: "2",
      name: "Elite Sports Arena",
      location: "Westside",
      status: "Inactive",
    },
  ];

  return (
    <CourtOwnerSidebar>
      <Card
        title="My Courts"
        extra={<Button type="primary">Add New Court</Button>}
      >
        <Table
          dataSource={courts}
          rowKey="id"
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Location", dataIndex: "location", key: "location" },
            { title: "Status", dataIndex: "status", key: "status" },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <Button onClick={() => navigate(`/owner/courts/${record.id}`)}>
                  Manage
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerCourtListView;
