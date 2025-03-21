import { useState } from "react";
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
} from "@mui/material";
import {
  PersonOutline,
  EventNote,
  MonetizationOn,
  Inventory,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";

const CoachDashboardView = () => {
  // Summary widgets data
  const summaryStats = [
    {
      title: "Học viên",
      value: "30",
      icon: <PersonOutline fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Buổi dạy",
      value: "150",
      icon: <EventNote fontSize="large" />,
      color: "#2e7d32",
    },
    {
      title: "Doanh thu",
      value: "4,500.00 VND",
      icon: <MonetizationOn fontSize="large" />,
      color: "#ed6c02",
    },
    {
      title: "Gói đào tạo",
      value: "5",
      icon: <Inventory fontSize="large" />,
      color: "#9c27b0",
    },
  ];

  // Revenue chart data
  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];
  const revenueData = [
    2000, 2500, 3000, 3500, 4200, 3800, 4500, 5000, 4800, 5500, 6000, 4500,
  ];

  // Upcoming schedule data
  const upcomingSchedule = [
    {
      id: 1,
      date: "21/03/2025",
      time: "09:00 AM",
      name: "Yoga buổi sáng",
      slots: 2,
      status: "Đã xác nhận",
    },
    {
      id: 2,
      date: "21/03/2025",
      time: "02:00 PM",
      name: "John Doe (Cá nhân)",
      slots: 1,
      status: "Chưa xác nhận",
    },
    {
      id: 3,
      date: "22/03/2025",
      time: "10:00 AM",
      name: "Bài tập giảm cân",
      slots: 3,
      status: "Đã xác nhận",
    },
  ];

  // Status chip style function
  const getStatusChip = (status) => {
    let color = "default";
    if (status === "Đã xác nhận") color = "success";
    else if (status === "Chưa xác nhận") color = "warning";
    else if (status === "Hoàn tất") color = "info";

    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Coach Dashboard
      </Typography>

      {/* Summary Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat, index) => (
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
            <BarChart
              dataset={months.map((month, index) => ({
                month: month,
                revenue: revenueData[index],
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
                  <TableCell>Giờ</TableCell>
                  <TableCell>Lớp/Học viên</TableCell>
                  <TableCell align="center">Slot còn lại</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingSchedule.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="center">{row.slots}</TableCell>
                    <TableCell align="center">
                      {getStatusChip(row.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CoachDashboardView;
