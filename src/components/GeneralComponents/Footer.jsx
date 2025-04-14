import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Divider,
  Link,
  Stack,
  Tooltip,
  List,
  ListItem,
  InputAdornment,
} from "@mui/material";

// Icons
import { Iconify } from "@/components/iconify";

// Images
import logoImg from "@/assets/logo.png";

// Footer social media links
const socialMedia = [
  { name: "Facebook", icon: "eva:facebook-fill", url: "#" },
  { name: "Twitter", icon: "eva:twitter-fill", url: "#" },
  { name: "Instagram", icon: "eva:instagram-fill", url: "#" },
  { name: "LinkedIn", icon: "eva:linkedin-fill", url: "#" },
];

// Footer quick links
const footerLinks = {
  company: [
    { name: "Về chúng tôi", url: "/about" },
    { name: "Các đối tác", url: "/partners" },
    { name: "Tuyển dụng", url: "/careers" },
    { name: "Blog", url: "/blog" },
  ],
  services: [
    { name: "Tìm kiếm sân", url: "/sports-centers" },
    { name: "Gói dịch vụ", url: "/packages" },
    { name: "Đặt lịch huấn luyện", url: "/coaches" },
    { name: "Tổ chức giải đấu", url: "/tournaments" },
  ],
  support: [
    { name: "Trung tâm hỗ trợ", url: "/help-center" },
    { name: "Điều khoản dịch vụ", url: "/terms" },
    { name: "Chính sách bảo mật", url: "/privacy" },
    { name: "Liên hệ", url: "/contact" },
  ],
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0f172a",
        color: "white",
        py: 8,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(37, 99, 235, 0.05)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Company Info */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <img
                  src={logoImg}
                  alt="Courtify"
                  height="40"
                  style={{ marginBottom: "8px" }}
                />
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight={700}
                  color="white"
                >
                  Courtify
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
              >
                Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam, kết nối
                người chơi với các sân chơi chất lượng và huấn luyện viên chuyên
                nghiệp.
              </Typography>

              <Stack direction="column" spacing={2}>
                <Box display="flex" alignItems="center">
                  <Iconify
                    icon="solar:map-point-bold-duotone"
                    width={20}
                    sx={{ mr: 1.5, color: "primary.main" }}
                  />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Iconify
                    icon="solar:phone-bold-duotone"
                    width={20}
                    sx={{ mr: 1.5, color: "primary.main" }}
                  />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    +84 123 456 789
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Iconify
                    icon="solar:letter-bold-duotone"
                    width={20}
                    sx={{ mr: 1.5, color: "primary.main" }}
                  />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    contact@courtsite.com
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} mt={3}>
                {socialMedia.map((item) => (
                  <Tooltip key={item.name} title={item.name} placement="top">
                    <IconButton
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.main",
                          transform: "translateY(-5px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Iconify icon={item.icon} width={20} height={20} />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="white"
                  gutterBottom
                >
                  Công ty
                </Typography>
                <List disablePadding>
                  {footerLinks.company.map((link) => (
                    <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "white",
                            paddingLeft: "4px",
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="white"
                  gutterBottom
                >
                  Dịch vụ
                </Typography>
                <List disablePadding>
                  {footerLinks.services.map((link) => (
                    <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "white",
                            paddingLeft: "4px",
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="white"
                  gutterBottom
                >
                  Hỗ trợ
                </Typography>
                <List disablePadding>
                  {footerLinks.support.map((link) => (
                    <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "white",
                            paddingLeft: "4px",
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Grid>

          {/* Newsletter */}
          <Grid
            size={{
              xs: 12,
              md: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="white"
              gutterBottom
            >
              Đăng ký thông tin
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "rgba(255, 255, 255, 0.7)" }}
            >
              Nhận thông tin mới nhất về các khuyến mãi và sự kiện
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ mb: 2 }}
            >
              <TextField
                fullWidth
                placeholder="Nhập email của bạn"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: 2,
                  ".MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                  input: { color: "white" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        sx={{
                          color: "white",
                          bgcolor: "primary.main",
                          "&:hover": { bgcolor: "#1d4ed8" },
                        }}
                      >
                        <Iconify icon="mdi:send" width={18} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Divider and Copyright */}
        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
            © {new Date().getFullYear()} CourtSite. Tất cả quyền được bảo lưu.
          </Typography>
          <Box>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              underline="hover"
              sx={{ color: "rgba(255, 255, 255, 0.6)", mr: 2 }}
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="inherit"
              underline="hover"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              Chính sách bảo mật
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
