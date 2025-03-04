import React from "react";
import WeekBookedCard from "./WeekBookedCard";
import { startOfWeek, addDays, format } from "date-fns";

const BookingModal = ({ bookedSchedules = [], court, width = "70vw", height = "70vh" }) => {
    const currentTime = new Date();
    const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

    // Generate days of the week (Mon-Sun)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startWeek, i);
        return {
            dayName: format(date, "EEE"),
            date: format(date, "d"),
            fullDate: format(date, "yyyy-MM-dd"),
            isToday: format(date, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd"),
        };
    });

    // Extract court working hours
    const { start: openHour, end: closeHour } = court.availableHours;
    const openTime = parseInt(openHour.split(":")[0], 10);
    const closeTime = parseInt(closeHour.split(":")[0], 10);

    // Get current time position
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimePosition = currentHour * 64 + (currentMinutes / 60) * 64;

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
                                <span className={`text-sm ${hour < openTime || hour >= closeTime ? "text-gray-400" : "text-gray-500"}`}>
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
                                <div
                                    key={hour}
                                    className={`h-16 border-t ${hour < openTime || hour >= closeTime ? "bg-gray-200 border-gray-200" : "border-gray-300"}`}
                                ></div>
                            ))}

                            {/* Render booked schedules for this day */}
                            {bookedSchedules
                                .filter((schedule) => schedule.date === day.fullDate)
                                .map((schedule, index) => (
                                    <WeekBookedCard
                                        key={index}
                                        startTime={schedule.timeStart}
                                        endTime={schedule.timeEnd}
                                        title="Booked"
                                    />
                                ))}
                        </div>
                    ))}
                </div>

                {/* Current Time Indicator */}
                <div className="absolute left-16 right-0 flex items-center" style={{ top: `${currentTimePosition}px` }}>
                    <div className="w-full h-[2px] bg-red-500 relative"></div>
                    <div className="absolute bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {currentHour % 12 || 12}:{currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
                        {currentHour >= 12 ? " PM" : " AM"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
