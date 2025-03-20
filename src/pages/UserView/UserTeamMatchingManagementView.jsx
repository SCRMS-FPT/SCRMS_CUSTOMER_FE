import React from "react";
import UserSidebar from "@/components/UserSidebar";
import { Card, Table, Button } from "antd";

const matchData = [
  { key: "1", date: "2025-03-14", time: "17:00", location: "Court A", status: "Upcoming", opponent: "Team Thunder" },
  { key: "2", date: "2025-03-20", time: "19:00", location: "Court B", status: "Looking for Opponent", opponent: "TBD" },
];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Location", dataIndex: "location", key: "location" },
  { title: "Opponent", dataIndex: "opponent", key: "opponent" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Actions", key: "actions", render: (_, record) => record.status === "Looking for Opponent" ? <Button type="primary">Join Match</Button> : "-" },
];

const UserTeamMatchingManagementView = () => {
  return (
    <UserSidebar>
      <Card title="Matching Management">
        <p>Find and connect with other players for matches.</p>
        <p>Join games or organize your own sessions with fellow athletes.</p>

        <Table dataSource={matchData} columns={columns} />
      </Card>
    </UserSidebar>
  );
};

export default UserTeamMatchingManagementView;
