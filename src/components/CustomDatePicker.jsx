import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/customCalendar.css"; // Custom styles for Tailwind

const CustomDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState(null); // No default selection

    // Function to disable past dates
    const isTileDisabled = ({ date }) => date < new Date().setHours(0, 0, 0, 0);

    // Handle date selection (toggle select/unselect)
    const handleDateChange = (date) => {
        setSelectedDate((prev) => (prev && prev.toDateString() === date.toDateString() ? null : date));
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
