import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Typography,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  BankOutlined,
  CalendarOutlined,
  GoldOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  HomeOutlined,
  CommentOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { alpha } from "@mui/material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { logout } from "@/store/userSlice";

const { Sider, Content } = Layout;
const { Text } = Typography;

const CourtOwnerSidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.user.userProfile);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Mock data for notification count - replace with real data
  useEffect(() => {
    // This would be replaced with a real API call
    setNotificationCount(5);
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      items: [
        {
          key: "/court-owner/dashboard",
          icon: <DashboardOutlined />,
          label: "Bảng điều khiển",
          onClick: () => navigate("/court-owner/dashboard"),
        },
      ],
    },
    {
      key: "management",
      label: "Quản lý",
      items: [
        {
          key: "/court-owner/venues",
          icon: <GoldOutlined />,
          label: "Trung tâm thể thao",
          onClick: () => navigate("/court-owner/venues"),
        },
        {
          key: "/court-owner/courts",
          icon: <BankOutlined />,
          label: "Sân",
          onClick: () => navigate("/court-owner/courts"),
        },
        {
          key: "/court-owner/bookings",
          icon: <CalendarOutlined />,
          label: "Lịch đặt sân",
          onClick: () => navigate("/court-owner/bookings"),
        },
      ],
    },
    {
      key: "communication",
      label: "Giao tiếp",
      items: [
        {
          key: "/court-owner/notifications",
          icon: (
            <Badge count={notificationCount} size="small" offset={[4, 0]}>
              <BellOutlined />
            </Badge>
          ),
          label: "Thông báo",
          onClick: () => navigate("/court-owner/notifications"),
        },
      ],
    },
    {
      key: "analytics",
      label: "Số liệu",
      items: [
        {
          key: "/court-owner/reports",
          icon: <BarChartOutlined />,
          label: "Báo cáo & Số liệu",
          onClick: () => navigate("/court-owner/reports"),
        },
      ],
    },
  ];

  // Get all possible paths to determine the active section
  const allPaths = menuItems.flatMap(
    (section) => section.items?.map((item) => item.key) || []
  );

  // Determine which section should be highlighted
  const activeSection = menuItems.find((section) =>
    section.items?.some((item) => location.pathname.startsWith(item.key))
  )?.key;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          overflow: "auto",
          background: `linear-gradient(180deg, ${theme.palette.background.paper
            } 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: "0 0 20px rgba(0,0,0,0.06)",
          zIndex: 1000,
        }}
        className="custom-scrollbar"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center py-6 px-4"
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mb-2"
            style={{
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            {collapsed ? (
              <BankOutlined style={{ fontSize: 24, color: "white" }} />
            ) : (
              <div className="text-white font-bold text-lg tracking-wide">
                SCMRS
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="text-xs uppercase tracking-wider mt-1 mb-2 opacity-80">
              Court Management System
            </div>
          )}
        </motion.div>

        {/* User Profile Section */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-4 mb-6 p-3 rounded-xl flex items-center"
            style={{
              background: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Avatar
              src={user?.avatar}
              icon={<UserOutlined />}
              size={40}
              style={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              }}
            />
            <div className="ml-3 overflow-hidden">
              <div className="font-medium truncate">
                {user?.name || "Court Owner"}
              </div>
              <div className="text-xs opacity-70 truncate">
                {user?.email || "owner@example.com"}
              </div>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <div className="flex justify-center my-4">
            <Avatar
              src={user?.avatar}
              icon={<UserOutlined />}
              size={36}
              style={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              }}
            />
          </div>
        )}

        {/* Toggle Button */}
        <Button
          type="text"
          className="absolute top-3 right-3 z-10"
          icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px", marginLeft: 16 }} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: theme.palette.primary.main,
            background: alpha(theme.palette.primary.main, 0.08),
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          }}
        />

        {/* Menu Sections */}
        <div className="px-2 flex-grow overflow-auto custom-scrollbar">
          {menuItems.map((section) => (
            <div key={section.key} className="mb-4">
              {!collapsed && section.label && (
                <Typography.Text
                  className="px-4 text-xs uppercase tracking-wider opacity-60 font-medium"
                  style={{ color: theme.palette.text.secondary }}
                >
                  {section.label}
                </Typography.Text>
              )}
              <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                className="border-0 custom-menu"
                style={{
                  background: "transparent",
                }}
                items={section.items.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: collapsed ? (
                    <Tooltip title={item.label} placement="right">
                      <span>{item.label}</span>
                    </Tooltip>
                  ) : (
                    item.label
                  ),
                  onClick: item.onClick,
                  className: location.pathname.startsWith(item.key)
                    ? "menu-item-active"
                    : "",
                }))}
              />
              {!collapsed &&
                section.key !== menuItems[menuItems.length - 1].key && (
                  <div
                    className="mx-4 my-2 opacity-20"
                    style={{
                      height: 1,
                      background: theme.palette.divider,
                    }}
                  />
                )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div
          className="mt-auto px-2 pb-4 pt-2"
          style={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
            background: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <Menu
            mode="inline"
            className="border-0 custom-menu"
            style={{
              background: "transparent",
            }}
            items={[
              {
                key: "/home",
                icon: <HomeOutlined />,
                label: collapsed ? (
                  <Tooltip title="Return to Homepage" placement="right">
                    <span>Homepage</span>
                  </Tooltip>
                ) : (
                  "Trở về trang chủ"
                ),
                onClick: () => navigate("/home"),
              },
              {
                key: "/settings",
                icon: <SettingOutlined />,
                label: collapsed ? (
                  <Tooltip title="Settings" placement="right">
                    <span>Settings</span>
                  </Tooltip>
                ) : (
                  "Cài đặt"
                ),
                onClick: () => navigate("/settings"),
              },
              {
                key: "/logout",
                icon: <LogoutOutlined />,
                label: collapsed ? (
                  <Tooltip title="Sign Out" placement="right">
                    <span>Sign Out</span>
                  </Tooltip>
                ) : (
                  "Đăng xuất"
                ),
                onClick: () => {
                  handleLogout();
                },
                style: { color: theme.palette.error.main },
              },
            ]}
          />
        </div>
      </Sider>

      {/* Content Area */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "margin-left 0.3s ease",
          position: "relative",
          background: theme.palette.background.default,
        }}
      >
        <Content
          style={{
            padding: "24px",
            overflowY: "auto",
            minHeight: "100vh",
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Add this CSS for custom styling */}
      <style>
        {`
        .custom-menu .ant-menu-item {
          margin: 4px 8px;
          padding: 10px 16px !important;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .custom-menu .ant-menu-item:hover {
          background: ${alpha(theme.palette.primary.main, 0.08)} !important;
          color: ${theme.palette.primary.main} !important;
        }

        .custom-menu .ant-menu-item-selected {
          background: ${alpha(theme.palette.primary.main, 0.15)} !important;
          color: ${theme.palette.primary.main} !important;
          font-weight: 500;
        }

        .custom-menu .ant-menu-item::after {
          display: none !important;
        }

        .custom-menu .ant-menu-item .anticon {
          vertical-align: middle;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${alpha(theme.palette.divider, 0.3)};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${alpha(theme.palette.divider, 0.5)};
        }
      `}
      </style>
    </Layout>
  );
};
CourtOwnerSidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CourtOwnerSidebar;
