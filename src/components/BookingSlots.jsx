import { useState } from "react";

const BookingSlots = ({ startTime, endTime, duration }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Hàm tính danh sách slot từ startTime đến endTime
  const generateSlots = (start, end, interval) => {
    const slots = [];
    let currentTime = new Date(`2024-01-01T${start}:00`); // Fake ngày để xử lý Date
    const endTimeObj = new Date(`2024-01-01T${end}:00`);

    while (currentTime < endTimeObj) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return slots;
  };

  const slots = generateSlots(startTime, endTime, duration);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chọn Slot Đặt Sân</h2>
      <div className="grid grid-cols-3 gap-4">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => setSelectedSlot(slot)}
            className={`p-3 border rounded-md ${
              selectedSlot === slot ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      {selectedSlot && (
        <p className="mt-4 text-lg font-semibold">
          Slot đã chọn: {selectedSlot}
        </p>
      )}
    </div>
  );
};

export default BookingSlots;
