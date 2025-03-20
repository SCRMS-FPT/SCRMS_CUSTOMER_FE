import React, { useState, useEffect } from "react";
import VenueSearchSelect from "@/components/FindCourtByVenueView/VenueSearchSelect";
import VenueBasicDetails from "@/components/FindCourtByVenueView/VenueBasicDetails";
import CourtList from "@/components/FindCourtByVenueView/CourtList";
import venuesData from "@/data/venue_mock_data";
import courtsData from "@/data/court_mock_data";

const FindCourtByVenueView = () => {
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [filteredCourts, setFilteredCourts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedVenue) {
            setLoading(true);

            setTimeout(() => {
                const venueCourts = courtsData.filter((court) =>
                    selectedVenue.courts.includes(court.court_id)
                );
                setFilteredCourts(venueCourts);
                setLoading(false);
            }, 100);
        } else {
            setFilteredCourts([]);
        }
    }, [selectedVenue]);

    return (
        <div className="container mx-auto p-6">
            <header className="mt-8 mb-16">
                <h1 className="text-4xl font-bold text-center text-indigo-600">
                    Find Courts by Venue
                </h1>
            </header>

            {/* Venue selection dropdown */}
            <div className="mb-4">
                <VenueSearchSelect
                    venues={venuesData}
                    onSelect={setSelectedVenue}
                />
            </div>
            {/* Show venue details if a venue is selected */}
            {selectedVenue && (
                <>
                    <VenueBasicDetails venue={selectedVenue} />
                    <CourtList courts={filteredCourts} loading={loading} />
                </>
            )}
        </div>
    );
};

export default FindCourtByVenueView;