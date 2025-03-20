"use client"
import { Table, Button, Space, Tag, Tooltip, Typography, Popconfirm } from "antd"
import { EditOutlined, DeleteOutlined, EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Text } = Typography

const SportsCenterTable = ({ data, onEdit, onDelete }) => {
    const columns = [
        {
            title: "Center Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`/courts-manage/${record.centerId}`} style={{ fontWeight: "500", color: "#1890ff" }}>
                    {text}
                </Link>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
            ellipsis: true,
            width: "20%",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (text) => (
                <Space>
                    <EnvironmentOutlined style={{ color: "#ff4d4f" }} />
                    <Text ellipsis={{ tooltip: text }}>{text}</Text>
                </Space>
            ),
            ellipsis: true,
            width: "25%",
        },
        {
            title: "Phone",
            dataIndex: "phone_number",
            key: "phone_number",
            render: (text) => (
                <Space>
                    <PhoneOutlined style={{ color: "#52c41a" }} />
                    <Text>{text}</Text>
                </Space>
            ),
            width: "15%",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <Tooltip title={text}>
                    <Text ellipsis={{ tooltip: text }}>{text}</Text>
                </Tooltip>
            ),
            ellipsis: true,
            width: "25%",
        },
        {
            title: "Location",
            dataIndex: ["location", "coordinates"],
            key: "location",
            render: (coordinates) => (
                <Tag color="blue">
                    {coordinates[0].toFixed(3)}, {coordinates[1].toFixed(3)}
                </Tag>
            ),
            width: "15%",
        },
        {
            title: "Actions",
            key: "action",
            width: "10%",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit center">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            shape="circle"
                            size="middle"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this center?"
                        onConfirm={() => onDelete(record)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <Tooltip title="Delete center">
                            <Button type="primary" danger icon={<DeleteOutlined />} shape="circle" size="middle" />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="centerId"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                pageSizeOptions: ["10", "20", "50"],
            }}
            bordered={false}
            size="middle"
            scroll={{ x: "100%" }}
            style={{
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
            }}
        />
    )
}

export default SportsCenterTable

