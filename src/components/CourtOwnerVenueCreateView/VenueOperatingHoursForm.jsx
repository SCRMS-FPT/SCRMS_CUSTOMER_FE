import React from "react";
import { Form, TimePicker } from "antd";
import dayjs from "dayjs";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const VenueOperatingHoursForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">⏰ Operating Hours</h2>

      <div className="grid grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <Form.Item
            key={day}
            name={["operating_hours", day]}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            getValueProps={(value) =>
              value ? { value: [dayjs(value.open, "HH:mm"), dayjs(value.close, "HH:mm")] } : {}
            }
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        ))}
      </div>
    </div>
  );
};

export default VenueOperatingHoursForm;
