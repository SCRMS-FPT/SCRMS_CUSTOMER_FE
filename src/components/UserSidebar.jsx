import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
    DashboardOutlined, 
    CalendarOutlined, 
    UsergroupAddOutlined, 
    TeamOutlined, 
    BookOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const UserSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: "/user/dashboard", icon: <DashboardOutlined />, label: "User Dashboard" },
    { key: "/user/bookings", icon: <CalendarOutlined />, label: "Court Booking" },
    { key: "/user/matching", icon: <UsergroupAddOutlined />, label: "Team Matching" },
    { key: "/user/coachings", icon: <BookOutlined />, label: "Coaching" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} width={220} theme="light">
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>User Dashboard</h2>
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

export default UserSidebar;
