import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Client } from "@/API/CourtApi";
import axios from "axios";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Rating,
  Pagination,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Alert,
  Skeleton,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// MUI Icons
import {
  LocationOn,
  Search,
  FilterAlt,
  Phone,
  ArrowForward,
  ArrowBack,
  StarRate,
  SportsBasketball,
} from "@mui/icons-material";

const FeaturedVenues = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage, setVenuesPerPage] = useState(6);
  const [isHovering, setIsHovering] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sportCenters, setSportCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);

  const navigate = useNavigate();
  const courtClient = new Client();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data && response.data.error === 0) {
          setCities(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const result = await courtClient.getSports();
        setSports(result.sports || []);
      } catch (err) {
        console.error("Error fetching sports:", err);
        setError("Failed to load sports. Please try again later.");
      }
    };

    fetchSports();
  }, []);

  // Fetch sport centers data
  useEffect(() => {
    const fetchSportCenters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using the proper API endpoint with pagination
        const response = await courtClient.getSportCenters(
          currentPage,
          venuesPerPage,
          selectedCity?.name || undefined,
          searchTerm || undefined
        );

        if (response.sportCenters && response.sportCenters.data) {
          setSportCenters(response.sportCenters.data);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching sport centers:", err);
        setError("Failed to load sport venues. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchSportCenters();
  }, [currentPage, venuesPerPage, searchTerm, selectedCity]);

  // Detect screen size and set venues per page accordingly
  useEffect(() => {
    const updateVenuesPerPage = () => {
      if (window.innerWidth < 640) {
        setVenuesPerPage(3);
      } else if (window.innerWidth < 1024) {
        setVenuesPerPage(4);
      } else {
        setVenuesPerPage(6);
      }
    };

    updateVenuesPerPage();
    window.addEventListener("resize", updateVenuesPerPage);
    return () => window.removeEventListener("resize", updateVenuesPerPage);
  }, []);

  // Filter sport centers based on selected sport
  const filteredVenues =
    selectedSport === "All"
      ? sportCenters
      : sportCenters.filter(
        (center) =>
          center.sportNames && center.sportNames.includes(selectedSport)
      );

  // Calculate total pages
  const totalItems = filteredVenues.length;
  const totalPages = Math.ceil(totalItems / venuesPerPage) || 1;

  // Get venues for the current page
  const currentVenues = filteredVenues.slice(0, venuesPerPage);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle venue selection
  const handleViewVenue = (sportCenterId) => {
    navigate(`/sports-center/${sportCenterId}`);
  };

  const handleBookNow = (sportCenterId) => {
    navigate(`/book-court/${sportCenterId}`);
  };

  // Format address from components
  const formatAddress = (center) => {
    const parts = [];
    if (center.addressLine) parts.push(center.addressLine);
    if (center.commune) parts.push(center.commune);
    if (center.district) parts.push(center.district);
    if (center.city) parts.push(center.city);

    return parts.join(", ");
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Section header with description */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1e293b",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Tìm kiếm trung tâm thể thao phù hợp với bạn
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontWeight: 400,
              mb: 4,
            }}
          >
            Khám phá các cơ sở thể thao được đánh giá cao trong khu vực của bạn. Lọc theo loại hình
            thể thao và đặt sân chơi tiếp theo của bạn một cách dễ dàng.
          </Typography>
        </Box>

        {/* Search and filter section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Tìm kiếm trung tâm thể thao"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={(option) => option.name}
              value={selectedCity}
              onChange={(event, newValue) => {
                setSelectedCity(newValue);
              }}
              loading={loadingCities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Lựa chọn thành phố"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LocationOn color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: "#2563eb",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
              startIcon={<FilterAlt />}
            >
              Tìm
            </Button>
          </Box>
        </Paper>

        {/* Sports Filter Tabs */}
        <Box sx={{ mb: 4 }}>
          <div className="flex align-center justify-between">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#334155",
              }}
            >
              Tìm theo môn thể thao
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate("/courts/sport")}
              sx={{
                textTransform: "none",
                color: "#2563eb",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Xem thêm <ArrowForward sx={{ fontSize: "small", ml: 0.5 }} />
            </Button>
          </div>


          <Paper
            sx={{
              overflowX: "auto",
              borderRadius: 3,
              boxShadow: "none",
              bgcolor: "transparent",
            }}
          >
            <Tabs
              value={
                sports.findIndex((sport) => sport.name === selectedSport) + 1 ||
                0
              }
              onChange={(e, newValue) => {
                setSelectedSport(
                  newValue === 0 ? "All" : sports[newValue - 1].name
                );
                setCurrentPage(1);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: "48px",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTab-root": {
                  minWidth: "auto",
                  minHeight: "48px",
                  borderRadius: 2,
                  mx: 0.5,
                  color: "#64748b",
                  fontWeight: 500,
                  "&.Mui-selected": {
                    bgcolor: "#2563eb",
                    color: "white",
                  },
                },
              }}
            >
              <Tab
                label="Tất cả các trung tâm"
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  bgcolor: selectedSport === "All" ? "#2563eb" : "white",
                  color: selectedSport === "All" ? "white" : "text.primary",
                  "&:hover": {
                    bgcolor: selectedSport === "All" ? "#1d4ed8" : "#f8fafc",
                  },
                }}
              />
              {sports.map((sport) => (
                <Tab
                  key={sport.id}
                  label={sport.name}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    bgcolor: selectedSport === sport.name ? "#2563eb" : "white",
                    color:
                      selectedSport === sport.name ? "white" : "text.primary",
                    "&:hover": {
                      bgcolor:
                        selectedSport === sport.name ? "#1d4ed8" : "#f8fafc",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Paper>
        </Box>

        {/* Results count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Đang hiện{" "}
            <Typography component="span" fontWeight="600" color="text.primary">
              {filteredVenues.length}
            </Typography>{" "}
            trung tâm
            {selectedSport !== "All" && (
              <>
                {" "}
                for{" "}
                <Typography
                  component="span"
                  fontWeight="600"
                  color="text.primary"
                >
                  {selectedSport}
                </Typography>
              </>
            )}
            {searchTerm && (
              <>
                {" "}
                matching "
                <Typography
                  component="span"
                  fontWeight="600"
                  color="text.primary"
                >
                  {searchTerm}
                </Typography>
                "
              </>
            )}
            {selectedCity && (
              <>
                {" "}
                in{" "}
                <Typography
                  component="span"
                  fontWeight="600"
                  color="text.primary"
                >
                  {selectedCity.name}
                </Typography>
              </>
            )}
          </Typography>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Venues Grid */}
        {!isLoading && !error && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {currentVenues.map((center, index) => (
              <Grid
                key={center.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onMouseEnter={() => setIsHovering(center.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{ height: "100%" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        image={
                          center.avatar ||
                          "https://placehold.co/600x400?text=Sport+Center"
                        }
                        alt={center.name}
                        sx={{
                          height: 220,
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease-in-out",
                          transform: isHovering === center.id ? "scale(1.05)" : "scale(1)",
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 100%)",
                        }}
                      />

                      {/* Sport tags */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {center.sportNames &&
                          center.sportNames.slice(0, 3).map((sport, idx) => (
                            <Chip
                              key={idx}
                              label={sport}
                              size="small"
                              sx={{
                                bgcolor: "#2563eb",
                                color: "white",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                              }}
                            />
                          ))}
                        {center.sportNames && center.sportNames.length > 3 && (
                          <Chip
                            label={`+${center.sportNames.length - 3}`}
                            size="small"
                            sx={{
                              bgcolor: "rgba(0,0,0,0.7)",
                              color: "white",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                        )}
                      </Box>

                      {/* Rating */}
                      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                        <Chip
                          icon={<StarRate sx={{ color: "#facc15" }} />}
                          label={center.fixedRating || (center.fixedRating = (Math.random() * 2 + 3).toFixed(1))}
                          size="small"
                          sx={{
                            bgcolor: "white",
                            fontWeight: 600,
                            "& .MuiChip-icon": {
                              ml: 0.5,
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {center.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1,
                          gap: 1,
                        }}
                      >
                        <LocationOn
                          color="action"
                          fontSize="small"
                          sx={{ mt: 0.3 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatAddress(center)}
                        </Typography>
                      </Box>

                      {center.phoneNumber && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 2,
                            gap: 1,
                          }}
                        >
                          <Phone
                            color="action"
                            fontSize="small"
                            sx={{ mt: 0.3 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {center.phoneNumber}
                          </Typography>
                        </Box>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flexGrow: 1,
                        }}
                      >
                        {center.description ||
                          `Experience premium sports facilities at ${center.name}. Book now for an outstanding sports experience.`}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewVenue(center.id)}
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            borderColor: "#e2e8f0",
                            color: "#475569",
                            fontWeight: 600,
                            py: 1,
                            "&:hover": {
                              borderColor: "#cbd5e1",
                              bgcolor: "#f8fafc",
                            },
                          }}
                        >
                          Chi tiết
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleBookNow(center.id)}
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            bgcolor: "#2563eb",
                            fontWeight: 600,
                            py: 1,
                            "&:hover": {
                              bgcolor: "#1d4ed8",
                            },
                          }}
                        >
                          Đặt sân
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* No results state */}
        {!isLoading && !error && filteredVenues.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              mb: 4,
            }}
          >
            <SportsBasketball
              sx={{
                fontSize: 64,
                color: "#e2e8f0",
                mb: 2,
              }}
            />
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Không tìm thấy trung tâm thể thao nào phù hợp
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {selectedSport !== "All" ? (
                <>Chúng tôi không tìm thấy trung tâm nào cho môn {selectedSport}.</>
              ) : searchTerm || selectedCity ? (
                <>Không có trung tâm nào khớp với tiêu chí tìm kiếm của bạn.</>
              ) : (
                <>Hiện tại không có trung tâm nào khả dụng.</>
              )}
              <br />
              Hãy thử điều chỉnh bộ lọc của bạn hoặc quay lại sau.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedSport("All");
                setSearchTerm("");
                setSelectedCity(null);
                setCurrentPage(1);
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Paper>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              shape="rounded"
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 1.5,
                },
              }}
            />
          </Box>
        )}

        {/* View More Button */}
        {!isLoading && !error && filteredVenues.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/sports-centers")}
              sx={{
                borderRadius: 2,
                bgcolor: "#2563eb",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 5,
                py: 1.5,
                boxShadow:
                  "0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)",
                "&:hover": {
                  bgcolor: "#1d4ed8",
                  boxShadow:
                    "0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(37, 99, 235, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Xem tất cả trung tâm thể thao
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedVenues;
