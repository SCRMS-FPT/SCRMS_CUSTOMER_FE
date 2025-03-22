import React, { useState, useEffect, useRef } from "react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    subMonths,
    addMonths,
    format,
    isSameDay,
    isSameMonth,
} from "date-fns";
import MonthDayCard from "./MonthDayCard";
import ScheduleModal from "./ScheduleModal";

const MonthView = ({ schedules = [], width = "70vw", height = "70vh" }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [months, setMonths] = useState([new Date()]); // Only track relevant months
    const [selectedDate, setSelectedDate] = useState(null);
    const containerRef = useRef(null);

    // Handle scroll-based infinite month loading
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

            if (scrollTop === 0) {
                // Load previous month at the top
                setMonths((prev) => [subMonths(prev[0], 1), ...prev]);
            }

            if (scrollTop + clientHeight >= scrollHeight - 20) {
                // Load next month at the bottom
                setMonths((prev) => [...prev, addMonths(prev[prev.length - 1], 1)]);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    // 🔥 Fix: Reset months when clicking Next/Previous
    const handleMonthChange = (direction) => {
        const newMonth = direction === "next" ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
        setMonths([newMonth]); // Reset to only show the new month
    };

    return (
        <div
            className="relative border border-gray-300 rounded-lg shadow-lg overflow-auto"
            style={{ width, height }}
            ref={containerRef}
        >
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
                <button onClick={() => handleMonthChange("prev")} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    ← Previous
                </button>
                <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
                <button onClick={() => handleMonthChange("next")} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    Next →
                </button>
            </div>

            {/* Month Grid */}
            {months.map((monthDate, index) => (
                <MonthGrid
                    key={index}
                    monthDate={monthDate}
                    schedules={schedules}
                    currentMonth={currentMonth}
                    setSelectedDate={setSelectedDate}
                />
            ))}

            {/* Schedule Details Modal */}
            {selectedDate && (
                <ScheduleModal
                    date={selectedDate}
                    schedules={schedules.filter(s => s.date === format(selectedDate, "yyyy-MM-dd"))}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

// 🔥 Month Grid Component
const MonthGrid = ({ monthDate, schedules, currentMonth, setSelectedDate }) => {
    const startMonth = startOfMonth(monthDate);
    const endMonth = endOfMonth(monthDate);
    const startWeek = startOfWeek(startMonth, { weekStartsOn: 0 });
    const endWeek = endOfWeek(endMonth, { weekStartsOn: 0 });

    const today = new Date();

    const days = [];
    for (let day = startWeek; day <= endWeek; day = addDays(day, 1)) {
        days.push(day);
    }

    return (
        <div className="mb-10 transition-opacity duration-300">
            {/* Days of the Week */}
            <div className="grid grid-cols-7 bg-gray-200 text-gray-700 font-medium">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center py-2">{day}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const daySchedules = schedules.filter(schedule => schedule.date === format(day, "yyyy-MM-dd"));
                    const isToday = isSameDay(day, today);
                    return (
                        <div
                            key={index}
                            className={`relative p-2 h-20 border transition-all duration-200 hover:bg-gray-100 cursor-pointer 
                                ${isSameMonth(day, currentMonth) ? "bg-white border-gray-300" : "bg-gray-100 text-gray-400"} 
                                ${isSameDay(day, new Date()) ? "bg-blue-100 border-blue-500" : ""}
                                ${isToday ? "font-bold border-red-600" : ""} `}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className="absolute top-1 left-2 text-sm font-semibold">{format(day, "d")}</span>

                            {/* Schedule Card */}
                            {daySchedules.length > 0 && <MonthDayCard count={daySchedules.length} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
