import React, { useState } from "react";
import { Card, Table, Button, Tag, Input, Space, Popconfirm, message, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined  } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const initialPromotions = [
  { id: "P001", title: "Spring Discount", discount: "20%", status: "Active" },
  { id: "P002", title: "Weekend Special", discount: "15%", status: "Expired" },
  { id: "P003", title: "Summer Offer", discount: "25%", status: "Active" },
  { id: "P004", title: "Holiday Bonus", discount: "10%", status: "Upcoming" },
];

const statusColors = {
  Active: "green",
  Expired: "red",
  Upcoming: "blue",
};

const CourtOwnerPromotionView = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState(initialPromotions);
  const [searchText, setSearchText] = useState("");

  // Handle delete confirmation
  const handleDelete = (id) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
    message.success("Promotion deleted successfully!");
  };

  // Search filter function
  const filteredPromotions = promotions.filter((promo) =>
    promo.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Promotion Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => parseInt(a.discount) - parseInt(b.discount),
      render: (discount) => <Tag color="gold">{discount}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: Object.keys(statusColors).map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/court-owner/promotions/details/${record.id}`)}
            />
          </Tooltip>
    
          <Tooltip title="Edit Promotion">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/court-owner/promotions/edit/${record.id}`)}
            />
          </Tooltip>
    
          <Popconfirm
            title="Are you sure to delete this promotion?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Promotion">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="🎟 Manage Promotions"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/court-owner/promotions/create")}>
          Add Promotion
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Title"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </Space>

      <Table
        dataSource={filteredPromotions}
        rowKey="id"
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default CourtOwnerPromotionView;
