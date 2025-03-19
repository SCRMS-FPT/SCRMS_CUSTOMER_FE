import React from "react";
import { Card, Table } from "antd";
import CoachSidebar from "@/components/CoachSidebar";

const CoachTraineeManagementView = () => {
  const trainees = [
    { key: "1", name: "John Doe", skillLevel: "Intermediate", progress: "80%" },
    { key: "2", name: "Jane Smith", skillLevel: "Beginner", progress: "50%" },
  ];

  return (
    <CoachSidebar>
      <Card title="Trainee Management">
        <Table dataSource={trainees} columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Skill Level", dataIndex: "skillLevel" },
          { title: "Progress", dataIndex: "progress" },
        ]} />
      </Card>
    </CoachSidebar>
  );
};

export default CoachTraineeManagementView;
