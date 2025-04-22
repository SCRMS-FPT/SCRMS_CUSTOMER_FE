import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
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
  Rating,
  Slider,
  Divider,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Badge,
  Alert,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Backdrop,
  Fade,
  Zoom,
  Avatar,
} from "@mui/material";
import {
  Search,
  LocationOn,
  Phone,
  SportsHandball,
  Clear,
  ArrowForward,
  FilterList,
  CalendarMonth,
  AccessTime,
  AttachMoney,
  ArrowDropDown,
  SportsTennis,
  Check,
  ViewList,
  ViewModule,
  Star,
  Whatshot,
  AccessTimeFilled,
  LocalOffer,
  Discount,
  Info,
  FitnessCenter,
  EventAvailable,
} from "@mui/icons-material";
import { Client } from "../../API/CourtApi";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import soccerBg from "@/assets/soccer_04.jpg";

// Time slot presets for quick selection
const TIME_PRESETS = [
  {
    label: "Morning",
    startTime: "06:00",
    endTime: "12:00",
    icon: <AccessTimeFilled />,
  },
  {
    label: "Afternoon",
    startTime: "12:00",
    endTime: "18:00",
    icon: <AccessTimeFilled />,
  },
  {
    label: "Evening",
    startTime: "18:00",
    endTime: "22:00",
    icon: <AccessTimeFilled />,
  },
  {
    label: "All Day",
    startTime: "06:00",
    endTime: "22:00",
    icon: <AccessTimeFilled />,
  },
];

// Common facilities for filtering
const FACILITIES = [
  {
    id: "locker",
    name: "Tủ đồ",
    icon: <Whatshot />,
    color: "#1976d2",
  },
  {
    id: "bathroom",
    name: "Nhà tắm",
    icon: <FitnessCenter />,
    color: "#2e7d32",
  },
  {
    id: "parking",
    name: "Bãi đậu xe",
    icon: <LocalOffer />,
    color: "#ed6c02",
  },
  {
    id: "spectator",
    name: "Ghế khán giả",
    icon: <EventAvailable />,
    color: "#9c27b0",
  },
  {
    id: "artificial_turf",
    name: "Thảm cỏ nhân tạo",
    icon: <SportsHandball />,
    color: "#00796b",
  },
  {
    id: "lighting",
    name: "Đèn chiếu sáng",
    icon: <AccessTime />,
    color: "#d32f2f",
  },
  {
    id: "cooling",
    name: "Quạt làm mát",
    icon: <Info />,
    color: "#0288d1",
  },
  {
    id: "wifi",
    name: "Wifi",
    icon: <Phone />,
    color: "#7b1fa2",
  },
  {
    id: "refreshment",
    name: "Quầy đồ uống",
    icon: <AttachMoney />,
    color: "#689f38",
  },
];

