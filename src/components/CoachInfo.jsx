import React from "react";
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar } from "react-icons/fa";

const CoachInfo = ({ name, location, availableHours, fee, rating }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} className={i <= rating ? "text-yellow-500 text-2xl" : "text-gray-300 text-2xl"} />
            );
        }
        return stars;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mt-4">{name}</h2>
            <p className="text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt /> {location}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
                <FaClock /> Available: {availableHours.start} - {availableHours.end}
            </p>
            <p className="text-green-600 flex items-center gap-2">
                <FaDollarSign /> Fee: ${fee}
            </p>
            <div className="flex items-center gap-1">
                {renderStars(rating)}
                <span className="text-gray-600">({rating})</span>
            </div>
            <div className="flex justify-end mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default CoachInfo;