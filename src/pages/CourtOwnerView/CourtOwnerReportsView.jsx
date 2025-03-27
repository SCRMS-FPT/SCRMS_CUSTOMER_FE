import React, { useState, useEffect } from "react";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import { Card, Statistic, Row, Col, Button, Table } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { DownloadOutlined } from "@ant-design/icons";

const CourtOwnerReportsView = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeCourts: 0,
    bookingTrend: [],
    revenueTrend: [],
    recentOrders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = {
        totalRevenue: 12450,
        totalBookings: 234,
        activeCourts: 5,
        activeVenues: 2,
        bookingTrend: [10, 20, 35, 50, 80, 65, 95, 100, 120, 140, 160, 180],
        revenueTrend: [500, 1000, 1500, 2000, 3500, 3000, 4500, 5000, 6000, 8000, 9000, 12500],
        recentOrders: [
          { key: "1", orderNumber: "#00126", date: "05-04-2023", customer: "Robert Johnson", total: 2455 },
          { key: "2", orderNumber: "#00125", date: "04-04-2023", customer: "Robert Johnson", total: 1254 },
          { key: "3", orderNumber: "#00124", date: "03-04-2023", customer: "Robert Johnson", total: 2455 },
        ],
      };
      setStats(response);
    };

    fetchData();
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const bookingData = {
    labels: months,
    datasets: [
      {
        label: "Bookings",
        data: stats.bookingTrend,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        pointRadius: 5,
        pointBackgroundColor: "#38bdf8",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: stats.revenueTrend,
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        pointRadius: 5,
        pointBackgroundColor: "#facc15",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex justify-between items-center">
        <span className="text-3xl">Court Owner Reports</span>
        <Button type="primary" icon={<DownloadOutlined />} onClick={() => console.log("Exporting data...")}>
          Export
        </Button>
      </h1>

      {/* Dashboard Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
            <Statistic title="Total Revenue" value={`$${stats.totalRevenue}`} valueStyle={{ color: "#facc15" }} />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
            <Statistic title="Total Bookings" value={stats.totalBookings} valueStyle={{ color: "#38bdf8" }} />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
            <Statistic title="Active Courts" value={stats.activeCourts} valueStyle={{ color: "#10b981" }} />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6} lg={6}>
          <Card className="dark:bg-gray-800 flex flex-col justify-between min-h-[135px]">
            <Statistic title="Active Venues" value={stats.activeVenues} valueStyle={{ color: "#1a4600" }} />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="my-6">
        {/* Booking Trend */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card className="dark:bg-gray-800 dark:text-white" style={{ minHeight: "320px" }}>
            <h2 className="text-lg font-bold mb-2">Booking Trend</h2>
            <div className="h-[260px]">
              <Line data={bookingData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        {/* Revenue Trend */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card className="dark:bg-gray-800 dark:text-white" style={{ minHeight: "320px" }}>
            <h2 className="text-lg font-bold mb-2">Revenue Trend</h2>
            <div className="h-[260px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card className="dark:bg-gray-800 dark:text-white">
        <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
        <Table
          dataSource={stats.recentOrders}
          columns={[
            { title: "No.", dataIndex: "orderNumber", key: "orderNumber" },
            { title: "Date/Time", dataIndex: "date", key: "date" },
            { title: "Customer", dataIndex: "customer", key: "customer" },
            { title: "Total", dataIndex: "total", key: "total", render: (total) => `$${total.toLocaleString()}` },
          ]}
          pagination={false}
          className="dark:bg-gray-800 dark:text-white"
        />
      </Card>
    </div>
  );
};

export default CourtOwnerReportsView;
