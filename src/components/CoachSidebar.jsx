import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  FolderOutlined,
  TeamOutlined,
  BookOutlined,
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

const CoachSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: "/coach/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/coach/sessions", icon: <ScheduleOutlined />, label: "Training Sessions" },
    { key: "/coach/schedule", icon: <CalendarOutlined />, label: "Coaching Schedule" },
    { key: "/coach/trainees", icon: <TeamOutlined />, label: "Trainees" },
    { key: "/coach/packages", icon: <FolderOutlined />, label: "Training Packages" },
    { key: "/coach/analytics", icon: <BarChartOutlined />, label: "Analytics" },
  ];

  const bottomMenuItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Return to Homepage" },
    { key: "/settings", icon: <SettingOutlined />, label: "View Profile Settings" },
    { key: "/logout", icon: <LogoutOutlined />, label: "Sign Out" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>Coach Dashboard</h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Sidebar Menu */}
        <Menu mode="inline" selectedKeys={[location.pathname]} style={{ flex: 1, borderRight: 0 }}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>

        {/* Bottom Menu (Fixed to Bottom) */}
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu mode="inline" selectedKeys={[location.pathname]}>
            {bottomMenuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
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

export default CoachSidebar;
