import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaStar,
  FaAngleRight,
  FaAngleLeft,
  FaSearch,
  FaFilter,
  FaPhone,
} from "react-icons/fa";
import { Client } from "../../API/CourtApi";
import { format } from "date-fns";

const FeaturedVenues = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage, setVenuesPerPage] = useState(6);
  const [isHovering, setIsHovering] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sportCenters, setSportCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const tabsRef = useRef(null);
  const navigate = useNavigate();
  const courtClient = new Client();

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const result = await courtClient.getSports();
        setSports(result.sports || []);
      } catch (err) {
        console.error("Error fetching sports:", err);
        setError("Failed to load sports. Please try again later.");
      }
    };

    fetchSports();
  }, []);

  // Fetch sport centers data
  useEffect(() => {
    const fetchSportCenters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using the proper API endpoint with pagination
        const response = await courtClient.getSportCenters(
          currentPage,
          venuesPerPage,
          searchLocation || undefined,
          searchTerm || undefined
        );

        if (response.sportCenters && response.sportCenters.data) {
          setSportCenters(response.sportCenters.data);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching sport centers:", err);
        setError("Failed to load sport venues. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchSportCenters();
  }, [currentPage, venuesPerPage, searchTerm, searchLocation]);

  // Detect screen size and set venues per page accordingly
  useEffect(() => {
    const updateVenuesPerPage = () => {
      if (window.innerWidth < 640) {
        setVenuesPerPage(3);
      } else if (window.innerWidth < 1024) {
        setVenuesPerPage(4);
      } else {
        setVenuesPerPage(6);
      }
    };

    updateVenuesPerPage();
    window.addEventListener("resize", updateVenuesPerPage);
    return () => window.removeEventListener("resize", updateVenuesPerPage);
  }, []);

  // Filter sport centers based on selected sport
  const filteredVenues =
    selectedSport === "All"
      ? sportCenters
      : sportCenters.filter(
          (center) =>
            center.sportNames && center.sportNames.includes(selectedSport)
        );

  // Calculate total pages
  const totalItems = filteredVenues.length;
  const totalPages = Math.ceil(totalItems / venuesPerPage) || 1;

  // Get venues for the current page
  const currentVenues = filteredVenues.slice(0, venuesPerPage);

  // Fill missing slots with placeholders to maintain grid layout
  const emptySlots = venuesPerPage - currentVenues.length;
  const placeholders = Array(emptySlots).fill(null);

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: window.scrollY - 50, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: window.scrollY - 50, behavior: "smooth" });
    }
  };

  // Scroll tabs horizontally
  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle venue selection
  const handleViewVenue = (sportCenterId) => {
    navigate(`/court/${sportCenterId}`);
  };

  const handleBookNow = (sportCenterId) => {
    navigate(`/book-court/${sportCenterId}`);
  };

  // Format address from components
  const formatAddress = (center) => {
    const parts = [];
    if (center.addressLine) parts.push(center.addressLine);
    if (center.commune) parts.push(center.commune);
    if (center.district) parts.push(center.district);
    if (center.city) parts.push(center.city);

    return parts.join(", ");
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header with description */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Find Your Perfect Venue
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover top-rated sports facilities in your area. Filter by sport
            type and book your next game with ease.
          </p>
        </div>

        {/* Search and filter section */}
        <div className="mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location (city)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FaFilter className="mr-2" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Sports Filter Tabs with scroll indicators */}
        <div className="relative mb-8">
          <div className="flex items-center mb-2 md:mb-4">
            <h3 className="text-xl font-semibold text-gray-700 mr-auto">
              Browse by Sport
            </h3>
            <div className="flex space-x-2 md:hidden">
              <button
                onClick={() => scrollTabs("left")}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
                aria-label="Scroll left"
              >
                <FaAngleLeft className="text-gray-700" />
              </button>
              <button
                onClick={() => scrollTabs("right")}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
                aria-label="Scroll right"
              >
                <FaAngleRight className="text-gray-700" />
              </button>
            </div>
          </div>

          <div
            ref={tabsRef}
            className="flex space-x-3 overflow-x-auto pb-2 md:pb-4 scrollbar-hide"
          >
            <button
              className={`px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                selectedSport === "All"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => {
                setSelectedSport("All");
                setCurrentPage(1);
              }}
            >
              All Venues
            </button>
            {sports.map((sport) => (
              <button
                key={sport.id}
                className={`px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSport === sport.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => {
                  setSelectedSport(sport.name);
                  setCurrentPage(1);
                }}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredVenues.length}</span>{" "}
            venues
            {selectedSport !== "All" && (
              <span>
                {" "}
                for <span className="font-medium">{selectedSport}</span>
              </span>
            )}
            {searchTerm && (
              <span>
                {" "}
                matching "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
            {searchLocation && (
              <span>
                {" "}
                in <span className="font-medium">{searchLocation}</span>
              </span>
            )}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Venues Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentVenues.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setIsHovering(center.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                  <div className="relative">
                    {/* Venue image with overlay */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={
                          center.avatar ||
                          "https://placehold.co/600x400?text=Sport+Center"
                        }
                        alt={center.name}
                        className={`h-full w-full object-cover transition-transform duration-700 ${
                          isHovering === center.id ? "scale-110" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                    </div>

                    {/* Sport tags */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                      {center.sportNames &&
                        center.sportNames.slice(0, 3).map((sport, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium"
                          >
                            {sport}
                          </span>
                        ))}
                      {center.sportNames && center.sportNames.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700 text-white text-xs rounded-full font-medium">
                          +{center.sportNames.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Rating - mock data since API doesn't provide ratings */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                        <FaStar className="text-yellow-400 mr-1" size={14} />
                        <span className="text-xs font-medium">
                          {(Math.random() * 2 + 3).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {center.name}
                    </h3>

                    <div className="flex items-start mb-2 text-gray-500">
                      <FaMapMarkerAlt className="mt-1 mr-2 flex-shrink-0 text-gray-400" />
                      <p className="text-sm">{formatAddress(center)}</p>
                    </div>

                    {center.phoneNumber && (
                      <div className="flex items-start mb-3 text-gray-500">
                        <FaPhone className="mt-1 mr-2 flex-shrink-0 text-gray-400" />
                        <p className="text-sm">{center.phoneNumber}</p>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3">
                      {center.description ||
                        `Experience premium sports facilities at ${center.name}. Book now for an outstanding sports experience.`}
                    </p>

                    <div className="flex items-center space-x-2 mt-auto">
                      <button
                        onClick={() => handleViewVenue(center.id)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBookNow(center.id)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Placeholders for empty slots */}
            {placeholders.map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="hidden lg:block"
              ></div>
            ))}
          </div>
        )}

        {/* No results state */}
        {!isLoading && !error && filteredVenues.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No venues found
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedSport !== "All" ? (
                <>We couldn't find any venues for {selectedSport}.</>
              ) : searchTerm || searchLocation ? (
                <>No venues match your search criteria.</>
              ) : (
                <>No venues available at this time.</>
              )}
              <br />
              Try adjusting your filters or check back later.
            </p>
            <button
              onClick={() => {
                setSelectedSport("All");
                setSearchTerm("");
                setSearchLocation("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FaAngleLeft className="mr-1" /> Previous
            </button>

            {/* Page indicators */}
            <div className="flex items-center space-x-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Next <FaAngleRight className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVenues;