// Sport center hero banner component
const HeroBanner = () => (
  <Box
    sx={{
      position: "relative",
      height: { xs: 220, md: 280 },
      borderRadius: 2,
      overflow: "hidden",
      mb: 5,
      boxShadow: 3,
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${soccerBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
    }}
  >
    <Container>
      <Zoom in={true} timeout={1000}>
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 800,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Tìm sân đấu phù hợp với bạn
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              maxWidth: 600,
              textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Khám phá và đặt sân thể thao trên khắp Việt Nam với tình trạng sẵn
            có theo thời gian thực
          </Typography>
        </Box>
      </Zoom>
    </Container>
  </Box>
);

const BrowseCourtsView = () => {
  // Theme for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  // URL Search params
  const [searchParams] = useSearchParams();
  // State management
  const [sportCenters, setSportCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameQuery, setNameQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sportFilter, setSportFilter] = useState(undefined);
  const [priceRange, setPriceRange] = useState([0, 2000000]); // Vietnamese dong
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [timePreset, setTimePreset] = useState(null);
  const [filterTab, setFilterTab] = useState(0);

  // Time filters
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Cities state (fetched from API)
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Sports state
  const [sports, setSports] = useState(null);
  const [loadingSports, setLoadingSports] = useState(false);

  // API client
  const courtClient = new Client();
  // Parse URL parameters on component load
  useEffect(() => {
    // Get parameters from URL
    const sportParam = searchParams.get("sport");
    const cityParam = searchParams.get("city");
    const dateParam = searchParams.get("date");
    const startTimeParam = searchParams.get("startTime");
    const endTimeParam = searchParams.get("endTime");

    // Set filters based on URL parameters
    if (sportParam) setSportFilter(sportParam);
    if (cityParam) setCityFilter(cityParam);

    // Handle date parameter
    if (dateParam) {
      const parsedDate = dayjs(dateParam);
      if (parsedDate.isValid()) {
        setSelectedDate(parsedDate);
      }
    }

    // Handle time parameters
    if (startTimeParam) {
      const [hours, minutes] = startTimeParam.split(":");
      const parsedStartTime = dayjs().hour(hours).minute(minutes);
      setStartTime(parsedStartTime);
    }

    if (endTimeParam) {
      const [hours, minutes] = endTimeParam.split(":");
      const parsedEndTime = dayjs().hour(hours).minute(minutes);
      setEndTime(parsedEndTime);
    }

    // If any parameters are present, expand the filters automatically
    if (sportParam || cityParam || startTimeParam || endTimeParam) {
      setFiltersExpanded(true);
    }
  }, [searchParams]);

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

  // Fetch sports list
  useEffect(() => {
    const fetchSports = async () => {
      setLoadingSports(true);
      try {
        const response = await courtClient.getSports();
        if (response && response.sports) {
          setSports(response.sports);
        }
      } catch (err) {
        console.error("Error fetching sports:", err);
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
  }, []);

  // Format time for API
  const formatTimeForApi = (time) => {
    if (!time) return null;
    // Format as HH:MM:00 for the API
    return time.format("HH:mm:00");
  };

  // Fetch sport centers from API
  const fetchSportCenters = async () => {
    setLoading(true);
    try {
      // Format start and end time for API
      const formattedStartTime = formatTimeForApi(startTime) ?? undefined;
      const formattedEndTime = formatTimeForApi(endTime) ?? undefined;

      // Get selected date in the correct format
      const formattedDate = selectedDate ? selectedDate.toDate() : undefined;

      const response = await courtClient.getSportCenters(
        page,
        pageSize,
        cityFilter || undefined,
        nameQuery || undefined,
        sportFilter || undefined,
        formattedDate || undefined, // bookingDate
        formattedStartTime || undefined, // startTime parameter
        formattedEndTime || undefined // endTime parameter
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

  // Fetch data when search/filter/pagination changes
  useEffect(() => {
    fetchSportCenters();
  }, [page, pageSize, cityFilter, nameQuery, sportFilter, selectedDate]);

  // Only run the search when start/end time are explicitly changed
  useEffect(() => {
    if (startTime !== null || endTime !== null) {
      fetchSportCenters();
    }
  }, [startTime, endTime]);

  // Handle time preset selection
  const handleTimePresetChange = (preset) => {
    if (timePreset === preset) {
      // If clicking the same preset, clear it
      setTimePreset(null);
      setStartTime(null);
      setEndTime(null);
    } else {
      setTimePreset(preset);
      setStartTime(
        dayjs()
          .hour(parseInt(preset.startTime.split(":")[0]))
          .minute(parseInt(preset.startTime.split(":")[1]))
      );
      setEndTime(
        dayjs()
          .hour(parseInt(preset.endTime.split(":")[0]))
          .minute(parseInt(preset.endTime.split(":")[1]))
      );
    }
    setPage(1);
  };

  // Handle changes for search and filters
  const handleNameQueryChange = (event) => {
    setNameQuery(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleCityChange = (event) => {
    setCityFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSportChange = (event) => {
    setSportFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setPage(1); // Reset to first page when date changes
  };

  const handleStartTimeChange = (newTime) => {
    setStartTime(newTime);
    setTimePreset(null); // Clear any selected preset
    setPage(1); // Reset to first page when time changes
  };

  const handleEndTimeChange = (newTime) => {
    setEndTime(newTime);
    setTimePreset(null); // Clear any selected preset
    setPage(1); // Reset to first page when time changes
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const handleFacilityChange = (event) => {
    const facilityId = event.target.value;
    setSelectedFacilities((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({
      top: document.getElementById("search-results")?.offsetTop - 20 || 0,
      behavior: "smooth",
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setNameQuery("");
    setCityFilter("");
    setSportFilter("");
    setPriceRange([0, 2000000]);
    setSelectedDate(dayjs());
    setStartTime(null);
    setEndTime(null);
    setTimePreset(null);
    setSelectedFacilities([]);
    setPage(1);
  };

  // Toggle view mode
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle filter tab change
  const handleFilterTabChange = (event, newValue) => {
    setFilterTab(newValue);
  };

  // Navigate to sport center details
  const handleSportCenterClick = (centerId) => {
    window.location.href = `/sports-center/${centerId}`;
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Helper to get minimum and maximum price for a sport center
  const getPriceRange = (sportCenter) => {
    if (!sportCenter.courts || sportCenter.courts.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = sportCenter.courts
      .map((court) => court.price || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) return { min: 0, max: 0 };

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  // Get unique sports from a sport center
  const getUniqueSports = (sportCenter) => {
    if (!sportCenter.courts) return [];

    const uniqueSports = new Set(
      sportCenter.courts.map((court) => court.sportName).filter(Boolean)
    );

    return Array.from(uniqueSports);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
          minHeight: "100vh",
        }}
      >
        {/* Hero Banner */}
        <HeroBanner />

        <Container maxWidth="lg">
          {/* Main Search Bar */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 4,
              borderRadius: 2,
              background: "#fff",
              position: "relative",
              zIndex: 2,
              mt: -8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Name Search */}
              <Grid
                size={{
                  xs: 12,
                  md: 5,
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Tìm kiếm theo tên..."
                  value={nameQuery}
                  onChange={handleNameQueryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: nameQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setNameQuery("")}
                          aria-label="clear search"
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />
              </Grid>

              {/* City Filter */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="city-filter-label">Thành phố</InputLabel>
                  <Select
                    labelId="city-filter-label"
                    value={cityFilter}
                    onChange={handleCityChange}
                    label="City"
                    disabled={loadingCities}
                    sx={{ borderRadius: 2 }}
                    startAdornment={
                      loadingCities ? (
                        <InputAdornment position="start">
                          <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      )
                    }
                  >
                    <MenuItem value="">Tất cả các thành phố</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Picker */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 2,
                }}
              >
                <DatePicker
                  label="Ngày"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: { borderRadius: 2 },
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth color="primary" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </Grid>

              {/* Advanced Filter Toggle */}
              <Grid
                size={{
                  xs: 12,
                  md: 2,
                }}
              >
                <Button
                  fullWidth
                  variant={filtersExpanded ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  endIcon={filtersExpanded ? <ArrowDropDown /> : <FilterList />}
                  sx={{ borderRadius: 2, height: "56px" }}
                >
                  {filtersExpanded ? "Ẩn bộ lọc" : "Thêm bộ lọc"}
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Filters Section */}
            <Fade in={filtersExpanded}>
              <Box>
                {filtersExpanded && (
                  <Box mt={3} pt={3} borderTop={1} borderColor="divider">
                    {/* Filter Tabs */}
                    <Box
                      sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                    >
                      <Tabs
                        value={filterTab}
                        onChange={handleFilterTabChange}
                        variant={isMobile ? "scrollable" : "standard"}
                        scrollButtons={isMobile ? "auto" : undefined}
                      >
                        <Tab
                          icon={<SportsTennis fontSize="small" />}
                          iconPosition="start"
                          label="Môn thể thao & Thời gian"
                        />
                        <Tab
                          icon={<AttachMoney fontSize="small" />}
                          iconPosition="start"
                          label="Giá thành"
                        />
                        <Tab
                          icon={<Check fontSize="small" />}
                          iconPosition="start"
                          label="Cơ sở vật chất"
                        />
                      </Tabs>
                    </Box>

                    {/* Sports & Time Tab */}
                    {filterTab === 0 && (
                      <Grid container spacing={3}>
                        {/* Sport Type */}
                        <Grid
                          size={{
                            xs: 12,
                            md: 4,
                          }}
                        >
                          <FormControl fullWidth variant="outlined">
                            <InputLabel id="sport-filter-label">
                              Môn thể thao
                            </InputLabel>
                            <Select
                              labelId="sport-filter-label"
                              value={sportFilter}
                              onChange={handleSportChange}
                              label="Sport"
                              disabled={loadingSports}
                              sx={{ borderRadius: 2 }}
                              renderValue={(selected) => {
                                // Check if the selected value is an ID
                                if (selected && selected.includes("-")) {
                                  // Find the sport with this ID
                                  const sport = sports.find(
                                    (s) => s.id === selected
                                  );
                                  if (sport) {
                                    return (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                        }}
                                      >
                                        <Avatar
                                          src={sport.icon}
                                          sx={{ width: 24, height: 24 }}
                                        />
                                        <Typography variant="body1" noWrap>
                                          {sport.name}
                                        </Typography>
                                      </div>
                                    );
                                  }
                                }

                                // Default case - show the selected value
                                const sport = sports.find(
                                  (s) => s.name === selected
                                );
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <Avatar
                                      src={sport?.icon}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography variant="body1" noWrap>
                                      {selected}
                                    </Typography>
                                  </div>
                                );
                              }}
                              startAdornment={
                                loadingSports ? (
                                  <InputAdornment position="start">
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  </InputAdornment>
                                ) : (
                                  <InputAdornment position="start">
                                    <SportsTennis color="primary" />
                                  </InputAdornment>
                                )
                              }
                            >
                              <MenuItem value="">
                                Tất cả các môn thể thao
                              </MenuItem>
                              {sports.map((sport) => (
                                <MenuItem key={sport.id} value={sport.id}>
                                  <ListItemIcon>
                                    <Avatar
                                      src={sport.icon}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary={sport.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Time Presets */}
                        <Grid
                          size={{
                            xs: 12,
                            md: 8,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <EventAvailable color="primary" sx={{ mr: 0.5 }} />
                            Thời gian của ngày
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {TIME_PRESETS.map((preset) => (
                              <Chip
                                key={preset.label}
                                label={preset.label}
                                icon={preset.icon}
                                onClick={() => handleTimePresetChange(preset)}
                                color={
                                  timePreset === preset ? "primary" : "default"
                                }
                                variant={
                                  timePreset === preset ? "filled" : "outlined"
                                }
                                sx={{ borderRadius: 2 }}
                              />
                            ))}
                          </Box>

                          {/* Custom Time Range */}
                          <Stack direction="row" spacing={2} mt={2}>
                            <TimePicker
                              label="Thời gian bắt đầu"
                              value={startTime}
                              onChange={handleStartTimeChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  size: "small",
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccessTime color="primary" />
                                      </InputAdornment>
                                    ),
                                  },
                                },
                              }}
                            />
                            <TimePicker
                              label="Thời gian kết thúc"
                              value={endTime}
                              onChange={handleEndTimeChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  size: "small",
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccessTime color="primary" />
                                      </InputAdornment>
                                    ),
                                  },
                                },
                              }}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    )}

                    {/* Price Tab */}
                    {filterTab === 1 && (
                      <Grid container spacing={3}>
                        <Grid size={12}>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <AttachMoney color="primary" sx={{ mr: 0.5 }} />
                              Giá thành theo tiếng (VND)
                            </Typography>
                            <Slider
                              value={priceRange}
                              onChange={handlePriceRangeChange}
                              valueLabelDisplay="auto"
                              min={0}
                              max={2000000}
                              step={50000}
                              valueLabelFormat={(value) => formatPrice(value)}
                              sx={{ width: "95%", mx: "auto" }}
                            />
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mt={1}
                              px={1}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatPrice(priceRange[0])} VND
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatPrice(priceRange[1])} VND
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    {/* Facilities Tab */}
                    {filterTab === 2 && (
                      <Grid container spacing={2}>
                        {FACILITIES.map((facility) => (
                          <Grid
                            key={facility.id}
                            size={{
                              xs: 6,
                              sm: 4,
                              md: 3,
                            }}
                          >
                            <Paper
                              sx={{
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                border: selectedFacilities.includes(facility.id)
                                  ? `2px solid ${facility.color}`
                                  : "1px solid #e0e0e0",
                                bgcolor: selectedFacilities.includes(
                                  facility.id
                                )
                                  ? `${facility.color}10`
                                  : "transparent",
                                "&:hover": {
                                  boxShadow: 2,
                                },
                              }}
                              onClick={() =>
                                handleFacilityChange({
                                  target: { value: facility.id },
                                })
                              }
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  mr: 1.5,
                                  bgcolor: `${facility.color}20`,
                                  fontSize: "1.2rem",
                                }}
                              >
                                {facility.icon}
                              </Box>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {facility.name}
                              </Typography>
                              {selectedFacilities.includes(facility.id) && (
                                <Check
                                  fontSize="small"
                                  sx={{ color: facility.color }}
                                />
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}

                    {/* Clear Filters Button */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        onClick={handleClearFilters}
                        startIcon={<Clear />}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        Xóa tất cả cac bộ lọc
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Fade>

            {/* Active Filter Chips */}
            <Box
              mt={2}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              {nameQuery && (
                <Chip
                  label={`Name: ${nameQuery}`}
                  size="small"
                  onDelete={() => setNameQuery("")}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {cityFilter && (
                <Chip
                  label={`City: ${cityFilter}`}
                  size="small"
                  onDelete={() => setCityFilter("")}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {sportFilter && (
                <Chip
                  label={`Sport: ${
                    sportFilter.includes("-")
                      ? sports.find((s) => s.id === sportFilter)?.name ||
                        sportFilter
                      : sportFilter
                  }`}
                  size="small"
                  onDelete={() => setSportFilter("")}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {timePreset && (
                <Chip
                  label={`Time: ${timePreset.label}`}
                  size="small"
                  onDelete={() => {
                    setTimePreset(null);
                    setStartTime(null);
                    setEndTime(null);
                  }}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {startTime && !timePreset && (
                <Chip
                  label={`From: ${startTime.format("HH:mm")}`}
                  size="small"
                  onDelete={() => setStartTime(null)}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {endTime && !timePreset && (
                <Chip
                  label={`To: ${endTime.format("HH:mm")}`}
                  size="small"
                  onDelete={() => setEndTime(null)}
                  sx={{ borderRadius: 2 }}
                />
              )}
              {selectedFacilities.length > 0 && (
                <Chip
                  label={`Facilities: ${selectedFacilities.length}`}
                  size="small"
                  onDelete={() => setSelectedFacilities([])}
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
          </Paper>

          {/* Results Info */}
          <Box
            id="search-results"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            sx={{
              borderBottom: "2px solid",
              borderColor: "divider",
              pb: 1,
            }}
          >
            <Typography variant="h5" component="h2" fontWeight={600}>
              {loading ? (
                <Skeleton width={180} />
              ) : totalCount > 0 ? (
                `Tất cả các trung tâm thể thao (${totalCount})`
              ) : (
                "Kết quả tìm kiếm"
              )}
            </Typography>

            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                mr={2}
                display={{ xs: "none", sm: "block" }}
              >
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  `Page ${page} of ${totalPages || 1}`
                )}
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                aria-label="view mode"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                textAlign: "center",
                bgcolor: "#fff5f5",
                border: "1px solid #ffcdd2",
              }}
            >
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={fetchSportCenters}
              >
                Try Again
              </Button>
            </Paper>
          )}

          {/* Loading State */}
          {loading && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[...Array(6)].map((_, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: viewMode === "grid" ? 6 : 12,
                    md: viewMode === "grid" ? 4 : 12,
                  }}
                >
                  <Paper
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: viewMode === "list" ? "row" : "column",
                      p: viewMode === "list" ? 0 : 0,
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                    elevation={2}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={viewMode === "list" ? 180 : 200}
                      width={viewMode === "list" ? 300 : "100%"}
                      animation="wave"
                    />
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: viewMode === "list" ? 2 : 0,
                      }}
                    >
                      <Box
                        sx={{
                          p: viewMode === "list" ? 0 : 2,
                          pt: viewMode === "list" ? 0 : 2,
                        }}
                      >
                        <Skeleton
                          variant="text"
                          height={32}
                          width="80%"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          height={24}
                          width="60%"
                          animation="wave"
                        />
                        <Box display="flex" gap={1} mt={1} mb={1}>
                          <Skeleton
                            variant="rounded"
                            height={24}
                            width={60}
                            animation="wave"
                          />
                          <Skeleton
                            variant="rounded"
                            height={24}
                            width={60}
                            animation="wave"
                          />
                          <Skeleton
                            variant="rounded"
                            height={24}
                            width={60}
                            animation="wave"
                          />
                        </Box>
                        <Skeleton
                          variant="text"
                          height={20}
                          width="90%"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          height={20}
                          width="40%"
                          animation="wave"
                        />
                      </Box>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Skeleton
                          variant="rounded"
                          height={36}
                          width="100%"
                          animation="wave"
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Sport Centers Grid/List */}
          {!loading && !error && (
            <>
              {sportCenters.length === 0 ? (
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    bgcolor: "#fff",
                    mb: 4,
                  }}
                >
                  <SportsHandball
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom color="text.secondary">
                    Không tìm thấy trung tâm thể thao nào phù hợp
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc để tìm thấy những gì
                    bạn đang tìm kiếm.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClearFilters}
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Xóa tất cả các bộ lọc
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {sportCenters.map((center) => {
                    const priceRange = getPriceRange(center);
                    const uniqueSports = getUniqueSports(center);

                    // Card for grid view
                    if (viewMode === "grid") {
                      return (
                        <Grid
                          key={center.id}
                          size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                          }}
                        >
                          <Paper
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: 2,
                              overflow: "hidden",
                              transition: "transform 0.3s, box-shadow 0.3s",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: 4,
                              },
                              cursor: "pointer",
                            }}
                            elevation={2}
                            onClick={() => handleSportCenterClick(center.id)}
                          >
                            <Box sx={{ position: "relative" }}>
                              <CardMedia
                                component="img"
                                image={
                                  center.avatar ||
                                  "https://via.placeholder.com/300x200?text=Sports+Center"
                                }
                                alt={center.name}
                                sx={{
                                  height: 200,
                                  objectFit: "cover",
                                  width: "100%",
                                }}
                              />
                              {/* Rating Badge */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  bgcolor: "rgba(0,0,0,0.7)",
                                  color: "white",
                                  borderRadius: 2,
                                  px: 1,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Star
                                  sx={{
                                    fontSize: 16,
                                    color: "#FFD700",
                                    mr: 0.5,
                                  }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                  4.5
                                </Typography>
                              </Box>
                            </Box>

                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                                fontWeight={600}
                              >
                                {center.name}
                              </Typography>

                              <Box display="flex" alignItems="center" mb={1}>
                                <LocationOn
                                  fontSize="small"
                                  color="primary"
                                  sx={{ mr: 0.5, minWidth: 20 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {center.address}
                                </Typography>
                              </Box>

                              <Box mb={1.5}>
                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                  {(center.sportNames || uniqueSports)
                                    .slice(0, 3)
                                    .map((sport, index) => (
                                      <Chip
                                        key={index}
                                        label={sport}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ borderRadius: 2, height: 24 }}
                                      />
                                    ))}
                                  {(center.sportNames?.length ||
                                    uniqueSports.length) > 3 && (
                                    <Chip
                                      label={`+${
                                        (center.sportNames?.length ||
                                          uniqueSports.length) - 3
                                      }`}
                                      size="small"
                                      sx={{ borderRadius: 2, height: 24 }}
                                    />
                                  )}
                                </Box>
                              </Box>

                              {/* Price Range */}
                              {priceRange.max > 0 && (
                                <Box display="flex" alignItems="center">
                                  <LocalOffer
                                    fontSize="small"
                                    color="action"
                                    sx={{ mr: 0.5, minWidth: 20 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {priceRange.min === priceRange.max
                                      ? `${formatPrice(priceRange.min)} VND`
                                      : `${formatPrice(
                                          priceRange.min
                                        )} - ${formatPrice(
                                          priceRange.max
                                        )} VND`}
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowForward />}
                                sx={{ borderRadius: 2 }}
                              >
                                Xem chi tiết
                              </Button>
                            </CardActions>
                          </Paper>
                        </Grid>
                      );
                    } else {
                      // Card for list view
                      return (
                        <Grid key={center.id} size={12}>
                          <Paper
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              borderRadius: 2,
                              overflow: "hidden",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                              },
                              cursor: "pointer",
                            }}
                            elevation={2}
                            onClick={() => handleSportCenterClick(center.id)}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                width: { xs: "100%", sm: 280 },
                                height: { xs: 180, sm: "auto" },
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="100%"
                                image={
                                  center.avatar ||
                                  "https://via.placeholder.com/300x200?text=Sports+Center"
                                }
                                alt={center.name}
                                sx={{
                                  objectFit: "cover",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                              {/* Rating Badge */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  bgcolor: "rgba(0,0,0,0.7)",
                                  color: "white",
                                  borderRadius: 2,
                                  px: 1,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Star
                                  sx={{
                                    fontSize: 16,
                                    color: "#FFD700",
                                    mr: 0.5,
                                  }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                  4.5
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2,
                              }}
                            >
                              <Box mb={1}>
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  gutterBottom
                                  fontWeight={600}
                                >
                                  {center.name}
                                </Typography>

                                <Grid container spacing={2}>
                                  <Grid
                                    size={{
                                      xs: 12,
                                      md: 7,
                                    }}
                                  >
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                    >
                                      <LocationOn
                                        fontSize="small"
                                        color="primary"
                                        sx={{ mr: 0.5, minWidth: 20 }}
                                      />
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {center.address}
                                      </Typography>
                                    </Box>

                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                    >
                                      <Phone
                                        fontSize="small"
                                        color="primary"
                                        sx={{ mr: 0.5, minWidth: 20 }}
                                      />
                                      <Typography variant="body2">
                                        {center.phoneNumber}
                                      </Typography>
                                    </Box>

                                    {/* Price Range */}
                                    {priceRange.max > 0 && (
                                      <Box display="flex" alignItems="center">
                                        <LocalOffer
                                          fontSize="small"
                                          color="action"
                                          sx={{ mr: 0.5, minWidth: 20 }}
                                        />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {priceRange.min === priceRange.max
                                            ? `${formatPrice(
                                                priceRange.min
                                              )} VND/hour`
                                            : `${formatPrice(
                                                priceRange.min
                                              )} - ${formatPrice(
                                                priceRange.max
                                              )} VND/hour`}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Grid>

                                  <Grid
                                    size={{
                                      xs: 12,
                                      md: 5,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <SportsTennis
                                        fontSize="small"
                                        sx={{ mr: 0.5 }}
                                      />
                                      Các môn thể thao
                                    </Typography>
                                    <Box
                                      display="flex"
                                      flexWrap="wrap"
                                      gap={0.5}
                                    >
                                      {(center.sportNames || uniqueSports).map(
                                        (sport, index) => (
                                          <Chip
                                            key={index}
                                            label={sport}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ borderRadius: 2, height: 24 }}
                                          />
                                        )
                                      )}
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>

                              {/* Description */}
                              {center.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 1,
                                    mb: 2,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {center.description}
                                </Typography>
                              )}

                              <Box mt="auto" textAlign="right">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  endIcon={<ArrowForward />}
                                  sx={{ borderRadius: 2 }}
                                >
                                  Xem chi tiết
                                </Button>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  my={4}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    siblingCount={isTablet ? 0 : 1}
                  />
                </Box>
              )}
            </>
          )}

          {/* Search Tips */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 4,
              mt: 2,
              borderRadius: 2,
              bgcolor: "#f1f8e9",
              border: "1px solid #c5e1a5",
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Info color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Mẹo tìm kiếm
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              • Sử dụng bộ lọc ngày và giờ để tìm sân có sẵn theo lịch trình bạn
              mong muốn
              <br />
              • Lọc theo loại môn thể thao để tìm các trung tâm cung cấp hoạt
              động cụ thể
              <br />• Kiểm tra yêu cầu cơ sở vật chất (phòng thay đồ, thuê thiết
              bị) để đảm bảo trung tâm đáp ứng nhu cầu của bạn
            </Typography>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default BrowseCourtsView;
