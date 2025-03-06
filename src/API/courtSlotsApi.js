import { API_IDENTITY_URL } from "../API/config";

export const getSlotsByDate = async (courtId, date) => {
  const response = await fetch(`${API_IDENTITY_URL}/api/courts/${courtId}/slots?date=${date}`);
  return response.json();
};

export const createSlot = async (slotData) => {
  const response = await fetch(`${API_IDENTITY_URL}/api/court-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slotData),
  });
  return response.json();
};

export const updateSlot = async (slotId, slotData) => {
  const response = await fetch(`${API_IDENTITY_URL}/api/court-slots/${slotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slotData),
  });
  return response.json();
};

export const deleteSlot = async (slotId) => {
  await fetch(`${API_IDENTITY_URL}/api/court-slots/${slotId}`, { method: "DELETE" });
};
