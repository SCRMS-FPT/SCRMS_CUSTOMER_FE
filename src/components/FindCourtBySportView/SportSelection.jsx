// src/components/SportSelection.jsx
import React, { useState } from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import sportsData from "@/data/sportsData";

const SportSelection = ({ selectedSport, setSelectedSport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter popular sports: Soccer (Football), Tennis, Badminton, Basketball.
  const popularSports = sportsData.filter(
    (sport) =>
      sport.name === "Football" ||
      sport.name === "Tennis" ||
      sport.name === "Badminton" ||
      sport.name === "Basketball"
  );

  // Create dropdown menu items for all sports
  const menuItems = sportsData.map((sport) => ({
    key: sport.name,
    label: (
      <span className="flex items-center">
        <img
          src={sport.icon}
          alt={sport.name}
          className="w-5 h-5 mr-2"
        />
        {sport.name}
      </span>
    ),
  }));

  const handleMenuClick = (e) => {
    setSelectedSport(e.key);
    setDropdownOpen(false);
  };

  const menu = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Popular Sports:</h2>
      <div className="grid grid-cols-2 gap-2">
        {popularSports.map((sport) => (
          <button
            key={sport.name}
            className={`sport-button bg-indigo-600 text-white py-2 px-4 rounded-lg flex items-center justify-center ${
              selectedSport === sport.name ? "bg-indigo-800" : ""
            }`}
            onClick={() => setSelectedSport(sport.name)}
          >
            <img src={sport.icon} alt={sport.name} className="w-5 h-5 mr-2" />
            {sport.name}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Select Sport:</h2>
      <Dropdown menu={menu} open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <Button className="w-full bg-white border border-gray-300 py-2 px-4 rounded-lg flex items-center justify-between">
          <span className="flex items-center">
            <img
              src={
                (sportsData.find((s) => s.name === selectedSport) || sportsData[0])
                  .icon
              }
              alt={selectedSport}
              className="w-5 h-5 mr-2"
            />
            {selectedSport}
          </span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default SportSelection;
