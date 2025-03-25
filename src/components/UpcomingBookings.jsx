import React, { useState } from "react";
import { Card, Typography, Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { format, parseISO, addDays, subDays } from "date-fns";
import WeekView from "./GeneralComponents/WeekView"; // Import the WeekView component

const { Title, Text } = Typography;

const bookedSchedules = [
  {
    title: "Team Standup",
    date: "2025-03-01",
    startTime: "09:10",
    endTime: "09:30",
  },
  {
    title: "Project Review",
    date: "2025-03-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    title: "Lunch Break",
    date: "2025-03-01",
    startTime: "12:30",
    endTime: "13:30",
  },
  {
    title: "Client Presentation",
    date: "2025-03-01",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    title: "Meeting",
    date: "2025-02-25",
    startTime: "15:00",
    endTime: "16:00",
  },

  {
    title: "Daily Standup",
    date: "2025-02-26",
    startTime: "09:00",
    endTime: "09:30",
  },
  {
    title: "Code Review",
    date: "2025-02-26",
    startTime: "10:30",
    endTime: "11:30",
  },
  {
    title: "Lunch Break",
    date: "2025-02-26",
    startTime: "12:30",
    endTime: "13:30",
  },
  {
    title: "Client Call",
    date: "2025-02-26",
    startTime: "14:30",
    endTime: "15:30",
  },

  {
    title: "Scrum Meeting",
    date: "2025-02-27",
    startTime: "09:00",
    endTime: "09:30",
  },
  {
    title: "Product Demo",
    date: "2025-02-27",
    startTime: "11:00",
    endTime: "12:00",
  },
];

const borderColors = ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"]; // Green, Orange, Blue, Purple

const UpcomingBookings = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // Default: Today
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");

  // Function to filter bookings by selected date
  const filteredBookings = bookedSchedules.filter(
    (booking) => booking.date === selectedDate
  );

  // Function to change date
  const changeDate = (direction) => {
    setSelectedDate((prevDate) => {
      const newDate =
        direction === "next"
          ? addDays(parseISO(prevDate), 1)
          : subDays(parseISO(prevDate), 1);
      return format(newDate, "yyyy-MM-dd");
    });
  };

  return (
    <>
      {/* Calendar Card */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "#fff",
          minHeight: 480,
          minWidth: 215,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Calendar
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LeftOutlined
              onClick={() => changeDate("prev")}
              style={{ cursor: "pointer" }}
            />
            <RightOutlined
              onClick={() => changeDate("next")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Date Display + TODAY Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Text type="secondary">
            {format(parseISO(selectedDate), "MMM d, EEE")}
          </Text>
          {selectedDate === today && (
            <Text
              type="secondary"
              style={{
                background: "#111827",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 8,
              }}
            >
              TODAY
            </Text>
          )}
        </div>

        {/* Scheduled Slots - Fixed height with overflow hidden */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {filteredBookings.length > 0 ? (
            filteredBookings.slice(0, 4).map((booking, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  marginBottom: 8,
                  background: "#fff",
                  position: "relative",
                  minHeight: 50, // Ensures each slot has consistent height
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: "100%",
                    backgroundColor: borderColors[index % borderColors.length], // Cycle through colors
                    borderRadius: 4,
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
                <div style={{ flex: 1, paddingLeft: 12 }}>
                  <Text strong>{booking.title}</Text>
                  <br />
                  <Text type="secondary">
                    {booking.startTime} - {booking.endTime}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Text type="secondary">No bookings for this date.</Text>
            </div>
          )}
        </div>

        {/* See Full Calendar Link */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Text
            type="secondary"
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={() => setIsModalOpen(true)}
          >
            See full calendar &gt;
          </Text>
        </div>
      </Card>

      {/* WeekView Modal */}
      <Modal
        title="Weekly Calendar View"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80vw"
        style={{ marginTop: "auto", marginBottom: "auto" }}
      >
        <WeekView bookedSchedules={bookedSchedules} />
      </Modal>
    </>
  );
};

export default UpcomingBookings;
