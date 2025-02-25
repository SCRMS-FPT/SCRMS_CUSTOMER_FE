import React from "react";

const DayBookedCard = ({ startTime, endTime, title }) => {
  // Convert time to precise position (1 hour = 64px, 1 min ≈ 1.07px)
  const startSplit = startTime.split(":").map(Number);
  const endSplit = endTime.split(":").map(Number);

  const startHour = startSplit[0];
  const startMinutes = startSplit[1];
  const endHour = endSplit[0];
  const endMinutes = endSplit[1];

  const startPosition = startHour * 64 + (startMinutes / 60) * 64;
  const endPosition = endHour * 64 + (endMinutes / 60) * 64;
  let duration = endPosition - startPosition;

  // Set a minimum height to ensure text visibility
  const minHeight = 30;
  const adjustedHeight = duration < minHeight ? minHeight : duration;

  return (
    <div
      className="absolute left-14 right-4 bg-blue-100 text-blue-600 px-4 py-1 rounded-md shadow-md flex items-center"
      style={{
        top: `${startPosition}px`, // Position based on time
        height: `${adjustedHeight}px`, // Ensure minimum height
        display: "flex",
        alignItems: duration < minHeight ? "center" : "flex-start", // Center text if too short
        justifyContent: "center", // Center horizontally
      }}
    >
      <div className="text-xs font-semibold text-center">
        {title}
        <br />
        <span className="text-gray-500">{startTime} - {endTime}</span>
      </div>
    </div>
  );
};

export default DayBookedCard;
