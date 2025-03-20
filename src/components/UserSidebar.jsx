import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  TransactionOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const UserSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: "/user/dashboard", icon: <DashboardOutlined />, label: <Link to="/user/dashboard">User Dashboard</Link> },
    { key: "/user/bookings", icon: <CalendarOutlined />, label: <Link to="/user/bookings">Court Booking</Link> },
    { key: "/user/matching", icon: <UsergroupAddOutlined />, label: <Link to="/user/matching">Team Matching</Link> },
    { key: "/user/coachings", icon: <BookOutlined />, label: <Link to="/user/coachings">Coaching</Link> },
    { key: "/user/transactions", icon: <TransactionOutlined />, label: <Link to="/user/transactions">Transactions</Link> },
  ];

  const bottomMenuItems = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Return to Homepage</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">View Profile Settings</Link> },
    { key: "/logout", icon: <LogoutOutlined />, label: <Link to="/logout">Sign Out</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        theme="light"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          overflow: "hidden",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>User Dashboard</h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Sidebar Menu */}
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

export default UserSidebar;
