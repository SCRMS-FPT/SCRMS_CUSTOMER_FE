import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  InputAdornment,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountBalanceWallet,
  QrCode2,
  CheckCircle,
  ArrowBack,
  Send as SendIcon,
} from "@mui/icons-material";
import QRCode from "react-qr-code";
import { Client, DepositFundsRequest } from "../../API/PaymentApi";

const DepositView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [walletBalance, setWalletBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [depositResponse, setDepositResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositError, setDepositError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [pollingTimeout, setPollingTimeout] = useState(null);
  const [isDepositCancelled, setIsDepositCancelled] = useState(false);

  const steps = ["Nhập thông tin", "Thanh toán", "Hoàn thành"];

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  // Fetch wallet balance
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

  // Validate amount
  const validateAmount = (value) => {
    if (!value) {
      setAmountError("Vui lòng nhập số tiền");
      return false;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Số tiền không hợp lệ");
      return false;
    }
    if (numValue <= 0) {
      setAmountError("Số tiền phải lớn hơn 0");
      return false;
    }
    if (numValue < 10000) {
      setAmountError("Số tiền tối thiểu là 10,000 VND");
      return false;
    }
    setAmountError("");
    return true;
  };

  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  // Handle deposit button click
  const handleDeposit = async () => {
    if (!validateAmount(amount)) return;

    setLoading(true);
    setDepositError(null);
    try {
      const apiClient = new Client();
      const depositRequest = new DepositFundsRequest({
        amount: parseFloat(amount),
        description: "Nạp tiền vào ví",
      });

      const response = await apiClient.depositFunds(depositRequest);
      setDepositResponse(response);
      setActiveStep(1);
      
      // Start polling for deposit status
      startPollingDepositStatus(response.id);
    } catch (error) {
      console.error("Error depositing funds:", error);
      setDepositError("Không thể khởi tạo giao dịch. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Start polling
  const startPollingDepositStatus = (depositId) => {
    if (!depositId) return;
    
    let pollCount = 0;
    const maxPolls = 180; 
    const pollInterval = 5000;
    
    const checkDepositStatus = async () => {
      try {
        const client = new Client();
        const status = await client.getDepositStatus(depositId);
        
        if (status.status === "Completed") {
          // Deposit successful
          setDepositSuccess(true);
          setTransactionId(depositId);
          setActiveStep(2);
          fetchWalletBalance(); // Refresh wallet balance
          clearTimeout(pollingTimeout);
        } else if (status.status === "Cancelled" || status.status === "Failed") {
          // Deposit failed or cancelled
          setDepositError("Giao dịch đã bị hủy hoặc thất bại.");
          setActiveStep(2);
          clearTimeout(pollingTimeout);
        } else {
          // Still pending
          pollCount++;
          
          if (pollCount >= maxPolls) {
            // Timeout after 15 minutes
            setIsDepositCancelled(true);
            setDepositError("Giao dịch đã hết thời gian chờ (15 phút). Vui lòng kiểm tra lại sau.");
            setActiveStep(2);
            clearTimeout(pollingTimeout);
          } else {
            // Continue polling
            const timeout = setTimeout(checkDepositStatus, pollInterval);
            setPollingTimeout(timeout);
          }
        }
      } catch (error) {
        console.error("Error checking deposit status:", error);
        pollCount++;
        
        if (pollCount >= maxPolls) {
          setIsDepositCancelled(true);
          setDepositError("Giao dịch đã hết thời gian chờ (15 phút). Vui lòng kiểm tra lại sau.");
          setActiveStep(2);
          clearTimeout(pollingTimeout);
        } else {
          const timeout = setTimeout(checkDepositStatus, pollInterval);
          setPollingTimeout(timeout);
        }
      }
    };
    
    // Start the first check
    const timeout = setTimeout(checkDepositStatus, pollInterval);
    setPollingTimeout(timeout);
  };

  // Clean up polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
      }
    };
  }, [pollingTimeout]);

  // Handle go back button
  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/wallet");
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Nhập số tiền bạn muốn nạp
            </Typography>
            <TextField
              fullWidth
              label="Số tiền"
              variant="outlined"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              error={!!amountError}
              helperText={amountError}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
            <FormHelperText sx={{ mb: 3 }}>
              Số tiền tối thiểu: 10,000 VND
            </FormHelperText>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleDeposit}
              disabled={!amount || !!amountError}
              startIcon={<SendIcon />}
              sx={{ py: 1.5 }}
            >
              Nạp tiền
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quét mã QR để thanh toán
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
            </Typography>

            <Paper
              elevation={3}
              sx={{ p: 3, mb: 3, mt: 2, maxWidth: 280, width: "100%" }}
            >
              <Box sx={{ p: 1, bgcolor: "white", display: "flex", justifyContent: "center" }}>
                <img
                  src={depositResponse.qrCodeUrl}
                  alt="QR Code"
                  style={{ maxWidth: "100%", maxHeight: 256 }}
                />
              </Box>
            </Paper>
            <Box sx={{ mb: 2, width: "100%", textAlign: "center" }}>
              <Typography variant="body1" gutterBottom fontWeight="bold">
                Thông tin chuyển khoản:
              </Typography>
              {depositResponse?.bankInfo && (
                <Box sx={{ mb: 1 }}>
                  {depositResponse.bankInfo.split(",").map((part, idx) => {
                    const [beforeColon, afterColon] = part.split(/:(.+)/); // split only on the first colon
                    return (
                      <Typography variant="body2" gutterBottom key={idx}>
                        {afterColon !== undefined ? (
                          <>
                            {beforeColon.trim()}:
                            <strong>{afterColon}</strong>
                          </>
                        ) : (
                          part
                        )}
                      </Typography>
                    );
                  })}
                </Box>
              )}
              <Typography variant="body2" gutterBottom>
                Số tiền:{" "}
                <strong>
                  {depositResponse?.amount
                    ? parseFloat(depositResponse.amount).toLocaleString()
                    : parseFloat(amount).toLocaleString()}{" "}
                  VND
                </strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Nội dung chuyển khoản:{" "}
                <strong>{depositResponse?.code || ""}</strong>
              </Typography>
            </Box>
            <CircularProgress sx={{ mt: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Đang xử lý thanh toán... (Tối đa 15 phút)
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {depositSuccess ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <CheckCircle color="success" sx={{ fontSize: 60 }} />
                </Box>
                <Typography variant="h5" gutterBottom color="success.main">
                  Nạp tiền thành công!
                </Typography>
                <Typography variant="body1" gutterBottom align="center">
                  Số tiền{" "}
                  <strong>{parseFloat(amount).toLocaleString()} VND</strong> đã
                  được thêm vào ví của bạn.
                </Typography>

                <Card sx={{ width: "100%", mt: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Chi tiết giao dịch
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Mã giao dịch
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" fontWeight="bold">
                          {transactionId}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2">
                          {new Date().toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Loại giao dịch
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2">Nạp tiền vào ví</Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Số tiền
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          +{parseFloat(amount).toLocaleString()} VND
                        </Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Số dư hiện tại
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" fontWeight="bold">
                          {walletBalance?.balance?.toLocaleString()} VND
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/wallet")}
                  >
                    Về trang ví
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setActiveStep(0);
                      setAmount("");
                      setDepositSuccess(false);
                    }}
                  >
                    Nạp thêm tiền
                  </Button>
                </Box>
              </>
            ) : depositError ? (
              <>
                <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                  {depositError}
                </Alert>
                {isDepositCancelled ? (
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Nếu bạn đã chuyển khoản, vui lòng liên hệ với bộ phận hỗ trợ và cung cấp mã giao dịch: <strong>{depositResponse?.id || "N/A"}</strong>
                  </Typography>
                ) : null}
                <Button variant="contained" onClick={() => setActiveStep(0)}>
                  Thử lại
                </Button>
              </>
            ) : (
              <CircularProgress />
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mr: 2 }}>
          {activeStep === 0 ? "Quay lại" : "Trở về"}
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Nạp tiền vào ví
        </Typography>
      </Box>

      {/* Wallet info card */}
      <Card
        sx={{
          mb: 4,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="body2">Số dư hiện tại</Typography>
              {balanceLoading ? (
                <CircularProgress size={20} sx={{ color: "white", my: 0.5 }} />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {walletBalance?.balance?.toLocaleString()} VND
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stepper */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main content */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {getStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default DepositView;
