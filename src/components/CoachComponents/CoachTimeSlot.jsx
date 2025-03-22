import React, { useState } from "react";
import { FaClock } from "react-icons/fa";

const CoachTimeSlot = ({ availableHours, schedule, selectedTime, setSelectedTime }) => {
    const [selectedDate, setSelectedDate] = useState("");

    const handleTimeSelect = (date, time) => {
        setSelectedTime(`${date} ${time}`);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const filteredSchedule = selectedDate
        ? schedule.filter(slot => slot.date === selectedDate)
        : schedule;

    return (
        <div
            className="bg-gray-100 p-6 rounded-lg shadow-md"
            style={{ backgroundImage: 'url(/src/assets/HLV/ban.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Available Time Slots</h2>
            <div className="mb-6">
                <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                    style={{ fontWeight: 'bold', fontSize: '1.2rem', padding: '1rem', borderColor: '#4A90E2' }}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                {filteredSchedule.map((slot, index) => (
                    <button
                        key={index}
                        className={`flex items-center justify-center p-3 rounded ${slot.booked ? "bg-gray-300 cursor-not-allowed" : selectedTime === `${slot.date} ${slot.time}` ? "bg-yellow-500 border-2 border-black text-black" : "bg-blue-500 text-white"} transition duration-300 ease-in-out transform hover:scale-105`}
                        onClick={() => !slot.booked && handleTimeSelect(slot.date, slot.time)}
                        disabled={slot.booked}
                        style={{ fontWeight: 'bold', fontSize: '1.2rem', padding: '1rem' }}
                    >
                        <FaClock className="mr-2" />
                        <span>{slot.date} - {slot.time}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CoachTimeSlot;