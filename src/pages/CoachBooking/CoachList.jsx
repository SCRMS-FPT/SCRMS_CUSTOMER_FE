import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Fade,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Avatar,
  useTheme,
  alpha,
  Skeleton,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import {
  SportsSoccerOutlined,
  LocationOnOutlined,
  SearchOutlined,
  FilterListOutlined,
  ArrowForwardOutlined,
  FavoriteBorderOutlined,
  SportsBasketballOutlined,
  SportsTennisOutlined,
  FitnessCenterOutlined,
  PoolOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Client } from "@/API/CoachApi";
import { Client as CourtClient } from "@/API/CourtApi";
import {
  Empty,
  Spin,
  Select,
  Input,
  Space,
  Tooltip,
  Badge,
  message,
  Tag,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import bannerImg from "@/assets/HLV/banner-1.jpg";

const { Option } = Select;
const { Search } = Input;

// Sport icon mapping
const getSportIcon = (sportName) => {
  const sportNameLower = sportName ? sportName.toLowerCase() : "";
  if (
    sportNameLower.includes("soccer") ||
    sportNameLower.includes("football")
  ) {
    return <SportsSoccerOutlined />;
  } else if (sportNameLower.includes("basketball")) {
    return <SportsBasketballOutlined />;
  } else if (sportNameLower.includes("tennis")) {
    return <SportsTennisOutlined />;
  } else if (sportNameLower.includes("swimming")) {
    return <PoolOutlined />;
  } else {
    return <FitnessCenterOutlined />;
  }
};

// Enhanced Coach Card Component
const EnhancedCoachCard = ({ coach, allSports }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Map sport IDs to sport names
  const sportNames =
    coach.sportIds?.map((sportId) => {
      const sport = allSports.find((s) => s.id === sportId);
      return sport?.name || "Unknown Sport";
    }) || [];

  const viewProfile = () => {
    navigate(`/coach-profile/${coach.id}`);
  };

  const bookNow = () => {
    navigate(`/coach-booking/${coach.id}`);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        borderRadius: 2,
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
        },
      }}
      component={motion.div}
      whileHover={{ y: -8 }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={
            coach.avatar || "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={coach.fullName}
          sx={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "10px",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            {coach.fullName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Rating value={4.5} precision={0.5} size="small" readOnly />
            <span>(12 reviews)</span>
          </Typography>
        </Box>
        <Tooltip title="Add to favorites">
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <FavoriteBorderOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
          {sportNames.map((sport, index) => (
            <Chip
              key={index}
              icon={getSportIcon(sport)}
              label={sport}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.dark,
                fontWeight: 500,
              }}
            />
          ))}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {coach.bio || "No coach description available."}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LocationOnOutlined fontSize="small" />
            Hanoi, Vietnam
          </Typography>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {coach.ratePerHour?.toLocaleString()} VND
            <Typography
              variant="caption"
              color="text.secondary"
              component="span"
            >
              {" "}
              /hr
            </Typography>
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button size="small" variant="outlined" onClick={viewProfile}>
          View Profile
        </Button>
        <Button
          size="small"
          variant="contained"
          endIcon={<ArrowForwardOutlined />}
          onClick={bookNow}
          sx={{
            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

// Enhanced filter component
const EnhancedCoachFilter = ({
  searchTerm,
  setSearchTerm,
  selectedSports,
  setSelectedSports,
  handleClearFilters,
  sportsList,
  loading,
}) => {
  const theme = useTheme();

  const handleSportChange = (value) => {
    setSelectedSports(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        <FilterListOutlined sx={{ verticalAlign: "middle", mr: 1 }} />
        Filter Coaches
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Search by name
          </Typography>
          <Search
            placeholder="Search coach name..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Filter by sport
          </Typography>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select sports"
            value={selectedSports}
            onChange={handleSportChange}
            loading={loading}
            size="large"
            maxTagCount={3}
          >
            <Option value="all">All Sports</Option>
            {sportsList.map((sport) => (
              <Option key={sport.id} value={sport.id}>
                {sport.name}
              </Option>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={handleClearFilters}
          startIcon={<RefreshOutlined />}
          sx={{ color: theme.palette.text.secondary }}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};

const CoachList = () => {
  const theme = useTheme();
  // State for coaches and loading
  const [coaches, setCoaches] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch coaches and sports data
  useEffect(() => {
    const fetchCoachesAndSports = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all coaches
        const coachClient = new Client();
        const coachesData = await coachClient.getCoaches();
        setCoaches(coachesData);

        // Fetch sports for filtering
        const courtClient = new CourtClient();
        const sportsResponse = await courtClient.getSports();

        if (sportsResponse && sportsResponse.sports) {
          setSports(sportsResponse.sports);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load coaches. Please try again later.");
        message.error("Failed to load coaches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachesAndSports();
  }, []);

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...coaches];

      // Apply name search filter
      if (searchTerm) {
        filtered = filtered.filter((coach) =>
          coach.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sport filter
      if (
        selectedSports &&
        selectedSports.length > 0 &&
        !selectedSports.includes("all")
      ) {
        filtered = filtered.filter((coach) =>
          coach.sportIds?.some((sportId) => selectedSports.includes(sportId))
        );
      }

      setFilteredCoaches(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [coaches, searchTerm, selectedSports]);

  // Clear filters helper
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSports([]);
  };

  // Get current page of coaches
  const getCurrentCoaches = () => {
    const indexOfLastCoach = currentPage * itemsPerPage;
    const indexOfFirstCoach = indexOfLastCoach - itemsPerPage;
    return filteredCoaches.slice(indexOfFirstCoach, indexOfLastCoach);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.background.default,
          0.8
        )}, ${theme.palette.background.paper})`,
        minHeight: "100vh",
        pb: 6,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 220, md: 300 },
          overflow: "hidden",
          mb: 6,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "white",
          p: 3,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            mb: 1,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Find Your Perfect Coach
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: 600,
            mx: "auto",
            opacity: 0.9,
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          Elevate your game with personalized training from top sports coaches
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.5)}`,
              "&:hover": {
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.7
                )}`,
              },
            }}
          >
            Explore Coaches
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "white",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Filter Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 4,
            background: theme.palette.background.paper,
          }}
        >
          <EnhancedCoachFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSports={selectedSports}
            setSelectedSports={setSelectedSports}
            handleClearFilters={handleClearFilters}
            sportsList={sports}
            loading={loading}
          />
        </Paper>

        {/* Results Stats */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {loading ? (
              <Skeleton width={150} />
            ) : (
              <>Showing {filteredCoaches.length} coaches</>
            )}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {selectedSports.length > 0 && selectedSports[0] !== "all" && (
              <Typography variant="body2" color="text.secondary">
                Filtered by:
                {selectedSports
                  .map((sportId) => {
                    const sport = sports.find((s) => s.id === sportId);
                    return sport ? ` ${sport.name}` : "";
                  })
                  .join(", ")}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Coach Cards List */}
        {loading ? (
          // Loading Skeleton
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 2, height: "100%", borderRadius: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                  <Skeleton width="70%" height={30} sx={{ mb: 1 }} />
                  <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton height={20} sx={{ mb: 1 }} />
                  <Skeleton height={20} sx={{ mb: 1 }} />
                  <Skeleton width="80%" height={20} sx={{ mb: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Skeleton width={80} height={40} />
                    <Skeleton width={80} height={40} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : filteredCoaches.length === 0 ? (
          // Empty State
          <Paper
            sx={{
              p: 6,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  No coaches found matching your criteria
                </Typography>
              }
            >
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                startIcon={<RefreshOutlined />}
              >
                Clear Filters
              </Button>
            </Empty>
          </Paper>
        ) : (
          // Coach Cards
          <Grid container spacing={3}>
            {getCurrentCoaches().map((coach) => (
              <Grid item xs={12} sm={6} md={4} key={coach.id}>
                <EnhancedCoachCard coach={coach} allSports={sports} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {filteredCoaches.length > itemsPerPage && (
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredCoaches.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "1rem",
                },
                "& .Mui-selected": {
                  fontWeight: "bold",
                  background: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CoachList;
