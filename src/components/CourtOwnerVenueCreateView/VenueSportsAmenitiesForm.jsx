import React from "react";
import { Form, Select } from "antd";

const sportsOptions = ["Tennis", "Basketball", "Badminton", "Soccer", "Volleyball"];
const amenitiesOptions = ["Parking", "Locker Rooms", "Showers", "Cafeteria", "Wi-Fi"];

const VenueSportsAmenitiesForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">🏆 Sports & Amenities</h2>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="sports_available" label="Sports Available">
          <Select mode="multiple" placeholder="Select sports">
            {sportsOptions.map((sport) => (
              <Select.Option key={sport} value={sport}>
                {sport}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="amenities" label="Amenities">
          <Select mode="multiple" placeholder="Select amenities">
            {amenitiesOptions.map((amenity) => (
              <Select.Option key={amenity} value={amenity}>
                {amenity}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default VenueSportsAmenitiesForm;
