import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  TablePagination,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Add,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  ShoppingCart,
  Info,
  Receipt,
  History,
  Visibility,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  AccessTime,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Client } from "@/API/PaymentApi";

const MyWalletView = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canWithdraw, setCanWithdraw] = useState(false);

  // Pagination states
  const [transactionPage, setTransactionPage] = useState(0);
  // Removed withdrawalPage and related handler as it wasn't used in the provided code
  const [rowsPerPage] = useState(5);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    fetchWalletData();
    checkWithdrawPermission();
  }, []); // Removed transactionPage dependency here, should refetch only when page changes

  useEffect(() => {
    // Refetch transactions when page changes
    if (!loading) { // Avoid refetching during initial load
      fetchTransactions();
    }
  }, [transactionPage]);

  const checkWithdrawPermission = () => {
    try {
      const userProfileData = localStorage.getItem("userProfile");
      if (userProfileData) {
        const profile = JSON.parse(userProfileData);
        if (profile.roles && Array.isArray(profile.roles)) {
          const hasWithdrawRole = profile.roles.some(
            (role) => role === "CourtOwner" || role === "Coach"
          );
          setCanWithdraw(hasWithdrawRole);
        }
      }
    } catch (err) {
      console.error("Error checking withdraw permission:", err);
    }
  };

  const fetchWalletData = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await Promise.all([
        fetchWalletBalance(),
        fetchTransactions(), // Initial fetch
        fetchWithdrawals(),
      ]);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setError("Không thể tải thông tin ví. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    setBalanceLoading(true);
    try {
      const apiClient = new Client();
      const response = await apiClient.getWalletBalance();
      setWalletBalance(response);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      // Optionally set a specific error for balance
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchTransactions = async () => {
    // Add loading state specifically for transactions if needed
    try {
      const apiClient = new Client();
      const response = await apiClient.getTransactionHistory(
        transactionPage + 1, // API might be 1-based index
        rowsPerPage
      );
      setTransactions(response.data || []);
      setTransactionCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Optionally set a specific error for transactions
    }
  };

  const fetchWithdrawals = async () => {
     // Add loading state specifically for withdrawals if needed
    try {
      const apiClient = new Client();
      const response = await apiClient.getUserWithdrawalRequests();
      // Sort withdrawals by date descending, assuming createdAt exists
      const sortedWithdrawals = (response || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setWithdrawals(sortedWithdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
       // Optionally set a specific error for withdrawals
    }
  };

  const handleTransactionPageChange = (event, newPage) => {
    setTransactionPage(newPage);
  };

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

  const formatTransactionType = (type) => {
    const lowerType = type?.toLowerCase() || "";

    if (lowerType === "deposit") {
      return { label: "Nạp tiền", color: "success", icon: <ArrowUpward /> };
    } else if (lowerType === "withdrawal") {
      return { label: "Rút tiền", color: "error", icon: <ArrowDownward /> };
    } else if (lowerType === "payment") {
      return { label: "Thanh toán", color: "info", icon: <ShoppingCart /> };
    } else if (lowerType === "refund") {
      return { label: "Hoàn tiền", color: "warning", icon: <Receipt /> };
    } else if (lowerType.includes("revenue")) {
      return { label: "Doanh thu", color: "success", icon: <ArrowUpward /> };
    }
    return { label: type || "Khác", color: "default", icon: <Info /> };
  };

  const getWithdrawalStatus = (status) => {
    const statusMap = {
      PENDING: {
        label: "Đang chờ", // Shorter label
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
        label: status || "Không rõ", // Default label
        color: "default",
        icon: <Info fontSize="small" />,
      }
    );
  };

  // Initial loading state
  if (loading && !transactions.length && !walletBalance) {
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
    // Added Container and Box for centering and max width
    <Container
      maxWidth="xl" // Use a larger breakpoint if needed
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Center the content horizontally
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1400 }}> {/* Adjust max width as needed */}
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Quản lý ví
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Main Grid Container */}
        <Grid container spacing={3}>
          {/* Balance Card - Takes 6 columns on medium screens */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}> {/* Added display: 'flex' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%' }} // Ensure motion div fills height
            >
              <Card
                elevation={3}
                sx={{
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                  color: "white",
                  height: '100%' // Added height: '100%'
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    height: '100%', // Ensure content takes full height
                    display: 'flex', // Use flexbox for content layout
                    flexDirection: 'column',
                    justifyContent: 'space-between' // Pushes buttons to bottom
                  }}
                >
                  {/* Top Section */}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <AccountBalanceWallet sx={{ fontSize: 42, mr: 2 }} />
                      <Typography variant="h5">Số dư ví</Typography>
                      <Tooltip title="Làm mới số dư">
                        <IconButton
                          color="inherit"
                          onClick={fetchWalletBalance}
                          disabled={balanceLoading}
                          sx={{ ml: "auto" }}
                        >
                          {balanceLoading ? <CircularProgress size={24} color="inherit"/> : <Refresh />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {balanceLoading && walletBalance === null ? ( // Show spinner only if balance is truly loading initially
                      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress color="inherit" />
                      </Box>
                    ) : (
                      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
                        {/* Handle potential null balance */}
                        {walletBalance?.balance?.toLocaleString() ?? "0"} VND
                      </Typography>
                    )}
                  </Box>

                  {/* Bottom Section (Buttons) */}
                  <Box sx={{ display: "flex", gap: 2, mt: 'auto' }}> {/* mt: 'auto' helps push buttons down */}
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Add />}
                      onClick={() => navigate("/wallet/deposit")}
                      fullWidth
                      sx={{
                        py: 1.2,
                        fontWeight: "bold",
                        backgroundColor: "#4caf50",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#3d8b40",
                        },
                      }}
                    >
                      Nạp tiền
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<ArrowDownward />}
                      onClick={() => navigate("/wallet/withdraw")}
                      fullWidth
                      disabled={!canWithdraw}
                      sx={{
                        py: 1.2,
                        fontWeight: "bold",
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Rút tiền
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Quick Stats - Takes 6 columns on medium screens */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}> {/* Added display: 'flex' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: '100%', height: '100%' }} // Ensure motion div fills height
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#f8fafc", // Lighter background
                  height: '100%' // Added height: '100%'
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    height: '100%', // Ensure content takes full height
                    display: 'flex', // Use flexbox for content layout
                    flexDirection: 'column',
                    // justifyContent: 'space-between' // Let content flow naturally or use space-between if needed
                  }}
                >
                  <Box> {/* Content wrapper */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography variant="h5">Thống kê</Typography> {/* Shorter Title */}
                    </Box>
                    <Box sx={{ py: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1" color="text.secondary">
                            Tổng giao dịch
                          </Typography>
                           {/* Use loading state */}
                           {loading ? (
                            <CircularProgress size={24} sx={{ mt: 1 }} />
                          ) : (
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}> {/* Slightly smaller H4 */}
                               {transactionCount || 0}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1" color="text.secondary">
                            Yêu cầu rút tiền
                          </Typography>
                          {/* Use loading state */}
                          {loading ? (
                            <CircularProgress size={24} sx={{ mt: 1 }} />
                          ) : (
                             <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}> {/* Slightly smaller H4 */}
                                {withdrawals.length || 0}
                             </Typography>
                          )}

                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  {/* Removed Spacer Box as flex layout on CardContent handles alignment if needed */}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Transaction History - Takes 6 columns on medium screens */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}> {/* Added display: 'flex' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ width: '100%', height: '100%' }} // Ensure motion div fills height
            >
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}> {/* Added height: '100%' */}
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}> {/* Flex column */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexShrink: 0, // Prevent header from shrinking
                    }}
                  >
                    <Typography variant="h6">Lịch sử giao dịch</Typography>
                    <Button
                      startIcon={<History />}
                      onClick={() => navigate("/wallet/history")}
                      size="small" // Smaller button
                    >
                      Xem tất cả
                    </Button>
                  </Box>

                  {/* Make TableContainer flexible */}
                  <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
                    <Table stickyHeader> {/* Add stickyHeader if needed */}
                      <TableHead>
                        <TableRow>
                          <TableCell>Thời gian</TableCell>
                          <TableCell>Loại</TableCell> {/* Shorter Header */}
                          <TableCell>Mô tả</TableCell>
                          <TableCell align="right">Số tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                       {loading && transactions.length === 0 ? ( // Show loading indicator inside table
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">Không có giao dịch nào</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                          transactions.map((transaction) => {
                            const type = formatTransactionType(
                              transaction.transactionType
                            );
                            const isIncome = type.color === 'success'; // Check if it's income based on color
                            return (
                              <TableRow key={transaction.id} hover>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                  {formatDate(transaction.createdAt)}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    icon={type.icon}
                                    label={type.label}
                                    color={type.color}
                                    size="small"
                                    variant="outlined" // Use outlined for subtle look
                                  />
                                </TableCell>
                                <TableCell>{transaction.description || "-"}</TableCell> {/* Add fallback */}
                                <TableCell align="right">
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "bold",
                                      color: isIncome ? "success.main" : "error.main",
                                      whiteSpace: 'nowrap' // Prevent wrapping
                                    }}
                                  >
                                    {isIncome ? "+" : "-"}
                                    {transaction.amount?.toLocaleString()} VND
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                   {/* Keep Pagination outside TableContainer */}
                   <TablePagination
                    component="div"
                    count={transactionCount}
                    page={transactionPage}
                    onPageChange={handleTransactionPageChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5]} // Only allow 5 rows per page
                    sx={{ flexShrink: 0, borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 'auto' }} // Stick to bottom
                    labelRowsPerPage="Số dòng:" // Translate label
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Withdrawal Requests - Takes 6 columns on medium screens */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}> {/* Added display: 'flex' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ width: '100%', height: '100%' }} // Ensure motion div fills height
            >
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}> {/* Added height: '100%' */}
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}> {/* Flex column */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexShrink: 0, // Prevent header from shrinking
                    }}
                  >
                    <Typography variant="h6">Yêu cầu rút tiền</Typography>
                    <Button
                      startIcon={<History />} // Changed icon to History for consistency
                      onClick={() => navigate("/wallet/withdrawals")}
                       size="small" // Smaller button
                    >
                      Xem tất cả
                    </Button>
                  </Box>

                  {/* Make TableContainer flexible */}
                  <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
                    <Table stickyHeader> {/* Add stickyHeader if needed */}
                      <TableHead>
                        <TableRow>
                          <TableCell>Thời gian</TableCell>
                          <TableCell align="right">Số tiền</TableCell> {/* Align right */}
                          <TableCell>Ngân hàng</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell align="center">Chi tiết</TableCell> {/* Center align */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                         {loading && withdrawals.length === 0 ? ( // Show loading indicator inside table
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                         ) : withdrawals.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary">Không có yêu cầu nào</Typography>
                                </TableCell>
                             </TableRow>
                         ) : (
                          // Only show the latest 5 withdrawals based on sorted list
                          withdrawals.slice(0, 5).map((withdrawal) => {
                            const status = getWithdrawalStatus(withdrawal.status);
                            return (
                              <TableRow key={withdrawal.id} hover>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                  {formatDate(withdrawal.createdAt)}
                                </TableCell>
                                <TableCell align="right"> {/* Align right */}
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "bold", color: "error.main", whiteSpace: 'nowrap' }} // Prevent wrapping
                                  >
                                    {withdrawal.amount?.toLocaleString()} VND
                                  </Typography>
                                </TableCell>
                                <TableCell>{withdrawal.bankName || "-"}</TableCell> {/* Add fallback */}
                                <TableCell>
                                  <Chip
                                    icon={status.icon}
                                    label={status.label}
                                    color={status.color}
                                    size="small"
                                    variant="outlined" // Use outlined for subtle look
                                  />
                                </TableCell>
                                <TableCell align="center"> {/* Center align */}
                                  <Tooltip title="Xem chi tiết">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        navigate("/wallet/withdrawals") // Navigate to the list page
                                      }
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* No pagination needed here as we only show top 5 */}
                   {/* Add a bottom border or padding if needed to match the other card's pagination */}
                   <Box sx={{ height: 53, flexShrink: 0, borderTop: '1px solid transparent', mt: 'auto' }} /> {/* Spacer to align bottoms */}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

        </Grid> {/* End Main Grid Container */}
      </Box> {/* End Centering Box */}
    </Container> // End Main Container
  );
};

export default MyWalletView;