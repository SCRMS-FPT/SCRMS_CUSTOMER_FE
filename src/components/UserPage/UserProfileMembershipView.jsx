// src/components/UserProfileMembershipView.jsx
//
// This component handles membership management for a user.
// It displays different views based on whether the user has an active membership pack.
// It provides three tabs:
//   1. Membership Details: Shows information about the current membership.
//   2. Renew Membership: Allows the user to renew their membership pack.
//   3. My Membership Pack: Displays details of the membership pack the user currently holds.
// If the user does not have a membership, it shows a subscription invitation.
// The component uses a modal for the renewal form and provides extensive UI feedback.

import React, { useState, useEffect } from "react";
import { Card, Typography, List, Button, Row, Col, Divider, Form, Input, Modal, message, Tabs } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
const { Panel } = Collapse;

// Ant Design Typography components
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// -------------------------------------------------------------------------
// MOCK DATA & INITIAL STATES
// -------------------------------------------------------------------------

// Simulated membership plans (in a real app, you might fetch these from an API)
const mockMembershipData = {
    // Uncomment the next line to simulate a user with an active membership pack
    hasMembership: true,
    // Uncomment the next line to simulate a user without any membership pack
    // hasMembership: false, 
    details: {
        planName: "Premium Membership",
        price: "$30/month",
        benefits: [
            "Access to all premium features",
            "Priority customer support",
            "Exclusive discounts on bookings",
            "Monthly newsletters",
            "Access to special events",
        ],
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        status: "Active", // possible values: Active, Expired, Cancelled
        remainingDays: 200,
    },
};

// Add this block after your imports:
const membershipPlans = [
    {
        id: 1,
        name: "Basic Membership",
        price: "$10/month",
        validity: "30 days",
        renewalDate: "2025-03-01",
        benefits: [
            "Access to basic features",
            "Limited support",
            "Access to community forums",
        ],
        description:
            "This plan gives you access to the essential features and community support. Perfect for newcomers.",
    },
    {
        id: 2,
        name: "Premium Membership",
        price: "$30/month",
        validity: "30 days",
        renewalDate: "2025-03-01",
        benefits: [
            "Access to all features",
            "Priority support",
            "Discounts on bookings",
            "Exclusive content and webinars",
            "Free monthly consultation",
        ],
        description:
            "The premium plan offers a comprehensive package that includes all features, priority support, and exclusive benefits. Ideal for power users.",
    },
];

// -------------------------------------------------------------------------
// MAIN COMPONENT: UserProfileMembershipView
// -------------------------------------------------------------------------

