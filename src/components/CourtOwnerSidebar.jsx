import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  BankOutlined,
  CalendarOutlined,
  GoldOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const CourtOwnerSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: "/court-owner/dashboard", icon: <DashboardOutlined />, label: <Link to="/court-owner/dashboard">Dashboard</Link> },
    { key: "/court-owner/venues", icon: <GoldOutlined />, label: <Link to="/court-owner/venues">My Venues</Link> },
    { key: "/court-owner/courts", icon: <BankOutlined />, label: <Link to="/court-owner/courts">My Courts</Link> },
    { key: "/court-owner/bookings", icon: <CalendarOutlined />, label: <Link to="/court-owner/bookings">Manage Bookings</Link> },
    { key: "/court-owner/schedule", icon: <ScheduleOutlined />, label: <Link to="/court-owner/schedule">Schedule Management</Link> },
    { key: "/court-owner/reports", icon: <BarChartOutlined />, label: <Link to="/court-owner/reports">Revenue & Reports</Link> },
  ];

  const bottomMenuItems = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Return to Homepage</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">View Profile Settings</Link> },
    { key: "/logout", icon: <LogoutOutlined />, label: <Link to="/logout">Sign Out</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} width={220} theme="light" style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        overflow: "hidden",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}>
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>Court Owner</h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <Menu mode="inline" selectedKeys={[location.pathname]} style={{ height: "100%", borderRight: 0 }} items={menuItems} />

        {/* Bottom Menu (Fixed to Bottom) */}
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu mode="inline" selectedKeys={[location.pathname]} items={bottomMenuItems} />
        </div>
      </Sider>

      {/* Scrollable Content Area */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 220,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Content
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "100vh",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourtOwnerSidebar;
