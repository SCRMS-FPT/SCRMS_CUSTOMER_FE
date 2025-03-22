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
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  ArrowUpward,
  ArrowDownward,
  ShoppingCart,
  Receipt,
  Info,
  Refresh,
} from "@mui/icons-material";
import { Client } from "../../API/PaymentApi";

const WalletHistoryView = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch transaction history on component mount and page/limit changes
  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage]);

  // Fetch transaction history
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const apiClient = new Client();
      const response = await apiClient.getTransactionHistory(page + 1, rowsPerPage);
      setTransactions(response.data || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format transaction type for display
  const formatTransactionType = (type) => {
    switch (type?.toLowerCase()) {
      case "deposit":
        return { label: "Nạp tiền", color: "success", icon: <ArrowUpward fontSize="small" /> };
      case "withdrawal":
        return { label: "Rút tiền", color: "error", icon: <ArrowDownward fontSize="small" /> };
      case "payment":
        return { label: "Thanh toán", color: "info", icon: <ShoppingCart fontSize="small" /> };
      case "refund":
        return { label: "Hoàn tiền", color: "warning", icon: <Receipt fontSize="small" /> };
      default:
        return { label: type || "Khác", color: "default", icon: <Info fontSize="small" /> };
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
      minute: "2-digit"
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate("/wallet")}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Lịch sử giao dịch
        </Typography>
        <IconButton 
          color="primary" 
          onClick={fetchTransactions} 
          disabled={loading}
          sx={{ ml: "auto" }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading && transactions.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
              <CircularProgress />
            </Box>
          ) : transactions.length > 0 ? (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Loại giao dịch</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell align="right">Số tiền</TableCell>
                      <TableCell>Mã tham chiếu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const formattedType = formatTransactionType(transaction.transactionType);
                      return (
                        <TableRow
                          key={transaction.id}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {formatDate(transaction.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={formattedType.icon}
                              label={formattedType.label}
                              color={formattedType.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: transaction.transactionType?.toLowerCase() === "deposit" 
                                  ? "success.main" 
                                  : transaction.transactionType?.toLowerCase() === "refund"
                                    ? "warning.dark"
                                    : "error.main"
                              }}
                            >
                              {transaction.transactionType?.toLowerCase() === "deposit" || 
                               transaction.transactionType?.toLowerCase() === "refund" 
                                ? "+" : "-"}
                              {transaction.amount?.toLocaleString()} VND
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {transaction.referenceId || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có giao dịch nào
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate("/wallet")}
                sx={{ mt: 2 }}
              >
                Nạp tiền ngay
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default WalletHistoryView;