import React from "react";
import { Card } from "antd";
import { DollarCircleOutlined, TagOutlined } from "@ant-design/icons";

const VenuePricingMembership = ({ pricing }) => {
  return (
    <Card className="mb-4">
      <h3 className="text-lg font-semibold mb-1">
        <DollarCircleOutlined style={{ color: "#16a34a", marginRight: 8, fontSize: 18 }} />
        Pricing
      </h3>
      {Object.entries(pricing.hourly_rate).map(([sport, price]) => (
        <p key={sport} className="flex items-center mb-1">
          <strong className="mr-2">{sport}:</strong> ${price}/hour
        </p>
      ))}
      <p className="flex items-center mb-1">
        <TagOutlined style={{ color: "#eab308", marginRight: 8, fontSize: 14 }} />
        <strong className="mr-2">Membership Discount:</strong> {pricing.membership_discount}%
      </p>
    </Card>
  );
};

export default VenuePricingMembership;
