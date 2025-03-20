import React from "react";
import { Card } from "antd";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, GlobalOutlined, StarFilled } from "@ant-design/icons";

const VenueOverview = ({ venue }) => {
  return (
    <Card className="mb-4">
      <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>

      <div className="ml-0">
        <p className="flex items-center mb-1">
          <EnvironmentOutlined style={{ color: "green", fontSize: "18px" }} className="mr-2" />
          <strong className="mr-1">Address:</strong> {venue.address.street}, {venue.address.city}, {venue.address.state}
        </p>

        <p className="flex items-center mb-1">
          <PhoneOutlined style={{ color: "blue", fontSize: "18px" }} className="mr-2" />
          <strong className="mr-1">Contact:</strong> {venue.contact_info.phone}
        </p>

        <p className="flex items-center mb-1">
          <MailOutlined style={{ color: "red", fontSize: "18px" }} className="mr-2" />
          <strong className="mr-1">Email:</strong> {venue.contact_info.email}
        </p>

        <p className="flex items-center mb-1">
          <GlobalOutlined style={{ color: "indigo", fontSize: "18px" }} className="mr-2" />
          <strong className="mr-1">Website:</strong>
          <a href={venue.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">
            {venue.contact_info.website}
          </a>
        </p>

        <p className="flex items-center mb-1">
          <StarFilled style={{ color: "gold", fontSize: "18px" }} className="mr-2" />
          <strong className="mr-1">Rating:</strong> {venue.rating}
        </p>
      </div>
    </Card>
  );
};

export default VenueOverview;
