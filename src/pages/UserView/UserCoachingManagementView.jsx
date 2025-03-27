import React, { useEffect } from "react";
import { Card, Tabs } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserCoachRegisteredView from "@/components/UserPage/UserCoachRegisteredView";
import UserCoachScheduleListView from "@/components/UserPage/UserCoachScheduleListView";
import UserCoachScheduleView from "@/components/UserPage/UserCoachScheduleView";

const UserCoachManagementView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the tab from the URL, default to "1" if not set
  const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (key) => {
    setSearchParams({ tab: key }); // Update URL when the tab changes
  };

  const tabItems = [
    { key: "1", label: "Registered Coaches", children: <UserCoachRegisteredView /> },
    { key: "2", label: "Schedule List", children: <UserCoachScheduleListView /> },
    { key: "3", label: "Schedule Calendar", children: <UserCoachScheduleView /> },
  ];

  useEffect(() => {
    // If URL contains an invalid tab, reset to "1"
    const validTabKeys = tabItems.map(item => item.key);
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
