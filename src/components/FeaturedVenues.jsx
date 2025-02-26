import React, { useState, useEffect } from "react";
import { Card, CardContent, Button } from "@mui/material";
import sportsData from "../data/sportsData"; // Importing sports list
import venuesData from "../data/venuesData"; // Importing venues list

const FeaturedVenues = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage, setVenuesPerPage] = useState(6); // Default is 6 venues per page

  // Detect screen size and set venues per page accordingly
  useEffect(() => {
    const updateVenuesPerPage = () => {
      if (window.innerWidth < 640) {
        setVenuesPerPage(3); // Mobile: 3 venues per page
      } else if (window.innerWidth < 1024) {
        setVenuesPerPage(4); // Tablets: 4 venues per page
      } else {
        setVenuesPerPage(6); // Desktop: 6 venues per page
      }
    };

    // Run on mount
    updateVenuesPerPage();

    // Listen for screen resize
    window.addEventListener("resize", updateVenuesPerPage);
    return () => window.removeEventListener("resize", updateVenuesPerPage);
  }, []);

  // Filter venues based on selected sport
  const filteredVenues =
    selectedSport === "All"
      ? venuesData
      : venuesData.filter((venue) => venue.sport === selectedSport);

  // Calculate total pages
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage) || 1;

  // Get venues for the current page
  const currentVenues = filteredVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  // Fill missing slots with placeholders to maintain grid layout
  const emptySlots = venuesPerPage - currentVenues.length;
  const placeholders = Array(emptySlots).fill(null);

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Featured Venues</h2>

      {/* Sports Filter Tabs */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        <button
          className={`px-4 py-2 border rounded-lg ${
            selectedSport === "All" ? "bg-gray-300" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            setSelectedSport("All");
            setCurrentPage(1);
          }}
        >
          All
        </button>
        {sportsData.map((sport) => (
          <button
            key={sport}
            className={`px-4 py-2 border rounded-lg ${
              selectedSport === sport ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedSport(sport);
              setCurrentPage(1);
            }}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {currentVenues.map((venue) => (
          <Card key={venue.id} className="border rounded-lg h-64">
            <img
              src={venue.image}
              alt={venue.name}
              className="h-32 w-full object-cover"
            />
            <CardContent>
              <h3 className="text-xl font-medium">{venue.name}</h3>
              <p className="text-sm text-gray-500">{venue.location}</p>
              <div className="flex justify-between mt-2">
                <Button variant="outlined">View</Button>
                <Button variant="contained" color="primary">
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Render Invisible Placeholders to Maintain Grid Structure */}
        {placeholders.map((_, index) => (
          <div key={`placeholder-${index}`} className="h-64 invisible"></div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedVenues;
