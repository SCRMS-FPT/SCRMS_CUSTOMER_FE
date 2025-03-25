import React from "react";
import { Card, List, Avatar, Badge, Input } from "antd";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";

const notifications = [
  {
    id: "N001",
    title: "Booking Confirmed",
    description: "Your venue has a new booking.",
  },
  {
    id: "N002",
    title: "Payment Received",
    description: "You received a payment from a user.",
  },
];

const CourtOwnerNotificationView = () => {
  return (
    <CourtOwnerSidebar>
      <div className="grid grid-cols-2 gap-4">
        {/* Notifications List */}
        <Card title="🔔 Notifications">
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge dot>
                      <Avatar shape="square" icon="🔔" />
                    </Badge>
                  }
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Chat Feature */}
        <Card title="💬 Chat Support">
          <div className="h-80 overflow-y-auto border p-4">
            <p>
              <strong>User:</strong> Hello, I have an issue with my booking.
            </p>
            <p className="text-right">
              <strong>You:</strong> Sure! What seems to be the issue?
            </p>
          </div>
          <Input placeholder="Type a message..." className="mt-2" />
        </Card>
      </div>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerNotificationView;
