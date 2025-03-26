import React, { useState } from "react";
import { FaCog, FaBell, FaIdCard } from "react-icons/fa";
import UserProfileSettingsView from "@/components/UserPage/UserProfileSettingsView";
import UserProfileNotificationView from "@/components/UserPage/UserProfileNotificationView";
import UserProfileMembershipView from "@/components/UserPage/UserProfileMembershipView";

const UserProfileView = () => {
  // "settings" | "notifications" | "membership"
  const [activeTab, setActiveTab] = useState("settings");

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <UserProfileSettingsView />;
      case "notifications":
        return <UserProfileNotificationView />;
      case "membership":
        return <UserProfileMembershipView />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Custom Tab Navigation */}
      <div className="flex justify-center border-b mb-6">
        <button
          className={`w-40 px-4 py-2 mr-4 flex items-center justify-center transition-colors rounded ${
            activeTab === "settings"
              ? "border-b-2 border-blue-500 font-bold text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog className="mr-2" /> Settings
        </button>
        <button
          className={`w-40 px-4 py-2 mr-4 flex items-center justify-center transition-colors rounded ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-500 font-bold text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <FaBell className="mr-2" /> Notifications
        </button>
        <button
          className={`w-40 px-4 py-2 flex items-center justify-center transition-colors rounded ${
            activeTab === "membership"
              ? "border-b-2 border-blue-500 font-bold text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("membership")}
        >
          <FaIdCard className="mr-2" /> Membership
        </button>
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default UserProfileView;
