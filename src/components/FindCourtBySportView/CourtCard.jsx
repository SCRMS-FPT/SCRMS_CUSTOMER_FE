import React from "react";

const CourtCard = ({ court }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
      <img
        alt={court.name}
        className="w-1/3 h-full object-cover"
        src={court.images?.[0] || "https://placehold.co/200x200"}
      />
      <div className="p-6 w-2/3">
        <h2 className="text-2xl font-bold text-indigo-600">{court.name}</h2>
        <p className="text-gray-700 mt-2">Location: {court.venue?.name}</p>
        <p className="text-gray-700 mt-1">Sport: {court.sport_type}</p>
        <p className="text-gray-700 mt-1">Availability: {court.weekly_availability?.monday?.[0]?.start || "N/A"} - {court.weekly_availability?.monday?.[0]?.end || "N/A"}</p>
      </div>
    </div>
  );
};

export default CourtCard;
