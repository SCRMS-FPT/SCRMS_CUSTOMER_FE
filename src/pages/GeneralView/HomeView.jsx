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
  Button,
  Paper,
  ListItemIcon,
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

const infoCardsData = [
  {
    title: "Pickleball: Tất cả những gì bạn cần biết!",
    cards: [
      "Luật chơi & Cơ bản",
      "Mẹo & Thủ thuật",
      "Pickleball vs. Cầu lông",
      "Sân phổ biến",
    ],
  },
  {
    title: "Năng động, An toàn",
    cards: [
      "Cộng đồng thể thao",
      "Tạo môi trường tích cực",
      "Đường dây nóng khẩn cấp",
      "Khởi động trước khi chơi",
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
    <Box className="flex flex-col">
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
                    md: 6,
                  }}
                >
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
                startIcon={<Iconify icon="solar:document-text-bold-duotone" />}
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
                md: 7,
              }}
            >
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
                hàng ngàn người chơi thể thao tiềm năng. Nền tảng của chúng tôi
                giúp bạn quản lý đặt sân trực tuyến và tối ưu hóa doanh thu.
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
                md: 5,
              }}
            >
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
  );
};

export default HomeView;
