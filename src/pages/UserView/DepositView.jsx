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
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositError, setDepositError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

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
  const handleDeposit = () => {
    if (!validateAmount(amount)) return;

    setActiveStep(1);

    // After 3 seconds, proceed to final step
    setTimeout(() => {
      processDeposit();
    }, 3000);
  };

  // Process the deposit
  const processDeposit = async () => {
    setLoading(true);
    setDepositError(null);
    try {
      const apiClient = new Client();
      const depositRequest = new DepositFundsRequest({
        amount: parseFloat(amount),
        description: "Nạp tiền vào ví",
      });

      const response = await apiClient.depositFunds(depositRequest);
      setDepositSuccess(true);
      setTransactionId(response?.id || "TXN-" + Date.now());
      setActiveStep(2);
      // Refresh wallet balance
      await fetchWalletBalance();
    } catch (error) {
      console.error("Error depositing funds:", error);
      setDepositError("Không thể hoàn thành giao dịch. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code content
  const generateQRContent = () => {
    const bankAccount = "0834398268";
    const accountName = "LE MINH THANG";
    const bank = "MBBANK";
    const content = `${bank}|${bankAccount}|${accountName}|${amount}|Nap tien vi Courtsite`;
    return content;
  };

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
              <Box sx={{ p: 1, bgcolor: "white" }}>
                <QRCode
                  value={generateQRContent()}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </Box>
            </Paper>
            <Box sx={{ mb: 2, width: "100%", textAlign: "center" }}>
              <Typography variant="body1" gutterBottom fontWeight="bold">
                Thông tin chuyển khoản:
              </Typography>
              <Typography variant="body2" gutterBottom>
                Số tài khoản: <strong>0834398268</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Tên: <strong>LE MINH THANG</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Ngân hàng: <strong>MBBANK</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Số tiền:{" "}
                <strong>{parseFloat(amount).toLocaleString()} VND</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Nội dung: <strong>Nap tien vi Courtify</strong>
              </Typography>
            </Box>
            <CircularProgress sx={{ mt: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Đang xử lý thanh toán...
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
