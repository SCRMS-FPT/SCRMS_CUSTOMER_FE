import React, { useState, useEffect } from "react";
import WeekBookedCard from "./WeekBookedCard";
import { startOfWeek, addDays, format } from "date-fns";

const WeekView = ({ bookedSchedules = [], width = "70vw", height = "70vh" }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date()); // Update time every minute
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Get the start of the week (Monday)
    const startWeek = startOfWeek(currentTime, { weekStartsOn: 1 });

    // Generate days of the week (Mon-Sun)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startWeek, i);
        return {
            dayName: format(date, "EEE"), // Mon, Tue, ...
            date: format(date, "d"), // 24, 25, ...
            fullDate: format(date, "yyyy-MM-dd"), // 2025-02-24
            isToday: format(date, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd"),
        };
    });

    // Extract current hour and minute for red time indicator
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimePosition = currentHour * 64 + (currentMinutes / 60) * 64; // Position in pixels

    return (
        <div className="relative border border-gray-300 rounded-lg shadow-lg overflow-hidden pt-6 pb-16" style={{ width, height }}>
            {/* Fixed Week Header */}
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-300 text-center text-gray-700 font-semibold z-10">
                <div className="grid grid-cols-8 p-4">
                    <div className="text-left pl-2">📅 All-day</div>
                    {weekDays.map((day) => (
                        <div key={day.fullDate} className="flex flex-col items-center">
                            <span>{day.dayName}</span>
                            <span className={`px-2 py-1 rounded-full ${day.isToday ? "bg-red-500 text-white" : "text-gray-600"}`}>
                                {day.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-auto mt-16 h-full relative">
                <div className="grid grid-cols-8 relative">
                    {/* Time Labels (Fixed Left Column) */}
                    <div className="w-16 flex flex-col bg-white z-10 border-r border-gray-300">
                        {Array.from({ length: 24 }).map((_, hour) => (
                            <div key={hour} className="relative h-16 flex items-start pl-2">
                                <span className="text-sm text-gray-500">
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
                    </div>

                    {/* Week Days Columns */}
                    {weekDays.map((day) => (
                        <div key={day.fullDate} className="flex-1 relative border-l border-gray-200">
                            {Array.from({ length: 24 }).map((_, hour) => (
                                <div key={hour} className="h-16 border-t border-gray-300"></div>
                            ))}

                            {/* Render booked schedules for this day */}
                            {bookedSchedules
                                .filter((schedule) => schedule.date === day.fullDate)
                                .map((schedule, index) => (
                                    <WeekBookedCard key={index} {...schedule} />
                                ))}
                        </div>
                    ))}
                </div>

                {/* Current Time Indicator */}
                <div
                    className="absolute left-16 right-0 flex items-center"
                    style={{ top: `${currentTimePosition}px` }}
                >
                    {/* Red Line */}
                    <div className="w-full h-[2px] bg-red-500 relative"></div>

                    {/* Time Label */}
                    <div className="absolute bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {currentHour % 12 || 12}:{currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
                        {currentHour >= 12 ? " PM" : " AM"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekView;
