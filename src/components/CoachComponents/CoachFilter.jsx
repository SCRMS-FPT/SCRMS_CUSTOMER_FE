import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFutbol,
  FaBasketballBall,
} from "react-icons/fa";
import sportsData from "../../data/sportsData";

const CoachFilter = ({
  selectedSport,
  setSelectedSport,
  selectedLocation,
  setSelectedLocation,
  selectedFee,
  setSelectedFee,
  applyFilters,
  clearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      {/* Choose Sport */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Choose Sport</h3>
        <div className="grid grid-cols-3 gap-3">
          {sportsData.slice(0, 6).map((sport) => (
            <button
              key={sport.name}
              onClick={() => setSelectedSport(sport.name)}
              className={`border p-3 rounded-md flex justify-center items-center transition-all 
                                ${
                                  selectedSport === sport.name
                                    ? "border-green-500 bg-green-100"
                                    : "border-gray-300"
                                }
                                hover:bg-gray-100`}
            >
              <img src={sport.icon} alt={sport.name} className="w-10 h-10" />
            </button>
          ))}
        </div>
      </div>

      {/* Location Input */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <div className="flex items-center border p-2 rounded-md">
          <FaMapMarkerAlt className="mr-2 text-gray-500" />
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full outline-none"
            placeholder="Enter location"
          />
        </div>
      </div>

      {/* Fee Input */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Max Fee</h3>
        <div className="flex items-center border p-2 rounded-md">
          <FaDollarSign className="mr-2 text-gray-500" />
          <input
            type="number"
            value={selectedFee}
            onChange={(e) => setSelectedFee(e.target.value)}
            className="w-full outline-none"
            placeholder="Enter max fee"
          />
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
          onClick={applyFilters}
          className="bg-green-600 text-white px-6 py-2 w-46 rounded-md hover:bg-green-700 transition-all"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default CoachFilter;
