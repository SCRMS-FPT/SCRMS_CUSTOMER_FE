import React, { useState, useEffect } from "react";
import { Card, Table, Statistic, Input, Button, Tag, Space } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import CourtDetailsReport from "./CourtDetailsReport"; // Import new component
import courtsData from "../../data/courtsData";
import bookedSchedule from "../../data/bookedSchedule";

const ManageCourts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null); // Manage selected court

  useEffect(() => {
    setFilteredCourts(courtsData);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredCourts(
      courtsData.filter(
        (court) =>
          court.name.toLowerCase().includes(value) ||
          court.city.toLowerCase().includes(value)
      )
    );
  };

  const getUpcomingBookings = (courtId) => {
    const today = new Date().toISOString().split("T")[0];
    return bookedSchedule.filter(
      (booking) => booking.courtId === courtId && booking.date >= today
    ).length;
  };

  const handleViewCourt = (court) => {
    setSelectedCourt(court);
  };

  // Function to go back to court list
  const handleBack = () => {
    setSelectedCourt(null);
  };

  return (
    <div>
      {selectedCourt ? (
        // Show Court Details View
        <CourtDetailsReport court={selectedCourt} onBack={handleBack} />
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Manage Courts
          </h1>

          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="shadow-lg">
              <Statistic title="Total Courts" value={courtsData.length} />
            </Card>
            <Card className="shadow-lg">
              <Statistic
                title="Upcoming Bookings"
                value={
                  bookedSchedule.filter(
                    (booking) =>
                      booking.date >= new Date().toISOString().split("T")[0]
                  ).length
                }
                prefix={<CalendarOutlined />}
              />
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-between items-center">
            <Input
              placeholder="Search courts by name or city..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:w-96"
            />
          </div>

          {/* Courts Table */}
          <Table
            dataSource={filteredCourts.map((court) => ({
              key: court.id,
              name: court.name,
              city: court.city,
              availability: `${court.availableHours.start} - ${court.availableHours.end}`,
              upcomingBookings: getUpcomingBookings(court.id),
              status: court.status,
              ...court,
            }))}
            columns={[
              {
                title: "Court Name",
                dataIndex: "name",
                key: "name",
                sorter: (a, b) => a.name.localeCompare(b.name),
              },
              {
                title: "City",
                dataIndex: "city",
                key: "city",
                sorter: (a, b) => a.city.localeCompare(b.city),
              },
              {
                title: "Availability",
                dataIndex: "availability",
                key: "availability",
              },
              {
                title: "Upcoming Bookings",
                dataIndex: "upcomingBookings",
                key: "upcomingBookings",
                sorter: (a, b) => a.upcomingBookings - b.upcomingBookings,
                render: (count) => (
                  <Tag color={count > 0 ? "green" : "volcano"}>
                    {count > 0 ? `${count} Upcoming` : "No Bookings"}
                  </Tag>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <Tag color={status === "available" ? "blue" : "red"}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleViewCourt(record)}
                    >
                      View
                    </Button>
                  </Space>
                ),
              },
            ]}
            pagination={{ pageSize: 5 }}
            bordered
            className="shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ManageCourts;
