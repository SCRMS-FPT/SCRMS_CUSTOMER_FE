import React from "react";
import CourtCard from "./CourtCard";

const CourtList = ({ courts, animationClass }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ${animationClass}`}>
      {courts.length > 0 ? (
        courts.map((court) => <CourtCard key={court.court_id} court={court} />)
      ) : (
        <p className="text-gray-600 text-center col-span-full">No courts available.</p>
      )}
    </div>
  );
};

export default CourtList;
