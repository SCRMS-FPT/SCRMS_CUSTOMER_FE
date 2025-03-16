import React from 'react';
import { Table, Button } from 'antd';

const SportsCenterTable = ({ data, onEdit, onDelete }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={() => onEdit(record)}>Edit</Button>
                    <Button onClick={() => onDelete(record)} style={{ marginLeft: 8 }}>Delete</Button>
                </span>
            ),
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey="centerId" />;
};

export default SportsCenterTable;