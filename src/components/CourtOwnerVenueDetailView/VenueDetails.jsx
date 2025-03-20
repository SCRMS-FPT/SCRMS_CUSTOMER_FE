import React from "react";
import { Card, Tag, Tooltip } from "antd";
import { TrophyOutlined, BuildOutlined, AppstoreOutlined } from "@ant-design/icons"; // Import icons

const MAX_DISPLAY = 4;

const VenueDetails = ({ venue }) => {
  const { sports_available, amenities, courts } = venue;

  const renderLimitedTags = (items, color, max) => {
    const limitedItems = items.slice(0, max);
    const remainingItems = items.slice(max);
    return (
      <>
        {limitedItems.map((item) => (
          <Tag color={color} key={item}>{item}</Tag>
        ))}
        {remainingItems.length > 0 && (
          <Tooltip title={remainingItems.join(", ")}>
            <Tag color="gray">+{remainingItems.length}</Tag>
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <Card className="mb-4">
      <p className="flex items-center mb-2">
        <TrophyOutlined style={{ color: "blue", marginRight: 5, fontSize: "18px" }} />
        <strong className="mr-3">Sports:</strong> {renderLimitedTags(sports_available, "blue", MAX_DISPLAY)}
      </p>
      <p className="flex items-center mb-2">
        <BuildOutlined style={{ color: "green", marginRight: 5, fontSize: "18px" }} />
        <strong className="mr-3">Amenities:</strong> {renderLimitedTags(amenities, "green", MAX_DISPLAY)}
      </p>
      <p className="flex items-center mb-2">
        <AppstoreOutlined style={{ color: "purple", marginRight: 5, fontSize: "18px" }} />
        <strong className="mr-2">Courts:</strong> {courts.length}
      </p>
    </Card>
  );
};

export default VenueDetails;
