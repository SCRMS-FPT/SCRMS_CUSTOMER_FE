import React, { useState } from "react";
import { Calendar, Card, Badge, Modal, List, Button } from "antd";
import { useNavigate } from "react-router-dom";

// Mock schedule data (Replace with API data later)
const coachSchedule = {
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

const CoachScheduleManagementView = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthSessions, setSelectedMonthSessions] = useState([]);
    const [monthModalOpen, setMonthModalOpen] = useState(false);
    const [isYearView, setIsYearView] = useState(false);

    // Renders session events inside the calendar
    const cellRender = (current, info) => {
        const dateStr = current.format("YYYY-MM-DD");
        const monthStr = current.format("YYYY-MM");

        if (info.type === "date") {
            // Handle month view (daily schedule)
            const sessionList = coachSchedule[dateStr] || [];
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
            // Handle year view (monthly schedule)
            const sessionsInMonth = Object.keys(coachSchedule)
                .filter(date => date.startsWith(monthStr)) // Get all dates in this month
                .flatMap(date => coachSchedule[date]); // Flatten to collect all sessions

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
        const sessionList = coachSchedule[dateStr] || [];

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


        const sessionsInMonth = Object.keys(coachSchedule)
            .filter(date => date.startsWith(monthStr))
            .flatMap(date => coachSchedule[date]);

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
    

    // Navigates to session details
    const handleViewDetails = (sessionId) => {
        setIsModalOpen(false);
        navigate(`/schedule/${sessionId}`);
    };

    return (
        <Card title="Manage Coaching Sessions">
            <Calendar cellRender={cellRender} onSelect={handleDateSelect} onPanelChange={handlePanelChange} />

            {/* Modal for session details */}
            <Modal
                title={`Coaching Sessions on ${selectedDate}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={900}  // Set the width of the modal to make it larger
            >
                <List
                    dataSource={selectedSessions}
                    renderItem={(session) => (
                        <List.Item>
                            <Badge status={session.type} text={session.content} />
                            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{session.location}</span>
                            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>Trainee: {session.trainee}</span>
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
                width={900}  // Set the width of the modal to make it larger
            >
                <List
                    dataSource={selectedMonthSessions}
                    renderItem={(session) => (
                        <List.Item>
                            <Badge status={session.type} text={session.content} />
                            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{session.location}</span>
                            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>Trainee: {session.trainee}</span>
                            <Button type="link" onClick={() => handleViewDetails(session.key)}>View Details</Button>
                        </List.Item>
                    )}
                />
            </Modal>
        </Card>
    );
};

export default CoachScheduleManagementView;
