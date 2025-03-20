import React from "react";
import { Form, Input } from "antd";

const VenueBasicForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">🏟 Venue Information</h2>

      {/* Venue Name */}
      <Form.Item name="name" label="Venue Name" rules={[{ required: true, message: "Please enter venue name" }]}>
        <Input placeholder="Enter venue name" />
      </Form.Item>

      {/* Address Fields (2 Columns) */}
      <div className="grid grid-cols-2 gap-4">
        <Form.Item name={["address", "street"]} label="Street">
          <Input placeholder="Enter street" />
        </Form.Item>
        <Form.Item name={["address", "city"]} label="City">
          <Input placeholder="Enter city" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Form.Item name={["address", "state"]} label="State">
          <Input placeholder="Enter state" />
        </Form.Item>
        <Form.Item name={["address", "zip_code"]} label="ZIP Code">
          <Input placeholder="Enter ZIP code" />
        </Form.Item>
        <Form.Item name={["address", "country"]} label="Country">
          <Input placeholder="Enter country" />
        </Form.Item>
      </div>

      {/* Contact Fields (2 Columns) */}
      <div className="grid grid-cols-2 gap-4">
        <Form.Item name={["contact_info", "phone"]} label="Phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item name={["contact_info", "email"]} label="Email">
          <Input placeholder="Enter email" />
        </Form.Item>
      </div>

      {/* Website */}
      <Form.Item name={["contact_info", "website"]} label="Website">
        <Input placeholder="Enter website URL" />
      </Form.Item>
    </div>
  );
};

export default VenueBasicForm;
