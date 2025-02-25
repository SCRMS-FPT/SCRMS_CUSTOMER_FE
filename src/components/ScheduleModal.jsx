import React from "react";

const ScheduleModal = ({ date, schedules, onClose }) => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex justify-center items-center animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Schedules for {date.toDateString()}</h2>
                {schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded mb-2">
                            <p className="text-sm font-semibold">{schedule.title}</p>
                            <p className="text-xs text-gray-600">{schedule.time}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No schedules for this day.</p>
                )}
                <button className="mt-4 bg-red-500 text-white py-1 px-4 rounded" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ScheduleModal;
