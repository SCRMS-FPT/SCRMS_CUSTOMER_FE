import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Added axios import
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  Pagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  LocationOn,
  Phone,
  SportsHandball,
  Clear,
  ArrowForward,
} from "@mui/icons-material";
import { Client } from "../../API/CourtApi";

const SportsCenter = () => {
  // State management
  const [sportCenters, setSportCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Cities state (now fetched from API)
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // API client
  const courtClient = new Client();

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
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

  // Fetch data from API
  const fetchSportCenters = async () => {
    setLoading(true);
    try {
      const response = await courtClient.getSportCenters(
        page, // API uses 0-based indexing
        pageSize,
        cityFilter || undefined,
        searchQuery || undefined
      );

      setSportCenters(response.sportCenters.data || []);
      setTotalCount(response.sportCenters.count || 0);
    } catch (err) {
      console.error("Failed to fetch sport centers:", err);
      setError("Failed to load sport centers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when search/filter/pagination changes
  useEffect(() => {
    fetchSportCenters();
  }, [page, pageSize, cityFilter, searchQuery]);

  // Handle search input change with debounce
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1); // Reset to first page when search changes
  };

  // Handle city filter change
  const handleCityChange = (event) => {
    setCityFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setCityFilter("");
    setPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Sports Centers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Find the perfect sports center for your activities
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #f8f9fa)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      aria-label="clear search"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="city-filter-label">Filter by City</InputLabel>
              <Select
                labelId="city-filter-label"
                value={cityFilter}
                onChange={handleCityChange}
                label="Filter by City"
                disabled={loadingCities}
                startAdornment={
                  loadingCities ? (
                    <InputAdornment position="start">
                      <CircularProgress size={20} color="inherit" />
                    </InputAdornment>
                  ) : null
                }
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={!searchQuery && !cityFilter}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Results summary */}
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            {loading ? (
              <Skeleton width={100} />
            ) : (
              `Showing ${sportCenters.length} of ${totalCount} results`
            )}
          </Typography>

          {(searchQuery || cityFilter) && (
            <Box>
              {searchQuery && (
                <Chip
                  label={`Name: ${searchQuery}`}
                  size="small"
                  onDelete={() => setSearchQuery("")}
                  sx={{ mr: 1 }}
                />
              )}
              {cityFilter && (
                <Chip
                  label={`City: ${cityFilter}`}
                  size="small"
                  onDelete={() => setCityFilter("")}
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Box textAlign="center" py={4}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={fetchSportCenters}
          >
            Try Again
          </Button>
        </Box>
      )}

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
                elevation={3}
              >
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" height={32} width="80%" />
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={20} width="90%" />
                  <Skeleton variant="text" height={20} width="40%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" height={36} width="100%" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Sport Centers Grid */}
      {!loading && !error && (
        <>
          {sportCenters.length === 0 ? (
            <Box
              textAlign="center"
              py={8}
              px={4}
              bgcolor="background.paper"
              borderRadius={2}
              boxShadow={3}
            >
              <SportsHandball
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                No sports centers found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Try adjusting your search or filters to find what you're looking
                for.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {sportCenters.map((center) => (
                <Grid item xs={12} sm={6} md={4} key={center.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                    }}
                    elevation={3}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      image={
                        center.avatar ||
                        "https://via.placeholder.com/300x200?text=Sports+Center"
                      }
                      alt={center.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {center.name}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn
                          fontSize="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {center.address}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={2}>
                        <Phone
                          fontSize="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">
                          {center.phoneNumber}
                        </Typography>
                      </Box>

                      {center.sportNames?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Available Sports:
                          </Typography>
                          <Box>
                            {center.sportNames.map((sport, index) => (
                              <Chip
                                key={index}
                                label={sport}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {center.description || "No description available."}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        component={Link}
                        to={`/sports-center/${center.id}`}
                        color="primary"
                        endIcon={<ArrowForward />}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SportsCenter;
