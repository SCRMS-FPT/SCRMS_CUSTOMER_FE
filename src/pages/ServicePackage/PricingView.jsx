import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { Client } from "@/API/IdentityApi";

const PricingView = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const client = new Client();
        const response = await client.servicePackages();

        // Parse the response
        if (response) {
          setPackages(response);
        } else {
          setPackages([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.");
        setError("Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate features based on package type
  const getFeatures = (pkg) => {
    const baseFeatures = [pkg.description];

    if (pkg.associatedRole === "Coach") {
      return [
        ...baseFeatures,
        "Tạo và quản lý các buổi huấn luyện",
        "Truy cập vào công cụ huấn luyện cao cấp",
        "Kết nối với khách hàng tiềm năng",
        "Hệ thống lịch trình tích hợp",
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
        "Truy cập nội dung cao cấp",
        "Ưu tiên đặt sân và huấn luyện viên",
        "Tính năng tìm kiếm nâng cao",
        "Trải nghiệm không quảng cáo",
      ];
    }
  };

  // Translate role names
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

  // Determine if a package should be highlighted
  const isPopular = (pkg) => {
    return (
      pkg.name.toLowerCase().includes("premium") ||
      pkg.price > 200000 ||
      pkg.price > 200000 ||
      pkg.associatedRole === "Coach"
    );
  };

  // Handle subscription button click
  const handleSubscribe = (pkg) => {
    // Navigate to subscribe page with package details
    navigate(`/subscribe-package/${pkg.id}`, { state: { package: pkg } });
  const handleSubscribe = (pkg) => {
    // Navigate to subscribe page with package details
    navigate(`/subscribe-package/${pkg.id}`, { state: { package: pkg } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header section */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 2,
          }}
        >
          Nâng Cấp Trải Nghiệm Của Bạn
          Nâng Cấp Trải Nghiệm Của Bạn
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: "800px", mx: "auto" }}
        >
          Chọn gói dịch vụ phù hợp để nâng cao trải nghiệm thể thao của bạn với
          các tính năng cao cấp và quyền lợi đặc biệt
          Chọn gói dịch vụ phù hợp để nâng cao trải nghiệm thể thao của bạn với
          các tính năng cao cấp và quyền lợi đặc biệt
        </Typography>
      </Box>

      {/* Package cards */}
      {packages.length === 0 ? (
        <Alert severity="info">
          Hiện tại không có gói dịch vụ nào. Vui lòng quay lại sau.
          Hiện tại không có gói dịch vụ nào. Vui lòng quay lại sau.
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {packages.map((pkg) => {
            const popular = isPopular(pkg);
            return (
              <Grid item key={pkg.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 30px rgba(0,0,0,0.1)",
                    },
                    position: "relative",
                    borderRadius: 3,
                    overflow: "visible",
                    border: popular
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  }}
                >
                  {popular && (
                    <Chip
                      label="KHUYẾN NGHỊ"
                      label="KHUYẾN NGHỊ"
                      color="primary"
                      icon={<StarIcon />}
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 20,
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box mb={1}>
                      <Chip
                        label={translateRole(pkg.associatedRole)}
                        label={translateRole(pkg.associatedRole)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {pkg.name}
                    </Typography>

                    <Box sx={{ my: 3, textAlign: "center", py: 2 }}>
                      <Typography
                        variant="h3"
                        component="div"
                        fontWeight="bold"
                      >
                        {formatPrice(pkg.price)}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        cho {pkg.durationDays} ngày
                        cho {pkg.durationDays} ngày
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List sx={{ py: 2 }}>
                      {getFeatures(pkg).map((feature, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.75 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: index === 0 ? "medium" : "regular",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={popular ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      onClick={() => handleSubscribe(pkg)}
                      onClick={() => handleSubscribe(pkg)}
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: 2,
                        boxShadow: popular ? 4 : 0,
                      }}
                    >
                      {popular ? "Đăng Ký Ngay" : "Mua Gói"}
                      {popular ? "Đăng Ký Ngay" : "Mua Gói"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* FAQ/Support section */}
      <Box
        sx={{
          textAlign: "center",
          mt: 12,
          p: 5,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Cần giúp đỡ để chọn gói phù hợp?
          Cần giúp đỡ để chọn gói phù hợp?
        </Typography>
        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}
        >
          Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn gói dịch vụ
          phù hợp nhất. Liên hệ với chúng tôi để được tư vấn cá nhân.
          Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn gói dịch vụ
          phù hợp nhất. Liên hệ với chúng tôi để được tư vấn cá nhân.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          color="primary"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Liên Hệ Hỗ Trợ
          Liên Hệ Hỗ Trợ
        </Button>
      </Box>
    </Container>
  );
};

export default PricingView;
