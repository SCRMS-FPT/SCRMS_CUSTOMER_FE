import React from "react";
import { Table, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";  // ✅ Import dayjs
import mockSlotsData from "../data/mockSlotsData";

const SlotTable = ({ selectedDate }) => {
  const navigate = useNavigate();
  
  console.log("🔍 Filtering Slots for Date:", selectedDate ? selectedDate.format("YYYY-MM-DD") : "All Dates");

  const filteredSlots = selectedDate
    ? mockSlotsData.filter(slot => 
        dayjs(slot.slot_date).isSame(selectedDate, "day") // ✅ Convert string to dayjs before comparison
      )
    : mockSlotsData;

  console.log("📊 Filtered Slots Data:", filteredSlots);

  const handleEdit = (slot) => {
    console.log("✏️ Editing Slot:", slot);
    navigate(`/slots/edit/${slot.id}`, { state: { slot } });
  };

  return (
    <Table dataSource={filteredSlots} rowKey="id">
      <Table.Column title="Date" dataIndex="slot_date" render={(date) => dayjs(date).format("YYYY-MM-DD")} />
      <Table.Column title="Start Time" dataIndex="start_time" />
      <Table.Column title="End Time" dataIndex="end_time" />
      <Table.Column title="Price" dataIndex="price_slot" />
      <Table.Column 
        title="Actions" 
        render={(_, slot) => (
          <Space>
            <Button onClick={() => handleEdit(slot)}>Edit</Button>
            <Button 
              danger 
              onClick={() => console.log("🗑️ Deleting Slot:", slot)}
            >
              Delete
            </Button>
          </Space>
        )}
      />
    </Table>
  );
};

export default SlotTable;
