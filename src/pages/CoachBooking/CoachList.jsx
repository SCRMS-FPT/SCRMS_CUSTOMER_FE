import React, { useState, useEffect } from "react";
import CoachCard from "../../components/CoachComponents/CoachCard";
import CoachFilter from "../../components/CoachComponents/CoachFilter";
import SearchCoachList from "../../components/CoachComponents/SearchCoachList";
import coachesData from "../../data/coachesData";
import { Pagination, Spin } from "antd";

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
        (selectedSport === "All Sports" || coach.sport.includes(selectedSport)) &&
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

  const paginatedCoaches = filteredCoaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white p-6">
      <h2 className="text-3xl font-bold mb-2">Danh sách huấn luyện viên</h2>
      <p className="text-gray-600 mb-6">
        Tìm kiếm và lọc huấn luyện viên dựa trên môn thể thao, vị trí, và phí.
      </p>
      <SearchCoachList onSearch={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 md:col-span-1">
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
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {paginatedCoaches.length > 0 ? (
              paginatedCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))
            ) : (
              <p className="text-gray-500">No coaches match your filters.</p>
            )}
          </div>
          {filteredCoaches.length > itemsPerPage && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredCoaches.length}
                pageSize={itemsPerPage}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachList;
