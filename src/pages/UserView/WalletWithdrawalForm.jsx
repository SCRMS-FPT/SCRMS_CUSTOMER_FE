import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ArrowBack,
  AccountBalanceWallet,
  ArrowDownward,
  Refresh,
  Info,
  CheckCircle,
  ErrorOutline,
  AccountBalance,
  CreditCard,
  Badge,
} from "@mui/icons-material";
import { Client, WithdrawalRequestDto } from "@/API/PaymentApi";

const WalletWithdrawalForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Add state for banks
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    bankObj: null,
    accountNumber: "",
    accountHolderName: "",
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  // Fetch wallet balance and banks on component mount
  useEffect(() => {
    fetchWalletBalance();
    fetchBanks();
  }, []);

  // Fetch banks from API
  const fetchBanks = async () => {
    setBanksLoading(true);
    try {
      const response = await fetch("https://api.vietqr.io/v2/banks");
      const result = await response.json();
      if (result.code === "00") {
        setBanks(result.data);
      } else {
        console.error("Error fetching banks:", result.desc);
        // Fall back to empty array but don't show error
        setBanks([]);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      setBanks([]);
    } finally {
      setBanksLoading(false);
    }
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
      setError("Không thể tải số dư ví. Vui lòng thử lại sau.");
    } finally {
      setBalanceLoading(false);
    }
  };

  // Handle amount change with immediate validation
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      amount: value,
    });

    // Clear previous error
    setFormErrors({
      ...formErrors,
      amount: "",
    });

    // Immediate validation
    if (value && (isNaN(value) || Number(value) <= 0)) {
      setFormErrors({
        ...formErrors,
        amount: "Số tiền phải lớn hơn 0",
      });
    } else if (value && Number(value) < 10000) {
      setFormErrors({
        ...formErrors,
        amount: "Số tiền rút tối thiểu là 10,000 VND",
      });
    } else if (
      value &&
      walletBalance &&
      Number(value) > walletBalance.balance
    ) {
      setFormErrors({
        ...formErrors,
        amount: "Số tiền rút vượt quá số dư ví",
      });
    }
  };

  // Handle other input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = "Vui lòng nhập số tiền";
      valid = false;
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Số tiền phải lớn hơn 0";
      valid = false;
    } else if (Number(formData.amount) < 10000) {
      newErrors.amount = "Số tiền rút tối thiểu là 10,000 VND";
      valid = false;
    } else if (
      walletBalance &&
      Number(formData.amount) > walletBalance.balance
    ) {
      newErrors.amount = "Số tiền rút vượt quá số dư ví";
      valid = false;
    }

    // Validate bank name
    if (!formData.bankName) {
      newErrors.bankName = "Vui lòng chọn ngân hàng";
      valid = false;
    }

    // Validate account number
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Vui lòng nhập số tài khoản";
      valid = false;
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Số tài khoản phải là số";
      valid = false;
    }

    // Validate account holder name
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "Vui lòng nhập tên chủ tài khoản";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const apiClient = new Client();
      const withdrawalRequest = new WithdrawalRequestDto({
        amount: Number(formData.amount),
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolderName: formData.accountHolderName,
      });

      await apiClient.createWithdrawalRequest(withdrawalRequest);

      // Show success dialog
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      setError(
        error.message || "Không thể tạo yêu cầu rút tiền. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle success dialog close
  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/wallet/withdrawals");
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={() => navigate("/wallet")}
          sx={{ mr: 2, color: "primary.main" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Rút tiền
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        {/* Balance card */}
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 24, mr: 1 }} />
                  <Typography variant="h6">Số dư ví</Typography>
                  <Tooltip title="Làm mới số dư">
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={fetchWalletBalance}
                      disabled={balanceLoading}
                      sx={{ ml: "auto" }}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {balanceLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 2 }}
                  >
                    <CircularProgress size={30} color="inherit" />
                  </Box>
                ) : (
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    {walletBalance?.balance?.toLocaleString()} VND
                  </Typography>
                )}

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Info fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, fontSize: 12 }}
                  >
                    Yêu cầu rút tiền sẽ được xử lý trong vòng 24-48 giờ làm việc
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Withdrawal form */}
        <Grid
          size={{
            xs: 12,
            md: 8
          }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                p: 4,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Tạo yêu cầu rút tiền
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Số tiền muốn rút"
                      name="amount"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      error={!!formErrors.amount}
                      helperText={
                        formErrors.amount ||
                        (walletBalance
                          ? `Số dư khả dụng: ${walletBalance.balance?.toLocaleString()} VND`
                          : "")
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">VND</InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <ArrowDownward color="error" />
                          </InputAdornment>
                        ),
                        inputProps: {
                          max: walletBalance?.balance || 0,
                          min: 0,
                        },
                      }}
                      variant="outlined"
                      type="number"
                    />
                  </Grid>

                  <Grid size={12}>
                    <Autocomplete
                      fullWidth
                      options={banks}
                      getOptionLabel={(option) =>
                        option ? `${option.code} - ${option.name}` : ""
                      }
                      loading={banksLoading}
                      filterOptions={(options, state) => {
                        const inputValue = state.inputValue.toLowerCase();
                        return options.filter(
                          (option) =>
                            option.code.toLowerCase().includes(inputValue) ||
                            option.name.toLowerCase().includes(inputValue)
                        );
                      }}
                      value={formData.bankObj}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          bankName: newValue
                            ? `${newValue.code} - ${newValue.name}`
                            : "",
                          bankObj: newValue,
                        });
                        // Clear error
                        if (formErrors.bankName) {
                          setFormErrors({
                            ...formErrors,
                            bankName: "",
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tên ngân hàng"
                          error={!!formErrors.bankName}
                          helperText={formErrors.bankName}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <AccountBalance />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              py: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={option.logo}
                                alt={option.shortName}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML =
                                    option.code;
                                }}
                              />
                            </Box>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {option.code} - {option.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {option.shortName}
                              </Typography>
                            </Box>
                          </Box>
                        </li>
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Số tài khoản"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      error={!!formErrors.accountNumber}
                      helperText={formErrors.accountNumber}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Tên chủ tài khoản"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      error={!!formErrors.accountHolderName}
                      helperText={formErrors.accountHolderName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Lưu ý: Yêu cầu rút tiền sẽ được xử lý trong vòng 24-48
                        giờ làm việc. Vui lòng kiểm tra kỹ thông tin tài khoản
                        trước khi gửi yêu cầu.
                      </Typography>
                    </Alert>
                  </Grid>

                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                    size={12}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/wallet")}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting || balanceLoading || banksLoading}
                      startIcon={
                        submitting ? <CircularProgress size={20} /> : null
                      }
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 2,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {submitting ? "Đang xử lý..." : "Tạo yêu cầu rút tiền"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">
            Yêu cầu rút tiền đã được tạo thành công!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
            Yêu cầu rút tiền của bạn đã được ghi nhận và đang chờ xử lý. Vui
            lòng kiểm tra danh sách yêu cầu rút tiền để theo dõi trạng thái.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSuccessDialogClose}
            color="primary"
            sx={{ borderRadius: 2, px: 3, py: 1 }}
          >
            Xem danh sách yêu cầu rút tiền
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletWithdrawalForm;
