import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Tag, Spin, Button, message, Typography, Row, Col, Modal, Rate, Input } from "antd";
import { ArrowLeftOutlined, UserOutlined, CreditCardOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Sample booking data (Replace with API fetch)
const bookingData = [
    {
        id: "1",
        user: "John Doe",
        court: "Court A",
        sport: "Tennis",
        date: "2025-03-10",
        time: "18:00",
        duration: "1 hour",
        status: "Completed",
        amountPaid: "$20",
        paymentStatus: "Paid",
        paymentMethod: "Credit Card",
        transactionId: "TXN123456",
        notes: "Bring extra rackets",
        createdAt: "2025-03-01 12:00",
        updatedAt: "2025-03-05 15:30",
    },
    {
        id: "2",
        user: "Alice Smith",
        court: "Court B",
        sport: "Basketball",
        date: "2025-03-12",
        time: "20:00",
        duration: "2 hours",
        status: "Pending",
        amountPaid: "$15",
        paymentStatus: "Unpaid",
        paymentMethod: "-",
        transactionId: "-",
        notes: "",
        createdAt: "2025-03-02 14:00",
        updatedAt: "2025-03-06 10:45",
    },
];

const UserBookingDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        setTimeout(() => {
            const foundBooking = bookingData.find((b) => b.id === id);
            if (foundBooking) {
                setBooking(foundBooking);
            } else {
                message.error("Booking not found");
                navigate("/user/bookings");
            }
            setLoading(false);
        }, 500);
    }, [id, navigate]);

    const handleSubmitReview = () => {
        if (!rating) {
            message.warning("Please select a rating.");
            return;
        }
        console.log("Review Submitted:", { rating, feedback });
        message.success("Thank you for your feedback!");
        setReviewModalVisible(false);
    };

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    return (
        <div className="container mx-auto p-6">
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <ArrowLeftOutlined onClick={() => navigate("/user/bookings")} style={{ cursor: "pointer" }} />
                        <Title level={4} style={{ margin: 0 }}>Booking Details</Title>
                    </div>
                }
                className="shadow-lg rounded-lg"
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Title level={5} className="mb-2"><UserOutlined /> Basic Information</Title>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Booking ID">{booking.id}</Descriptions.Item>
                            <Descriptions.Item label="User">{booking.user}</Descriptions.Item>
                            <Descriptions.Item label="Court">{booking.court}</Descriptions.Item>
                            <Descriptions.Item label="Sport">{booking.sport}</Descriptions.Item>
                            <Descriptions.Item label="Date">{booking.date}</Descriptions.Item>
                            <Descriptions.Item label="Time">{booking.time}</Descriptions.Item>
                            <Descriptions.Item label="Duration">{booking.duration}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={booking.status === "Completed" ? "blue" : booking.status === "Confirmed" ? "green" : booking.status === "Pending" ? "orange" : "red"}>
                                    {booking.status}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>

                    <Col span={12}>
                        <Title level={5} className="mb-2"><CreditCardOutlined /> Payment Details</Title>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Amount Paid">{booking.amountPaid}</Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Tag color={booking.paymentStatus === "Paid" ? "green" : "red"}>{booking.paymentStatus}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Method">{booking.paymentMethod}</Descriptions.Item>
                            <Descriptions.Item label="Transaction ID">{booking.transactionId}</Descriptions.Item>
                        </Descriptions>

                        <div className="mt-4">
                            <Title level={5} className="mb-2"><FileTextOutlined /> Additional Information</Title>
                            <Descriptions bordered column={1} className="mt-4">
                                <Descriptions.Item label="Booking Notes">{booking.notes || "No special instructions"}</Descriptions.Item>
                                <Descriptions.Item label="Created At">{booking.createdAt}</Descriptions.Item>
                                <Descriptions.Item label="Last Updated">{booking.updatedAt}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Col>
                </Row>

                <div className="mt-4 flex justify-end gap-2">
                    {booking.status === "Completed" && (
                        <Button type="primary" onClick={() => setReviewModalVisible(true)}>
                            Write Review
                        </Button>
                    )}
                    <Button onClick={() => navigate("/user/bookings")}>
                        Back to Bookings
                    </Button>
                </div>
            </Card>

            {/* Review Modal */}
            <Modal
                title="Rate Your Experience"
                open={reviewModalVisible}
                onCancel={() => setReviewModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setReviewModalVisible(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitReview}>Submit</Button>
                ]}
            >
                <div className="mb-4">
                    <Text>How was your experience?</Text>
                    <div className="mt-2">
                        <Rate value={rating} onChange={setRating} />
                    </div>
                </div>
                <div>
                    <Text>Additional Feedback (optional):</Text>
                    <TextArea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your thoughts..." />
                </div>
            </Modal>
        </div>
    );
};

export default UserBookingDetailView;
