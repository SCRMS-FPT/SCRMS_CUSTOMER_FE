import React from "react";
import { Card, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CoachTrainingPackageManagementView = () => {
  const trainingPackages = [
    { key: "1", name: "Beginner Package", price: "$100", sessions: "5" },
    { key: "2", name: "Advanced Coaching", price: "$250", sessions: "10" },
  ];

  return (
    <Card
      title="My Training Packages"
      extra={<Button icon={<PlusOutlined />}>Add Package</Button>}
    >
      <Table
        dataSource={trainingPackages}
        columns={[
          { title: "Package Name", dataIndex: "name" },
          { title: "Price", dataIndex: "price" },
          { title: "Sessions", dataIndex: "sessions" },
        ]}
      />
    </Card>
  );
};

export default CoachTrainingPackageManagementView;
