import React, { useEffect } from "react";
import { Card, Tabs } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserPurchasedPackagesView from "@/components/UserPage/UserPurchasedPackagesView";
import UserCoachBookingsView from "@/components/UserPage/UserCoachBookingsView";
import UserCoachCalendarView from "@/components/UserPage/UserCoachCalendarView";

const UserCoachManagementView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the tab from the URL, default to "1" if not set
  const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (key) => {
    setSearchParams({ tab: key }); // Update URL when the tab changes
  };

  const tabItems = [
    {
      key: "1",
      label: "Purchased Packages",
      children: <UserPurchasedPackagesView />,
    },
    { key: "2", label: "Booking History", children: <UserCoachBookingsView /> },
    {
      key: "3",
      label: "Schedule Calendar",
      children: <UserCoachCalendarView />,
    },
  ];

  useEffect(() => {
    // If URL contains an invalid tab, reset to "1"
    const validTabKeys = tabItems.map((item) => item.key);
    if (!validTabKeys.includes(activeTab)) {
      navigate("/user/coaches?tab=1", { replace: true });
    }
  }, [activeTab, navigate]);

  return (
    <Card title="Coach Management">
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default UserCoachManagementView;
