import React from "react";
import { Form, TimePicker } from "antd";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const VenueOperatingHoursForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">⏰ Operating Hours</h2>

      <div className="grid grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <Form.Item key={day.toLowerCase()} label={day}>
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        ))}
      </div>
    </div>
  );
};

export default VenueOperatingHoursForm;
