import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CourtSlotForm from "../components/CourtComponents/CourtSlotForm";

const NewSlotPage = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/slots/list"); // Navigate back to slot list
  };

  return (
    <Card title="Create New Slot">
      <CourtSlotForm onCancel={handleCancel} />
    </Card>
  );
};

export default NewSlotPage;
