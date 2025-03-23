import React, { useState } from "react";
import { Card, Table, Tag, Button, Modal, Select, Space, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

// Mock booking data
const initialBookings = [
  { key: "1", date: "2025-05-01", time: "18:00", court: "Champions Court", sport: "Tennis", status: "Confirmed" },
  { key: "2", date: "2025-05-02", time: "20:00", court: "Elite Sports Arena", sport: "Basketball", status: "Pending" },
  { key: "3", date: "2025-05-03", time: "16:00", court: "City Soccer Field", sport: "Soccer", status: "Cancelled" },
  { key: "4", date: "2025-05-04", time: "14:00", court: "Urban Indoor Court", sport: "Badminton", status: "Completed" },
  { key: "5", date: "2025-05-05", time: "19:00", court: "Downtown Sports Arena", sport: "Basketball", status: "No-Show" },
];

// Status colors mapping
const statusColors = {
  Pending: "orange",
  Confirmed: "green",
  Completed: "blue",
  Cancelled: "red",
  "No-Show": "black",
  Rescheduled: "purple",
  Expired: "volcano",
};

const CourtOwnerBookingView = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Handle Cancel Booking
  const handleCancelBooking = (key) => {
    Modal.confirm({
      title: "Cancel Booking",
      content: "Are you sure you want to cancel this booking?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.key === key ? { ...booking, status: "Cancelled" } : booking
          )
        );
        message.success("Booking has been cancelled.");
      },
    });
  };

  // Filter bookings based on status & search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = booking.court.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Table columns definition
  const columns = [
    { title: "Date", dataIndex: "date", key: "date", sorter: (a, b) => a.date.localeCompare(b.date) },
    { 
      title: "Time", 
      dataIndex: "time", 
      key: "time", 
      sorter: (a, b) => a.time.localeCompare(b.time) 
    },
    { 
      title: "Court", 
      dataIndex: "court", 
      key: "court", 
      sorter: (a, b) => a.court.localeCompare(b.court) 
    },
    { 
      title: "Sport", 
      dataIndex: "sport", 
      key: "sport", 
      sorter: (a, b) => a.sport.localeCompare(b.sport) 
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: Object.keys(statusColors).map((status) => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/court-owner/bookings/${record.key}`)}>Manage</Button>
          {record.status !== "Cancelled" && record.status !== "Completed" && (
            <Button type="link" danger onClick={() => handleCancelBooking(record.key)}>Cancel</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="Manage Bookings">
      {/* Search & Filter Section */}
      <Space className="mb-4" wrap>
        <Input
          placeholder="Search by Court Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <span className="ml-10">Filter by Status:</span>
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
          <Option value="all">All</Option>
          {Object.keys(statusColors).map((status) => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
      </Space>

      {/* Booking Table */}
      <Table dataSource={filteredBookings} columns={columns} pagination={{ pageSize: 10 }} />
    </Card>
  );
};

export default CourtOwnerBookingView;
