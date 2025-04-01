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
import { HeaderSection } from "../core/header-section";
import Alert from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import { Iconify } from "../iconify";
import { NotificationsPopover } from "./notifications-popover";
import { AccountPopover } from "./account-popover";
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
      label: <Link to="/coach/dashboard">Dashboard</Link>,
    },
    {
      key: "/coach/sessions",
      icon: <ScheduleOutlined />,
      label: <Link to="/coach/sessions">Training Sessions</Link>,
    },
    {
      key: "/coach/schedule",
      icon: <CalendarOutlined />,
      label: <Link to="/coach/schedule">Coaching Schedule</Link>,
    },
    {
      key: "/coach/trainees",
      icon: <TeamOutlined />,
      label: <Link to="/coach/trainees">Trainees</Link>,
    },
    {
      key: "/coach/analytics",
      icon: <BarChartOutlined />,
      label: <Link to="/coach/analytics">Analytics</Link>,
    },
    {
      key: "/coach-profile",
      icon: <ProfileOutlined />,
      label: <Link to="/coach-profile">Coach Profile</Link>,
    },
    {
      key: "/coach-schedules",
      icon: <ScheduleOutlined />,
      label: <Link to="/coach-schedules">Coach Schedules</Link>,
    },
    {
      key: "/coach-packages",
      icon: <InboxOutlined />,
      label: <Link to="/coach-packages">Coach Packages</Link>,
    },
    {
      key: "/coach-bookings",
      icon: <FormOutlined />,
      label: <Link to="/coach-bookings">Coach Bookings</Link>,
    },
    {
      key: "/coach-promotions",
      icon: <PercentageOutlined />,
      label: <Link to="/coach-promotions">Coach Promotions</Link>,
    },
  ];

  const bottomMenuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: <Link to="/home">Return to Homepage</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">View Profile Settings</Link>,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: <Link to="/logout">Sign Out</Link>,
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
            Coach Dashboard
          </h2>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px", marginLeft: 16 }} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} />}
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
          <HeaderSection
            layoutQuery={"md"}
            slotProps={{ container: { maxWidth: false } }}
            slots={{
              topArea: (
                <Alert
                  severity="info"
                  sx={{ display: "none", borderRadius: 0 }}
                >
                  This is an info Alert.
                </Alert>
              ),
              leftArea: (
                <img
                  src="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%201024%201024'%20class='icon'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M309.2%20584.776h105.5l-49%20153.2H225.8c-7.3%200-13.3-6-13.3-13.3%200-2.6%200.8-5.1%202.2-7.3l83.4-126.7c2.5-3.6%206.7-5.9%2011.1-5.9z'%20fill='%23FFFFFF'%20/%3e%3cpath%20d='M404.5%20791.276H225.8c-36.7%200-66.5-29.8-66.5-66.5%200-13%203.8-25.7%2011-36.6l83.4-126.7c12.3-18.7%2033.1-29.9%2055.5-29.9h178.4l-83.1%20259.7z%20m-95.3-206.5c-4.5%200-8.6%202.2-11.1%206l-83.4%20126.7c-1.4%202.2-2.2%204.7-2.2%207.3%200%207.3%206%2013.3%2013.3%2013.3h139.9l49-153.2H309.2z'%20fill='%23333333'%20/%3e%3cpath%20d='M454.6%20584.776h109.6l25.3%20153.3H429.3z'%20fill='%23FFFFFF'%20/%3e%3cpath%20d='M652.2%20791.276H366.6l42.8-259.6h200l42.8%20259.6z%20m-222.9-53.2h160.2l-25.3-153.3H454.6l-25.3%20153.3z'%20fill='%23333333'%20/%3e%3cpath%20d='M618.6%20584.776h105.5c4.5%200%208.6%202.2%2011.1%206l83.5%20126.7c4%206.1%202.3%2014.4-3.8%2018.4-2.2%201.4-4.7%202.2-7.3%202.2H667.7l-49.1-153.3z'%20fill='%23FFFFFF'%20/%3e%3cpath%20d='M807.6%20791.276H628.9l-83.1-259.7h178.4c22.4%200%2043.2%2011.2%2055.5%2029.9l83.4%20126.7c9.8%2014.8%2013.2%2032.6%209.6%2050s-13.7%2032.3-28.6%2042.1c-10.8%207.2-23.5%2011-36.5%2011z%20m-139.9-53.2h139.9c2.6%200%205.1-0.8%207.3-2.2%204-2.6%205.3-6.4%205.7-8.4%200.4-2%200.7-6-1.9-10l-83.4-126.6c-2.5-3.8-6.6-6-11.1-6H618.6l49.1%20153.2z'%20fill='%23333333'%20/%3e%3cpath%20d='M534.1%20639.7C652.5%20537.4%20711.7%20445.8%20711.7%20365c0-127-102.7-212.1-195-212.1s-195%2085.1-195%20212.1c0%2080.8%2059.2%20172.3%20177.7%20274.7%209.9%208.6%2024.7%208.6%2034.7%200z'%20fill='%238CAAFF'%20/%3e%3cpath%20d='M516.7%20672.7c-12.5%200-24.9-4.3-34.8-12.9C356.2%20551.2%20295.1%20454.7%20295.1%20365c0-142.8%20114.6-238.7%20221.6-238.7S738.3%20222.2%20738.3%20365c0%2089.7-61.1%20186.2-186.9%20294.8-9.8%208.6-22.3%2012.9-34.7%2012.9z%20m0-493.2c-79.7%200-168.4%2076.2-168.4%20185.5%200%2072.3%2056.7%20158%20168.4%20254.6C628.5%20523%20685.1%20437.3%20685.1%20365c0-109.3-88.7-185.5-168.4-185.5z'%20fill='%23333333'%20/%3e%3cpath%20d='M516.7%20348m-97.5%200a97.5%2097.5%200%201%200%20195%200%2097.5%2097.5%200%201%200-195%200Z'%20fill='%23FFFFFF'%20/%3e%3cpath%20d='M516.7%20472.1c-68.4%200-124.1-55.7-124.1-124.1s55.7-124.1%20124.1-124.1S640.8%20279.5%20640.8%20348%20585.1%20472.1%20516.7%20472.1z%20m0-195.1c-39.1%200-70.9%2031.8-70.9%2070.9%200%2039.1%2031.8%2070.9%2070.9%2070.9s70.9-31.8%2070.9-70.9c0-39.1-31.8-70.9-70.9-70.9z'%20fill='%23333333'%20/%3e%3c/svg%3e"
                  alt="Courtsite"
                  className="h-8 mr-2"
                />
              ),
              rightArea: (
                <Box gap={1} display="flex" alignItems="center">
                  <NotificationsPopover data={_notifications} />
                  <AccountPopover
                    data={[
                      {
                        label: "Home",
                        href: "/",
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:home-angle-bold-duotone"
                          />
                        ),
                      },
                      {
                        label: "Profile",
                        href: "#",
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:shield-keyhole-bold-duotone"
                          />
                        ),
                      },
                      {
                        label: "Settings",
                        href: "#",
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:settings-bold-duotone"
                          />
                        ),
                      },
                    ]}
                  />
                </Box>
              ),
            }}
          />
          <main className="mt-4">{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CoachSidebar;
