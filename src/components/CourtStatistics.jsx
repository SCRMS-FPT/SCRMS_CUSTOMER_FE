import React, { useState, useEffect, useContext } from "react";
import { Card, Statistic, Row, Col, Progress, Table, Tag, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import UpcomingBookings from "./UpcomingBookings";

const CourtStatistics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        avgRating: 0,
        bookingTrend: [],
        revenueTrend: [],
        feedbacks: [],
        recentOrders: [],
    });

    useEffect(() => {
        // Mock API call
        const fetchData = async () => {
            const response = {
                totalRevenue: 12500,
                totalBookings: 320,
                avgRating: 4.5,
                bookingTrend: [10, 20, 35, 50, 80, 65, 95, 100, 120, 140, 160, 180],
                revenueTrend: [500, 1000, 1500, 2000, 3500, 3000, 4500, 5000, 6000, 8000, 9000, 12500],
                feedbacks: [
                    { key: 1, user: "John Doe", rating: 5, comment: "Great court!" },
                    { key: 2, user: "Jane Smith", rating: 4, comment: "Nice facilities but a bit crowded." },
                    { key: 3, user: "Mike Johnson", rating: 3, comment: "Could use better lighting." },
                ],
                recentOrders: [
                    {
                        key: "1",
                        orderNumber: "#00126",
                        date: "05-04-2023",
                        customer: "Robert Johnson",
                        items: 4,
                        paid: "Yes",
                        status: "Pending",
                        total: 2455,
                    },
                    {
                        key: "2",
                        orderNumber: "#00125",
                        date: "04-04-2023",
                        customer: "Robert Johnson",
                        items: 2,
                        paid: "Yes",
                        status: "Pending",
                        total: 1254,
                    },
                    {
                        key: "3",
                        orderNumber: "#00124",
                        date: "03-04-2023",
                        customer: "Robert Johnson",
                        items: 4,
                        paid: "Yes",
                        status: "Credited",
                        total: 2455,
                    },
                ]
            };
            setStats(response);
        };

        fetchData();
    }, []);

    const bookingData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Bookings",
                data: stats.bookingTrend,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.2)",
                fill: true,
            },
        ],
    };

    const revenueData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Revenue ($)",
                data: stats.revenueTrend,
                borderColor: "#facc15",
                backgroundColor: "rgba(250, 204, 21, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex justify-between items-center">
                <span className="text-3xl">Court Statistics</span>
                <Button type="primary" icon={<DownloadOutlined />} onClick={() => console.log("Exporting data...")}>
                    Export
                </Button>
            </h1>

            {/* Dashboard Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                {/* Total Revenue */}
                <Col xs={12} sm={12} md={6} lg={6}>
                    <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
                        <Statistic title="Total Revenue" value={`$${stats.totalRevenue}`} valueStyle={{ color: "#facc15" }} />
                    </Card>
                </Col>

                {/* Total Bookings */}
                <Col xs={12} sm={12} md={6} lg={6}>
                    <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
                        <Statistic title="Total Bookings" value={stats.totalBookings} valueStyle={{ color: "#38bdf8" }} />
                    </Card>
                </Col>

                {/* Average Rating */}
                <Col xs={12} sm={12} md={6} lg={6}>
                    <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
                        <Statistic title="Average Rating" value={stats.avgRating} valueStyle={{ color: "#10b981" }} suffix="/ 5" />
                        <Progress percent={(stats.avgRating / 5) * 100} status="active" showInfo={false} />
                    </Card>
                </Col>

                {/* New Customers */}
                <Col xs={12} sm={12} md={6} lg={6}>
                    <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
                        <Statistic title="New Customers" value={12} valueStyle={{ color: "#10b981" }} />
                    </Card>
                </Col>
            </Row>



            {/* Charts */}
            <Row
                gutter={[16, 16]} // Add spacing between items (for stacked mobile view)
                className="my-6"
                style={{ display: "flex", flexWrap: "wrap" }}
            >
                {/* Booking Trend */}
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Card
                        className="dark:bg-gray-800 dark:text-white"
                        style={{
                            minHeight: "320px", // Adjusts for smaller screens
                            height: "100%", // Makes it stretch when possible
                        }}
                    >
                        <h2 className="text-lg font-bold mb-2">Booking Trend</h2>
                        <Line data={bookingData} />
                    </Card>
                </Col>

                {/* Revenue Trend */}
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Card
                        className="dark:bg-gray-800 dark:text-white"
                        style={{
                            minHeight: "320px",
                            height: "100%",
                        }}
                    >
                        <h2 className="text-lg font-bold mb-2">Revenue Trend</h2>
                        <Line data={revenueData} />
                    </Card>
                </Col>

                {/* Upcoming Bookings */}
                <Col xs={24} sm={24} md={24} lg={4}>
                    <UpcomingBookings />
                </Col>
            </Row>

            {/* Recent Orders Section */}
            <Card className="dark:bg-gray-800 dark:text-white">
                <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
                <Table
                    dataSource={stats.recentOrders}
                    columns={[
                        {
                            title: "No.",
                            dataIndex: "orderNumber",
                            key: "orderNumber",
                        },
                        {
                            title: "Date/Time",
                            dataIndex: "date",
                            key: "date",
                        },
                        {
                            title: "Customer",
                            dataIndex: "customer",
                            key: "customer",
                        },
                        {
                            title: "Items",
                            dataIndex: "items",
                            key: "items",
                            render: (items) => `${items} items`,
                        },
                        {
                            title: "Paid",
                            dataIndex: "paid",
                            key: "paid",
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => {
                                let color = status === "Pending" ? "gold" : "green";
                                return <Tag color={color}>{status}</Tag>;
                            },
                        },
                        {
                            title: "Total",
                            dataIndex: "total",
                            key: "total",
                            render: (total) => `$${total.toLocaleString()}`,
                        },
                    ]}
                    pagination={false}
                    className="dark:bg-gray-800 dark:text-white"
                />
            </Card>
            <div className="my-6" />
            {/* Customer Feedback */}
            <Card className="dark:bg-gray-800 dark:text-white mt-6">
                <h2 className="text-lg font-bold mb-2">Customer Feedback</h2>
                <Table
                    dataSource={stats.feedbacks}
                    columns={[
                        { title: "User", dataIndex: "user", key: "user" },
                        { title: "Rating", dataIndex: "rating", key: "rating" },
                        { title: "Comment", dataIndex: "comment", key: "comment" },
                    ]}
                    pagination={false}
                    className="dark:bg-gray-800 dark:text-white"
                />
            </Card>
        </div>
    );
};

export default CourtStatistics;
