import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SportSelection from "@/components/FindCourtBySportView/SportSelection";
import CourtList from "@/components/FindCourtBySportView/CourtList";
import LoadingIndicator from "@/components/FindCourtBySportView/LoadingIndicator";
import Pagination from "@/components/FindCourtBySportView/Pagination";
import "@/styles/animations.css";

const ITEMS_PER_PAGE = 6; // Set items per page
const VALID_SPORTS = ["All Sports", "Soccer", "Tennis", "Hockey", "Basketball", "Volleyball", "Badminton"];

const formatSportType = (sport) => {
    if (!sport) return "All Sports"; // Default
    return sport
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const FindCourtBySportView = ({ data }) => {
    const { sportType } = useParams(); // Get sport from URL
    const navigate = useNavigate();
    const formattedSport = formatSportType(decodeURIComponent(sportType)); // Decode URL param
    const initialSport = VALID_SPORTS.includes(formattedSport) ? formattedSport : "All Sports"; // Validate sport

    const [selectedSport, setSelectedSport] = useState(initialSport);
    const [filteredCourts, setFilteredCourts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [animationClass, setAnimationClass] = useState("slide-in");

    useEffect(() => {
        setLoading(true);
        setAnimationClass("slide-out");
        setTimeout(() => {
            const courts = selectedSport === "All Sports"
                ? data
                : data.filter(court => court.sport_type === selectedSport);

            setFilteredCourts(courts);
            setCurrentPage(1); // Reset to first page when changing sport
            setLoading(false);
            setAnimationClass("slide-in");
        }, 100);
    }, [selectedSport, data]);

    // Update the URL when the sport is selected
    const handleSportChange = (newSport) => {
        setSelectedSport(newSport);
        const sportURL = newSport === "All Sports" ? "/courts/sport" : `/courts/sport/${encodeURIComponent(newSport)}`;
        navigate(sportURL, { replace: true }); // Update URL without reloading
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredCourts.length / ITEMS_PER_PAGE);
    const paginatedCourts = filteredCourts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container mx-auto p-4">
            <header className="mt-8 mb-16">
                <h1 className="text-4xl font-bold text-center text-indigo-600">
                    Find Your Sport Court
                </h1>
            </header>

            {/* Sidebar - Sport Selection */}
            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 md:col-span-4">
                    <SportSelection selectedSport={selectedSport} setSelectedSport={handleSportChange} />
                </div>

                {/* Courts List Section */}
                <div className="col-span-12 md:col-span-8">
                    {loading ? <LoadingIndicator /> : <CourtList courts={paginatedCourts} animationClass={animationClass} />}
                    {filteredCourts.length > ITEMS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindCourtBySportView;