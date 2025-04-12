import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Material UI components
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Link,
  Stack,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
} from "@mui/material";

// Components
import HeroSection from "@/components/HomeView/HeroSection";
import SportsCarousel from "@/components/HomeView/SportCarousel";
import FeaturedVenues from "@/components/HomeView/FeaturedVenues";
import InfoCardSection from "@/components/HomeView/InfoCardSection";

// Icons
import { Iconify } from "@/components/iconify";

// Images
import basketballCourtBg from "@/assets/basketball_court_01.jpg";
import logoImg from "@/assets/logo.jpg"; // Assuming you have a logo, if not use an appropriate URL

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

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

const infoCardsData = [
  {
    title: "Pickleball Wave: All You Need To Know!",
    cards: [
      "Rules & Basics",
      "Tips & Tricks",
      "Pickleball vs. Badminton",
      "Popular Courts",
    ],
  },
  {
    title: "Stay Active, Stay Safe",
    cards: [
      "Courtside Community",
      "Create Positive Environment",
      "Emergency Hotlines",
      "Warm-up Before Game",
    ],
  },
];

const HomeView = () => {
  const navigate = useNavigate();
  // Add intersection observer for scroll animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box className="bg-white flex flex-col min-h-screen">
      {/* Main Content */}
      <Box component="main" className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Sports Carousel */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <SportsCarousel />
        </motion.div>

        {/* Featured Venues */}
        <FeaturedVenues />

        {/* Info Section with Background */}
        <Box ref={ref} className="relative py-16">
          <Box
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            sx={{
              backgroundImage: `url(${basketballCourtBg})`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 1,
              },
            }}
          />

          <Container maxWidth="lg" className="relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <motion.div variants={fadeIn}>
                <Typography
                  variant="h2"
                  component="h2"
                  align="center"
                  className="mb-12 font-bold text-white drop-shadow-lg"
                >
                  Khám phá thêm về thể thao
                </Typography>
              </motion.div>

              <Grid container spacing={4} className="mb-10">
                {infoCardsData.map((section, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <motion.div variants={fadeIn} className="h-full">
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: "100%",
                          borderRadius: 4,
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255, 255, 255, 0.85)",
                          transition:
                            "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 22px 40px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h3"
                          className="mb-4 font-bold text-gray-800"
                        >
                          {section.title}
                        </Typography>

                        <Grid container spacing={2}>
                          {section.cards.map((card, cardIndex) => (
                            <Grid key={cardIndex} size={6}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  borderRadius: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  border: "1px solid rgba(0, 0, 0, 0.05)",
                                  transition: "all 0.2s ease-in-out",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(37, 99, 235, 0.05)",
                                    borderColor: "rgba(37, 99, 235, 0.2)",
                                    transform: "translateY(-4px)",
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <Iconify
                                    icon="solar:document-bold-duotone"
                                    width={24}
                                    sx={{ color: "#2563eb" }}
                                  />
                                </ListItemIcon>
                                <Typography variant="body2" fontWeight={500}>
                                  {card}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <motion.div variants={fadeIn} className="text-center">
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={
                    <Iconify icon="solar:document-text-bold-duotone" />
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                    backgroundImage:
                      "linear-gradient(to right, #2563eb, #3b82f6)",
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundImage:
                        "linear-gradient(to right, #1d4ed8, #2563eb)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)",
                    },
                  }}
                >
                  Xem tất cả bài viết
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 10,
            backgroundColor: "#f8fafc",
          }}
        >
          <Container maxWidth="md">
            <Grid container spacing={3} alignItems="center">
              <Grid
                size={{
                  xs: 12,
                  md: 7
                }}>
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight={700}
                  gutterBottom
                >
                  Bạn sở hữu một trung tâm thể thao?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 3 }}
                >
                  Hãy đăng ký để trở thành đối tác với chúng tôi và tiếp cận với
                  hàng ngàn người chơi thể thao tiềm năng. Nền tảng của chúng
                  tôi giúp bạn quản lý đặt sân trực tuyến và tối ưu hóa doanh
                  thu.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/pricing")}
                  endIcon={<Iconify icon="solar:arrow-right-bold-duotone" />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundImage:
                      "linear-gradient(to right, #2563eb, #3b82f6)",
                    "&:hover": {
                      backgroundImage:
                        "linear-gradient(to right, #1d4ed8, #2563eb)",
                    },
                  }}
                >
                  Đăng ký làm đối tác
                </Button>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 5
                }}>
                <img
                  src="https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sport center partners"
                  className="w-full rounded-xl shadow-lg transform -rotate-2"
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      {/* Footer */}
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
                md: 4
              }}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <img
                    src={logoImg}
                    alt="CourtSite"
                    height="40"
                    style={{ marginRight: "12px" }}
                  />
                  <Typography
                    variant="h5"
                    component="div"
                    fontWeight={700}
                    color="white"
                  >
                    CourtSite
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam, kết
                  nối người chơi với các sân chơi chất lượng và huấn luyện viên
                  chuyên nghiệp.
                </Typography>

                <Stack direction="column" spacing={2}>
                  <Box display="flex" alignItems="center">
                    <Iconify
                      icon="solar:map-point-bold-duotone"
                      width={20}
                      sx={{ mr: 1.5, color: "primary.main" }}
                    />
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Iconify
                      icon="solar:phone-bold-duotone"
                      width={20}
                      sx={{ mr: 1.5, color: "primary.main" }}
                    />
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      +84 123 456 789
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Iconify
                      icon="solar:letter-bold-duotone"
                      width={20}
                      sx={{ mr: 1.5, color: "primary.main" }}
                    />
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.7)"
                    >
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
                md: 6
              }}>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 4
                  }}>
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
                    sm: 4
                  }}>
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
                    sm: 4
                  }}>
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
                md: 2
              }}>
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
    </Box>
  );
};

export default HomeView;
