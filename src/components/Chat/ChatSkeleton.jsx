// /src/components/Chat/ChatSkeleton.jsx
import React from "react";
import { Skeleton } from "antd";

const ChatSkeleton = () => {
  return (
    <div className="p-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 mb-3">
          <Skeleton.Avatar active size="large" />
          <Skeleton.Input active style={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;
