import React, { useState, useEffect } from "react";
import { Table, Tag, Button, message, Modal, Rate, Input } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Search } = Input;

const registeredMatchesData = [
  { key: "1", date: "2025-03-14", time: "17:00", location: "Court A", sport: "Basketball", status: "Upcoming", opponent: "Team Thunder" },
  { key: "2", date: "2025-03-10", time: "15:00", location: "Court C", sport: "Soccer", status: "Completed", opponent: "Team Eagles" },
  { key: "3", date: "2025-03-20", time: "19:00", location: "Court B", sport: "Tennis", status: "Cancelled", opponent: "Team Storm" },
];

const statusFilters = [
  { text: "Sắp diễn ra", value: "Upcoming" },
  { text: "Đã hoàn thành", value: "Completed" },
  { text: "Đã hủy", value: "Cancelled" },
  { text: "Đã lên lịch lại", value: "Rescheduled" },
  { text: "Chờ xác nhận", value: "Pending Confirmation" },
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
    message.warning("Yêu cầu hủy trận đấu đã được gửi.");
    setMatches(matches.map(m => (m.key === key ? { ...m, status: "Cancelled" } : m)));
    setFilteredMatches(filteredMatches.map(m => (m.key === key ? { ...m, status: "Cancelled" } : m)));
  };

  const handleOpenFeedbackModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (!rating || !feedback.trim()) {
      message.error("Vui lòng cung cấp đánh giá và phản hồi.");
      return;
    }

    message.success("Phản hồi đã được gửi thành công!");
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
    { title: "Ngày", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: "Thời gian", dataIndex: "time", key: "time", sorter: (a, b) => a.time.localeCompare(b.time) },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    { title: "Đối thủ", dataIndex: "opponent", key: "opponent" },
    { title: "Môn thể thao", dataIndex: "sport", key: "sport" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status.includes(value),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewDetails(record.key)} className="mr-2">Xem chi tiết</Button>
          {record.status === "Upcoming" && <Button danger onClick={() => handleCancelMatch(record.key)}>Hủy trận đấu</Button>}
          {record.status === "Completed" && <Button type="primary" onClick={() => handleOpenFeedbackModal(record)}>Viết đánh giá</Button>}
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
        title={`Đánh giá cho ${selectedMatch?.opponent}`}
        open={isModalOpen}
        onOk={handleSubmitFeedback}
        onCancel={() => setIsModalOpen(false)}
        okText="Gửi"
        cancelText="hủy"
      >
        <p>Đánh giá trận đấu:</p>
        <Rate allowHalf value={rating} onChange={setRating} />
        <p style={{ marginTop: 10 }}>Để lại đánh giá:</p>
        <Input.TextArea
          rows={4}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default UserRegisteredMatchesView;
