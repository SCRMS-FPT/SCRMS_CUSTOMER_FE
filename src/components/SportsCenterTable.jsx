import React from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SportsCenterTable = ({ data, onEdit, onDelete }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => onEdit(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => onDelete(record)} icon={<DeleteOutlined />} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={data} rowKey="name" />
    );
};

export default SportsCenterTable;