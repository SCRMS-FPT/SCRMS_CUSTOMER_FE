import React, { useEffect, useState } from "react";
import { Card, notification } from "antd";
import CourtSlotForm from "../components/CourtComponents/CourtSlotForm";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import mockSlotsData from "../data/mockSlotsData"; // ✅ Import mock data

const UpdateSlotPage = () => {
  const navigate = useNavigate();
  const { slotId } = useParams(); // ✅ Get slot ID from URL
  const [slot, setSlot] = useState(null);

  // ✅ Function to fetch slot details by ID (Simulating API call)
  const fetchSlotById = (slotId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const slot = mockSlotsData.find((s) => s.id === slotId);
        resolve(slot || null);
      }, 500); // Simulate network delay
    });
  };

  useEffect(() => {
    fetchSlotById(slotId).then((fetchedSlot) => {
      if (fetchedSlot) {
        setSlot({
          ...fetchedSlot,
          slot_date: dayjs(fetchedSlot.slot_date, "YYYY-MM-DD"), // ✅ Convert to dayjs object
        });
      }
    });
  }, [slotId]);

  console.log("📌 Loaded Slot Data:", slot);

  const handleUpdateSuccess = () => {
    notification.success({
      message: "Update Successful",
      description: "Slot details have been updated successfully.",
      placement: "topRight",
    });
    navigate("/slots");
  };

  return (
    <Card title="Edit Slot">
      {slot ? (
        <CourtSlotForm
          initialData={slot}
          onSubmit={handleUpdateSuccess}
          onCancel={() => navigate("/slots")}
        />
      ) : (
        <p>Loading slot details...</p>
      )}
    </Card>
  );
};

export default UpdateSlotPage;
