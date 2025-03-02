import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DollarOutlined, CloseOutlined } from "@ant-design/icons";
import { Modal, Slider, Dropdown } from "antd";
import sportsData from "../data/sportsData";
import courtsData from "../data/courtsData";
import soccerBg from "../assets/soccer_04.jpg";

const SearchBarList = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSport, setSelectedSport] = useState(sportsData[0]);
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100]);

    // Extract unique cities from courtsData
    const cityOptions = ["All Cities", ...new Set(courtsData.map((court) => court.city))];

    const handleSearch = () => {
        setSearchTerm((prev) => {
            const updatedSearchTerm = prev;
            onSearch(updatedSearchTerm, selectedSport.name, selectedCity, priceRange);
            return prev;
        });
    };

    // Convert sportsData into Ant Design Dropdown `items` format
    const sportItems = sportsData.map((sport) => ({
        key: sport.name,
        label: (
            <div className="flex items-center space-x-2 p-2 cursor-pointer"
                onClick={() => setSelectedSport(sport)}>
                <img src={sport.icon} alt={sport.name} className="w-6 h-6" />
                <span>{sport.name}</span>
            </div>
        ),
    }));

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

                    <button
                        className="right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setSearchTerm("")}
                    >
                        <CloseOutlined />
                    </button>

                </div>

                {/* Sports Dropdown (Updated) */}
                <Dropdown menu={{ items: sportItems }} trigger={["click"]} dropdownRender={(menu) => (
                    <div className="max-h-60 overflow-y-auto">{menu}</div>
                )}>
                    <button className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-10">
                        <img src={selectedSport.icon} alt={selectedSport.name} className="w-6 h-6" />
                    </button>
                </Dropdown>

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

                {/* Price Filter Button */}
                <button
                    className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-10"
                    onClick={() => setIsPriceModalOpen(true)}
                >
                    <DollarOutlined className="text-gray-700 text-xl" />
                </button>

                {/* Price Modal */}
                <Modal
                    title="Select Price Range"
                    open={isPriceModalOpen}
                    onOk={() => setIsPriceModalOpen(false)}
                    onCancel={() => setIsPriceModalOpen(false)}
                    okText="Apply"
                >
                    <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        value={priceRange}
                        onChange={setPriceRange}
                    />
                    <p className="text-center mt-2 text-gray-700">{`$${priceRange[0]} - $${priceRange[1]}`}</p>
                </Modal>

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
