import DayView from "../components/GeneralComponents/DayView";
import MonthView from "../components/GeneralComponents/MonthView";
import WeekView from "../components/GeneralComponents/WeekView";
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

const CourtCalendar = () => {
  const bookedSchedules = [
    {
      title: "Team Standup",
      date: "2025-02-25",
      startTime: "09:10",
      endTime: "09:30",
    },
    {
      title: "Project Review",
      date: "2025-02-25",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      title: "Lunch Break",
      date: "2025-02-25",
      startTime: "12:30",
      endTime: "13:30",
    },
    {
      title: "Client Presentation",
      date: "2025-02-25",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      title: "Meeting",
      date: "2025-02-25",
      startTime: "15:00",
      endTime: "16:00",
    },
    {
      title: "Training Session",
      date: "2025-02-25",
      startTime: "16:30",
      endTime: "18:00",
    },
    {
      title: "Dinner with Investors",
      date: "2025-02-25",
      startTime: "19:00",
      endTime: "20:30",
    },

    {
      title: "Daily Standup",
      date: "2025-02-26",
      startTime: "09:00",
      endTime: "09:30",
    },
    {
      title: "Code Review",
      date: "2025-02-26",
      startTime: "10:30",
      endTime: "11:30",
    },
    {
      title: "Lunch Break",
      date: "2025-02-26",
      startTime: "12:30",
      endTime: "13:30",
    },
    {
      title: "Client Call",
      date: "2025-02-26",
      startTime: "14:30",
      endTime: "15:30",
    },
    {
      title: "Strategy Meeting",
      date: "2025-02-26",
      startTime: "16:00",
      endTime: "17:30",
    },

    {
      title: "Morning Exercise",
      date: "2025-02-27",
      startTime: "07:00",
      endTime: "07:45",
    },
    {
      title: "Scrum Meeting",
      date: "2025-02-27",
      startTime: "09:00",
      endTime: "09:30",
    },
    {
      title: "Product Demo",
      date: "2025-02-27",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      title: "Lunch Break",
      date: "2025-02-27",
      startTime: "12:30",
      endTime: "13:30",
    },
    {
      title: "User Feedback Session",
      date: "2025-02-27",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      title: "Team Bonding",
      date: "2025-02-27",
      startTime: "17:30",
      endTime: "19:00",
    },
  ];

  const [selectedView, setSelectedView] = useState("month"); // Default to Month View
  const [currentDate, setCurrentDate] = useState(new Date()); // Track selected date
  const [componentSize, setComponentSize] = useState({
    width: "70vw",
    height: "70vh",
  });

  // Generate Mini Calendar (Current Month)
  const startMonth = startOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth, { weekStartsOn: 0 });

  const miniCalendarDays = Array.from({ length: 42 }, (_, i) =>
    addDays(startWeek, i)
  ); // 6 weeks grid

  return (
    <div className="flex w-full h-screen p-4">
      {/* Left Sidebar - Mini Calendar */}
      <div className="w-1/4 bg-white border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold text-center">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        {/* Mini Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mt-4 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-semibold text-gray-700">
              {day}
            </div>
          ))}

          {miniCalendarDays.map((day, index) => (
            <button
              key={index}
              className={`p-2 rounded-md text-sm 
                                ${
                                  isSameDay(day, currentDate)
                                    ? "bg-red-500 text-white font-bold"
                                    : "text-gray-600"
                                } 
                                ${
                                  format(day, "MM") !==
                                  format(currentDate, "MM")
                                    ? "opacity-50"
                                    : ""
                                }`}
              onClick={() => setCurrentDate(day)}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>

        {/* View Selector */}
        <div className="mt-6">
          <label className="text-lg font-semibold">View Mode:</label>
          <select
            className="w-full mt-2 px-4 py-2 border rounded-md text-gray-700 shadow-md"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="day">Day View</option>
            <option value="week">Week View</option>
            <option value="month">Month View</option>
          </select>
        </div>
      </div>

      {/* Right Section - Calendar Views */}
      <div className="w-3/4 p-4">
        {selectedView === "day" && (
          <DayView
            date={currentDate}
            bookedSchedules={bookedSchedules}
            {...componentSize}
          />
        )}
        {selectedView === "week" && (
          <WeekView
            date={currentDate}
            bookedSchedules={bookedSchedules}
            {...componentSize}
          />
        )}
        {selectedView === "month" && (
          <MonthView
            date={currentDate}
            schedules={bookedSchedules}
            {...componentSize}
          />
        )}
      </div>
    </div>
  );
};

export default CourtCalendar;
