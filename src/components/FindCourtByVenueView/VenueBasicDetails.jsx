import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import courtsData from "@/data/courtsData";

const VenueBasicDetails = ({ venue }) => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (venue) {
            setLoading(true);
            setTimeout(() => {
                const filteredCourts = courtsData.filter((court) =>
                    venue.courts.includes(court.court_id)
                );
                setCourts(filteredCourts);
                setLoading(false);
            }, 1000);
        }
    }, [venue]);

    if (!venue) return <p>Please select a venue to see details.</p>;

    return (
        <Card className="shadow-md p-4 relative flex flex-col">
            {/* Venue Information */}
            <div>
                <h2 className="text-xl font-semibold">{venue.name}</h2>
                <p><strong>Address:</strong> {venue.address.street}, {venue.address.city}</p>
                <p><strong>Contact:</strong> {venue.contact_info.phone}</p>
                <p><strong>Sports Available:</strong> {venue.sports_available.join(", ")}</p>
                <p><strong>Amenities:</strong> {venue.amenities.join(", ")}</p>
            </div>

            {/* More Details Icon */}
            <a
                href={`/venue/${venue.id}`}
                className="absolute top-4 right-4 text-gray-500 transition-all duration-300 ease-in-out transform hover:scale-125 hover:text-indigo-600"
            >
                <InfoCircleOutlined style={{ fontSize: "1.5rem" }} />
            </a>
        </Card>
    );
};

export default VenueBasicDetails;
