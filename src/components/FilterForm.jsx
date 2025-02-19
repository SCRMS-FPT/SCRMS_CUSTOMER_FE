import React from "react";
import { FaSearch } from "react-icons/fa";

const FilterForm = () => {
  return (
    <form className="bg-white shadow-md rounded-lg flex items-center w-full max-w-3xl overflow-hidden border border-gray-300">
      {/* Sport Selection */}
      <select className="p-3 w-40 text-gray-700 bg-transparent border-r border-gray-300 focus:outline-none">
        <option value="basketball">Basketball</option>
        <option value="football">Football</option>
        <option value="gym">Gym</option>
        <option value="hockey">Hockey</option>
        <option value="tennis">Tennis</option>
        <option value="volleyball">Volleyball</option>
      </select>

      {/* Date Picker */}
      <input
        type="date"
        defaultValue="2025-02-18"
        className="p-3 w-40 text-gray-700 bg-transparent border-r border-gray-300 focus:outline-none"
      />

      {/* Time Selection */}
      <select className="p-3 w-24 text-gray-700 bg-transparent border-r border-gray-300 focus:outline-none">
        {[...Array(12)].map((_, i) => (
          <option key={i} value={`${i === 0 ? 12 : i}:00`}>
            {i === 0 ? 12 : i}:00
          </option>
        ))}
      </select>

      {/* AM/PM Selection */}
      <select className="p-3 w-20 text-gray-700 bg-transparent border-r border-gray-300 focus:outline-none">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>

      {/* Location Selection */}
      <select className="p-3 w-40 text-gray-700 bg-transparent border-r border-gray-300 focus:outline-none">
        <option value="any">Any</option>
        <option value="gozo">Gozo</option>
        <option value="malta-central">Malta - Central</option>
        <option value="malta-north">Malta - North</option>
        <option value="malta-south">Malta - South</option>
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center justify-center h-full"
      >
        <FaSearch className="mr-2" /> Search
      </button>
    </form>
  );
};

export default FilterForm;
