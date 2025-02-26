import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import sportsData from "../data/sportsData"; // Import sports data
import venuesData from "../data/venuesData"; // Import venues data
import soccerBg from "../assets/soccer_04.jpg";

const SearchBarList = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSport, setSelectedSport] = useState(sportsData[0]); // Default to "All Sports"
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);

    // Extract unique cities from venuesData
    const cityOptions = [
        "All Cities",
        ...new Set(venuesData.map((venue) => venue.location)),
    ];

    const handleSearch = () => {
        const filteredVenues = venuesData.filter((venue) => {
            const matchesName =
                venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                searchTerm === "";

            const matchesSport =
                selectedSport.name === "All Sports" || venue.sport === selectedSport.name;

            const matchesCity =
                selectedCity === "All Cities" || venue.location === selectedCity;

            return matchesName && matchesSport && matchesCity;
        });

        onSearch(filteredVenues);
    };

    return (

        <div className="w-full h-[40vh] bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${soccerBg})` }}>

            {/* Search Bar Container */}
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md space-x-2 w-full max-w-3xl mx-auto">
                {/* Search Input */}
                <div className="flex items-center bg-gray-100 p-2 rounded-lg flex-1">
                    <FaSearch className="text-gray-500 mx-2" />
                    <input
                        type="text"
                        placeholder="Search with stadium name"
                        className="bg-transparent outline-none flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sports Dropdown */}
                <div className="relative">
                    <button
                        className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-10"
                        onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                    >
                        <img src={selectedSport.icon} alt={selectedSport.name} className="w-6 h-6" />
                    </button>

                    {isSportDropdownOpen && (
                        <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-48 z-10 max-h-60 overflow-y-auto">
                            {sportsData.map((sport) => (
                                <div
                                    key={sport.name}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setSelectedSport(sport);
                                        setIsSportDropdownOpen(false);
                                    }}
                                >
                                    <img src={sport.icon} alt={sport.name} className="w-6 h-6" />
                                    <span>{sport.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* City Dropdown */}
                <div className="relative">
                    <select
                        className="bg-gray-100 p-2 rounded-lg outline-none cursor-pointer"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        {cityOptions.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600"
                >
                    FIND
                </button>
            </div>
        </div>

    );
};

export default SearchBarList;
