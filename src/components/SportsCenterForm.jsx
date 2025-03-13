import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, InfoCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

const SportsCenterForm = ({ initialValues, onFinish, form }) => {
    useEffect(() => {
        form.resetFields();
    }, [initialValues, form]);

    return (
        <Form
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
        >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input prefix={<HomeOutlined />} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input prefix={<InfoCircleOutlined />} />
            </Form.Item>
            <Form.Item name={['location', 'coordinates']} label="Coordinates" rules={[{ required: true }]}>
                <Input prefix={<EnvironmentOutlined />} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {initialValues ? "Update" : "Create"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SportsCenterForm;