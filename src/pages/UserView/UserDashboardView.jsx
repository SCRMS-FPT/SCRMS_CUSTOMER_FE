import React from "react";
import UserSidebar from "@/components/UserSidebar";
import { Card, Row, Col, Statistic, Table } from "antd";
import { CalendarOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";

const upcomingBookings = [
  { key: "1", date: "2025-03-10", time: "18:00", court: "Court A", status: "Confirmed" },
  { key: "2", date: "2025-03-12", time: "20:00", court: "Court B", status: "Pending" },
];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Court", dataIndex: "court", key: "court" },
  { title: "Status", dataIndex: "status", key: "status" },
];

const UserDashboardView = () => {
  return (
    <UserSidebar>
      <Card title="User Dashboard">
        <p>Welcome to your personal dashboard.</p>
        <p>Manage your bookings, find matches, and track coaching sessions here.</p>

        <Row gutter={16} className="mt-4">
          <Col span={8}>
            <Card>
              <Statistic title="Upcoming Bookings" value={2} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Team Matches Played" value={5} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Coaching Sessions Completed" value={3} prefix={<TrophyOutlined />} />
            </Card>
          </Col>
        </Row>

        <Card title="Upcoming Bookings" className="mt-4">
          <Table dataSource={upcomingBookings} columns={columns} pagination={false} />
        </Card>
      </Card>
    </UserSidebar>
  );
};

export default UserDashboardView;
