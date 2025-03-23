import React, { useEffect } from "react";
import { Card, Tabs } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserRegisteredMatchesView from "@/components/UserPage/UserRegisteredMatchesView";
import UserMatchRequestsView from "@/components/UserPage/UserMatchRequestsView";
import UserMatchScheduleView from "@/components/UserPage/UserMatchScheduleView";

const UserTeamMatchingManagementView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the tab from the URL, default to "1" if not set
  const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (key) => {
    setSearchParams({ tab: key }); // Update URL when the tab changes
  };

  const tabItems = [
    { key: "1", label: "Registered Matches", children: <UserRegisteredMatchesView /> },
    { key: "2", label: "Match Requests", children: <UserMatchRequestsView /> },
    { key: "3", label: "Match Schedule", children: <UserMatchScheduleView /> },
  ];

  useEffect(() => {
    // If URL contains an invalid tab, reset to "1"
    const validTabKeys = tabItems.map(item => item.key);
    if (!validTabKeys.includes(activeTab)) {
      navigate("/user/matching?tab=1", { replace: true });
    }
  }, [activeTab, navigate]);

  return (
    <Card title="Matching Management">
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default UserTeamMatchingManagementView;
