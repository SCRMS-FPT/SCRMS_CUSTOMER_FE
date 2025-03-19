import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/customCalendar.css"; // Custom styles for Tailwind

const CustomDatePicker = ({ selectedDate, setSelectedDate }) => {
    // Function to disable past dates
    const isTileDisabled = ({ date }) => date < new Date().setHours(0, 0, 0, 0);

    // Handle date selection (toggle select/unselect)
    const handleDateChange = (date) => {
        // **Fix: Ensure the selected date is in local timezone**
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const newDate =
            selectedDate && selectedDate.toDateString() === localDate.toDateString()
                ? null
                : localDate;

        setSelectedDate(newDate);

        // **Console Log to Check Selected Date (Fixed)**
        if (newDate) {
            console.log("📅 Date Selected:", newDate.toLocaleDateString("en-CA")); // YYYY-MM-DD format
        } else {
            console.log("❌ No Date Selected (Cleared)");
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg max-w-xs">
            <Calendar
                onChange={handleDateChange}
                value={selectedDate} // Allow deselection
                minDate={new Date()} // Prevent selecting past dates
                tileDisabled={isTileDisabled} // Disable past dates
                className="custom-calendar w-full"
                tileClassName={({ date }) => {
                    const today = new Date().setHours(0, 0, 0, 0);
                    if (date < today) {
                        return "text-gray-300 cursor-not-allowed"; // Past dates gray & unclickable
                    }
                    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                        return "bg-green-500 text-white font-semibold rounded-full"; // Selected date
                    }
                    return "hover:bg-gray-200 rounded-full"; // Hover effect
                }}
            />
        </div>
    );
};

export default CustomDatePicker;
