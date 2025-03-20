"use client"

import { useEffect } from "react"
import { Form, Input, Button, Row, Col, Typography, Divider } from "antd"
import {
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined,
    SaveOutlined,
    CloseOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

const SportsCenterForm = ({ initialValues, onFinish, form }) => {
    useEffect(() => {
        if (initialValues) {
            // Format coordinates for display if they exist
            const formattedValues = {
                ...initialValues,
                location: {
                    ...initialValues.location,
                    coordinates: initialValues.location?.coordinates?.join(", "),
                },
            }
            form.setFieldsValue(formattedValues)
        } else {
            form.resetFields()
        }
    }, [initialValues, form])

    const handleFinish = (values) => {
        // Parse coordinates back to array format
        const coordinates = values.location?.coordinates
            ?.split(",")
            .map((coord) => Number.parseFloat(coord.trim()))
            .filter((coord) => !isNaN(coord))

        const formattedValues = {
            ...values,
            location: {
                type: "Point",
                coordinates: coordinates && coordinates.length === 2 ? coordinates : [0, 0],
            },
            // Generate a centerId if it's a new entry
            centerId: initialValues?.centerId || `centerId${Date.now()}`,
        }

        onFinish(formattedValues)
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues}
            requiredMark={false}
            style={{ width: "100%" }}
        >
            <Title level={5} style={{ marginBottom: "16px" }}>
                Sports Center Information
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: "24px" }}>
                Please fill in all the required information about the sports center.
            </Text>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="name"
                        label="Center Name"
                        rules={[{ required: true, message: "Please enter the center name" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Enter center name"
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: "Please enter phone number" }]}
                    >
                        <Input
                            prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Enter phone number"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name={["location", "coordinates"]}
                        label="Coordinates (longitude, latitude)"
                        rules={[
                            {
                                required: true,
                                message: "Please enter coordinates",
                                pattern: /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/,
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve()
                                    const coords = value.split(",").map((c) => Number.parseFloat(c.trim()))
                                    if (coords.length !== 2 || coords.some((c) => isNaN(c))) {
                                        return Promise.reject("Invalid coordinates format")
                                    }
                                    return Promise.resolve()
                                },
                            },
                        ]}
                    >
                        <Input
                            prefix={<EnvironmentOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="e.g. 106.700, 10.780"
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address" }]}>
                <Input prefix={<HomeOutlined style={{ color: "#bfbfbf" }} />} placeholder="Enter full address" size="large" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
            >
                <TextArea
                    placeholder="Enter center description"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    prefix={<InfoCircleOutlined style={{ color: "#bfbfbf" }} />}
                />
            </Form.Item>

            <Divider style={{ margin: "12px 0 24px" }} />

            <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <Button onClick={() => form.resetFields()} icon={<CloseOutlined />} size="large">
                        Reset
                    </Button>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        {initialValues ? "Update Center" : "Create Center"}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default SportsCenterForm

