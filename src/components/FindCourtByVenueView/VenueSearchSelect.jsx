import React from "react";
import { Select } from "antd";

const { Option } = Select;

const VenueSearchSelect = ({ venues, onSelect }) => {
  return (
    <Select
      showSearch
      placeholder="Tìm kiếm hoặc lựa chọn một trung tâm thể thao"
      optionFilterProp="children"
      className="w-full md:w-1/2"
      onChange={(venueId) => {
        const venue = venues.find((v) => v.id === venueId);
        onSelect(venue);
      }}
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {venues.map((venue) => (
        <Option key={venue.id} value={venue.id}>
          {venue.name}
        </Option>
      ))}
    </Select>
  );
};

export default VenueSearchSelect;
