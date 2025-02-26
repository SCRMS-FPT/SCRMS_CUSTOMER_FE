import React, { useState, useEffect } from "react";
import DayBookedCard from "./DayBookedCard";

const DayView = ({ width = "70vw", height = "70vh", bookedSchedules = [] }) => {
  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // Update time every minute
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Extract hours & minutes from current time
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimePosition = currentHour * 64 + (currentMinutes / 60) * 64; // Dynamic position

  return (
    <div className="ml-10 flex flex-col" style={{ width, height }}>
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-300 text-xl font-semibold bg-white sticky top-0 z-10">
        <span className="text-gray-700">February 2025</span>
        <span className="float-right text-gray-500">Mon 24</span>
      </div>

      {/* Scrollable Time Slots */}
      <div className="relative overflow-y-auto flex-1" style={{ height: "calc(100vh - 56px)" }}>
        {Array.from({ length: 25 }).map((_, hour) => (
          <div key={hour} className="relative border-t border-gray-200 h-16 pl-14">
            <span className="absolute -top-2 left-2 text-sm text-gray-500">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </span>
          </div>
        ))}

        {/* Render Booked Slots Dynamically */}
        {bookedSchedules.map((schedule, index) => (
          <DayBookedCard
            key={index}
            startTime={schedule.startTime}
            endTime={schedule.endTime}
            title={schedule.title}
          />
        ))}

        {/* Current Time Indicator (Red Line, Auto Updates) */}
        <div className="absolute left-0 right-0 h-[1px] bg-red-500" style={{ top: `${currentTimePosition}px` }}>
          <span className="absolute -top-3 bg-red-500 text-white px-1 py-1 rounded text-xs font-semibold">
            {currentHour % 12 || 12}:{currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
            {currentHour >= 12 ? " PM" : " AM"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DayView;
