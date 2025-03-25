import React from "react";
import { Table, Tag, Button } from "antd";

const TransactionHistoryTable = ({ transactions }) => {
  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Type", dataIndex: "type", key: "type", render: (type) => <Tag color="blue">{type}</Tag> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount) => `$${amount.toFixed(2)}` },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "Success" ? "green" : "red"}>{status}</Tag> },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => alert(`Viewing details for transaction ${record.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={transactions}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default TransactionHistoryTable;