import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Search as SearchIcon,
  SportsTennis,
  AccessTime,
  LocationOn,
  CalendarMonth,
} from "@mui/icons-material";

const FilterForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Form state
  const [sportFilter, setSportFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(null);
  const [cityFilter, setCityFilter] = useState("");

  // Data states
  const [sports, setSports] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      setLoadingSports(true);
      try {
        const response = await axios.get(
          "https://api.courtsite.com/api/sports"
        );
        setSports(response.data || []);
      } catch (err) {
        console.error("Error fetching sports:", err);
        // Fallback sports data
        setSports([
          { id: "1", name: "Tennis" },
          { id: "2", name: "Football" },
          { id: "3", name: "Basketball" },
          { id: "4", name: "Badminton" },
          { id: "5", name: "Volleyball" },
        ]);
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
  }, []);

  // Fetch cities data
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

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Format params for URL
    const searchParams = new URLSearchParams();

    if (sportFilter) searchParams.append("sport", sportFilter);
    if (cityFilter) searchParams.append("city", cityFilter);

    // Format date and time if selected
    if (selectedDate) {
      searchParams.append("date", selectedDate.format("YYYY-MM-DD"));
    }

    if (startTime) {
      searchParams.append("startTime", startTime.format("HH:mm:00"));
      // Set default end time 2 hours after start time
      const endTime = startTime.add(2, "hour");
      searchParams.append("endTime", endTime.format("HH:mm:00"));
    }

    // Navigate to browse courts with search params
    navigate(`/browse-courts?${searchParams.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "fit-content",
          maxWidth: "900px",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Sport Selection */}
        <FormControl
          sx={{
            minWidth: isMobile ? "100%" : 180,
            borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Select
            labelId="sport-filter-label"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            label="Sport"
            disabled={loadingSports}
            sx={{ borderRadius: 0, height: "100%" }}
            startAdornment={
              loadingSports ? (
                <InputAdornment position="start">
                  <CircularProgress size={20} color="inherit" />
                </InputAdornment>
              ) : (
                <InputAdornment position="start">
                  <SportsTennis color="primary" />
                </InputAdornment>
              )
            }
          >
            <MenuItem value="">Any Sport</MenuItem>
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Picker */}
        <Box
          sx={{
            width: isMobile ? "100%" : 180,
            borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "filled",
                sx: {
                  borderRadius: 0,
                  "& .MuiFilledInput-root": {
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    "& .MuiInputAdornment-root": {
                      height: "100%",
                      maxHeight: "none",
                      marginTop: 0,
                    },
                    "& .MuiFilledInput-input": {
                      paddingTop: "16px",
                      paddingBottom: "16px",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#1976D2", // Set icon color
                    },
                  },
                },
                InputProps: {
                  disableUnderline: true,
                },
              },
            }}
          />
        </Box>

        {/* Time Picker */}
        <Box
          sx={{
            width: isMobile ? "100%" : 180,
            borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <TimePicker
            value={startTime}
            onChange={(newTime) => setStartTime(newTime)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "filled",
                sx: {
                  borderRadius: 0,
                  "& .MuiFilledInput-root": {
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    "& .MuiInputAdornment-root": {
                      height: "100%",
                      maxHeight: "none",
                      marginTop: 0,
                    },
                    "& .MuiFilledInput-input": {
                      paddingTop: "16px",
                      paddingBottom: "16px",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#1976D2", // Set icon color
                    },
                  },
                },
                InputProps: {
                  disableUnderline: true,
                },
              },
            }}
          />
        </Box>

        {/* Location Selection */}
        <FormControl
          sx={{
            minWidth: isMobile ? "100%" : 180,
            borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Select
            labelId="city-filter-label"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            label="Location"
            disabled={loadingCities}
            sx={{ borderRadius: 0, height: "100%" }}
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
            <MenuItem value="">Any Location</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 0,
            px: 4,
            height: isMobile ? 56 : "auto",
            textTransform: "none",
            fontSize: "1rem",
          }}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Paper>
    </LocalizationProvider>
  );
};

export default FilterForm;
