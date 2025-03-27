import React, { useState } from "react";
import { Card, Calendar, Badge, Modal, List, Button } from "antd";
import { useNavigate } from "react-router-dom";

// Mock court schedule data (Replace with API later)
const courtSchedule = {
  "2025-03-25": [
    { key: "101", type: "success", content: "Morning Session with Trainee John", location: "Gym A", trainee: "John Doe" },
  ],
  "2025-03-26": [
    { key: "102", type: "processing", content: "Evening Session with Trainee Jane", location: "Field B", trainee: "Jane Smith" },
  ],
  "2025-03-27": [
    { key: "103", type: "warning", content: "Advanced Coaching Session", location: "Hall C", trainee: "Alex Johnson" },
    { key: "104", type: "warning", content: "Advanced Coaching Session", location: "Hall C", trainee: "Alex Johnson" },
  ],
};

const CourtOwnerScheduleView = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthSessions, setSelectedMonthSessions] = useState([]);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [isYearView, setIsYearView] = useState(false);

  // Renders events inside the calendar
  const cellRender = (current, info) => {
    const dateStr = current.format("YYYY-MM-DD");
    const monthStr = current.format("YYYY-MM");

    if (info.type === "date") {
      // Handle daily schedule
      const sessionList = courtSchedule[dateStr] || [];
      return sessionList.length > 0 ? (
        <ul className="events">
          {sessionList.map((session) => (
            <li key={session.key}>
              <Badge status={session.type} text={session.content} />
            </li>
          ))}
        </ul>
      ) : null;
    }

    if (info.type === "month") {
      // Handle monthly summary
      const sessionsInMonth = Object.keys(courtSchedule)
        .filter(date => date.startsWith(monthStr))
        .flatMap(date => courtSchedule[date]);

      const sessionCount = sessionsInMonth.length;

      return sessionCount > 0 ? (
        <div
          style={{ textAlign: "center", fontWeight: "bold", color: "#1890ff", cursor: "pointer" }}
          onClick={() => openMonthModal(monthStr)}
        >
          {sessionCount} Sessions
        </div>
      ) : null;
    }

    return null;
  };

  // Handles date selection in Month View
  const handleDateSelect = (value) => {
    if (isYearView) return;

    const dateStr = value.format("YYYY-MM-DD");
    const sessionList = courtSchedule[dateStr] || [];

    if (sessionList.length > 0) {
      setSelectedDate(dateStr);
      setSelectedSessions(sessionList);
      setIsModalOpen(true);
    }
  };

  // Handles month selection in Year View
  const openMonthModal = (monthStr) => {
    // Close any previously opened daily session modal
    setIsModalOpen(false);

    const sessionsInMonth = Object.keys(courtSchedule)
      .filter(date => date.startsWith(monthStr))
      .flatMap(date => courtSchedule[date]);

    if (sessionsInMonth.length > 0) {
      setSelectedMonth(monthStr);
      setSelectedMonthSessions(sessionsInMonth);
      setMonthModalOpen(true);
    }
  };

  const handlePanelChange = (value, mode) => {
    if (mode === "year") {
      setIsYearView(true);  // ✅ Enter Year View
      openMonthModal(value.format("YYYY-MM"));
    } else {
      setIsYearView(false); // ✅ Back to Month View
    }
  };

  // Navigates to booking details
  const handleViewDetails = (sessionId) => {
    setIsModalOpen(false);
    navigate(`/court-owner/bookings/${sessionId}`);
  };

  return (
    <Card title="Court Schedule Management">
      <Calendar
        cellRender={cellRender}
        onSelect={handleDateSelect}
        onPanelChange={handlePanelChange}
      />

      {/* Modal for daily session details */}
      <Modal
        title={`Court Events on ${selectedDate}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
      >
        <List
          dataSource={selectedSessions}
          renderItem={(session) => (
            <List.Item>
              <Badge status={session.type} text={session.content} />
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{session.location}</span>
              <span style={{ marginLeft: "10px", fontStyle: "italic" }}>Players: {session.players}</span>
              <Button type="link" onClick={() => handleViewDetails(session.key)}>View Details</Button>
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal for monthly session details */}
      <Modal
        title={`Sessions in ${selectedMonth}`}
        open={monthModalOpen}
        onCancel={() => setMonthModalOpen(false)}
        footer={null}
        width={900}
      >
        <List
          dataSource={selectedMonthSessions}
          renderItem={(session) => (
            <List.Item>
              <Badge status={session.type} text={session.content} />
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{session.location}</span>
              <span style={{ marginLeft: "10px", fontStyle: "italic" }}>Players: {session.players}</span>
              <Button type="link" onClick={() => handleViewDetails(session.key)}>View Details</Button>
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default CourtOwnerScheduleView;
