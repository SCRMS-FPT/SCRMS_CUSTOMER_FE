import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Add,
  ArrowUpward,
  ArrowDownward,
  History,
  Refresh,
  ShoppingCart,
  Error,
  Receipt,
  Info,
} from "@mui/icons-material";
import { Client, DepositFundsRequest } from "../../API/PaymentApi";

const WalletView = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");

  // Fetch wallet data on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Fetch both wallet balance and transactions
  const fetchWalletData = async () => {
    setLoading(true);
    await Promise.all([fetchWalletBalance(), fetchTransactions()]);
    setLoading(false);
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    setBalanceLoading(true);
    try {
      const apiClient = new Client();
      const response = await apiClient.getWalletBalance();
      setWalletBalance(response);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setError("Failed to load wallet balance. Please try again.");
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const apiClient = new Client();
      const response = await apiClient.getTransactionHistory(1, 5); // Get first page with 5 records
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction history. Please try again.");
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Format transaction type for display
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
    } else {
      return { label: type || "Khác", color: "default", icon: <Info /> };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Ví của tôi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Wallet Balance Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: "100%",
              background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalanceWallet sx={{ fontSize: 42, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Số dư ví
                </Typography>
                <Tooltip title="Làm mới số dư">
                  <IconButton
                    color="inherit"
                    onClick={fetchWalletBalance}
                    disabled={balanceLoading}
                    sx={{ ml: "auto" }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              {balanceLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 3 }}
                >
                  {walletBalance?.balance?.toLocaleString()} VND
                </Typography>
              )}

              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => navigate("/wallet/deposit")}
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  backgroundColor: "#4caf50",
                  borderRadius: 2,
                  boxShadow: "0 4px 10px rgba(76, 175, 80, 0.5)",
                  "&:hover": {
                    backgroundColor: "#3d8b40",
                  },
                }}
              >
                Nạp tiền
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <History sx={{ fontSize: 28, mr: 2, color: "#637381" }} />
                <Typography variant="h5" component="div">
                  Giao dịch gần đây
                </Typography>
                <Tooltip title="Làm mới danh sách">
                  <IconButton
                    color="primary"
                    onClick={fetchTransactions}
                    disabled={transactionsLoading}
                    sx={{ ml: "auto" }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {transactionsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : transactions.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {transactions.map((transaction) => {
                    const formattedType = formatTransactionType(
                      transaction.transactionType
                    );

                    return (
                      <ListItem
                        key={transaction.id}
                        alignItems="flex-start"
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderRadius: 1,
                          mb: 1,
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: `${formattedType.color}.light` }}
                          >
                            {formattedType.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Chip
                                  label={formattedType.label}
                                  color={formattedType.color}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {formatDate(transaction.createdAt)}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "bold",
                                  color:
                                    ["deposit", "refund"].includes(
                                      transaction.transactionType?.toLowerCase()
                                    ) ||
                                    transaction.transactionType
                                      ?.toLowerCase()
                                      .includes("revenue")
                                      ? "success.main"
                                      : "text.primary",
                                }}
                              >
                                {["deposit", "refund"].includes(
                                  transaction.transactionType?.toLowerCase()
                                ) ||
                                transaction.transactionType
                                  ?.toLowerCase()
                                  .includes("revenue")
                                  ? "+"
                                  : "-"}
                                {transaction.amount?.toLocaleString()} VND
                              </Typography>
                            </Box>
                          }
                          secondary={transaction.description}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Box sx={{ mb: 2, color: "#637381" }}>
                    <Error sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Chưa có giao dịch nào
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => navigate("/wallet/history")}
                  sx={{ borderRadius: 2 }}
                >
                  Xem lịch sử giao dịch
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WalletView;
