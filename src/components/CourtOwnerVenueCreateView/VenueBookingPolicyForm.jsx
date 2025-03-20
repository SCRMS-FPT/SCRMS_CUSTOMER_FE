import React from "react";
import { Form, InputNumber, Switch, TimePicker } from "antd";
import dayjs from "dayjs";

const VenueBookingPolicyForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">📅 Booking Policy</h2>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Cancellation Period (Hours) */}
        <Form.Item
          name={["booking_policy", "cancellation_period"]}
          label="Cancellation Period (Hours)"
          rules={[{ required: true, message: "Please enter cancellation period in hours" }]}
          className="flex-1 min-w-[200px]"
        >
          <InputNumber min={1} placeholder="Enter hours" className="w-full" style={{ minWidth: "200px" }} />
        </Form.Item>

        {/* Advance Booking Limit (Days) */}
        <Form.Item
          name={["booking_policy", "advance_booking_limit"]}
          label="Advance Booking (Days)"
          rules={[{ required: true, message: "Please enter advance booking limit" }]}
          className="flex-1 min-w-[150px]"
        >
          <InputNumber min={1} placeholder="Max days in advance" className="w-full" style={{ minWidth: "200px" }} />
        </Form.Item>

        {/* Modification Allowed Toggle */}
        <Form.Item
          name={["booking_policy", "modification_allowed"]}
          label="Modification Allowed"
          valuePropName="checked"
          className="flex-1 min-w-[150px]"
        >
          <Switch />
        </Form.Item>
      </div>
    </div>
  );
};

export default VenueBookingPolicyForm;
