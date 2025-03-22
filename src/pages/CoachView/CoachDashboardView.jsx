import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  PersonOutline,
  EventNote,
  MonetizationOn,
  Inventory,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { Client } from "../../API/CoachApi";

const CoachDashboardView = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const apiClient = new Client();

        // Calculate date ranges for dashboard stats (1 year)
        const currentDate = new Date();
        const endDate = currentDate.toISOString().split("T")[0];
        const startDate = new Date(currentDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        const formattedStartDate = startDate.toISOString().split("T")[0];

        // Fetch dashboard stats
        const stats = await apiClient.getCoachDashboardStats(
          formattedStartDate,
          endDate,
          "month"
        );
        setDashboardStats(stats);

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
  }, []);

  // Prepare summary stats data from API response
  const getSummaryStats = () => {
    if (!dashboardStats) return [];

    return [
      {
        title: "Học viên",
        value: dashboardStats.totalStudents.toString(),
        icon: <PersonOutline fontSize="large" />,
        color: "#1976d2",
      },
      {
        title: "Buổi dạy",
        value: dashboardStats.totalSessions.toString(),
        icon: <EventNote fontSize="large" />,
        color: "#2e7d32",
      },
      {
        title: "Doanh thu",
        value: `${dashboardStats.totalRevenue.toLocaleString()} VND`,
        icon: <MonetizationOn fontSize="large" />,
        color: "#ed6c02",
      },
      {
        title: "Gói đào tạo",
        value: dashboardStats.totalPackage.toString(),
        icon: <Inventory fontSize="large" />,
        color: "#9c27b0",
      },
    ];
  };

  // Format period (like "2025-03") to display label (like "T3")
  const formatPeriodLabel = (period) => {
    if (!period) return "";
    const month = parseInt(period.split("-")[1]);
    return `T${month}`;
  };

  // Prepare chart data from API response
  const prepareChartData = () => {
    if (!dashboardStats || !dashboardStats.stats)
      return { labels: [], data: [] };

    // Sort stats by period to ensure chronological order
    const sortedStats = [...dashboardStats.stats].sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    return {
      labels: sortedStats.map((stat) => formatPeriodLabel(stat.period)),
      data: sortedStats.map((stat) => stat.revenue),
    };
  };

  // Map API schedule status to UI display status
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

  // Format time from API (like "09:00:00") to display format (like "09:00 AM")
  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Extract hours and minutes
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);

    // Convert to 12-hour format
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  // Status chip style function
  const getStatusChip = (status) => {
    let color = "default";
    const mappedStatus = mapScheduleStatus(status);

    if (mappedStatus === "Đã xác nhận") color = "success";
    else if (mappedStatus === "Còn trống") color = "info";
    else if (mappedStatus === "Chưa xác nhận") color = "warning";

    return <Chip label={mappedStatus} color={color} size="small" />;
  };

  // Chart data
  const chartData = prepareChartData();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Coach Dashboard
      </Typography>

      {/* Summary Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {getSummaryStats().map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", bgcolor: stat.color + "10" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Biểu Đồ Doanh Thu
          </Typography>
          <Box sx={{ height: 350, width: "100%", p: 2 }}>
            {dashboardStats?.stats?.length > 0 ? (
              <BarChart
                dataset={chartData.labels.map((month, index) => ({
                  month: month,
                  revenue: chartData.data[index],
                }))}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "month",
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
                    valueFormatter: (value) => `${value.toLocaleString()} VND`,
                    color: "#2196f3",
                    highlightScope: {
                      highlighted: "item",
                      faded: "global",
                    },
                  },
                ]}
                slotProps={{
                  legend: { hidden: false },
                }}
                layout="vertical"
                colors={["#2196f3", "#f44336", "#ffeb3b", "#4caf50"]}
                sx={{
                  ".MuiChartsAxis-tickLabel": {
                    strokeWidth: "0.4px",
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
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Không có dữ liệu doanh thu để hiển thị
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Upcoming Schedule */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Lịch làm việc sắp tới
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giờ bắt đầu</TableCell>
                  <TableCell>Giờ kết thúc</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>{schedule.date}</TableCell>
                      <TableCell>{formatTime(schedule.startTime)}</TableCell>
                      <TableCell>{formatTime(schedule.endTime)}</TableCell>
                      <TableCell align="center">
                        {getStatusChip(schedule.status)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Không có lịch làm việc trong thời gian này
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CoachDashboardView;
