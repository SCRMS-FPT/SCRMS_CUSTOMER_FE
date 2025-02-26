import React from "react";

const WeekBookedCard = ({ startTime, endTime, title }) => {
  // Convert time into precise positioning
  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 64 + (minutes / 60) * 64;
  };

  const startPos = parseTime(startTime);
  const endPos = parseTime(endTime);
  const duration = Math.max(endPos - startPos, 48); // Ensure min height for readability

  return (
    <div
      className="absolute left-1 right-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-md shadow-md flex flex-col justify-center"
      style={{
        top: `${startPos}px`,
        height: `${duration}px`,
        borderLeft: "4px solid #60A5FA", // Blue left border
        borderBottom: "1px solid #FFFFFF", 
        borderTop: "1px solid #FFFFFF",
      }}
    >
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-xs text-gray-600">
        {startTime} - {endTime}
      </span>
    </div>
  );
};

export default WeekBookedCard;
