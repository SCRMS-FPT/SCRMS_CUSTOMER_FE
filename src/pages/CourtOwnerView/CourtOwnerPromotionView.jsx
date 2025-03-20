import React from "react";
import { Card, Table, Button, Tag } from "antd";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";

const promotionsData = [
  { id: "P001", title: "Spring Discount", discount: "20%", status: "Active" },
  { id: "P002", title: "Weekend Special", discount: "15%", status: "Expired" },
];

const CourtOwnerPromotionView = () => {
  const columns = [
    { title: "Promotion Title", dataIndex: "title", key: "title" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary">Edit</Button>
      ),
    },
  ];

  return (
    <CourtOwnerSidebar>
      <Card title="🎟 Promotions" extra={<Button type="primary">Add Promotion</Button>}>
        <Table dataSource={promotionsData} rowKey="id" columns={columns} />
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerPromotionView;
