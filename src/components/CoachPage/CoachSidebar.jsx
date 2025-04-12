import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  FolderOutlined,
  TeamOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ProfileOutlined,
  InboxOutlined,
  FormOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import { Iconify } from "../iconify";
import { CommentOutlined } from "@mui/icons-material";
const { Sider, Content } = Layout;
const _notifications = [
  {
    id: 1,
    message: "New message received",
    type: "info",
    title: "Message",
    isUnRead: true,
    description: "You have received a new message",
    avatarUrl: "path/to/avatar1.png",
    postedAt: new Date().toISOString(), // Convert Date to string
  },
  {
    id: 2,
    message: "Server maintenance at midnight",
    type: "alert",
    title: "Maintenance",
    isUnRead: false,
    description: "Scheduled server maintenance at midnight",
    avatarUrl: "path/to/avatar2.png",
    postedAt: new Date().toISOString(), // Convert Date to string
  },
];
const CoachSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: "/coach/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/coach/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: "/coach-profile",
      icon: <ProfileOutlined />,
      label: <Link to="/coach-profile">Thông tin</Link>,
    },
    {
      key: "/coach-schedules",
      icon: <ScheduleOutlined />,
      label: <Link to="/coach-schedules">Lịch</Link>,
    },
    {
      key: "/coach-packages",
      icon: <InboxOutlined />,
      label: <Link to="/coach-packages">Gói huấn luyện</Link>,
    },
    {
      key: "/coach-bookings",
      icon: <FormOutlined />,
      label: <Link to="/coach-bookings">Lịch huấn luyện</Link>,
    },
    {
      key: "/coach-promotions",
      icon: <PercentageOutlined />,
      label: <Link to="/coach-promotions">Ưu đãi</Link>,
    },
    {
      key: "/coach-reviews",
      icon: <CommentOutlined />,
      label: <Link to="/coach-reviews">Đánh giá</Link>,
    },
  ];

  const bottomMenuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: <Link to="/home">Trở về trang chủ</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Cài đặt cá nhân</Link>,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: <Link to="/logout">Đăng xuất</Link>,
    },
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
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>
            Huấn luyện viên
          </h2>
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{ fontSize: "20px", marginLeft: 16 }}
                />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "20px" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Sidebar Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, borderRight: 0 }}
          items={menuItems}
        />

        {/* Bottom Menu (Fixed to Bottom) */}
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={bottomMenuItems}
          />
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
          <main className="mt-4">{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CoachSidebar;
