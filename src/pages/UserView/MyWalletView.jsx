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
import { Assessment, SwapHoriz } from '@mui/icons-material';
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
    const [rowsPerPage] = useState(5);
    const [transactionCount, setTransactionCount] = useState(0);

    useEffect(() => {
        fetchWalletData();
        checkWithdrawPermission();
    }, []);

    useEffect(() => {
        if (!loading) {
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
        setError(null);
        try {
            await Promise.all([
                fetchWalletBalance(),
                fetchTransactions(),
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
        } finally {
            setBalanceLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const apiClient = new Client();
            const response = await apiClient.getTransactionHistory(
                transactionPage + 1,
                rowsPerPage
            );
            setTransactions(response.data || []);
            setTransactionCount(response.count || 0);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchWithdrawals = async () => {
        try {
            const apiClient = new Client();
            const response = await apiClient.getUserWithdrawalRequests();
            const sortedWithdrawals = (response || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setWithdrawals(sortedWithdrawals);
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
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
                label: "Đang chờ",
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
                label: status || "Không rõ",
                color: "default",
                icon: <Info fontSize="small" />,
            }
        );
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
        <Container
            maxWidth={false}
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f8fafc'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <Typography variant="h4" component="h1" fontWeight="bold" align="center">
                    Quản lý ví
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    {/* Balance Card */}
                    <Box sx={{ width: 'calc(50% - 12px)', minWidth: '500px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ height: '100%' }}
                        >
                            <Card
                                elevation={3}
                                sx={{
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                                    color: "white",
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
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
                                                    {balanceLoading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                        {balanceLoading && walletBalance === null ? (
                                            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                                                <CircularProgress color="inherit" />
                                            </Box>
                                        ) : (
                                            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
                                                {walletBalance?.balance?.toLocaleString() ?? "0"} VND
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<Add />}
                                            onClick={() => navigate("/user/deposit")}
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

                                        {canWithdraw && (
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                startIcon={<ArrowDownward />}
                                                onClick={() => navigate("/wallet/withdraw")}
                                                fullWidth
                                                sx={{
                                                    py: 1.2,
                                                    fontWeight: "bold",
                                                    borderColor: "rgba(255,255,255,0.5)",
                                                    color: "white",
                                                    borderRadius: 2,
                                                    "&:hover": {
                                                        borderColor: "white",
                                                        backgroundColor: "rgba(255,255,255,0.1)",
                                                    },
                                                }}
                                            >
                                                Rút tiền
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>

                    {/* Quick Stats Card */}
                    <Box sx={{ width: 'calc(50% - 12px)', minWidth: '500px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{ height: '100%' }}
                        >
                            <Card
                                elevation={2}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#f8fafc",
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                            <Assessment sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                                Thống kê giao dịch
                                            </Typography>
                                        </Box>
                                        <Box sx={{ py: 3 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <SwapHoriz sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                                                            Tổng giao dịch
                                                        </Typography>
                                                    </Box>
                                                    {loading ? (
                                                        <CircularProgress size={24} sx={{ mt: 1 }} />
                                                    ) : (
                                                        <Typography variant="h3" sx={{ mt: 1, fontWeight: "bold", color: 'primary.main' }}>
                                                            {transactionCount || 0}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                                {canWithdraw && (
                                                    <Grid size={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <ArrowDownward sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                                                                Yêu cầu rút tiền
                                                            </Typography>
                                                        </Box>
                                                        {loading ? (
                                                            <CircularProgress size={24} sx={{ mt: 1 }} />
                                                        ) : (
                                                            <Typography variant="h3" sx={{ mt: 1, fontWeight: "bold", color: 'primary.main' }}>
                                                                {withdrawals.length || 0}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>
                </Box>

                {/* Transaction History and Withdrawal Requests in full width */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Updated Transaction History */}
                    <Box sx={{ width: '100%' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            style={{ height: '100%' }}
                        >
                            <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h5">Lịch sử giao dịch</Typography>
                                        <Button
                                            startIcon={<History />}
                                            onClick={() => navigate("/user/wallet/history")}
                                            size="small"
                                        >
                                            Xem tất cả
                                        </Button>
                                    </Box>

                                    <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
                                        <Table stickyHeader>
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
                                                        <TableRow key={transaction.id} hover>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                {formatDate(transaction.createdAt)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    icon={formattedType.icon}
                                                                    label={formattedType.label}
                                                                    color={formattedType.color}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{transaction.description || "-"}</TableCell>
                                                            <TableCell align="right">
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: "bold",
                                                                        color: [
                                                                            "deposit",
                                                                            "refund",
                                                                            "coach_booking_refund",
                                                                        ].includes(transaction.transactionType?.toLowerCase()) ||
                                                                            transaction.transactionType?.toLowerCase().includes("revenue")
                                                                            ? "success.main"
                                                                            : [
                                                                                "refund_deduction",
                                                                                "coach_refund_deduction",
                                                                                "payment",
                                                                                "withdrawal",
                                                                            ].includes(transaction.transactionType?.toLowerCase())
                                                                                ? "error.main"
                                                                                : "text.secondary",
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {["deposit", "refund", "coach_booking_refund"].includes(transaction.transactionType?.toLowerCase()) ||
                                                                        transaction.transactionType?.toLowerCase().includes("revenue")
                                                                        ? "+"
                                                                        : ""}
                                                                    {transaction.amount?.toLocaleString()} VND
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>{transaction.referenceId || "-"}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={transactionCount}
                                        page={transactionPage}
                                        onPageChange={handleTransactionPageChange}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[5]}
                                        sx={{ flexShrink: 0, borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 'auto' }}
                                        labelRowsPerPage="Số dòng:"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>

                    {/* Withdrawal Requests */}
                    {canWithdraw && (
                        <Box sx={{ width: '100%' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                style={{ height: '100%' }}
                            >
                                <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5">Yêu cầu rút tiền</Typography>
                                            <Button
                                                startIcon={<ArrowDownward />}
                                                onClick={() => navigate("/user/withdrawal/history")}
                                                size="small"
                                            >
                                                Xem tất cả
                                            </Button>
                                        </Box>

                                        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Thời gian</TableCell>
                                                        <TableCell align="right">Số tiền</TableCell>
                                                        <TableCell>Ngân hàng</TableCell>
                                                        <TableCell>Trạng thái</TableCell>
                                                        <TableCell align="center">Chi tiết</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {withdrawals.slice(0, 5).map((withdrawal) => {
                                                        const status = getWithdrawalStatus(withdrawal.status);
                                                        return (
                                                            <TableRow key={withdrawal.id} hover>
                                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                    {formatDate(withdrawal.createdAt)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{ fontWeight: "bold", color: "error.main", whiteSpace: 'nowrap' }}
                                                                    >
                                                                        {withdrawal.amount?.toLocaleString()} VND
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>{withdrawal.bankName || "-"}</TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        icon={status.icon}
                                                                        label={status.label}
                                                                        color={status.color}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Tooltip title="Xem chi tiết">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => navigate("/wallet/withdrawals")}
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
                                        <Box sx={{ height: 52, flexShrink: 0, borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 'auto' }} />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default MyWalletView;