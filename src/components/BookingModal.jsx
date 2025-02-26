import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns"; // Helps format dates dynamically

const BookingModal = ({ isOpen, onClose, slots = {}, onBook }) => {
    if (!isOpen) return null;

    // Generate next 7 days dynamically
    const [days, setDays] = useState([]);

    useEffect(() => {
        const today = new Date();
        const upcomingDays = Array.from({ length: 7 }, (_, i) => ({
            date: format(addDays(today, i), "dd"), // Gets the date (e.g., 22)
            day: format(addDays(today, i), "EEE"), // Gets the day (e.g., Thu)
        }));
        setDays(upcomingDays);
    }, []);

    const timeSlots = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "3 PM", "4 PM"];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Background Overlay */}
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-4xl">
                            <h2 className="text-xl font-semibold mb-4 text-center">Select an Available Slot</h2>

                            {/* Booking Table */}
                            <div className="w-full border rounded-lg overflow-hidden">
                                {/* Table Headers */}
                                <div className="grid grid-cols-8 bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-3">
                                    <div className="text-left">Date</div>
                                    {timeSlots.map((time, index) => (
                                        <div key={index} className="text-center">{time}</div>
                                    ))}
                                </div>

                                {/* Table Rows */}
                                {days.map(({ date, day }, rowIndex) => (
                                    <div key={rowIndex} className="grid grid-cols-8 border-t border-gray-300 items-center text-center">
                                        {/* Date Column */}
                                        <div className="bg-orange-500 text-white py-2 px-3 font-semibold">
                                            {day} {date}
                                        </div>

                                        {/* Time Slots */}
                                        {timeSlots.map((time, colIndex) => {
                                            const slotKey = `${day}-${time}`;
                                            const isBooked = slots[slotKey];

                                            return (
                                                <div key={colIndex} className="py-2 px-1">
                                                    {isBooked ? (
                                                        <span className="text-gray-400 text-xs">Booked</span>
                                                    ) : (
                                                        <button
                                                            className="bg-green-500 text-white text-xs px-2 py-1 rounded-md hover:bg-green-700 transition"
                                                            onClick={() => onBook(slotKey)}
                                                        >
                                                            £50 Book
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Close Button */}
                            <div className="text-center mt-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
