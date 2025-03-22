import React, { useState, useEffect } from "react";
import CoachCard from "../components/CoachComponents/CoachCard";
import CoachFilter from "../components/CoachComponents/CoachFilter";
import SearchCoachList from "../components/CoachComponents/SearchCoachList";
import coachesData from "../data/coachesData";

const CoachList = () => {
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedFee, setSelectedFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCoaches, setFilteredCoaches] = useState(coachesData);

  const itemsPerPage = 5;

  const applyFilters = () => {
    const filtered = coachesData.filter((coach) => {
      return (
        (selectedSport === "All Sports" ||
          coach.sport.includes(selectedSport)) &&
        (!selectedLocation || coach.location.includes(selectedLocation)) &&
        (!selectedFee || coach.fee <= selectedFee) &&
        (coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coach.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coach.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredCoaches(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSport("All Sports");
    setSelectedLocation("");
    setSelectedFee(null);
    setSearchTerm("");
    setFilteredCoaches(coachesData);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedSport, selectedLocation, selectedFee, searchTerm]);

  const totalPages = Math.ceil(filteredCoaches.length / itemsPerPage);
  const paginatedCoaches = filteredCoaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    console.log("🔍 Current Filters:");
    console.log("🏅 Selected Sport:", selectedSport);
    console.log("📍 Selected Location:", selectedLocation);
    console.log("💵 Selected Fee:", selectedFee);
    console.log("🔍 Search Term:", searchTerm);
    console.log(
      "📋 Filtered Coaches:",
      filteredCoaches.length,
      "coaches available"
    );
  }, [
    selectedSport,
    selectedLocation,
    selectedFee,
    searchTerm,
    filteredCoaches,
  ]);

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách huấn luyện viên</h2>
      <SearchCoachList onSearch={setSearchTerm} />
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-4 bg-white p-6 rounded-lg flex flex-col justify-between">
          <CoachFilter
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedFee={selectedFee}
            setSelectedFee={setSelectedFee}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>
        <div className="col-span-8">
          <div className="bg-white p-6 rounded-lg">
            {paginatedCoaches.length > 0 ? (
              paginatedCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))
            ) : (
              <p className="text-gray-500">No coaches match your filters.</p>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 mx-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 mx-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
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

export default CoachList;
