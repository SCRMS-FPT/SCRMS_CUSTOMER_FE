import React, { useEffect, useState } from "react";
import { Table, Spin, Tag, Button } from "antd";
import { Link } from "react-router-dom";

const UserCoachRegisteredView = () => {
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    // Simulating API Call
    setTimeout(() => {
      setCoaches([
        {
          id: 1,
          name: "Coach John Doe",
          email: "john.doe@example.com",
          registeredAt: "2024-03-01",
          sports: ["Football", "Basketball"], // Specialties
        },
        {
          id: 2,
          name: "Coach Jane Smith",
          email: "jane.smith@example.com",
          registeredAt: "2024-02-20",
          sports: ["Tennis", "Swimming"],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Registered Date", dataIndex: "registeredAt", key: "registeredAt" },
    {
      title: "Sports Specialties",
      dataIndex: "sports",
      key: "sports",
      render: (sports) =>
        sports.map((sport) => (
          <Tag color="blue" key={sport}>
            {sport}
          </Tag>
        )),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/user/coach/${record.id}`}>
          <Button type="primary">View Details</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2>Registered Coaches</h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table dataSource={coaches} columns={columns} rowKey="id" />
      )}
    </div>
  );
};

export default UserCoachRegisteredView;
