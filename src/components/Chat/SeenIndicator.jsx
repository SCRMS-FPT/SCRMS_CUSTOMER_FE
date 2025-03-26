// /src/components/Chat/SeenIndicator.jsx
import React from "react";

const SeenIndicator = ({ seen }) => {
  return (
    <span className="text-xs text-gray-400">
      {seen ? "Seen" : ""}
    </span>
  );
};

export default SeenIndicator;
