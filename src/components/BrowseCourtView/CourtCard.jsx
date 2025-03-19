import React from "react";
import { useNavigate } from "react-router-dom";
import sportsData from "@/data/sportsData"; // Import sports data for icons

const CourtCard = ({ court }) => {
    const navigate = useNavigate();

    // Function to get the corresponding sport icon
    const getSportIcon = (sportName) => {
        const sport = sportsData.find((s) => s.name === sportName);
        return sport ? sport.icon : null;
    };

    // Format date for better readability (e.g., "Feb 20, 2024")
    const today = new Date().toISOString().split("T")[0];
    const formatDateRange = (dateRange) => {
        if (!dateRange || !dateRange.start || !dateRange.end) return "Not Available";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return `${new Date(dateRange.start).toLocaleDateString("en-US", options)} - ${new Date(dateRange.end).toLocaleDateString("en-US", options)}`;
    };

    // Determine if the court is unavailable
    const isUnavailable =
    !court.dateRange || court.status === "unavailable" ||
    court.dateRange.start > today || court.dateRange.end < today;

    const handleClick = () => {
        navigate(`/court/${court.id}`);
    }

    return (
        <div className={`bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 flex transition-all hover:shadow-lg ${isUnavailable ? "opacity-50" : ""}`} onClick={handleClick}>
            {/* Court Image */}
            <img src={court.image} alt={court.name} className="w-1/3 h-48 object-cover" />

            {/* Court Details */}
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{court.name}</h2>
                    <p className="text-gray-500">{court.city}</p>
                    <p className="text-gray-600">{court.address}</p>
                    <p className="text-gray-700">
                        ⏰ {court.availableHours.start} - {court.availableHours.end}
                    </p>

                    {/* Show "Unavailable" message if court is unavailable */}
                    {isUnavailable ? (
                        <p className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded-md w-max">🚫 Unavailable</p>
                    ) : (
                        <p className="text-blue-600 font-medium">📅 {formatDateRange(court.dateRange)}</p>
                    )}
                </div>

                {/* Show booking details only if the court is available */}
                {!isUnavailable && (
                    <>
                        {/* Price & Rating */}
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-green-600 font-bold">Price {court.pricePerHour} $</span>
                            <span className="text-orange-500">⭐ {court.rating}</span>
                        </div>

                        {/* Available Durations */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {court.durations.map((duration, index) => (
                                <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
                                    {duration} mins
                                </span>
                            ))}
                        </div>

                        {/* Sports Tags with Icons */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {court.sport.map((sport, index) => {
                                const icon = getSportIcon(sport);
                                return (
                                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                        {icon && <img src={icon} alt={sport} className="w-4 h-4" />} {sport}
                                    </span>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourtCard;
