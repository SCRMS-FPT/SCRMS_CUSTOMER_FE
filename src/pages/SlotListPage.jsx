import React, { useState } from "react";
import { Card, Button, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import SlotTable from "../components/SlotTable";
import dayjs from "dayjs";  // ✅ Import dayjs

const SlotListPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    console.log("📅 Selected Date (dayjs object):", date);
    console.log("📅 Selected Date (formatted):", date ? date.format("YYYY-MM-DD") : "None");
    setSelectedDate(date);
  };

  return (
    <Card title="Slot List">
      <DatePicker 
        onChange={handleDateChange}  // ✅ Store the dayjs object and log changes
        placeholder="Select a Date" 
        value={selectedDate} 
      />
      <Button 
        type="primary" 
        onClick={() => {
          console.log("➕ Navigating to Add New Slot page...");
          navigate("/slots/new");
        }} 
        className="ml-2"
      >
        Add New Slot
      </Button>

      <SlotTable selectedDate={selectedDate} />
    </Card>
  );
};

export default SlotListPage;