const UserProfileMembershipView = () => {
    // State indicating if the user currently has a membership pack
    const [hasMembership, setHasMembership] = useState(false);
    // State for membership details if available
    const [membershipData, setMembershipData] = useState(null);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // Active tab key for the custom tab navigation ("details", "renew", "membership")
    const [activeTab, setActiveTab] = useState("details");
    // State for update message after an action (e.g., renewal)
    const [updateMessage, setUpdateMessage] = useState("");

    // States for the membership renewal modal and form
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [renewForm, setRenewForm] = useState({
        newPlan: "",
        duration: "",
        startDate: "",
    });

    // -------------------------------------------------------------------------
    // Simulate fetching membership data from an API (mock data used here)
    // -------------------------------------------------------------------------
    useEffect(() => {
        // Simulated API delay
        setTimeout(() => {
            // For demonstration, using mockMembershipData (toggle hasMembership to simulate either case)
            setHasMembership(mockMembershipData.hasMembership);
            if (mockMembershipData.hasMembership) {
                setMembershipData(mockMembershipData.details);
            }
            setLoading(false);
        }, 500);
    }, []);

    // -------------------------------------------------------------------------
    // Helper function: Handle changes in the renewal form fields.
    // -------------------------------------------------------------------------
    const handleRenewFormChange = (field, value) => {
        setRenewForm((prev) => ({ ...prev, [field]: value }));
    };

    // -------------------------------------------------------------------------
    // Helper function: Handle membership renewal submission.
    // This simulates a submission; in a real app, you would call an API.
    // -------------------------------------------------------------------------
    const handleRenewMembership = () => {
        // Simulate API call for renewal
        message.success("Membership renewed successfully!");
        setRenewModalVisible(false);
        // Optionally update membershipData, e.g., extend endDate, update remainingDays, etc.
        setUpdateMessage("Your membership has been renewed successfully.");
        // Reset renewal form
        setRenewForm({ newPlan: "", duration: "", startDate: "" });
    };

    // -------------------------------------------------------------------------
    // RENDER FUNCTIONS FOR DIFFERENT TABS
    // -------------------------------------------------------------------------

    // Renders membership details when a user has a membership
    const renderMembershipDetails = () => {
        if (!membershipData) return null;

        return (
            <div className="p-4">
                <Title level={4}>Thông tin gói thành viên</Title>
                <Paragraph>
                    Bạn hiện tại đang đăng kí gói thành viên <strong>{membershipData.planName}</strong> .
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Text strong>Giá tiền:</Text> <Text>{membershipData.price}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Trạng thái:</Text>{" "}
                        <Text>
                            {membershipData.status === "Active" ? (
                                <span className="text-green-500">
                                    <CheckCircleOutlined /> Đang kích hoạt
                                </span>
                            ) : membershipData.status === "Expired" ? (
                                <span className="text-red-500">
                                    <ExclamationCircleOutlined /> Hết hạn
                                </span>
                            ) : (
                                <span className="text-gray-500">Đã hủy</span>
                            )}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Ngày bắt đầu:</Text> <Text>{membershipData.startDate}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Ngày kết thúc:</Text> <Text>{membershipData.endDate}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Số ngày còn lại:</Text> <Text>{membershipData.remainingDays}</Text>
                    </Col>
                </Row>
                <Divider />
                <div>
                    <Title level={5}>Lợi ích</Title>
                    <List
                        dataSource={membershipData.benefits}
                        renderItem={(benefit, index) => (
                            <List.Item key={index} className="text-gray-700">
                                {benefit}
                            </List.Item>
                        )}
                        bordered
                    />
                </div>
                <Divider />
                <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={() => setRenewModalVisible(true)}>
                        Tái kích hoạt gói thành viên
                    </Button>
                    <Button
                        className="ml-4"
                        onClick={() => message.info("View details functionality not implemented yet.")}
                    >
                        Xem thông tin chi tiết
                    </Button>
                </div>
            </div>
        );
    };

    // Add or update this function in your UserProfileMembershipView component
    const renderSubscriptionInvitation = () => {
        return (
            <div className="p-8 text-center">
                <Title level={3} className="mb-4">Không có gói thành viên nào</Title>
                <Paragraph>
                    Hiện tại bạn không có gói thành viên hoạt động. Hãy đăng ký ngay để mở khóa các lợi ích độc quyền, 
                    tính năng nâng cao và hỗ trợ cá nhân hóa.                </Paragraph>
                <Divider />
                <Row gutter={[24, 24]} justify="center">
                    {membershipPlans.map((plan) => (
                        <Col xs={24} md={12} key={plan.id}>
                            <Card
                                bordered={false}
                                className="shadow-xl rounded-xl"
                                style={{
                                    background: "linear-gradient(135deg, #f0f5ff, #ffffff)",
                                    padding: "24px",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Title level={4} className="m-0">
                                            {plan.name}
                                        </Title>
                                        <Text strong className="text-xl text-blue-600">
                                            {plan.price}
                                        </Text>
                                    </div>
                                    <Text type="secondary">
                                        {plan.validity} khả dụng, đăng kí gói lại vào ngày {plan.renewalDate}
                                    </Text>
                                    <Divider />
                                    <Paragraph>{plan.description}</Paragraph>
                                    <Collapse ghost>
                                        <Panel header={<span className="font-semibold">Lợi ích</span>} key="1">
                                            <ul className="list-disc pl-6">
                                                {plan.benefits.map((benefit, index) => (
                                                    <li key={index} className="text-gray-700 flex items-center">
                                                        <CheckCircleOutlined className="text-green-500 mr-2" /> {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Panel>
                                    </Collapse>
                                </div>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <Button type="primary">Đăng kí</Button>
                                    <Button icon={<InfoCircleOutlined />}>Tìm hiểu thêm</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    // Render the content for each custom tab based on activeTab state.
    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return hasMembership ? renderMembershipDetails() : renderSubscriptionInvitation();
            case "renew":
                return hasMembership ? (
                    <div className="p-4">
                        <Title level={4}>Tái kích hoạt gói thành viên</Title>
                        <Paragraph>Điền vào thông tin phía dưới để tái kích hoạt gói thành viên.</Paragraph>
                        <Form layout="vertical">
                            <Form.Item label="Gói mới">
                                <Input
                                    placeholder="Nhập tên gói mới"
                                    value={renewForm.newPlan}
                                    onChange={(e) => handleRenewFormChange("newPlan", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Thời hạn (Tháng)">
                                <Input
                                    type="number"
                                    placeholder="Nhập thời hạn theo tháng"
                                    value={renewForm.duration}
                                    onChange={(e) => handleRenewFormChange("duration", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Ngày bắt đầu">
                                <Input
                                    type="date"
                                    value={renewForm.startDate}
                                    onChange={(e) => handleRenewFormChange("startDate", e.target.value)}
                                />
                            </Form.Item>
                            <div className="flex justify-end mt-4">
                                <Button type="primary" onClick={handleRenewMembership}>
                                    Tái kích hoạt
                                </Button>
                            </div>
                        </Form>
                    </div>
                ) : (
                    // If no membership, prompt subscription in the Renew tab as well.
                    renderSubscriptionInvitation()
                );
            case "membership":
                return hasMembership ? renderMembershipDetails() : renderSubscriptionInvitation();
            default:
                return null;
        }
    };


    // -------------------------------------------------------------------------
    // Main render of the component.
    // -------------------------------------------------------------------------
    return (
        <div className="container mx-auto p-6">
            <Card
                title={<Title level={3}>Quản lý gói thành viên</Title>}
                bordered={false}
                className="shadow-xl rounded-lg"
                style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
            >
                {/* Custom Tab Navigation */}
                <div className="flex justify-center border-b pb-4 mb-6">
                    <button
                        className={`w-56 px-4 py-2 mx-2 transition-colors rounded ${activeTab === "details"
                            ? "border-b-2 border-blue-500 font-bold text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("details")}
                    >
                        Thông tin gói thành viên
                    </button>
                    <button
                        className={`w-56 px-4 py-2 mx-2 transition-colors rounded ${activeTab === "renew"
                            ? "border-b-2 border-blue-500 font-bold text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("renew")}
                    >
                        Tái kích hoạt gói thành viên
                    </button>
                    <button
                        className={`w-56 px-4 py-2 mx-2 transition-colors rounded ${activeTab === "membership"
                            ? "border-b-2 border-blue-500 font-bold text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("membership")}
                    >
                        Gói thành viên của tôi
                    </button>
                </div>

                {/* Tab Content */}
                <div>{renderTabContent()}</div>

                {updateMessage && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
                        {updateMessage}
                    </div>
                )}
            </Card>

            {/* Renewal Modal (Detailed Form) */}
            <Modal
                title="Tái kích hoạt gói thành viên"
                visible={renewModalVisible}
                onOk={handleRenewMembership}
                onCancel={() => setRenewModalVisible(false)}
                okText="Submit Renewal"
                cancelText="Cancel"
                width={600}
            >
                <div className="p-4">
                    <p>Vui lòng nhập thông tin phía dưới đây để tái kích hoạt gói thành viên:</p>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Gói mới</label>
                        <input
                            type="text"
                            value={renewForm.newPlan}
                            onChange={(e) => handleRenewFormChange("newPlan", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                            placeholder="Nhập tên gói mới"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Thời hạn (tháng)</label>
                        <input
                            type="number"
                            value={renewForm.duration}
                            onChange={(e) => handleRenewFormChange("duration", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                            placeholder="Nhập thời hạn theo tháng"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={renewForm.startDate}
                            onChange={(e) => handleRenewFormChange("startDate", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserProfileMembershipView;
