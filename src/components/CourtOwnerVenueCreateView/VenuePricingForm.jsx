import React from "react";
import { Form, InputNumber } from "antd";

const VenuePricingForm = () => {
  const selectedSports = Form.useWatch("sports_available"); // Track selected sports

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">💰 Pricing & Membership</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {selectedSports &&
          selectedSports.map((sport) => (
            <Form.Item
              key={sport}
              name={["pricing_model", "hourly_rate", sport]}
              label={`${sport} Rate ($/hour)`}
              rules={[{ required: true, message: `Enter rate for ${sport}` }]}
              getValueProps={(value) => ({ value: value || undefined })}
            >
              <InputNumber min={0} placeholder="Enter price" style={{ minWidth: "120px" }} />
            </Form.Item>
          ))}
      </div>

      <div className="mt-4">
        <Form.Item
          name={["pricing_model", "membership_discount"]}
          label="Membership Discount (%)"
          getValueProps={(value) => ({ value: value || undefined })}
        >
          <InputNumber min={0} max={100} placeholder="Enter discount" style={{ minWidth: "120px" }} />
        </Form.Item>
      </div>
    </div>
  );
};

export default VenuePricingForm;
