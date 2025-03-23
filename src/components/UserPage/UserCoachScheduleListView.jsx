import React, { useEffect, useState } from "react";
import { Table, Spin, Tag, Button, Modal, Rate } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


const UserCoachScheduleListView = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [rating, setRating] = useState(0); // State for storing the rating
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "1";

  useEffect(() => {
    // Simulating API Call
    setTimeout(() => {
      setSchedules([
        {
          id: 101,
          title: "Morning Training",
          date: "2024-03-25",
          time: "10:00 AM",
          coach: "Coach John Doe",
          sport: "Football",
          location: "Field A",
          status: "Upcoming",
        },
        {
          id: 102,
          title: "Evening Training",
          date: "2024-03-26",
          time: "6:00 PM",
          coach: "Coach Jane Smith",
          sport: "Swimming",
          location: "Pool B",
          status: "Completed",
        },
      ]);
      setLoading(false);
    }, 100);
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Coach", dataIndex: "coach", key: "coach" },
    {
      title: "Sport",
      dataIndex: "sport",
      key: "sport",
      render: (sport) => <Tag color="blue">{sport}</Tag>,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Link to={`/user/coachings/schedule/${record.id}?tab=${activeTab}`}>
            <Button type="primary" style={{ marginRight: 8 }}>
              View Details
            </Button>
          </Link>
          {record.status === "Completed" && (
            <Button
              type="default"
              onClick={() => {
                setSelectedSchedule(record);
                setRating(0); // Reset rating when opening the modal
                setFeedbackModalVisible(true);
              }}
            >
              Write Feedback
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleFeedbackSubmit = () => {
    // Handle feedback submission logic here
    console.log("Feedback submitted for:", selectedSchedule.title);
    console.log("Rating:", rating);
    setFeedbackModalVisible(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalVisible(false);
  };

  return (
    <div>
      <h2>Coaching Schedules</h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table dataSource={schedules} columns={columns} rowKey="id" />
      )}

      {/* Feedback Modal */}
      <Modal
        title={`Feedback for ${selectedSchedule?.title}`}
        visible={feedbackModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={handleFeedbackCancel}
      >
        <div style={{ marginBottom: "16px" }}>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            style={{ fontSize: "20px" }}
          />
        </div>
        <textarea
          placeholder="Provide your feedback here..."
          rows={4}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default UserCoachScheduleListView;
