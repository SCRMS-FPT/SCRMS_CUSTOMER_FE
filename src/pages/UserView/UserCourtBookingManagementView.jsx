import React from "react";
import UserSidebar from "@/components/UserSidebar";
import { Card, Table, Tag, Button } from "antd";

const bookingsData = [
  { key: "1", date: "2025-03-10", time: "18:00", court: "Court A", status: "Confirmed" },
  { key: "2", date: "2025-03-12", time: "20:00", court: "Court B", status: "Pending" },
  { key: "3", date: "2025-03-15", time: "16:00", court: "Court C", status: "Cancelled" },
];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Court", dataIndex: "court", key: "court" },
  { title: "Status", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "Confirmed" ? "green" : status === "Pending" ? "orange" : "red"}>{status}</Tag> },
  { title: "Actions", key: "actions", render: () => <Button type="link">Cancel Booking</Button> },
];

const UserCourtBookingManagementView = () => {
  return (
    <UserSidebar>
      <Card title="Booking Management">
        <p>View and manage all your court bookings.</p>
        <p>Track upcoming reservations and make changes as needed.</p>

        <Table dataSource={bookingsData} columns={columns} />
      </Card>
    </UserSidebar>
  );
};

export default UserCourtBookingManagementView;
