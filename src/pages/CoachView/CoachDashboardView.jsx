import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Material UI components
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  ButtonBase,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

// MUI X Charts
import { BarChart } from "@mui/x-charts/BarChart";

// API Clients
import { Client } from "../../API/CoachApi";
import { Client as PaymentClient } from "../../API/PaymentApi"; // Import Payment API Client

// Iconify for beautiful icons
import { Iconify } from "@/components/iconify";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CoachDashboardView = () => {
  const theme = useTheme();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null); // New state for revenue data
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeRange, setActiveTimeRange] = useState("month");
  const [activeDateRange, setActiveDateRange] = useState("1year"); // New state for date range (1year or 3years)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const apiClient = new Client();
        const paymentClient = new PaymentClient(); // Create Payment API client

        // Calculate date ranges based on selected date range
        const currentDate = new Date();
        const endDate = currentDate.toISOString().split("T")[0];
        const startDate = new Date(currentDate);

        // Set startDate based on activeDateRange
        if (activeDateRange === "3years") {
          startDate.setFullYear(startDate.getFullYear() - 3);
        } else {
          // Default to 1 year
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const formattedStartDate = startDate.toISOString().split("T")[0];

        // Fetch dashboard stats
        const stats = await apiClient.getCoachDashboardStats(
          formattedStartDate,
          endDate,
          "month"
        );
        setDashboardStats(stats);

        // Fetch revenue data using payment API
        const revenueReport = await paymentClient.getCoachRevenueReport(
          formattedStartDate,
          endDate,
          activeTimeRange
        );
        setRevenueData(revenueReport);

        // Calculate date range for schedules (5 days from now)
        const scheduleEndDate = new Date(currentDate);
        scheduleEndDate.setDate(scheduleEndDate.getDate() + 5);
        const formattedScheduleEndDate = scheduleEndDate
          .toISOString()
          .split("T")[0];

        // Fetch coach schedules
        const schedulesResponse = await apiClient.getCoachSchedules(
          endDate,
          formattedScheduleEndDate,
          1,
          10
        );
        setSchedules(schedulesResponse.schedules || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTimeRange, activeDateRange]); // Add both dependencies to refetch when either changes

  // Update time range and fetch new data
  const handleTimeRangeChange = (timeRange) => {
    setActiveTimeRange(timeRange);
  };

  // Update date range and fetch new data
  const handleDateRangeChange = (event, newDateRange) => {
    if (newDateRange !== null) {
      setActiveDateRange(newDateRange);
    }
  };

  // Summary stats with enhanced design
  const getSummaryStats = () => {
    if (!dashboardStats || !revenueData) return [];

    return [
      {
        title: "Học viên",
        value: dashboardStats.totalStudents.toString(),
        icon: "solar:user-rounded-bold-duotone",
        bgGradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
        secondaryText: "Tổng số học viên hiện tại",
      },
      {
        title: "Buổi dạy",
        value: dashboardStats.totalSessions.toString(),
        icon: "solar:calendar-mark-bold-duotone",
        bgGradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
        secondaryText: "Tổng số buổi đã dạy",
      },
      {
        title: "Doanh thu",
        value: `${revenueData?.totalRevenue?.toLocaleString() || 0} VND`,
        icon: "solar:wallet-money-bold-duotone",
        bgGradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
        secondaryText: `Tổng doanh thu ${
          activeDateRange === "3years" ? "3 năm" : "12 tháng"
        } qua`,
      },
      {
        title: "Gói đào tạo",
        value: dashboardStats.totalPackage.toString(),
        icon: "solar:box-bold-duotone",
        bgGradient: "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)",
        secondaryText: "Số gói đào tạo hiện có",
      },
    ];
  };

  // Format period for chart labels based on activeTimeRange
  const formatPeriodLabel = (period) => {
    if (!period) return "";

    if (activeTimeRange === "month") {
      const [year, month] = period.split("-");
      return `T${month}/${year.slice(2)}`;
    } else if (activeTimeRange === "quarter") {
      return `Q${period.charAt(period.length - 1)}/${period
        .slice(0, 4)
        .slice(2)}`;
    } else if (activeTimeRange === "year") {
      return period;
    }

    return period;
  };

  const prepareChartData = () => {
    if (!revenueData || !revenueData.dateRange) return { labels: [], data: [] };

    // Generate all periods within the date range based on activeTimeRange
    const allPeriods = generateAllPeriods(
      revenueData.dateRange.startDate,
      revenueData.dateRange.endDate,
      activeTimeRange
    );

    // Create a map of existing revenue data
    const revenueMap = {};
    if (revenueData.stats) {
      revenueData.stats.forEach((stat) => {
        revenueMap[stat.period] = stat.revenue;
      });
    }

    // Generate complete dataset with 0 revenue for missing periods
    const completeDataset = allPeriods.map((period) => ({
      period: period,
      revenue: revenueMap[period] || 0,
    }));

    return {
      labels: completeDataset.map((item) => formatPeriodLabel(item.period)),
      data: completeDataset.map((item) => item.revenue),
      rawData: completeDataset,
    };
  };

  // Generate all periods within a date range based on activeTimeRange
  const generateAllPeriods = (startDateStr, endDateStr, timeRange) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const periods = [];

    if (timeRange === "month") {
      // Generate all months in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        // JavaScript months are 0-indexed, so add 1 and pad with leading zero if needed
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        periods.push(`${year}-${month}`);

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (timeRange === "quarter") {
      // Generate all quarters in the range
      const currentDate = new Date(startDate);
      // Set to first month of the quarter
      currentDate.setMonth(Math.floor(currentDate.getMonth() / 3) * 3);

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

  // Map schedule status to display status
  const mapScheduleStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return "Đã xác nhận";
      case "available":
        return "Còn trống";
      default:
        return status || "Không xác định";
    }
  };

  // Format time (24h to 12h)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Status chip component with enhanced styling
  const getStatusChip = (status) => {
    const mappedStatus = mapScheduleStatus(status);
    let color = "default";
    let bgColor = "rgba(0, 0, 0, 0.08)";
    let icon = "";

    if (mappedStatus === "Đã xác nhận") {
      color = "#14b8a6";
      bgColor = "rgba(20, 184, 166, 0.1)";
      icon = "solar:check-circle-bold-duotone";
    } else if (mappedStatus === "Còn trống") {
      color = "#3b82f6";
      bgColor = "rgba(59, 130, 246, 0.1)";
      icon = "solar:clock-circle-bold-duotone";
    } else if (mappedStatus === "Chưa xác nhận") {
      color = "#f59e0b";
      bgColor = "rgba(245, 158, 11, 0.1)";
      icon = "solar:clock-circle-bold-duotone";
    }

    return (
      <Chip
        label={mappedStatus}
        icon={icon ? <Iconify icon={icon} width={16} /> : undefined}
        sx={{
          color: color,
          bgcolor: bgColor,
          fontWeight: 500,
          borderRadius: "6px",
          transition: "all 0.2s ease",
          "& .MuiChip-label": { px: 1 },
          "&:hover": {
            bgcolor: `${bgColor.replace("0.1", "0.2")}`,
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
        size="small"
      />
    );
  };

  // Chart data
  const chartData = prepareChartData();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
          icon={
            <Iconify icon="solar:danger-triangle-bold-duotone" width={24} />
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="overflow-hidden"
    >
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {/* Dashboard Header */}
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom={false}
              sx={{
                backgroundImage: "linear-gradient(135deg, #374151, #1f2937)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              Bảng điều khiển huấn luyện viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theo dõi hiệu suất và lịch trình công việc của bạn
            </Typography>
          </Box>
        </Box>

        {/* Summary Widgets */}
        <motion.div
          variants={staggeredContainer}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {getSummaryStats().map((stat, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <motion.div
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        background: stat.bgGradient,
                        position: "absolute",
                        width: "6px",
                        left: 0,
                        top: 0,
                      }}
                    />
                    <CardContent
                      sx={{
                        p: 3,
                        "&:last-child": { pb: 3 },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box className="flex justify-between">
                        <Box>
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight={700}
                            sx={{ mb: 0.5 }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {stat.title}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Iconify
                            icon={stat.icon}
                            width={24}
                            sx={{
                              background: stat.bgGradient,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          />
                        </Avatar>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1.5, fontSize: "0.75rem" }}
                      >
                        {stat.secondaryText}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Biểu Đồ Doanh Thu
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {revenueData?.dateRange
                      ? `Từ ${new Date(
                          revenueData.dateRange.startDate
                        ).toLocaleDateString("vi-VN")} đến ${new Date(
                          revenueData.dateRange.endDate
                        ).toLocaleDateString("vi-VN")}`
                      : "Theo dõi doanh thu của bạn"}
                  </Typography>
                </Box>

                <Box className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Box
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    sx={{ bgcolor: "rgba(59, 130, 246, 0.1)" }}
                  >
                    <Iconify
                      icon="solar:graph-up-linear"
                      width={16}
                      color="#3b82f6"
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 500, color: "#3b82f6" }}
                    >
                      Tổng: {revenueData?.totalRevenue?.toLocaleString() || 0}{" "}
                      VND
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Chart Controls */}
              <Box
                className="flex flex-col md:flex-row justify-between items-start md:items-center"
                sx={{ mb: 2 }}
              >
                {/* Date Range Toggle */}
                <ToggleButtonGroup
                  value={activeDateRange}
                  exclusive
                  onChange={handleDateRangeChange}
                  size="small"
                  sx={{
                    mb: { xs: 2, md: 0 },
                    "& .MuiToggleButton-root": {
                      borderRadius: "6px",
                      mx: 0.5,
                      px: 2,
                      py: 0.5,
                      fontWeight: 500,
                      fontSize: "0.8rem",
                      textTransform: "none",
                      borderColor: "rgba(0, 0, 0, 0.08)",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(59, 130, 246, 0.08)",
                        color: "#3b82f6",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ToggleButton value="1year">
                    <Iconify
                      icon="solar:calendar-linear"
                      width={16}
                      style={{ marginRight: 6 }}
                    />
                    1 năm gần đây
                  </ToggleButton>
                  <ToggleButton value="3years">
                    <Iconify
                      icon="solar:calendar-bold-duotone"
                      width={16}
                      style={{ marginRight: 6 }}
                    />
                    3 năm gần đây
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Grouping Toggle */}
                <Box
                  className="flex items-center bg-gray-50 rounded-lg p-1"
                  sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  {[
                    { label: "Năm", value: "year" },
                    { label: "Quý", value: "quarter" },
                    { label: "Tháng", value: "month" },
                  ].map((item) => (
                    <ButtonBase
                      key={item.value}
                      onClick={() => handleTimeRangeChange(item.value)}
                      sx={{
                        px: 2,
                        py: 0.7,
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                        backgroundColor:
                          activeTimeRange === item.value
                            ? theme.palette.primary.main
                            : "transparent",
                        color:
                          activeTimeRange === item.value
                            ? "#fff"
                            : theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor:
                            activeTimeRange === item.value
                              ? theme.palette.primary.main
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      {item.label}
                    </ButtonBase>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  height: 350,
                  width: "100%",
                  py: 2,
                  px: { xs: 0, sm: 2 },
                }}
              >
                {revenueData?.stats?.length > 0 ? (
                  <BarChart
                    dataset={chartData.rawData || []}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "period",
                        valueFormatter: (value) => formatPeriodLabel(value),
                        tickLabelStyle: {
                          angle: 0,
                          textAnchor: "middle",
                          fontSize: 12,
                          fontWeight: "bold",
                        },
                      },
                    ]}
                    series={[
                      {
                        dataKey: "revenue",
                        label: "Doanh thu (VND)",
                        valueFormatter: (value) =>
                          `${value.toLocaleString()} VND`,
                        color: "#3b82f6",
                        highlightScope: {
                          highlighted: "item",
                          faded: "global",
                        },
                      },
                    ]}
                    slotProps={{
                      legend: { hidden: false },
                    }}
                    height={350}
                    layout="vertical"
                    colors={["#3b82f6"]}
                    sx={{
                      ".MuiChartsAxis-tickLabel": {
                        strokeWidth: "0.4px",
                      },
                      ".MuiBarElement-root": {
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                      },
                      ".MuiBarElement-root:hover": {
                        filter: "brightness(0.9)",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    <Iconify
                      icon="solar:chart-square-linear"
                      width={48}
                      sx={{ color: "rgba(0,0,0,0.2)" }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Không có dữ liệu doanh thu để hiển thị
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Schedule */}
        <motion.div variants={fadeIn} transition={{ delay: 0.6 }}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Lịch làm việc sắp tới
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    5 ngày tới của bạn
                  </Typography>
                </Box>

                <ButtonBase
                  sx={{
                    mt: { xs: 1, sm: 0 },
                    px: 2,
                    py: 0.75,
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: theme.palette.primary.main,
                    bgcolor: "rgba(59, 130, 246, 0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(59, 130, 246, 0.12)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <Iconify
                    icon="solar:calendar-add-bold-duotone"
                    width={16}
                    sx={{ mr: 0.75 }}
                  />
                  Xem tất cả lịch
                </ButtonBase>
              </Box>

              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ borderRadius: 2 }}
                >
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          Ngày
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          Giờ bắt đầu
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          Giờ kết thúc
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          Trạng thái
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.length > 0 ? (
                        schedules.map((schedule, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              transition: "background-color 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(0,0,0,0.02)",
                              },
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                              borderBottom:
                                index === schedules.length - 1
                                  ? "none"
                                  : "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                py: 2,
                                fontWeight: 500,
                              }}
                            >
                              {new Date(schedule.date).toLocaleDateString(
                                "vi-VN",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box className="flex items-center gap-2">
                                <Iconify
                                  icon="solar:clock-circle-linear"
                                  width={16}
                                  color={theme.palette.text.secondary}
                                />
                                {formatTime(schedule.startTime)}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box className="flex items-center gap-2">
                                <Iconify
                                  icon="solar:clock-circle-bold-duotone"
                                  width={16}
                                  color={theme.palette.text.secondary}
                                />
                                {formatTime(schedule.endTime)}
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 2 }}>
                              {getStatusChip(schedule.status)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Box className="flex flex-col items-center gap-2">
                              <Iconify
                                icon="solar:calendar-minimalistic-linear"
                                width={40}
                                sx={{ color: "rgba(0,0,0,0.2)" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Không có lịch làm việc trong thời gian này
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default CoachDashboardView;
