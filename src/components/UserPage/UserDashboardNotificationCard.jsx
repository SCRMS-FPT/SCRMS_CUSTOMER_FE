import React from "react";
import { List, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";

const UserDashboardNotificationCard = ({ id, title, description, time }) => {
  return (
    <List.Item key={id}>
      <List.Item.Meta 
        avatar={<Avatar icon={<BellOutlined />} />} 
        title={<span>{title} <small className="text-gray-500">({time})</small></span>} 
        description={description} 
      />
    </List.Item>
  );
};

export default UserDashboardNotificationCard;
