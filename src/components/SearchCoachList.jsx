import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchCoachList = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 300); // Adjust the delay as needed

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div
            className="bg-cover bg-center h-150 flex items-center justify-center"
            style={{
                backgroundImage: "url('/src/assets/HLV/banner-1.jpg')",
                backgroundSize: "cover", // Change this line to make the image cover the entire div
                backgroundRepeat: "no-repeat" // Ensure the image does not repeat
            }}
        >
            <div className="relative w-full max-w-lg">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-3 pl-10 rounded-md w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-75"
                    placeholder="Search for coaches..."
                    style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for highlighting
                        border: "2px solid #007BFF" // Add border for highlighting
                    }}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
        </div>
    );
};

export default SearchCoachList;