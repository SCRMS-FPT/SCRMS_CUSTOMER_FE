import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaDollarSign, FaFutbol, FaBasketballBall, FaSwimmer, FaTableTennis, FaVolleyballBall, FaRunning, FaDumbbell, FaGolfBall } from "react-icons/fa";

const CoachCard = ({ coach }) => {
    const sportIcon = (sport) => {
        switch (sport) {
            case "Football":
                return <FaFutbol className="text-gray-600" />;
            case "Basketball":
                return <FaBasketballBall className="text-gray-600" />;
            case "Swimming":
                return <FaSwimmer className="text-gray-600" />;
            case "Tennis":
                return <FaTableTennis className="text-gray-600" />;
            case "Volleyball":
                return <FaVolleyballBall className="text-gray-600" />;
            case "Running":
                return <FaRunning className="text-gray-600" />;
            case "Gym":
                return <FaDumbbell className="text-gray-600" />;
            case "Golf":
                return <FaGolfBall className="text-gray-600" />;
            // Add more cases for other sports
            default:
                return null;
        }
    };

    return (
        <Link to={`/coach/${coach.id}`} className="block border rounded-lg overflow-hidden shadow-lg mb-4 flex hover:bg-gray-100 transition duration-200">
            <img src={coach.image} alt={coach.name} className="w-60 h-50 object-cover m-4" />
            <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold mb-2">{coach.name}</h3>
                <div className="flex items-center mb-2">
                    {sportIcon(coach.sport)}
                    <p className="ml-2 text-gray-600">{coach.sport}</p>
                </div>
                <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-gray-600" />
                    <p className="ml-2 text-gray-600">{coach.location}</p>
                </div>
                <div className="flex items-center mb-2">
                    <FaDollarSign className="text-gray-600" />
                    <p className="ml-2 text-gray-600">${coach.fee} per hour</p>
                </div>
                <p className="text-gray-600">{coach.description}</p>
            </div>
        </Link>
    );
};

export default CoachCard;