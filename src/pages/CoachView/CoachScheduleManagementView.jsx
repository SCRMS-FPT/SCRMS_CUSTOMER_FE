import React from "react";
import { Card, Calendar } from "antd";
import CoachSidebar from "@/components/CoachSidebar";

const CoachScheduleManagementView = () => {
  return (
    <CoachSidebar>
      <Card title="Coaching Schedule"> 
        <Calendar />
      </Card>
    </CoachSidebar>
  );
};

export default CoachScheduleManagementView;
