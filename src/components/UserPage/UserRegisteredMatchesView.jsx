import React, { useState, useEffect } from "react";
import { Table, Tag, Button, message, Modal, Rate, Input } from "antd";
import { useNavigate, useSearchParams  } from "react-router-dom";

const { Search } = Input;

const registeredMatchesData = [
    { key: "1", date: "2025-03-14", time: "17:00", location: "Court A", sport: "Basketball", status: "Upcoming", opponent: "Team Thunder" },
    { key: "2", date: "2025-03-10", time: "15:00", location: "Court C", sport: "Soccer", status: "Completed", opponent: "Team Eagles" },
    { key: "3", date: "2025-03-20", time: "19:00", location: "Court B", sport: "Tennis", status: "Cancelled", opponent: "Team Storm" },
  ];

const statusFilters = [
  { text: "Upcoming", value: "Upcoming" },
  { text: "Completed", value: "Completed" },
  { text: "Cancelled", value: "Cancelled" },
  { text: "Rescheduled", value: "Rescheduled" },
  { text: "Pending Confirmation", value: "Pending Confirmation" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming": return "green";
    case "Completed": return "blue";
    case "Cancelled": return "red";
    case "Rescheduled": return "orange";
    case "Pending Confirmation": return "yellow";
    default: return "gray";
  }
};

const UserRegisteredMatchesView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const activeTab = searchParams.get("tab") || "1";
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setMatches(registeredMatchesData);
      setFilteredMatches(registeredMatchesData);
    }, 500);
  }, []);

  const handleCancelMatch = (key) => {
    message.warning("Match cancellation requested.");
    setMatches(matches.map(m => (m.key === key ? { ...m, status: "Cancelled" } : m)));
    setFilteredMatches(filteredMatches.map(m => (m.key === key ? { ...m, status: "Cancelled" } : m)));
  };

  const handleOpenFeedbackModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (!rating || !feedback.trim()) {
      message.error("Please provide a rating and feedback.");
      return;
    }

    message.success("Feedback submitted successfully!");
    setIsModalOpen(false);
    setRating(0);
    setFeedback("");
  };

  const handleViewDetails = (matchId) => {
    navigate(`/user/matching/${matchId}?tab=${activeTab}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = matches.filter(({ date, time, location, opponent, status }) =>
      [date, time, location, opponent, status].some((field) =>
        field.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredMatches(filtered);
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: "Time", dataIndex: "time", key: "time", sorter: (a, b) => a.time.localeCompare(b.time) },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Opponent", dataIndex: "opponent", key: "opponent" },
    { title: "Sport", dataIndex: "sport", key: "sport" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      filters: statusFilters,
      onFilter: (value, record) => record.status.includes(value),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag> 
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewDetails(record.key)} className="mr-2">View Details</Button>
          {record.status === "Upcoming" && <Button danger onClick={() => handleCancelMatch(record.key)}>Cancel Match</Button>}
          {record.status === "Completed" && <Button type="primary" onClick={() => handleOpenFeedbackModal(record)}>Write Review</Button>}
        </>
      ),
    },
  ];

  return (
    <>
      <Search
        placeholder="Search matches..."
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: "30%" }}
      />
      <Table dataSource={filteredMatches} columns={columns} />

      <Modal
        title={`Feedback for ${selectedMatch?.opponent}`}
        open={isModalOpen}
        onOk={handleSubmitFeedback}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <p>Rate the match:</p>
        <Rate allowHalf value={rating} onChange={setRating} />
        <p style={{ marginTop: 10 }}>Leave your feedback:</p>
        <Input.TextArea
          rows={4}
          placeholder="Describe your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default UserRegisteredMatchesView;
