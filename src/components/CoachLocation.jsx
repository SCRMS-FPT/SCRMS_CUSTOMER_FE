import React from "react";

const CoachLocation = ({ location }) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;

    return (
        <div className="mt-4">
            <h4 className="text-md font-semibold mb-3">Location</h4>
            <iframe
                title="Coach Location"
                width="100%"
                height="250"
                className="rounded-lg border"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(location)}`}
                allowFullScreen
            ></iframe>
            <p className="mt-2 text-blue-600 underline">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    View on Google Maps
                </a>
            </p>
        </div>
    );
};

export default CoachLocation;