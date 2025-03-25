import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Tag, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Search } = Input;

const matchRequestsData = [
    { key: "1", date: "2025-03-22", time: "18:00", location: "Court D", sport: "Tennis", status: "Pending", organizer: "Alex Johnson" },
    { key: "2", date: "2025-03-25", time: "20:00", location: "Court A", sport: "Badminton", status: "Pending", organizer: "Chris Evans" },
    { key: "3", date: "2025-03-28", time: "19:00", location: "Court B", sport: "Basketball", status: "Joined", organizer: "Taylor Swift" },
];

const statusFilters = [
    { text: "Pending", value: "Pending" },
    { text: "Joined", value: "Joined" },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Pending": return "orange";
        case "Joined": return "green";
        default: return "gray";
    }
};

const UserMatchRequestsView = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "1";
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setRequests(matchRequestsData);
            setFilteredRequests(matchRequestsData);
        }, 500);
    }, []);

    const handleJoinMatch = (key) => {
        message.success("Match joined successfully!");
        setRequests((prev) => prev.map(m => (m.key === key ? { ...m, status: "Joined" } : m)));
        setFilteredRequests((prev) => prev.map(m => (m.key === key ? { ...m, status: "Joined" } : m)));
    };

    const handleViewDetails = (matchId) => {
        navigate(`/user/matching/${matchId}?tab=${activeTab}`);
      };

    const handleCreateMatchRequest = () => {
        navigate("/user/match-request/new");
    };

    const handleSearch = (value) => {
        const filtered = requests.filter(({ date, time, location, organizer, status }) =>
            [date, time, location, organizer, status].some((field) =>
                field.toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredRequests(filtered);
    };

    const columns = [
        { title: "Date", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
        { title: "Time", dataIndex: "time", key: "time" },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            filters: [...new Set(requests.map(r => ({ text: r.location, value: r.location })))],
            onFilter: (value, record) => record.location.includes(value),
        },
        {
            title: "Sport",
            dataIndex: "sport",
            key: "sport",
            filters: [...new Set(requests.map(r => ({ text: r.sport, value: r.sport })))],
            onFilter: (value, record) => record.sport.includes(value),
        },
        {
            title: "Organizer",
            dataIndex: "organizer",
            key: "organizer",
            filters: [...new Set(requests.map(r => ({ text: r.organizer, value: r.organizer })))],
            onFilter: (value, record) => record.organizer.includes(value),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: statusFilters,
            onFilter: (value, record) => record.status.includes(value),
            render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleViewDetails(record.key)}>View Details</Button>
                    {record.status === "Pending" && (
                        <Button type="primary" onClick={() => handleJoinMatch(record.key)}>Join Match</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                <Search placeholder="Search matches..." allowClear onChange={(e) => handleSearch(e.target.value)} style={{ width: "40%" }} />
                <Button type="primary" onClick={handleCreateMatchRequest}>Create Match Request</Button>
            </Space>
            <Table dataSource={filteredRequests} columns={columns} />
        </>
    );
};

export default UserMatchRequestsView;
