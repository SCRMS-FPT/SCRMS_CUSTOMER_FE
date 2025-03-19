import React from "react";
import UserSidebar from "@/components/UserSidebar";
import { Card, Table, Tag, Button } from "antd";

const coachingData = [
  { key: "1", date: "2025-03-18", time: "10:00", coach: "Coach James", status: "Upcoming" },
  { key: "2", date: "2025-03-22", time: "14:00", coach: "Coach Emily", status: "Completed" },
];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Coach", dataIndex: "coach", key: "coach" },
  { title: "Status", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "Upcoming" ? "blue" : "green"}>{status}</Tag> },
  { title: "Actions", key: "actions", render: (_, record) => record.status === "Upcoming" ? <Button type="primary">Reschedule</Button> : "-" },
];

const UserCoachingManagementView = () => {
  return (
    <UserSidebar>
      <Card title="Coaching Management">
        <p>Manage your coaching sessions with professional trainers.</p>
        <p>View upcoming lessons, schedule new sessions, and track progress.</p>

        <Table dataSource={coachingData} columns={columns} />
      </Card>
    </UserSidebar>
  );
};

export default UserCoachingManagementView;
