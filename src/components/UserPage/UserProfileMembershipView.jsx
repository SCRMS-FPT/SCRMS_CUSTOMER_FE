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
                <Title level={4}>Membership Details</Title>
                <Paragraph>
                    You are currently subscribed to the <strong>{membershipData.planName}</strong> plan.
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Text strong>Price:</Text> <Text>{membershipData.price}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Status:</Text>{" "}
                        <Text>
                            {membershipData.status === "Active" ? (
                                <span className="text-green-500">
                                    <CheckCircleOutlined /> Active
                                </span>
                            ) : membershipData.status === "Expired" ? (
                                <span className="text-red-500">
                                    <ExclamationCircleOutlined /> Expired
                                </span>
                            ) : (
                                <span className="text-gray-500">Cancelled</span>
                            )}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Start Date:</Text> <Text>{membershipData.startDate}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>End Date:</Text> <Text>{membershipData.endDate}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Remaining Days:</Text> <Text>{membershipData.remainingDays}</Text>
                    </Col>
                </Row>
                <Divider />
                <div>
                    <Title level={5}>Benefits</Title>
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
                        Renew Membership
                    </Button>
                    <Button
                        className="ml-4"
                        onClick={() => message.info("View details functionality not implemented yet.")}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        );
    };

    // Add or update this function in your UserProfileMembershipView component
    const renderSubscriptionInvitation = () => {
        return (
            <div className="p-8 text-center">
                <Title level={3} className="mb-4">No Membership Found</Title>
                <Paragraph>
                    You currently do not have an active membership pack. Subscribe now to unlock exclusive benefits, advanced features, and personalized support.
                </Paragraph>
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
                                        {plan.validity} validity, renew on {plan.renewalDate}
                                    </Text>
                                    <Divider />
                                    <Paragraph>{plan.description}</Paragraph>
                                    <Collapse ghost>
                                        <Panel header={<span className="font-semibold">Benefits</span>} key="1">
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
                                    <Button type="primary">Subscribe</Button>
                                    <Button icon={<InfoCircleOutlined />}>Learn More</Button>
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
                        <Title level={4}>Renew Membership</Title>
                        <Paragraph>Fill in the details below to renew your membership pack.</Paragraph>
                        <Form layout="vertical">
                            <Form.Item label="New Plan">
                                <Input
                                    placeholder="Enter new plan name"
                                    value={renewForm.newPlan}
                                    onChange={(e) => handleRenewFormChange("newPlan", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Duration (months)">
                                <Input
                                    type="number"
                                    placeholder="Enter duration in months"
                                    value={renewForm.duration}
                                    onChange={(e) => handleRenewFormChange("duration", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Start Date">
                                <Input
                                    type="date"
                                    value={renewForm.startDate}
                                    onChange={(e) => handleRenewFormChange("startDate", e.target.value)}
                                />
                            </Form.Item>
                            <div className="flex justify-end mt-4">
                                <Button type="primary" onClick={handleRenewMembership}>
                                    Submit Renewal
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
                title={<Title level={3}>Membership Management</Title>}
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
                        Membership Details
                    </button>
                    <button
                        className={`w-56 px-4 py-2 mx-2 transition-colors rounded ${activeTab === "renew"
                                ? "border-b-2 border-blue-500 font-bold text-blue-600"
                                : "text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("renew")}
                    >
                        Renew Membership
                    </button>
                    <button
                        className={`w-56 px-4 py-2 mx-2 transition-colors rounded ${activeTab === "membership"
                                ? "border-b-2 border-blue-500 font-bold text-blue-600"
                                : "text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab("membership")}
                    >
                        My Membership Pack
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
                title="Renew Membership"
                visible={renewModalVisible}
                onOk={handleRenewMembership}
                onCancel={() => setRenewModalVisible(false)}
                okText="Submit Renewal"
                cancelText="Cancel"
                width={600}
            >
                <div className="p-4">
                    <p>Please fill in the details below to renew your membership pack:</p>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">New Plan</label>
                        <input
                            type="text"
                            value={renewForm.newPlan}
                            onChange={(e) => handleRenewFormChange("newPlan", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                            placeholder="Enter new plan name"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Duration (months)</label>
                        <input
                            type="number"
                            value={renewForm.duration}
                            onChange={(e) => handleRenewFormChange("duration", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                            placeholder="Enter duration in months"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Start Date</label>
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
