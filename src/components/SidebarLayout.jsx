import React, { useState } from "react";
import { Layout, Menu, Button, Switch, notification  } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    CalendarOutlined,
    BarChartOutlined,
    BankOutlined,
    ScheduleOutlined,
    TagOutlined,
    TeamOutlined,
    BellOutlined,
    SettingOutlined,
    FileTextOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const SidebarLayout = ({ selectedTab, setSelectedTab, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const sidebarStyle = {
        background: isDarkMode ? "#111827" : "#F9FAFB",
        color: isDarkMode ? "#D1D5DB" : "#111827",
        transition: "all 0.3s ease-in-out",
    };
    const availableTabs = ["dashboard", "courts", "bookings", "reports"];
    const menuItems = [
        { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },               // 📊 Overview
        { key: "courts", icon: <BankOutlined />, label: "Manage Courts" },              // 🏟️ List of courts
        { key: "bookings", icon: <CalendarOutlined />, label: "Bookings" },             // 📅 View/manage bookings
        { key: "reports", icon: <BarChartOutlined />, label: "Revenue & Reports" },     // 📈 Earnings & trends
        { key: "availability", icon: <ScheduleOutlined />, label: "Availability" },     // 🕒 Manage court hours
        { key: "promotions", icon: <TagOutlined />, label: "Promotions & Discounts" },  // 🎟️ Manage offers
        { key: "customers", icon: <TeamOutlined />, label: "Customers" },               // 👥 View customer info
        { key: "notifications", icon: <BellOutlined />, label: "Notifications" },       // 🔔 Alerts & messages
    ];

    const bottomMenuItems = [
        { key: "settings", icon: <SettingOutlined />, label: "Settings" },            // ⚙️ Profile & business settings
        { key: "export", icon: <FileTextOutlined />, label: "Reports & Exports" },    // 📄 Financial reports
        { key: "logout", icon: <LogoutOutlined />, label: "Signout", danger: true },  // 🚪 Logout
    ];

    const handleMenuClick = (e) => {
        const key = e.key;
        if (availableTabs.includes(key)) {
            setSelectedTab(key);
        } else {
            notification.warning({
                message: "Operation Unavailable",
                description: "This feature is currently not available.",
                placement: "topRight",
            });
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={220}
                style={{
                    ...sidebarStyle,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                    height: "100vh",  // Make sidebar take full viewport height
                    position: "fixed", // Fix sidebar to the page
                    left: 0,          // Ensure it's positioned on the left
                    top: 0,           // Stick to the top
                    bottom: 0,        // Extend to the bottom
                    overflow: "hidden",
                }}
            >
                {/* Toggle Button Inside Sidebar */}
                <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: isDarkMode ? "#374151" : "#F3F4F6",
                            color: sidebarStyle.color,
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                    />
                </div>

                {/* Sidebar Menu */}
                <Menu
                    theme={isDarkMode ? "dark" : "light"}
                    mode="inline"
                    selectedKeys={[selectedTab]}
                    onClick={handleMenuClick}
                    items={menuItems}
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        background: sidebarStyle.background,
                        color: sidebarStyle.color,
                    }}
                />

                {/* Theme Toggle Switch */}
                <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Switch
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                        checkedChildren="🌙"
                        unCheckedChildren="☀️"
                    />
                </div>

                {/* Settings & Logout at the Bottom */}
                <div className="">
                    <Menu
                        theme={isDarkMode ? "dark" : "light"}
                        mode="inline"
                        items={bottomMenuItems}
                        style={{
                            background: sidebarStyle.background,
                            borderTop: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                        }}
                    />
                </div>
            </Sider>

            {/* Main Content */}
            <Layout  style={{ marginLeft: collapsed ? 80 : 220, transition: "margin-left 0.3s ease" }}>
                <Content 
                    style={{
                        padding: "20px",
                        transition: "all 0.3s ease-in-out",
                        background: isDarkMode ? "#1F2937" : "#E0E0E0",
                        color: isDarkMode ? "#D1D5DB" : "#111827",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SidebarLayout;
