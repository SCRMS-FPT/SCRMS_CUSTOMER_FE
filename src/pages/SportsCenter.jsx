import React, { useState } from 'react';
import { Button, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import sportsCentersData from '../data/sportsCenter';
import SportsCenterTable from '../components/SportsCenterTable';
import SportsCenterForm from '../components/SportsCenterForm';
import SportsCenterSearch from '../components/SportsCenterSearch';

const SportsCenter = () => {
    const [sportsCenters, setSportsCenters] = useState(sportsCentersData);
    const [newEntries, setNewEntries] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCenter, setEditingCenter] = useState(null);
    const [form] = Form.useForm();

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const mergedCenters = [...sportsCenters, ...newEntries];

    const filteredCenters = mergedCenters.filter(center =>
        Object.values(center).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const handleEdit = (record) => {
        setEditingCenter(record);
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        setSportsCenters(sportsCenters.filter(center => center !== record));
        setNewEntries(newEntries.filter(center => center !== record));
    };

    const handleAdd = () => {
        setEditingCenter(null);
        setIsModalVisible(true);
    };

    const handleOk = (values) => {
        if (editingCenter) {
            const updatedCenters = mergedCenters.map(center => center === editingCenter ? values : center);
            setSportsCenters(updatedCenters.filter(center => !newEntries.includes(center)));
            setNewEntries(updatedCenters.filter(center => newEntries.includes(center)));
        } else {
            setNewEntries([...newEntries, values]);
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div>
            <SportsCenterSearch searchText={searchText} handleSearch={handleSearch} />
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 20 }}>
                <PlusOutlined /> Add Sports Center
            </Button>
            <SportsCenterTable
                data={filteredCenters}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal
                title={editingCenter ? "Edit Sports Center" : "Add Sports Center"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <SportsCenterForm
                    initialValues={editingCenter}
                    onFinish={handleOk}
                    form={form}
                />
            </Modal>
        </div>
    );
};

export default SportsCenter;