import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Statistic,
  Button,
  Tag,
  Tabs,
  List,
  Row,
  Col,
  Progress,
  Typography,
  Modal,
  Space,
  Divider,
  Radio,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  AlertOutlined,
  BellOutlined,
  HomeOutlined,
  DownloadOutlined,
  CheckOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Client } from "@/API/CourtApi";
import { Client as PaymentClient } from "@/API/PaymentApi";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Box, CircularProgress } from "@mui/material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const { Title, Text, Paragraph } = Typography;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CourtOwnerDashboardView = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Revenue chart controls
  const [periodType, setPeriodType] = useState("month");
  const [dateRange, setDateRange] = useState("1year");

  // API data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format currency function
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Generate all periods function for complete chart
  const generateAllPeriods = (startDateStr, endDateStr, timeRange) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const periods = [];

    if (timeRange === "month") {
      // Generate all months in the range
      const currentDate = new Date(startDate);
      currentDate.setDate(1); // Set to first day of month

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        // JavaScript months are 0-indexed, so add 1
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        periods.push(`${year}-${month}`);

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (timeRange === "quarter") {
      // Generate all quarters in the range
      const currentDate = new Date(startDate);
      // Set to first month of quarter
      currentDate.setMonth(Math.floor(currentDate.getMonth() / 3) * 3);
      currentDate.setDate(1);

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        periods.push(`${year}-Q${quarter}`);

        // Move to next quarter (add 3 months)
        currentDate.setMonth(currentDate.getMonth() + 3);
      }
    } else if (timeRange === "year") {
      // Generate all years in the range
      for (
        let year = startDate.getFullYear();
        year <= endDate.getFullYear();
        year++
      ) {
        periods.push(`${year}`);
      }
    }

    return periods;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Calculate date ranges based on selected range
        const currentDate = new Date();
        const endDate = currentDate.toISOString().split("T")[0];
        const startDate = new Date(currentDate);

        if (dateRange === "3years") {
          startDate.setFullYear(startDate.getFullYear() - 3);
        } else {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const formattedStartDate = startDate.toISOString().split("T")[0];

        // Fetch dashboard stats
        const courtClient = new Client();
        const stats = await courtClient.getCourtOwnerDashboard();
        setDashboardStats(stats);

        // Fetch revenue report
        const paymentClient = new PaymentClient();
        const revenueReport = await paymentClient.getCourtRevenueReport(
          formattedStartDate,
          endDate,
          periodType
        );
        setRevenueData(revenueReport);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [periodType, dateRange]);

  // Calculate utilization metrics - updating calculation as requested
  const courtUtilization = dashboardStats
    ? Math.min(
        100,
        dashboardStats.completedBookingRate +
          dashboardStats.confirmedBookingRate
      )
    : 0;

  // Function to open modal with notification details
  const showNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  // Format period labels for chart
  const formatPeriodLabel = (period) => {
    if (!period) return "";

    if (periodType === "month") {
      const [year, month] = period.split("-");
      return `T${month}/${year.slice(2)}`;
    } else if (periodType === "quarter") {
      if (period.includes("Q")) {
        return `Q${period.charAt(period.length - 1)}/${period
          .slice(0, 4)
          .slice(2)}`;
      }
    } else if (periodType === "year") {
      return period;
    }

    return period;
  };

  // Prepare chart data with all periods (even empty ones)
  const prepareChartData = () => {
    if (!revenueData || !revenueData.dateRange) return null;

    // Generate all periods in the date range
    const allPeriods = generateAllPeriods(
      revenueData.dateRange.startDate,
      revenueData.dateRange.endDate,
      periodType
    );

    // Create a map of existing revenue data
    const revenueMap = {};
    if (revenueData.stats) {
      revenueData.stats.forEach((stat) => {
        revenueMap[stat.period] = stat.revenue;
      });
    }

    // Create a complete dataset with all periods
    const labels = allPeriods.map((period) => formatPeriodLabel(period));
    const data = allPeriods.map((period) => revenueMap[period] || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: "Doanh thu",
          data: data,
          borderColor: "#1677ff",
          backgroundColor: "rgba(22, 119, 255, 0.2)",
          pointRadius: 5,
          pointBackgroundColor: "#1677ff",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
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
          callback: function (value) {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              notation: "compact",
            }).format(value);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
      },
    },
  };

  // Mock data for notifications
  const notifications = [
    {
      key: "1",
      message: "Court B requires maintenance",
      type: "Maintenance",
      time: "10 mins ago",
    },
    {
      key: "2",
      message: "New member registration: Alex",
      type: "Membership",
      time: "30 mins ago",
    },
    {
      key: "3",
      message: "Payment received: 500.000₫ from John Doe",
      type: "Payment",
      time: "1 hour ago",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <CircularProgress size={60} sx={{ color: "#1677ff", mb: 3 }} />
        <Text className="text-lg mt-4">Đang tải dữ liệu dashboard...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  const chartData = prepareChartData();

  // Format percentage with 1 decimal place
  const formatPercentage = (value) => {
    if (!value && value !== 0) return "0.0%";
    return `${parseFloat(value).toFixed(1)}%`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Top Stats Row */}
            <motion.div variants={fadeIn} className="mb-6">
              <Row gutter={16}>
                <Col span={6}>
                  <Card
                    hoverable
                    className="h-full transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ padding: "20px", height: "100%" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text type="secondary" className="text-base">
                            Trung tâm thể thao
                          </Text>
                          <Title level={2} className="my-2 text-primary">
                            {dashboardStats?.totalSportCenters || 0}
                          </Title>
                        </div>
                        <div
                          className="bg-blue-50 p-2 rounded-full flex items-center justify-center"
                          style={{ width: 48, height: 48 }}
                        >
                          <EnvironmentOutlined
                            style={{ fontSize: "24px", color: "#1677ff" }}
                          />
                        </div>
                      </div>
                      <div className="mt-auto pt-4 flex items-center">
                        <Tag color="blue" icon={<TeamOutlined />}>
                          Quản lý trung tâm thể thao
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card
                    hoverable
                    className="h-full transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ padding: "20px", height: "100%" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text type="secondary" className="text-base">
                            Tổng số sân
                          </Text>
                          <Title level={2} className="my-2 text-purple-500">
                            {dashboardStats?.totalCourts || 0}
                          </Title>
                        </div>
                        <div
                          className="bg-purple-50 p-2 rounded-full flex items-center justify-center"
                          style={{ width: 48, height: 48 }}
                        >
                          <HomeOutlined
                            style={{ fontSize: "24px", color: "#722ed1" }}
                          />
                        </div>
                      </div>
                      <div className="mt-auto pt-4 flex items-center">
                        <Tag color="purple" icon={<EnvironmentOutlined />}>
                          Sân hoạt động
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card
                    hoverable
                    className="h-full transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ padding: "20px", height: "100%" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text type="secondary" className="text-base">
                            Tổng lượt đặt
                          </Text>
                          <Title level={2} className="my-2 text-green-600">
                            {dashboardStats?.totalBookings || 0}
                          </Title>
                        </div>
                        <div
                          className="bg-green-50 p-2 rounded-full flex items-center justify-center"
                          style={{ width: 48, height: 48 }}
                        >
                          <CalendarOutlined
                            style={{ fontSize: "24px", color: "#52c41a" }}
                          />
                        </div>
                      </div>
                      <div className="mt-auto pt-4 flex items-center">
                        <Tag color="green" icon={<CheckOutlined />}>
                          Lượt đặt sân
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card
                    hoverable
                    className="h-full transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ padding: "20px", height: "100%" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text type="secondary" className="text-base">
                            Tỉ lệ đặt sân
                          </Text>
                          <Title
                            level={2}
                            className="my-2"
                            style={{
                              color:
                                courtUtilization > 80
                                  ? "#f5222d"
                                  : courtUtilization > 50
                                  ? "#fa8c16"
                                  : "#52c41a",
                            }}
                          >
                            {formatPercentage(courtUtilization)}
                          </Title>
                        </div>
                        <div
                          className="bg-orange-50 p-2 rounded-full flex items-center justify-center"
                          style={{ width: 48, height: 48 }}
                        >
                          <TrophyOutlined
                            style={{ fontSize: "24px", color: "#fa8c16" }}
                          />
                        </div>
                      </div>
                      <div className="mt-auto pt-2">
                        <Tooltip title="Tổng tỉ lệ đặt sân (đã xác nhận + đã hoàn thành)">
                          <Progress
                            percent={courtUtilization}
                            size="small"
                            status={
                              courtUtilization > 80
                                ? "exception"
                                : courtUtilization > 50
                                ? "active"
                                : "success"
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </motion.div>

            {/* Second Row: Revenue Stats */}
            <motion.div variants={fadeIn} className="mb-6">
              <Row gutter={16}>
                {/* Revenue Chart */}
                <Col span={16}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <BarChartOutlined className="text-blue-500" />
                        <span>Biểu đồ doanh thu</span>
                      </div>
                    }
                    className="transition-all duration-300 hover:shadow-lg"
                    extra={
                      <Space>
                        <Radio.Group
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          buttonStyle="solid"
                          size="small"
                        >
                          <Radio.Button value="1year">1 năm</Radio.Button>
                          <Radio.Button value="3years">3 năm</Radio.Button>
                        </Radio.Group>

                        <Radio.Group
                          value={periodType}
                          onChange={(e) => setPeriodType(e.target.value)}
                          buttonStyle="solid"
                          size="small"
                        >
                          <Radio.Button value="month">Tháng</Radio.Button>
                          <Radio.Button value="quarter">Quý</Radio.Button>
                          <Radio.Button value="year">Năm</Radio.Button>
                        </Radio.Group>
                      </Space>
                    }
                  >
                    <div
                      style={{ height: "350px", width: "100%" }}
                      className="p-2"
                    >
                      {chartData ? (
                        <Line data={chartData} options={chartOptions} />
                      ) : (
                        <div className="flex flex-col justify-center items-center h-full">
                          <Icon
                            icon="solar:chart-square-linear"
                            width={48}
                            className="text-gray-300 mb-3"
                          />
                          <Text type="secondary" className="text-base">
                            Không có dữ liệu doanh thu
                          </Text>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>

                {/* Revenue Stats */}
                <Col span={8}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <DollarOutlined className="text-green-600" />
                        <span>Thống kê doanh thu</span>
                      </div>
                    }
                    className="h-full transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-6">
                      {/* Daily Revenue */}
                      <div className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md">
                        <Text type="secondary">Doanh thu hôm nay</Text>
                        <div className="flex justify-between items-center mt-2">
                          <Title level={3} className="my-0 text-lg">
                            {formatCurrency(
                              dashboardStats?.todayRevenue?.amount || 0
                            )}
                          </Title>
                          <div className="flex items-center">
                            {dashboardStats?.todayRevenue?.isIncrease ? (
                              <Tag
                                color="success"
                                className="flex items-center gap-1"
                              >
                                <RiseOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.todayRevenue?.percentageChange
                                )}
                              </Tag>
                            ) : (
                              <Tag
                                color="error"
                                className="flex items-center gap-1"
                              >
                                <FallOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.todayRevenue?.percentageChange
                                )}
                              </Tag>
                            )}
                          </div>
                        </div>
                        <Progress
                          percent={Math.min(
                            100,
                            Math.abs(
                              dashboardStats?.todayRevenue?.percentageChange ||
                                0
                            )
                          )}
                          size="small"
                          status={
                            dashboardStats?.todayRevenue?.isIncrease
                              ? "success"
                              : "exception"
                          }
                          className="mt-2"
                        />
                      </div>

                      {/* Weekly Revenue */}
                      <div className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md">
                        <Text type="secondary">Doanh thu tuần này</Text>
                        <div className="flex justify-between items-center mt-2">
                          <Title level={3} className="my-0 text-lg">
                            {formatCurrency(
                              dashboardStats?.weeklyRevenue?.amount || 0
                            )}
                          </Title>
                          <div className="flex items-center">
                            {dashboardStats?.weeklyRevenue?.isIncrease ? (
                              <Tag
                                color="success"
                                className="flex items-center gap-1"
                              >
                                <RiseOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.weeklyRevenue
                                    ?.percentageChange
                                )}
                              </Tag>
                            ) : (
                              <Tag
                                color="error"
                                className="flex items-center gap-1"
                              >
                                <FallOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.weeklyRevenue
                                    ?.percentageChange
                                )}
                              </Tag>
                            )}
                          </div>
                        </div>
                        <Progress
                          percent={Math.min(
                            100,
                            Math.abs(
                              dashboardStats?.weeklyRevenue?.percentageChange ||
                                0
                            )
                          )}
                          size="small"
                          status={
                            dashboardStats?.weeklyRevenue?.isIncrease
                              ? "success"
                              : "exception"
                          }
                          className="mt-2"
                        />
                      </div>

                      {/* Monthly Revenue */}
                      <div className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md">
                        <Text type="secondary">Doanh thu tháng này</Text>
                        <div className="flex justify-between items-center mt-2">
                          <Title level={3} className="my-0 text-lg">
                            {formatCurrency(
                              dashboardStats?.monthlyRevenue?.amount || 0
                            )}
                          </Title>
                          <div className="flex items-center">
                            {dashboardStats?.monthlyRevenue?.isIncrease ? (
                              <Tag
                                color="success"
                                className="flex items-center gap-1"
                              >
                                <RiseOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.monthlyRevenue
                                    ?.percentageChange
                                )}
                              </Tag>
                            ) : (
                              <Tag
                                color="error"
                                className="flex items-center gap-1"
                              >
                                <FallOutlined />{" "}
                                {formatPercentage(
                                  dashboardStats?.monthlyRevenue
                                    ?.percentageChange
                                )}
                              </Tag>
                            )}
                          </div>
                        </div>
                        <Progress
                          percent={Math.min(
                            100,
                            Math.abs(
                              dashboardStats?.monthlyRevenue
                                ?.percentageChange || 0
                            )
                          )}
                          size="small"
                          status={
                            dashboardStats?.monthlyRevenue?.isIncrease
                              ? "success"
                              : "exception"
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </motion.div>

            {/* Third Row: Booking Analysis & Completion Rate */}
            <motion.div variants={fadeIn}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:chart-line-bold-duotone"
                          className="text-blue-500"
                          width="20"
                        />
                        <span>Phân tích tỉ lệ đặt sân</span>
                      </div>
                    }
                    className="transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ height: "fit-content" }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex gap-6 mb-6">
                        <Statistic
                          title="Tỉ lệ đặt sân đã xác nhận"
                          value={formatPercentage(
                            dashboardStats?.confirmedBookingRate
                          )}
                          valueStyle={{ color: "#1677ff" }}
                        />
                        <Statistic
                          title="Tỉ lệ đặt sân đã hoàn thành"
                          value={formatPercentage(
                            dashboardStats?.completedBookingRate
                          )}
                          valueStyle={{ color: "#52c41a" }}
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-1">
                          <Text>Tỉ lệ đã xác nhận</Text>
                          <Text strong>
                            {formatPercentage(
                              dashboardStats?.confirmedBookingRate
                            )}
                          </Text>
                        </div>
                        <Progress
                          percent={dashboardStats?.confirmedBookingRate}
                          strokeColor="#1677ff"
                          showInfo={false}
                          size="small"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-1">
                          <Text>Tỉ lệ đã hoàn thành</Text>
                          <Text strong>
                            {formatPercentage(
                              dashboardStats?.completedBookingRate
                            )}
                          </Text>
                        </div>
                        <Progress
                          percent={dashboardStats?.completedBookingRate}
                          strokeColor="#52c41a"
                          showInfo={false}
                          size="small"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <Text>Tổng tỉ lệ đặt sân</Text>
                          <Text strong>
                            {formatPercentage(courtUtilization)}
                          </Text>
                        </div>
                        <Progress
                          percent={courtUtilization}
                          strokeColor={{
                            "0%": "#1677ff",
                            "100%": "#52c41a",
                          }}
                          size="small"
                          showInfo={false}
                        />
                      </div>

                      <div className="mt-auto pt-4">
                        <Button
                          type="primary"
                          block
                          icon={<BarChartOutlined />}
                          onClick={() => navigate("/court-owner/courts")}
                          className="transition-all hover:scale-105"
                        >
                          Xem chi tiết hiệu suất sân
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-green-600" />
                        <span>Lịch đặt sân hôm nay</span>
                      </div>
                    }
                    className="transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{
                      height: "455px",
                      padding:
                        dashboardStats?.todayBookings?.length > 0
                          ? "24px"
                          : "24px 24px 12px",
                    }}
                  >
                    {dashboardStats?.todayBookings?.length > 0 ? (
                      <div className="h-full flex flex-col">
                        <Table
                          columns={[
                            {
                              title: "Thời gian",
                              key: "time",
                              render: (_, record) =>
                                `${record.startTime} - ${record.endTime}`,
                            },
                            {
                              title: "Sân",
                              dataIndex: "courtName",
                              key: "courtName",
                            },
                            {
                              title: "Trạng thái",
                              dataIndex: "status",
                              key: "status",
                              render: (status) => {
                                let color = "default";
                                if (status === "Completed") color = "green";
                                else if (status === "Confirmed") color = "blue";
                                else if (status === "Pending") color = "gold";
                                return <Tag color={color}>{status}</Tag>;
                              },
                            },
                            {
                              title: "",
                              key: "actions",
                              render: (_, record) => (
                                <Button
                                  type="link"
                                  size="small"
                                  className="p-0"
                                  onClick={() =>
                                    navigate(
                                      `/court-owner/bookings/${record.bookingId}`
                                    )
                                  }
                                >
                                  Chi tiết
                                </Button>
                              ),
                            },
                          ]}
                          dataSource={dashboardStats.todayBookings}
                          pagination={{ pageSize: 3 }}
                          size="small"
                          className="flex-1"
                          rowKey="bookingId"
                        />
                        <div className="pt-4 mt-auto">
                          <Button
                            type="primary"
                            block
                            icon={<CalendarOutlined />}
                            onClick={() => navigate("/court-owner/bookings")}
                            className="transition-all hover:scale-105"
                          >
                            Xem tất cả lịch đặt sân
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center">
                        <Icon
                          icon="solar:calendar-minimalistic-bold-duotone"
                          width={64}
                          className="text-gray-300 mb-4"
                        />
                        <Text className="text-gray-500 text-lg mb-6">
                          Không có lịch đặt sân hôm nay
                        </Text>
                        <Button
                          type="primary"
                          icon={<CalendarOutlined />}
                          onClick={() => navigate("/court-owner/bookings")}
                          className="transition-all hover:scale-105"
                        >
                          Xem lịch đặt sân khác
                        </Button>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </motion.div>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="shadow-sm">
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                pagination={{ pageSize: 8 }}
                renderItem={(item) => (
                  <List.Item
                    className="hover:bg-blue-50 transition-colors duration-300 rounded-md p-2"
                    actions={[
                      <Button
                        key="view-details"
                        type="link"
                        onClick={() => showNotificationDetails(item)}
                        className="transition-all hover:text-blue-700"
                      >
                        Xem chi tiết
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<AlertOutlined />}
                          className="bg-blue-100 text-blue-600"
                        />
                      }
                      title={<Text strong>{item.message}</Text>}
                      description={<Text type="secondary">{item.time}</Text>}
                    />
                    <Tag color="blue">{item.type}</Tag>
                  </List.Item>
                )}
              />

              <Divider />

              <Button
                type="primary"
                block
                icon={<BellOutlined />}
                onClick={() => navigate("/court-owner/notifications")}
                className="mt-4 transition-all hover:scale-105"
              >
                Xem tất cả thông báo
              </Button>
            </Card>

            {/* Notification Details Modal */}
            <Modal
              title={
                <div className="flex items-center gap-2">
                  <BellOutlined
                    style={{ fontSize: "20px", color: "#1890ff" }}
                  />
                  <Text strong>Chi tiết thông báo</Text>
                </div>
              }
              open={isModalVisible}
              onCancel={handleCloseModal}
              footer={[
                <Button
                  key="markAsRead"
                  type="primary"
                  onClick={handleCloseModal}
                >
                  Đánh dấu đã đọc
                </Button>,
                <Button key="close" onClick={handleCloseModal}>
                  Đóng
                </Button>,
              ]}
            >
              {selectedNotification ? (
                <div className="p-4">
                  {/* Notification Type */}
                  <div className="flex items-center gap-2 mb-4">
                    <AlertOutlined
                      style={{ fontSize: "18px", color: "#faad14" }}
                    />
                    <Text strong>Loại thông báo:</Text>
                    <Tag color="blue">{selectedNotification.type}</Tag>
                  </div>

                  <Separator className="my-4" />

                  {/* Notification Message */}
                  <div className="mb-4">
                    <Text strong style={{ fontSize: "16px" }}>
                      Nội dung:
                    </Text>
                    <Paragraph className="mt-2 p-3 bg-gray-50 rounded-md">
                      {selectedNotification.message}
                    </Paragraph>
                  </div>

                  <Separator className="my-4" />

                  {/* Time & Additional Info */}
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="solar:clock-circle-bold"
                      className="text-gray-500"
                    />
                    <Text strong>Nhận lúc:</Text>
                    <Text>{selectedNotification.time || "Vừa xong"}</Text>
                  </div>
                </div>
              ) : (
                <Text>Không có chi tiết.</Text>
              )}
            </Modal>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-2 text-base">
          <HomeOutlined />
          Tổng quan
        </span>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-2 text-base">
          <BellOutlined />
          Thông báo
        </span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <Card
        title={
          <div className="flex items-center gap-2 py-2">
            <Icon
              icon="solar:chart-square-bold-duotone"
              className="text-blue-600"
              width="24"
            />
            <Text strong className="text-lg">
              Bảng điều khiển quản lý sân
            </Text>
          </div>
        }
        className="shadow-md"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
          size="large"
          className="dashboard-tabs"
        />
        <Box className="mt-6">{renderContent()}</Box>
        <Separator className="my-6" />

        {/* Quick Actions */}
        <div className="py-2">
          <Text strong className="text-gray-500 mb-4 block text-sm uppercase">
            Truy cập nhanh
          </Text>
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Button
                className="flex items-center gap-2 transition-all hover:scale-105 px-4 py-5 h-auto"
                icon={<HomeOutlined />}
                onClick={() => navigate("/court-owner/courts")}
              >
                <span>Xem tất cả sân</span>
              </Button>
            </Col>
            <Col>
              <Button
                className="flex items-center gap-2 transition-all hover:scale-105 px-4 py-5 h-auto"
                icon={<DollarOutlined />}
                onClick={() => navigate("/court-owner/venues")}
              >
                <span>Trung tâm thể thao</span>
              </Button>
            </Col>
            <Col>
              <Button
                className="flex items-center gap-2 transition-all hover:scale-105 px-4 py-5 h-auto"
                icon={<CheckOutlined />}
                onClick={() => navigate("/court-owner/bookings")}
              >
                <span>Quản lý đặt sân</span>
              </Button>
            </Col>
            <Col>
              <Button
                className="flex items-center gap-2 transition-all hover:scale-105 px-4 py-5 h-auto"
                icon={<DownloadOutlined />}
              >
                <span>Xuất báo cáo</span>
              </Button>
            </Col>
          </Row>
        </div>
      </Card>

      <style jsx global>{`
        .dashboard-tabs .ant-tabs-nav::before {
          border-bottom: none;
        }
        .dashboard-tabs .ant-tabs-tab {
          border-radius: 8px 8px 0 0;
          padding: 8px 16px;
          transition: all 0.3s;
        }
        .dashboard-tabs .ant-tabs-tab:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        .dashboard-tabs .ant-tabs-tab-active {
          background-color: #f0f5ff !important;
        }
      `}</style>
    </motion.div>
  );
};

export default CourtOwnerDashboardView;
