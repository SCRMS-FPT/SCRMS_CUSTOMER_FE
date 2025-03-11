import React, { useState } from "react";
import { Card, Button, notification } from "antd";
import BookingTable from "../components/BookingTable";
import mockBookingsData from "../data/mockBookingsData";

const BookingListPage = () => {
  const [bookings, setBookings] = useState(mockBookingsData);

  const refreshBookings = () => {
    // Simulate refreshing the list (replace with API call later)
    notification.success({
      message: "List Updated",
      description: "Booking list has been refreshed.",
      placement: "topRight",
    });
    setBookings([...mockBookingsData]); // Reset with mock data
  };

  return (
    <Card title="Court Bookings">
      <Button type="primary" onClick={refreshBookings} className="mb-3">
        Refresh List
      </Button>
      <BookingTable bookings={bookings} setBookings={setBookings} />
    </Card>
  );
};

export default BookingListPage;
