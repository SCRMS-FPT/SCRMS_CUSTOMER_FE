import React from "react";

const CoachSpecialties = ({ specialties }) => (
    <div className="flex gap-2 mt-2">
        {specialties.map((specialty, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                {specialty}
            </span>
        ))}
    </div>
);

export default CoachSpecialties;