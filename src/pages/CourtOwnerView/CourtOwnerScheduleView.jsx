import React from "react";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";
import { Card, Calendar } from "antd";

const CourtOwnerScheduleView = () => {
  return (
    <CourtOwnerSidebar>
      <Card title="Schedule Management">
        <p>Manage court availability and scheduling here.</p>
        <Calendar fullscreen={false} />
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerScheduleView;
