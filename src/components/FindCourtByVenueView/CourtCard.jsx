import React from "react";
import { Card } from "antd";

const CourtCard = ({ court }) => {
  return (
    <Card className="shadow-md">
      <div className="flex flex-col space-y-2">
        {/* Display first two images */}
        {court.images.slice(0, 2).map((image, index) => (
          <div
            key={index}
            className="h-32 bg-gray-200 flex items-center justify-center text-gray-500"
          >
            <img src={image} alt={`Court ${court.name} image ${index + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold">{court.name}</h3>
        <p><strong>Sport Type:</strong> {court.sport_type}</p>
        <p><strong>Surface Type:</strong> {court.features.surface_type}</p>
        <p><strong>Seating Capacity:</strong> {court.features.seating_capacity}</p>
        <p><strong>Indoor:</strong> {court.features.indoor ? "Yes" : "No"}</p>
        <p><strong>Lighting:</strong> {court.features.lighting ? "Yes" : "No"}</p>
        <p><strong>Parking:</strong> {court.features.has_parking ? "Yes" : "No"}</p>
        <p><strong>Showers:</strong> {court.features.has_showers ? "Yes" : "No"}</p>
      </div>
    </Card>
  );
};

export default CourtCard;
