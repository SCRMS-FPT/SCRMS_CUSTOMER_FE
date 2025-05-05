import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ArrowBack,
  Add,
  Visibility,
  ArrowDownward,
  InfoOutlined,
  MoreVert,
  AccessTime,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";
import { Client } from "@/API/PaymentApi";

const MyUserWithdrawalsList = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch withdrawals on component mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Fetch withdrawal requests
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const apiClient = new Client();
      const response = await apiClient.getUserWithdrawalRequests();
      setWithdrawals(response || []);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setError(
        "Không thể tải danh sách yêu cầu rút tiền. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status chip properties
  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: {
        label: "Đang chờ xử lý",
        color: "warning",
        icon: <HourglassEmpty fontSize="small" />,
      },
      APPROVED: {
        label: "Đã duyệt",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
      },
      REJECTED: {
        label: "Từ chối",
        color: "error",
        icon: <Cancel fontSize="small" />,
      },
      PROCESSING: {
        label: "Đang xử lý",
        color: "info",
        icon: <AccessTime fontSize="small" />,
      },
      COMPLETED: {
        label: "Hoàn thành",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
      },
    };

    return (
      statusMap[status] || {
        label: status || "Không xác định",
        color: "default",
        icon: <InfoOutlined fontSize="small" />,
      }
    );
  };

  // Handle view details
  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDetailsDialogOpen(true);
  };

  // Handle create new withdrawal
  const handleCreateWithdrawal = () => {
    navigate("/user/withdrawal");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/user/my-wallet")}
            sx={{ mr: 2, color: "primary.main" }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Yêu cầu rút tiền
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateWithdrawal}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 2,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          Tạo yêu cầu mới
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {withdrawals.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0, 0, 0, 0.03)"
                          : "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <TableCell>Mã yêu cầu</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Ngân hàng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => {
                    const statusChip = getStatusChip(withdrawal.status);
                    return (
                      <TableRow
                        key={withdrawal.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? "rgba(0, 0, 0, 0.04)"
                                : "rgba(255, 255, 255, 0.08)",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                          >
                            {withdrawal.id.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {formatDate(withdrawal.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "error.main" }}
                          >
                            {withdrawal.amount?.toLocaleString()} VND
                          </Typography>
                        </TableCell>
                        <TableCell>{withdrawal.bankName}</TableCell>
                        <TableCell>
                          <Chip
                            icon={statusChip.icon}
                            label={statusChip.label}
                            color={statusChip.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              onClick={() => handleViewDetails(withdrawal)}
                              size="small"
                              color="primary"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                py: 8,
                px: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowDownward
                sx={{
                  fontSize: 60,
                  color: "text.secondary",
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Chưa có yêu cầu rút tiền nào
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, maxWidth: 500 }}
              >
                Bạn chưa có yêu cầu rút tiền nào. Hãy tạo yêu cầu mới để rút
                tiền từ ví của bạn.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateWithdrawal}
                sx={{ borderRadius: 2 }}
              >
                Tạo yêu cầu rút tiền
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
      {/* Withdrawal Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        {selectedWithdrawal && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6">Chi tiết yêu cầu rút tiền</Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(0, 0, 0, 0.02)"
                            : "rgba(255, 255, 255, 0.05)",
                        mb: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Mã yêu cầu
                      </Typography>
                      <Typography
                        variant="body1"
                        fontFamily="monospace"
                        fontWeight="medium"
                      >
                        {selectedWithdrawal.id}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ngày tạo
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedWithdrawal.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Trạng thái
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(selectedWithdrawal.status).icon}{" "}
                        <Typography
                          variant="body1"
                          component="span"
                          sx={{
                            ml: 0.5,
                            color: `${
                              getStatusChip(selectedWithdrawal.status).color
                            }.main`,
                            fontWeight: "medium",
                          }}
                        >
                          {getStatusChip(selectedWithdrawal.status).label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid size={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Số tiền rút
                      </Typography>
                      <Typography
                        variant="h5"
                        color="error.main"
                        fontWeight="bold"
                      >
                        {selectedWithdrawal.amount?.toLocaleString()} VND
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ngân hàng
                      </Typography>
                      <Typography variant="body1">
                        {selectedWithdrawal.bankName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Số tài khoản
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {selectedWithdrawal.accountNumber}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Chủ tài khoản
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedWithdrawal.accountHolderName}
                      </Typography>
                    </Box>
                  </Grid>

                  {selectedWithdrawal.status === "REJECTED" && (
                    <Grid size={12}>
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <Typography variant="subtitle2">
                          Lý do từ chối:
                        </Typography>
                        <Typography variant="body2">
                          {selectedWithdrawal.adminNote ||
                            "Không có thông tin chi tiết."}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  {selectedWithdrawal.completedAt && (
                    <Grid size={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày hoàn thành
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedWithdrawal.completedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyUserWithdrawalsList;
