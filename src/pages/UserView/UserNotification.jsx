import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { alpha } from "@mui/material/styles";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  setCurrentPage,
} from "@/store/notificationSlice";

// Hàm tiện ích để nhóm thông báo theo ngày
const groupByDate = (notifications) => {
  const grouped = {};
  notifications.forEach((notification) => {
    try {
      const date = format(new Date(notification.createdAt), "dd/MM/yyyy", {
        locale: vi,
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  });
  return grouped;
};

// Thành phần hiển thị nhóm thông báo
const NotificationGroup = ({ date, items, onMarkAsRead }) => (
  <Box key={date} mb={3}>
    <Typography
      variant="subtitle1"
      color="text.secondary"
      fontWeight="bold"
      mb={1}
    >
      {date}
    </Typography>
    <List>
      {items.map((n) => (
        <React.Fragment key={n.id}>
          <ListItem
            sx={{
              background: !n.isRead ? alpha("#2563eb", 0.05) : undefined,
              borderRadius: 2,
              mb: 1,
            }}
            secondaryAction={
              <Tooltip title={n.isRead ? "Đã đọc" : "Đánh dấu đã đọc"}>
                <IconButton
                  disabled={n.isRead}
                  onClick={() => onMarkAsRead(n.id)}
                >
                  {!n.isRead && <CheckCircleOutline />}
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight={500}>{n.title}</Typography>
                    <Typography variant="caption" color="primary">
                      {n.type}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap", ml: 2 }}
                    paddingRight={3}
                  >
                    {format(new Date(n.createdAt), "HH:mm:ss dd/MM/yyyy")}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    overflowWrap: "break-word",
                  }}
                >
                  {n.content}
                </Typography>
              }
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Box>
);

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { notifications, totalItems, loading, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const limit = 10;

  useEffect(() => {
    dispatch(fetchNotifications({ page, limit }));
    dispatch(setCurrentPage(page));
  }, [dispatch, page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleGoToPageSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(goToPage, 10);
    const maxPage = Math.ceil(totalItems / limit);
    if (!isNaN(num) && num >= 1 && num <= maxPage) {
      setPage(num);
      //   setGoToPage("");
    } else {
      alert(`Trang hợp lệ từ 1 đến ${maxPage}`);
    }
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const groupedNotifications = groupByDate(notifications);

  if (loading) {
    return (
      <Box
        height="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!notifications.length) {
    return (
      <Box
        height="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>Không có thông báo nào.</Typography>
      </Box>
    );
  }

  return (
    <Box
      maxWidth="800px"
      mx="auto"
      p={3}
      bgcolor="#f9fafb"
      borderRadius={3}
      boxShadow={3}
      mt={5}
      mb={5}
    >
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Thông báo
        </Typography>
        <Button
          variant="contained"
          startIcon={<CheckCircleOutline />}
          onClick={handleMarkAllRead}
          disabled={unreadCount == 0}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </Box>

      {Object.entries(groupedNotifications).map(([date, items]) => (
        <NotificationGroup
          key={date}
          date={date}
          items={items}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}

      {/* Pagination */}
      <Box
        mt={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Pagination
          count={Math.ceil(totalItems / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />

        <Typography variant="body2" color="text.secondary">
          {page} / {Math.ceil(totalItems / limit)}
        </Typography>

        <form onSubmit={handleGoToPageSubmit}>
          <TextField
            label="Đến trang"
            size="small"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            sx={{ width: 200 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" size="small" variant="contained">
                    Đi
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );
};

export default NotificationPage;
