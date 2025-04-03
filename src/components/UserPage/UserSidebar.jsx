import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  TransactionOutlined,
  HomeOutlined,
  MessageOutlined,
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
    { key: "/user/dashboard", icon: <DashboardOutlined />, label: <Link to="/user/dashboard">Bảng điều khiển</Link> },
    { key: "/user/bookings", icon: <CalendarOutlined />, label: <Link to="/user/bookings">Đặt lịch sân</Link> },
    { key: "/user/matching", icon: <UsergroupAddOutlined />, label: <Link to="/user/matching">Tìm trận</Link> },
    { key: "/user/coachings", icon: <BookOutlined />, label: <Link to="/user/coachings">Huấn luyện viên</Link> },
    { key: "/user/feedbacks", icon: <MessageOutlined />, label: <Link to="/user/feedbacks">Phản hồi</Link> },
    { key: "/user/transactions", icon: <TransactionOutlined />, label: <Link to="/user/transactions">Thanh toán</Link> },
  ];

  const bottomMenuItems = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Quay trở lại trang chủ</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">Xem cài đặt cá nhân</Link> },
    { key: "/logout", icon: <LogoutOutlined />, label: <Link to="/logout">Đăng xuất</Link> },
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
          <h2 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>Bảng điều khiển</h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px", marginLeft: 16 }} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} />}
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
