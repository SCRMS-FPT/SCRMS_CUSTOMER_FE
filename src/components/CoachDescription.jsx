import React from "react";

const CoachDescription = ({ description }) => (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">{description || "No description available for this coach."}</p>
    </div>
);

export default CoachDescription;