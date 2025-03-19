import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const CourtOwnerSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: "/court-owner/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/court-owner/courts", icon: <BankOutlined />, label: "My Courts" },
    { key: "/court-owner/bookings", icon: <CalendarOutlined />, label: "Manage Bookings" },
    { key: "/court-owner/schedule", icon: <ScheduleOutlined />, label: "Schedule Management" },
    { key: "/court-owner/reports", icon: <BarChartOutlined />, label: "Revenue & Reports" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} width={220} theme="light">
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>Court Owner</h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <Menu mode="inline" selectedKeys={[location.pathname]} style={{ height: "100%", borderRight: 0 }}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ marginLeft: collapsed ? 20 : 10, transition: "margin-left 0.3s ease" }}>
        <Content style={{ padding: "20px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default CourtOwnerSidebar;
