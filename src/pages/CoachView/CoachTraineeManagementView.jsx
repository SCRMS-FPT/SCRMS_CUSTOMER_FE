import React from "react";
import { Card, Table } from "antd";

const CoachTraineeManagementView = () => {
  const trainees = [
    { key: "1", name: "John Doe", skillLevel: "Intermediate", progress: "80%" },
    { key: "2", name: "Jane Smith", skillLevel: "Beginner", progress: "50%" },
  ];

  return (
    <Card title="Trainee Management">
      <Table
        dataSource={trainees}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Skill Level", dataIndex: "skillLevel" },
          { title: "Progress", dataIndex: "progress" },
        ]}
      />
    </Card>
  );
};

export default CoachTraineeManagementView;
