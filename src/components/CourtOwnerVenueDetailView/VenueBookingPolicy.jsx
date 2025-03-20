import React from "react";
import { Card } from "antd";
import { CalendarOutlined, StopOutlined, SyncOutlined, ClockCircleOutlined } from "@ant-design/icons";

const VenueBookingPolicy = ({ policy }) => {
  return (
    <Card className="mb-4">
      <h3 className="text-lg font-semibold mb-1">
        <CalendarOutlined style={{ color: "#2563eb", marginRight: 8, fontSize: 18 }} />
        Booking Policy
      </h3>
      <p className="flex items-center mb-1">
        <StopOutlined style={{ color: "#dc2626", marginRight: 12, fontSize: 14 }} />
        <strong className="mr-2">Cancellation:</strong>
        {policy.cancellation_period} {policy.cancellation_period === 1 ? "hour" : "hours"} before booking
      </p>
      <p className="flex items-center mb-1">
        <SyncOutlined style={{ color: "#16a34a", marginRight: 12, fontSize: 14 }} />
        <strong className="mr-2">Modification Allowed:</strong> {policy.modification_allowed ? "Yes" : "No"}
      </p>
      <p className="flex items-center">
        <ClockCircleOutlined style={{ color: "#eab308", marginRight: 12, fontSize: 14 }} />
        <strong className="mr-2">Advance Booking Limit:</strong>
        {policy.advance_booking_limit} {policy.advance_booking_limit === 1 ? "day" : "days"}
      </p>
    </Card>
  );
};

export default VenueBookingPolicy;
