import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import CourtStatistics from "../components/CourtStatistics";
// import Bookings from "../components/Bookings";
import ManageCourts from "../components/ManageCourts";
// import Promotions from "../components/Promotions";
// import Notifications from "../components/Notifications";
// import Reports from "../components/Reports";
import { Layout } from "antd";

const { Content } = Layout; 

const CourtReport = () => {
    const [selectedTab, setSelectedTab] = useState("dashboard"); // Default to Dashboard

    // Function to render the correct content based on selected tab
    const renderContent = () => {
        switch (selectedTab) {
            case "dashboard":
                return <CourtStatistics />;
                case "courts":
                    return <ManageCourts />;
                case "bookings":
                    return <h1 className="text-xl font-semibold">Bookings (Coming Soon)</h1>;
                case "availability":
                    return <h1 className="text-xl font-semibold">Availability Management</h1>;
                case "promotions":
                    return <h1 className="text-xl font-semibold">Promotions & Discounts</h1>;
                case "customers":
                    return <h1 className="text-xl font-semibold">Customer List & Insights</h1>;
                case "notifications":
                    return <h1 className="text-xl font-semibold">Notifications</h1>;
                case "reports":
                    return <h1 className="text-xl font-semibold">Reports & Exports</h1>;
                case "settings":
                    return <h1 className="text-xl font-semibold">Settings</h1>;
            default:
                return <CourtStatistics />;
        }
    };

    return (
        <SidebarLayout selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
            <Content style={{ padding: "20px" }}>
                {renderContent()}
            </Content>
        </SidebarLayout>
    );
};

export default CourtReport;
