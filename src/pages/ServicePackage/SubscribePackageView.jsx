import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  Chip,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  AccountBalanceWallet as WalletIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import {
  Client as PaymentClient,
  ProcessPaymentRequest,
} from "@/API/PaymentApi";
import { Client as IdentityClient, SubscribeRequest } from "@/API/IdentityApi";
import { updateProfile } from "../../store/userSlice";

const SubscribePackageView = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const packageData = location.state?.package;

  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    // If we have package data from location state, use it directly
    if (packageData) {
      setPackageDetails(packageData);
      setLoading(false);
    } else {
      // Otherwise fetch it using the ID
      fetchPackageDetails();
    }

    // Fetch wallet balance
    fetchWalletBalance();
  }, [id, packageData]);

  const fetchPackageDetails = async () => {
    try {
      const client = new IdentityClient();
      const packages = await client.servicePackages();

      if (packages && packages.length > 0) {
        const pkg = packages.find((p) => p.id === id);
        if (pkg) {
          setPackageDetails(pkg);
        } else {
          setError("Không tìm thấy gói dịch vụ. Vui lòng thử lại sau.");
        }
      } else {
        setError("Không tìm thấy gói dịch vụ. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Error fetching package details:", err);
      setError("Không thể tải thông tin gói dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    setBalanceLoading(true);
    try {
      const client = new PaymentClient();
      const response = await client.getWalletBalance();
      setWalletBalance(response);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setError("Không thể tải thông tin ví. Vui lòng thử lại sau.");
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleSubscribe = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubscribe = async () => {
    setConfirmDialogOpen(false);
    setProcessing(true);
    setError(null);

    try {
      // Step 1: Process payment
      const paymentClient = new PaymentClient();
      const paymentRequest = new ProcessPaymentRequest({
        amount: packageDetails.price,
        description: `Đăng ký gói ${packageDetails.name}`,
        paymentType: "ServicePackage",
        packageId: packageDetails.id,
        referenceId: packageDetails.id,
        providerId: packageDetails.providerId || undefined,
      });

      const response = await paymentClient.processBookingPayment(
        paymentRequest
      );
      setTransactionDetails(response);

      // Step 2: Call the subscribe API to register the subscription
      try {
        const identityClient = new IdentityClient();
        const subscribeRequest = new SubscribeRequest({
          packageId: packageDetails.id,
        });

        await identityClient.subscribe(subscribeRequest);
        console.log("Package subscription registered successfully");

        // Step 3: Refresh token to get updated permissions
        const tokenResponse = await identityClient.refreshToken();

        if (tokenResponse && tokenResponse.token) {
          // Update token in localStorage
          localStorage.setItem("token", tokenResponse.token);

          // If the response also includes updated user info, update that too
          if (tokenResponse.user) {
            localStorage.setItem(
              "userProfile",
              JSON.stringify(tokenResponse.user)
            );

            // Step 4: Update Redux store with the latest user data
            dispatch(updateProfile(tokenResponse.user));
            console.log("User profile and token refreshed with new role");
          } else {
            // If token response doesn't include user data, update the roles manually
            if (user && packageDetails?.associatedRole) {
              const updatedUser = { ...user };

              if (!Array.isArray(updatedUser.roles)) {
                updatedUser.roles = [];
              }

              if (!updatedUser.roles.includes(packageDetails.associatedRole)) {
                updatedUser.roles = [
                  ...updatedUser.roles,
                  packageDetails.associatedRole,
                ];

                // Update Redux store
                dispatch(updateProfile(updatedUser));
                console.log(
                  `Role ${packageDetails.associatedRole} added to user profile`
                );
              }
            }
          }
        } else {
          console.warn("Token refresh didn't return expected data");
        }
      } catch (subscriptionErr) {
        console.error("Failed to register subscription:", subscriptionErr);
        setError(
          "Thanh toán thành công nhưng không thể đăng ký gói. Vui lòng liên hệ hỗ trợ."
        );
      }

      // Step 5: Set success state and refresh wallet balance
      setSuccess(true);
      await fetchWalletBalance();
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(
        "Không thể hoàn tất thanh toán. Vui lòng kiểm tra số dư và thử lại sau."
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const translateRole = (role) => {
    switch (role) {
      case "Coach":
        return "Huấn Luyện Viên";
      case "CourtOwner":
        return "Chủ Sân";
      default:
        return "Người Dùng";
    }
  };

  const getFeatures = (pkg) => {
    const baseFeatures = [pkg.description];

    if (pkg.associatedRole === "Coach") {
      return [
        ...baseFeatures,
        "Tạo và quản lý các buổi huấn luyện",
        "Truy cập vào công cụ huấn luyện cao cấp",
        "Kết nối với khách hàng tiềm năng",
        "Hệ thống lịch trình tích hợp",
      ];
    } else if (pkg.associatedRole === "Venue") {
      return [
        ...baseFeatures,
        "Liệt kê và quảng bá sân của bạn",
        "Hệ thống quản lý sân",
        "Khả năng đặt sân trực tuyến",
        "Công cụ phân tích và báo cáo",
      ];
    } else {
      return [
        ...baseFeatures,
        "Truy cập nội dung cao cấp",
        "Ưu tiên đặt sân và huấn luyện viên",
        "Tính năng tìm kiếm nâng cao",
        "Trải nghiệm không quảng cáo",
      ];
    }
  };

  const hasEnoughBalance = () => {
    if (!walletBalance || !packageDetails) return false;
    return walletBalance.balance >= packageDetails.price;
  };

  if (loading || balanceLoading) {
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

  if (error && !packageDetails) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/pricing")}
        >
          Quay lại danh sách gói
        </Button>
      </Container>
    );
  }

  if (!packageDetails) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          <AlertTitle>Không tìm thấy gói</AlertTitle>
          Không tìm thấy thông tin gói dịch vụ. Vui lòng chọn lại gói từ danh
          sách.
        </Alert>
        <Box mt={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/pricing")}
          >
            Quay lại danh sách gói
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Back button */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/pricing")}
        >
          Quay lại danh sách gói
        </Button>
      </Box>
      {/* Header */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        Đăng Ký Gói Dịch Vụ
      </Typography>
      {/* Success message */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 4 }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          <AlertTitle>Đăng ký thành công!</AlertTitle>
          Bạn đã đăng ký gói {packageDetails.name} thành công. Tài khoản của bạn
          đã được nâng cấp.
        </Alert>
      )}
      {/* Error message */}
      {error && !success && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        {/* Package details */}
        <Grid
          size={{
            xs: 12,
            md: 7
          }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Thông tin gói dịch vụ
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Chip
                label={translateRole(packageDetails.associatedRole)}
                color="primary"
                size="medium"
                sx={{ mr: 2 }}
              />
              <Typography variant="h4" fontWeight="bold">
                {packageDetails.name}
              </Typography>
            </Box>

            <Box mt={3} mb={4}>
              <Typography
                variant="h3"
                fontWeight="bold"
                component="div"
                color="primary.main"
              >
                {formatPrice(packageDetails.price)}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Thời hạn: {packageDetails.durationDays} ngày
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Quyền lợi bao gồm:
            </Typography>

            <List>
              {getFeatures(packageDetails).map((feature, index) => (
                <ListItem key={index} disableGutters sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      fontWeight: index === 0 ? "medium" : "regular",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Payment details */}
        <Grid
          size={{
            xs: 12,
            md: 5
          }}>
          <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thanh toán
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Wallet balance */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <WalletIcon
                  fontSize="large"
                  sx={{ mr: 2, color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Số dư ví của bạn
                  </Typography>
                  {balanceLoading ? (
                    <CircularProgress size={20} sx={{ my: 0.5 }} />
                  ) : (
                    <Typography variant="h6" fontWeight="bold">
                      {formatPrice(walletBalance?.balance || 0)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Payment summary */}
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Tóm tắt thanh toán
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={8}>
                    <Typography>Gói dịch vụ</Typography>
                  </Grid>
                  <Grid sx={{ textAlign: "right" }} size={4}>
                    <Typography fontWeight="medium">
                      {packageDetails.name}
                    </Typography>
                  </Grid>

                  <Grid size={8}>
                    <Typography>Thời hạn</Typography>
                  </Grid>
                  <Grid sx={{ textAlign: "right" }} size={4}>
                    <Typography>{packageDetails.durationDays} ngày</Typography>
                  </Grid>

                  <Grid size={8}>
                    <Typography>Giá</Typography>
                  </Grid>
                  <Grid sx={{ textAlign: "right" }} size={4}>
                    <Typography>{formatPrice(packageDetails.price)}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={8}>
                    <Typography fontWeight="bold">Tổng thanh toán</Typography>
                  </Grid>
                  <Grid sx={{ textAlign: "right" }} size={4}>
                    <Typography fontWeight="bold" color="primary.main">
                      {formatPrice(packageDetails.price)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Low balance warning */}
              {!hasEnoughBalance() && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <AlertTitle>Số dư không đủ</AlertTitle>
                  Số dư hiện tại của bạn không đủ để mua gói này. Vui lòng nạp
                  thêm tiền vào ví.
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate("/wallet/deposit")}
                    >
                      Nạp tiền ngay
                    </Button>
                  </Box>
                </Alert>
              )}

              {/* Terms and conditions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Bằng cách đăng ký gói dịch vụ này, bạn đồng ý với điều khoản
                  sử dụng và chính sách của Courtsite.
                </Typography>
              </Box>

              {/* Subscribe button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!hasEnoughBalance() || processing || success}
                onClick={handleSubscribe}
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                {processing ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Đang xử lý...
                  </>
                ) : success ? (
                  "Đã đăng ký thành công"
                ) : (
                  "Xác nhận đăng ký"
                )}
              </Button>

              {success && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button variant="outlined" onClick={() => navigate("/")}>
                    Về trang chủ
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Confirmation dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Xác nhận đăng ký</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn chắc chắn muốn đăng ký gói{" "}
            <strong>{packageDetails.name}</strong> với giá{" "}
            <strong>{formatPrice(packageDetails.price)}</strong>?
            <br />
            <br />
            Số tiền này sẽ được trừ từ ví của bạn.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmSubscribe}
            variant="contained"
            color="primary"
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Processing backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={processing}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Đang xử lý giao dịch...</Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default SubscribePackageView;
