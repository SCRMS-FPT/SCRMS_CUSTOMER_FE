import React, { useState } from "react";
import CustomDatePicker from "../components/CustomDatePicker";
import sportsData from "../data/sportsData";
import CourtCard from "../components/CourtCard";
import courtsData from "../data/courtsData";
import { useEffect } from "react";
import SearchBarList from "../components/SearchBarList";
import { TimePicker } from 'antd';
import dayjs from "dayjs";



const BrowseCourts = () => {
    const today = new Date().toISOString().split("T")[0]; // 📅 Get today's date (YYYY-MM-DD)

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSport, setSelectedSport] = useState("All Sports");
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [selectedPriceRange, setSelectedPriceRange] = useState([0, 500]);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAllSports, setShowAllSports] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCourts, setFilteredCourts] = useState([]);

    const itemsPerPage = 5;

    const handleTimeChange = (timeString) => {
        setSelectedTime(timeString);
    };

    useEffect(() => {
        const defaultFilteredCourts = courtsData.filter(
            (court) => court.status === "available" && court.date >= today
        );
        setFilteredCourts(defaultFilteredCourts);
    }, []);

    const applyFilters = () => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

        const filtered = courtsData.filter((court) => {
            if (court.status !== "available") return false;

            // **Exclude past courts**
            if (court.date && court.date < today) return false;

            // **Search Term Filtering (Court Name)**
            if (searchTerm && String(searchTerm).toLowerCase().trim() !== "") {
                if (!court.name.toLowerCase().includes(String(searchTerm).toLowerCase())) {
                    return false;
                }
            }

            // **Date Filtering**
            if (selectedDate) {
                const formattedCourtDate = new Date(court.date).toLocaleDateString("en-CA"); // Ensure consistent format
                if (formattedCourtDate !== selectedDate.toLocaleDateString("en-CA")) {
                    return false;
                }
            }

            // **City Filtering (Search Bar)**
            if (selectedCity !== "All Cities" && court.city !== selectedCity) {
                return false;
            }

            // **Price Filtering (Search Bar)**
            if (court.price < selectedPriceRange[0] || court.price > selectedPriceRange[1]) {
                return false;
            }

            // **Time Filtering**
            if (selectedTime) {
                const selectedTimeValue = Number(selectedTime.split(":")[0]) * 60 + Number(selectedTime.split(":")[1]);
                const courtOpenTime = Number(court.availableHours.start.split(":")[0]) * 60 + Number(court.availableHours.start.split(":")[1]);
                const courtCloseTime = Number(court.availableHours.end.split(":")[0]) * 60 + Number(court.availableHours.end.split(":")[1]);

                if (selectedTimeValue < courtOpenTime || selectedTimeValue >= courtCloseTime) {
                    return false; // ✅ Time must be within open-close range
                }
            }

            // **Sport Filtering**
            if (selectedSport !== "All Sports" && !court.sport.includes(selectedSport)) {
                return false; // ✅ Sport must exist in the court.sport array
            }

            // **Duration Filtering**
            if (selectedDuration && !court.durations.includes(selectedDuration)) {
                return false; // ✅ Selected duration must be available
            }

            return true; // ✅ If all filters pass, include court
        });

        setFilteredCourts(filtered);
        setCurrentPage(1); // Reset pagination
    };

    // **Reset Filters**
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedSport("All Sports");
        setSelectedCity("All Cities");
        setSelectedPriceRange([0, 500]);
        setSelectedDuration(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setFilteredCourts(courtsData.filter((court) => court.status === "available" && court.date >= today));
        setCurrentPage(1);
    };

    useEffect(() => {
        applyFilters(); // ✅ Apply filters whenever search or filter state changes
    }, [searchTerm, selectedSport, selectedCity, selectedPriceRange, selectedDate, selectedTime, selectedDuration]);


    // **Pagination Logic**
    const totalPages = Math.ceil(filteredCourts.length / itemsPerPage);
    const paginatedCourts = filteredCourts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        console.log("🔍 Current Filters:");
        console.log("📍 Selected City:", selectedCity)
        console.log("🔍 Search Term:", searchTerm);
        console.log("💰 Selected Price Range:", selectedPriceRange);
        console.log("📅 Selected Date:", selectedDate ? selectedDate.toLocaleDateString("en-CA") : "None");
        console.log("⏰ Selected Time:", selectedTime || "None");
        console.log("🏅 Selected Sport:", selectedSport);
        console.log("⏳ Selected Duration:", selectedDuration ? `${selectedDuration} mins` : "None");
        console.log("📋 Filtered Courts:", filteredCourts.length, "courts available");
        console.log(filteredCourts);
    }, [selectedDate, selectedTime, selectedSport, selectedDuration, filteredCourts]);

    return (
        <div className="bg-white">
            <SearchBarList onSearch={(term, sport, city, price) => {
                setSearchTerm(term);
                setSelectedSport(sport);
                setSelectedCity(city);
                setSelectedPriceRange(price);
                applyFilters();
            }} />
            <div className="grid grid-cols-8 gap-6 p-6">
                {/* Sidebar - Filters */}
                <div className="col-span-3 bg-white p-6 rounded-lg flex flex-col justify-between">
                    <div className="w-[70%] ml-auto">
                        {/* Date Picker */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Date</h3>
                            <div className="flex justify-center">
                                <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            </div>
                        </div>

                        {/* Time Picker */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Time from</h3>
                            <TimePicker
                                format="HH:mm"
                                use12Hours={true} // Ensures 12-hour format
                                showNow={true}
                                onChange={handleTimeChange}
                                className="w-full"
                                value={selectedTime ? dayjs(selectedTime, "HH:mm") : null}
                            />
                        </div>

                        {/* Choose Sport */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Choose Sport</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {sportsData.slice(0, showAllSports ? sportsData.length : 6).map((sport) => (
                                    <button
                                        key={sport.name}
                                        onClick={() => setSelectedSport(sport.name)}
                                        className={`border p-3 rounded-md flex justify-center items-center transition-all 
                            ${selectedSport === sport.name ? "border-green-500 bg-green-100" : "border-gray-300"}
                            hover:bg-gray-100`}
                                    >
                                        <img src={sport.icon} alt={sport.name} className="w-10 h-10" />
                                    </button>
                                ))}
                            </div>

                            {sportsData.length > 6 && (
                                <div className="mt-3 flex flex-col items-center">
                                    <button
                                        onClick={() => setShowAllSports(!showAllSports)}
                                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-all"
                                    >
                                        {showAllSports ? "Show Less" : "Expand Here"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Match Duration */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Match Duration</h3>
                            <div className="flex gap-3">
                                {[60, 90, 120].map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => setSelectedDuration(duration === selectedDuration ? null : duration)}
                                        className={`border p-2 rounded-md transition-all
                            ${selectedDuration === duration ? "border-green-500 bg-green-100" : "border-gray-300"}
                            hover:bg-gray-100`}
                                    >
                                        {duration} Mins
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear & Filter Buttons */}
                        <div className="flex justify-center gap-x-4 mt-8">
                            <button
                                onClick={clearFilters}
                                className="border px-6 py-2 w-46 rounded-md text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                Clear
                            </button>
                            {/* <button
                                onClick={applyFilters}
                                className="bg-green-600 text-white px-6 py-2 w-46 rounded-md hover:bg-green-700 transition-all"
                            >
                                Filter
                            </button> */}
                        </div>
                    </div>
                </div>


                {/* Right Side - Court List */}
                <div className="col-span-5">
                    <div className="bg-white p-6 w-[85%] mr-auto">


                        {/* Render Court Cards */}
                        {paginatedCourts.length > 0 ? (
                            paginatedCourts.map((court) => <CourtCard key={court.id} court={court} />)
                        ) : (
                            <p className="text-gray-500">No courts match your filters.</p>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseCourts;
