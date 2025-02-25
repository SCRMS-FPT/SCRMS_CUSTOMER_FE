import React, { useState } from "react";
import CustomDatePicker from "../components/CustomDatePicker";
import TimePicker from "../components/TimePicker";
import sportsData from "../data/sportsData";
import CourtCard from "../components/CourtCard";
import courtsData from "../data/courtsData";
import { useEffect } from "react";
import SearchBarList from "../components/SearchBarList";


const BrowseCourts = () => {
    const [selectedSport, setSelectedSport] = useState("All Sports"); // Default to "All Sports"
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAllSports, setShowAllSports] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCourts, setFilteredCourts] = useState(
        courtsData.filter((court) => court.status === "available")
    );

    const itemsPerPage = 5;

    // **Handle Filtering on Button Click**
    const applyFilters = () => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

        const filtered = courtsData.filter((court) => {
            // **Ensure courts in the past are unavailable**
            if (court.date && court.date < today) {
                return false; // Exclude past courts
            }

            // **Convert selectedTime from "HH:MM" to a comparable number**
            const selectedTimeValue = selectedTime
                ? Number(selectedTime.split(":")[0]) * 60 + Number(selectedTime.split(":")[1])
                : null; // Convert to total minutes

            const courtOpenTime = Number(court.availableHours.start.split(":")[0]) * 60 + Number(court.availableHours.start.split(":")[1]);
            const courtCloseTime = Number(court.availableHours.end.split(":")[0]) * 60 + Number(court.availableHours.end.split(":")[1]);

            return (
                court.status === "available" && // ✅ Show only available courts
                (!selectedDate || court.date === selectedDate.toISOString().split("T")[0]) && // ✅ Matches exact date
                (selectedSport === "All Sports" || court.sport.includes(selectedSport)) && // ✅ Skip sport filter if "All Sports"
                (!selectedDuration || court.durations.includes(selectedDuration)) &&
                (!selectedTime || (selectedTimeValue >= courtOpenTime && selectedTimeValue < courtCloseTime)) // ✅ Time within open range
            );
        });

        setFilteredCourts(filtered);
        setCurrentPage(1); // Reset pagination
    };

    // **Reset Filters**
    const clearFilters = () => {
        setSelectedSport("All Sports"); 
        setSelectedDuration(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setFilteredCourts(courtsData.filter((court) => court.status === "available"));
        setCurrentPage(1);
    };


    // **Pagination Logic**
    const totalPages = Math.ceil(filteredCourts.length / itemsPerPage);
    const paginatedCourts = filteredCourts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        console.log("🔍 Current Filters:");
        console.log("📅 Selected Date:", selectedDate ? selectedDate.toISOString().split("T")[0] : "None");
        console.log("⏰ Selected Time:", selectedTime || "None");
        console.log("🏅 Selected Sport:", selectedSport);
        console.log("⏳ Selected Duration:", selectedDuration ? `${selectedDuration} mins` : "None");
        console.log("📋 Filtered Courts:", filteredCourts.length, "courts available");
    }, [selectedDate, selectedTime, selectedSport, selectedDuration, filteredCourts]);

    return (
        <div className="bg-white">
            <SearchBarList />
            <div className="grid grid-cols-8 gap-6 p-6">
                {/* Sidebar - Filters */}
                <div className="col-span-3 bg-white p-6 rounded-lg flex flex-col justify-between">
                    <div className="w-[70%] ml-auto">
                        {/* Date Picker */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Date</h3>
                            <div className="flex justify-center">
                                <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                            </div>
                        </div>

                        {/* Time Picker */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Time from</h3>
                            <TimePicker selectedTime={selectedTime} onChange={setSelectedTime} />
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
                        <div className="flex justify-center gap-x-4 mt-6">
                            <button
                                onClick={clearFilters}
                                className="border px-6 py-2 w-46 rounded-md text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                Clear
                            </button>
                            <button
                                onClick={applyFilters} // ✅ Only filters when clicked
                                className="bg-green-600 text-white px-6 py-2 w-46 rounded-md hover:bg-green-700 transition-all"
                            >
                                Filter
                            </button>
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
