import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Client } from "@/API/CourtApi";

// Material UI
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";

// Iconify
import { Iconify } from "@/components/iconify";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.5,
    },
  },
};

const SportsCarousel = () => {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const courtClient = new Client();
        const response = await courtClient.getSports();
        setSports(response.sports || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching sports:", err);
        setError("Failed to load sports data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  const handleSportClick = (sport) => {
    navigate(`/courts/sport/${encodeURIComponent(sport.name)}`);
  };

  // Fallback sports for skeleton loading
  const loadingItems = [1, 2, 3, 4, 5, 6];

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Iconify icon="solar:refresh-bold-duotone" width={24} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Please refresh the page to try again
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        py: 10,
        px: 2,
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0) 70%)",
          top: "-100px",
          left: "-100px",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0) 70%)",
          bottom: "-50px",
          right: "10%",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            label="Explore Sports"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontWeight: "medium", px: 1.5 }}
          />
          <Typography
            component="h2"
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              background:
                "linear-gradient(90deg,rgb(2, 35, 80) 10%,rgb(1, 17, 58) 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Popular Sports
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover and book courts for your favorite sports in just a few
            clicks
          </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={3} justifyContent="center">
            {loadingItems.map((item) => (
              <Grid
                key={item}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <Card
                  elevation={0}
                  sx={{
                    height: 250,
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height="70%"
                    animation="wave"
                  />
                  <CardContent>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={30}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      animation="wave"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Grid container spacing={3} justifyContent="center">
              {sports.map((sport) => (
                <Grid
                  key={sport.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                  }}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 4,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(0,0,0,0.06)",
                        "&:hover": {
                          boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
                          transform: "translateY(-10px)",
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleSportClick(sport)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                        }}
                      >
                        <Box
                          sx={{
                            height: 200,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            backgroundColor: "rgba(37, 99, 235, 0.04)",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: `radial-gradient(circle at center, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.02) 70%)`,
                              zIndex: 1,
                            },
                          }}
                        >
                          <Typography
                            variant="h1"
                            component="span"
                            className="transition-all duration-300 group-hover:scale-125"
                            sx={{
                              fontSize: "6rem",
                              zIndex: 2,
                            }}
                          >
                            {sport.icon || "🏆"}
                          </Typography>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            fontWeight={700}
                          >
                            {sport.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              height: "40px",
                            }}
                          >
                            {sport.description}
                          </Typography>
                          <Box
                            className="mt-3 inline-flex items-center font-medium text-blue-600"
                            sx={{
                              alignItems: "center",
                              display: "inline-flex",
                              gap: 0.5,
                              color: "primary.main",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              mt: 2,
                            }}
                          >
                            <span>Explore Courts</span>
                            <Iconify
                              icon="solar:arrow-right-bold-duotone"
                              width={16}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {!isLoading && sports.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Iconify
              icon="solar:emoji-sad-linear"
              width={60}
              sx={{ color: "text.secondary", opacity: 0.6, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No sports available at the moment
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SportsCarousel;
