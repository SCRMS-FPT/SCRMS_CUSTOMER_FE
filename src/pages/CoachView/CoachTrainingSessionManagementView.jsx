import React from "react";
import { Card, Table, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import CoachSidebar from "@/components/CoachSidebar";

const CoachTrainingSessionManagementView = () => {
  const sessions = [
    { key: "1", trainee: "John Doe", sessionType: "Speed Drills", date: "March 15" },
    { key: "2", trainee: "Jane Smith", sessionType: "Endurance Training", date: "March 17" },
  ];

  return (
    <CoachSidebar>
      <Card title="Training Sessions" extra={<Button icon={<CalendarOutlined />}>Schedule New</Button>}>
        <Table dataSource={sessions} columns={[
          { title: "Trainee", dataIndex: "trainee" },
          { title: "Session Type", dataIndex: "sessionType" },
          { title: "Date", dataIndex: "date" },
        ]} />
      </Card>
    </CoachSidebar>
  );
};

export default CoachTrainingSessionManagementView;
