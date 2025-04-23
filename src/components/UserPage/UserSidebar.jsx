import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Tooltip, Divider, Badge } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  BookOutlined,
  MessageOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  WalletOutlined,
  BellOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";

const { Sider, Content } = Layout;

const UserSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/user/dashboard",
      icon: <Icon icon="clarity:dashboard-solid" className="text-lg" />,
      label: "Bảng điều khiển",
    },
    {
      key: "/user/bookings",
      icon: <Icon icon="mdi:calendar-check" className="text-lg" />,
      label: "Đặt sân",
    },
    {
      key: "/user/coachings",
      icon: <Icon icon="ic:round-sports" className="text-lg" />,
      label: "Huấn luyện viên",
    },
    {
      key: "/user/feedbacks",
      icon: <Icon icon="material-symbols:rate-review" className="text-lg" />,
      label: "Đánh giá",
    },
    {
      key: "/user/subscriptions",
      icon: <Icon icon="mdi:package-variant-closed" className="text-lg" />,
      label: "Gói dịch vụ",
    },
    {
      key: "/wallet",
      icon: <Icon icon="mdi:wallet" className="text-lg" />,
      label: "Ví của tôi",
      children: [
        {
          key: "/wallet/deposit",
          icon: <Icon icon="mdi:cash-plus" />,
          label: "Nạp tiền",
        },
        {
          key: "/wallet/withdraw",
          icon: <Icon icon="mdi:cash-minus" />,
          label: "Rút tiền",
        },
        {
          key: "/wallet/withdrawals",
          icon: <Icon icon="mdi:history" />,
          label: "Lịch sử rút tiền",
        },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      key: "/home",
      icon: <Icon icon="ic:round-home" className="text-lg" />,
      label: "Trang chủ",
    },
    {
      key: "/profile",
      icon: <Icon icon="ic:round-account-circle" className="text-lg" />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "/change-password",
      icon: <Icon icon="mdi:lock-reset" className="text-lg" />,
      label: "Đổi mật khẩu",
    },
  ];

  const userFullName = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : "Người dùng";
  const userInitials = userProfile
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
    : "U";
  const userRoles = userProfile?.roles || [];
  const userAvatar =
    userProfile?.imageUrls?.length > 0 ? userProfile.imageUrls[0] : null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        theme="light"
        className="shadow-md transition-all duration-300 ease-in-out"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          overflow: "hidden",
          borderRight: "1px solid rgba(0, 0, 0, 0.06)",
          background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
          zIndex: 1000,
        }}
      >
        <div
          className="flex items-center p-4 border-b border-gray-100"
          style={{
            height: "72px",
          }}
        >
          {collapsed ? (
            <div className="w-full flex justify-center">
              <Avatar
                size={40}
                src={userAvatar}
                className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-110"
                style={{
                  fontWeight: "bold",
                  border: "2px solid white",
                }}
              >
                {userInitials}
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center w-full">
              <Avatar
                size={45}
                src={userAvatar}
                className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                style={{
                  fontWeight: "bold",
                  border: "2px solid white",
                }}
              >
                {userInitials}
              </Avatar>
              <div className="ml-3 overflow-hidden">
                <div className="font-semibold text-base truncate text-gray-800">
                  {userFullName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {userProfile?.email}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu-container flex flex-col h-full justify-between pt-2">
          <div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={collapsed ? [] : ["/wallet"]}
              style={{
                border: "none",
                backgroundColor: "transparent",
              }}
              className="sidebar-menu"
              onClick={({ key }) => {
                navigate(key);
              }}
              items={menuItems}
            />
          </div>

          {/* Bottom Menu */}
          <div>
            <Divider style={{ margin: "12px 0" }} />

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{
                border: "none",
                backgroundColor: "transparent",
              }}
              className="sidebar-menu"
              onClick={({ key }) => {
                if (key === "/logout") {
                  handleLogout();
                } else {
                  navigate(key);
                }
              }}
              items={[
                ...bottomMenuItems,
                {
                  key: "/logout",
                  danger: true,
                  icon: (
                    <Icon
                      icon="ic:baseline-logout"
                      className="text-lg text-red-500"
                    />
                  ),
                  label: "Đăng xuất",
                },
              ]}
            />
          </div>
        </div>

        {/* Collapse Button */}
        <Button
          type="text"
          className="collapse-btn absolute bottom-5 right-4 shadow-md hover:shadow-lg transition-all duration-200"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </Sider>

      {/* Main Content Area */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: "margin-left 0.3s ease",
          background: "#f5f7fa",
        }}
      >
        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-10"
        >
          <div className="flex items-center">
            <div className="text-lg font-semibold text-gray-800">
              {location.pathname === "/user/dashboard" && "Dashboard"}
              {location.pathname === "/user/bookings" && "Quản lý đặt sân"}
              {location.pathname === "/user/coachings" && "Huấn luyện viên"}
              {location.pathname === "/user/feedbacks" && "Đánh giá của tôi"}
              {location.pathname === "/user/subscriptions" &&
                "Gói dịch vụ đã đăng ký"}
              {location.pathname.startsWith("/user/feedbacks/") &&
                "Chi tiết đánh giá"}
              {location.pathname.startsWith("/user/bookings/") &&
                "Chi tiết đặt sân"}
              {location.pathname.startsWith("/user/coachings/") &&
                "Chi tiết lịch huấn luyện"}
              {location.pathname.startsWith("/wallet/") && "Quản lý ví"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Thông báo">
              <Badge count={3} size="small">
                <Button
                  icon={<BellOutlined />}
                  shape="circle"
                  className="flex items-center justify-center hover:bg-gray-100"
                />
              </Badge>
            </Tooltip>

            <Tooltip title="Tin nhắn">
              <Badge count={2} size="small">
                <Button
                  icon={<MessageOutlined />}
                  shape="circle"
                  className="flex items-center justify-center hover:bg-gray-100"
                  onClick={() => navigate("/messenger")}
                />
              </Badge>
            </Tooltip>

            {userProfile && (
              <div className="hidden md:flex items-center ml-2">
                <Tooltip title="Xem hồ sơ">
                  <div
                    className="cursor-pointer flex items-center gap-2 py-1 px-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => navigate("/profile")}
                  >
                    <Avatar src={userAvatar} size={32} className="bg-blue-500">
                      {userInitials}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">
                      {userProfile.firstName}
                    </span>
                    <ArrowRightOutlined className="text-xs text-gray-400" />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </motion.div>

        {/* Page Content */}
        <Content
          className="p-6"
          style={{
            minHeight: "calc(100vh - 56px)",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Custom CSS for menu animations and styling */}
      <style jsx>{`
        .sidebar-menu .ant-menu-item {
          border-radius: 6px;
          margin: 4px 8px !important;
          padding-left: 12px !important;
        }

        .sidebar-menu .ant-menu-submenu .ant-menu-item {
          margin-left: 20px !important;
          margin-right: 20px !important;
          padding-left: 12px !important;
        }

        .sidebar-menu .ant-menu-item::after {
          display: none;
        }

        .sidebar-menu .ant-menu-item:hover {
          color: #1890ff;
          background-color: rgba(24, 144, 255, 0.1);
        }

        .sidebar-menu .ant-menu-item-selected {
          background: linear-gradient(
            90deg,
            rgba(24, 144, 255, 0.2) 0%,
            rgba(24, 144, 255, 0.05) 100%
          );
          border-left: 3px solid #1890ff;
          font-weight: 500;
        }

        .sidebar-menu .ant-menu-item-selected::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #1890ff;
          display: none;
        }

        .ant-menu-inline-collapsed .ant-menu-item-icon,
        .ant-menu-inline-collapsed .anticon {
          font-size: 18px !important;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default UserSidebar;
