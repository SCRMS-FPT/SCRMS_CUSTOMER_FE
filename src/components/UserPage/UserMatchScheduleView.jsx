import React, { useState } from "react";
import { Calendar, Card, Badge, Modal, List, Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const matchSchedule = {
  "2025-03-10": [
    { key: "1", type: "success", content: "Match vs Team Eagles", status: "Completed" },
  ],
  "2025-03-14": [
    { key: "2", type: "processing", content: "Match vs Team Thunder", status: "Upcoming" },
    { key: "3", type: "warning", content: "Friendly Match vs Team Falcons", status: "Scheduled" },
  ],
  "2025-03-20": [
    { key: "4", type: "error", content: "Match vs Team Storm (Cancelled)", status: "Cancelled" },
  ],
};

const UserMatchScheduleView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "1";
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [selectedMonthMatches, setSelectedMonthMatches] = useState([]);

  // Unified cellRender function for both date and month views
  const cellRender = (current, info) => {
    if (info.type === "date") {
      // Handle date cells (Month View)
      const dateStr = current.format("YYYY-MM-DD");
      const matchList = matchSchedule[dateStr] || [];

      return matchList.length > 0 ? (
        <ul className="events">
          {matchList.map((item, index) => (
            <li key={index}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      ) : null;
    }

    if (info.type === "month") {
      // Handle month cells (Year View)
      const month = current.format("YYYY-MM");
      const matchesInMonth = Object.keys(matchSchedule)
        .filter(date => date.startsWith(month))
        .flatMap(date => matchSchedule[date]); // Collect all matches

      const matchCount = matchesInMonth.length; // Count all matches

      return matchCount > 0 ? (
        <div
          style={{ textAlign: "center", fontWeight: "bold", color: "#1890ff", cursor: "pointer" }}
          onClick={() => handleMonthClick(month)}
        >
          {matchCount} Matches
        </div>
      ) : null;
    }

    return null;
  };

  // Handle day selection (opens day-based modal)
  const handleDateSelect = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const matchList = matchSchedule[dateStr] || [];

    if (matchList.length > 0) {
      setSelectedDate(dateStr);
      setSelectedMatches(matchList);
      setIsModalOpen(true);
    }
  };

  // Handle month selection (opens month-based modal)
  const handleMonthClick = (month) => {
    const matchesInMonth = Object.keys(matchSchedule)
      .filter(date => date.startsWith(month))
      .flatMap(date => matchSchedule[date]); // Collect all matches

    if (matchesInMonth.length > 0) {
      setSelectedMonthMatches(matchesInMonth);
      setMonthModalOpen(true);
    }
  };

  // Navigate to match details
  const handleViewDetails = (matchId) => {
    setIsModalOpen(false);
    setMonthModalOpen(false);
    navigate(`/user/matching/${matchId}?tab=${activeTab}`);
  };

  return (
    <Card title="Match Schedule">
      <Calendar cellRender={cellRender} onSelect={handleDateSelect} />

      {/* Day-based Modal */}
      <Modal
        title={`Matches on ${selectedDate}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <List
          dataSource={selectedMatches}
          renderItem={(match) => (
            <List.Item>
              <Badge status={match.type} text={match.content} />
              <Button type="link" onClick={() => handleViewDetails(match.key)}>View Details</Button>
            </List.Item>
          )}
        />
      </Modal>

      {/* Month-based Modal */}
      <Modal
        title="Matches in Selected Month"
        open={monthModalOpen}
        onCancel={() => setMonthModalOpen(false)}
        footer={null}
      >
        <List
          dataSource={selectedMonthMatches}
          renderItem={(match) => (
            <List.Item>
              <Badge status={match.type} text={match.content} />
              <Button type="link" onClick={() => handleViewDetails(match.key)}>View Details</Button>
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default UserMatchScheduleView;
