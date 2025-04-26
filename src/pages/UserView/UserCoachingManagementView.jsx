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
    { key: "1", label: "Lịch sử đặt", children: <UserCoachBookingsView /> },
    {
      key: "2",
      label: "Lịch",
      children: <UserCoachCalendarView />,
    },
    {
      key: "3",
      label: "Các gói huấn luyện viên đã mua",
      children: <UserPurchasedPackagesView />,
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
    <Card title="Quản lý huấn luyện viên">
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default UserCoachManagementView;
