import React from "react";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import { Card } from "antd";

const CourtOwnerDashboardView = () => {
  return (
    <CourtOwnerSidebar>
      <Card title="Court Owner Dashboard">
        <p>Welcome to your court management dashboard.</p>
        <p>
          Here you can manage bookings, view reports, and update court
          schedules.
        </p>
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerDashboardView;
