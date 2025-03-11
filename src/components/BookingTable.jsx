import React, { useState } from "react";
import { Table, Button, Space, Tag, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateBookingModal from "./UpdateBookingModal";

const BookingTable = ({ bookings, setBookings }) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const updateBookingStatus = (id, newStatus) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
  };

  return (
    <>
      <Table dataSource={bookings} rowKey="id">
        <Table.Column title="Customer" dataIndex="customer_name" />
        <Table.Column title="Court" dataIndex="court_name" />
        <Table.Column title="Date" dataIndex="slot_date" />
        <Table.Column title="Start Time" dataIndex="start_time" />
        <Table.Column title="End Time" dataIndex="end_time" />
        <Table.Column
          title="Status"
          dataIndex="status"
          render={(status) => (
            <Tag color={status === "confirmed" ? "green" : "volcano"}>
              {status.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          title="Actions"
          render={(text, record) => (
            <Space>
              <Button onClick={() => showUpdateModal(record)}>Update Status</Button>
            </Space>
          )}
        />
      </Table>

      {/* Update Modal */}
      <UpdateBookingModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        booking={selectedBooking}
        updateBookingStatus={updateBookingStatus}
      />
    </>
  );
};

export default BookingTable;
