// src/components/SportSelection.jsx
import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const sports = ["All Sports", "Soccer", "Tennis", "Hockey", "Basketball", "Volleyball", "Badminton"];

const SportSelection = ({ selectedSport, setSelectedSport }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (sport) => {
    setSelectedSport(sport);
    setDropdownVisible(false);
  };

  const menu = (
    <Menu>
      {sports.map((sport) => (
        <Menu.Item key={sport} onClick={() => handleSelect(sport)}>
          {sport}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Popular Sports:</h2>
      <div className="grid grid-cols-2 gap-2">
        {sports.slice(1).map((sport) => (
          <button
            key={sport}
            className={`sport-button bg-indigo-600 text-white py-2 px-4 rounded-lg ${
              selectedSport === sport ? "bg-indigo-800" : ""
            }`}
            onClick={() => setSelectedSport(sport)}
          >
            {sport}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Select Sport:</h2>
      <Dropdown overlay={menu} visible={dropdownVisible} onVisibleChange={setDropdownVisible}>
        <button className="w-full bg-white border border-gray-300 py-2 px-4 rounded-lg flex items-center justify-between">
          {selectedSport} <DownOutlined />
        </button>
      </Dropdown>
    </div>
  );
};

export default SportSelection;
