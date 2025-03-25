import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Divider,
  Paper,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Phone,
  LocationOn,
  Description,
  ArrowBack,
  CalendarMonth,
  SportsTennis,
  Spa,
  Event,
  Check,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Client } from "../../API/CourtApi";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const SportCenterDetails = () => {
  const courtClient = new Client();
  const { id } = useParams();
  const [sportCenter, setSportCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courtsLoading, setCourtsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Courts state
  const [courts, setCourts] = useState([]);
  const [totalCourts, setTotalCourts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Filters state
  const [courtType, setCourtType] = useState("all");
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");

  // Google Maps config
  const mapContainerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "4px",
  };

  const defaultCenter = {
    lat: 21.0285, // Default to Hanoi if coordinates not available
    lng: 105.8542,
  };

  const getCourtTypeName = (type) => {
    switch (type) {
      case 1:
        return "Indoor";
      case 2:
        return "Outdoor";
      case 3:
        return "Rooftop";
      default:
        return "Unknown";
    }
  };

  // Fetch sport center details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await courtClient.getSportCenterById(id);
        setSportCenter(data);

        // Set map center based on sport center's coordinates
        if (data.latitude && data.longitude) {
          setMapCenter({
            lat: data.latitude,
            lng: data.longitude,
          });
        }
      } catch (err) {
        setError("Failed to load sport center details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch sports list for filtering
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await courtClient.getSports();
        setSports(response.sports || []);
      } catch (err) {
        console.error("Failed to load sports:", err);
      }
    };

    fetchSports();
  }, []);

  // Fetch courts with filters
  useEffect(() => {
    const fetchCourts = async () => {
      setCourtsLoading(true);
      try {
        const courtTypeValue =
          courtType === "indoor"
            ? 1
            : courtType === "outdoor"
            ? 2
            : courtType === "rooftop"
            ? 3
            : undefined;

        const response = await courtClient.getCourts(
          page - 1, // API uses 0-based index for pages
          pageSize,
          id, // sportCenterId
          selectedSport || undefined,
          courtTypeValue
        );

        setCourts(response.courts.data || []);
        setTotalCourts(response.courts.count || 0);
      } catch (err) {
        console.error("Failed to load courts:", err);
      } finally {
        setCourtsLoading(false);
      }
    };

    if (!loading && sportCenter) {
      fetchCourts();
    }
  }, [id, page, pageSize, courtType, selectedSport, loading, sportCenter]);

  // Handle filter changes
  const handleCourtTypeChange = (event, newValue) => {
    setCourtType(newValue);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSportChange = (event) => {
    setSelectedSport(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !sportCenter) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error">
          {error || "Sport center not found"}
        </Typography>
      </Box>
    );
  }

  const fullAddress = `${sportCenter.addressLine}, ${sportCenter.commune}, ${sportCenter.district}, ${sportCenter.city}`;
  const totalPages = Math.ceil(totalCourts / pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/sports-centers"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Back to Sports Centers
      </Button>

      {/* Main Image and Basic Info */}
      <Card sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="400"
          image={
            sportCenter.avatar ||
            "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt={sportCenter.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ py: 3 }}>
          <Typography gutterBottom variant="h4" component="h1">
            {sportCenter.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <LocationOn color="primary" />
            <Typography variant="body1">{fullAddress}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Phone color="primary" />
            <Typography variant="body1">{sportCenter.phoneNumber}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <Description sx={{ mr: 1 }} />
              About
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {sportCenter.description || "No description available."}
            </Typography>
          </Paper>

          {/* Courts Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <SportsTennis sx={{ mr: 1 }} />
              Available Courts
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Filters */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="sport-select-label">Sport</InputLabel>
                    <Select
                      labelId="sport-select-label"
                      value={selectedSport}
                      label="Sport"
                      onChange={handleSportChange}
                    >
                      <MenuItem value="">All Sports</MenuItem>
                      {sports.map((sport) => (
                        <MenuItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tabs
                    value={courtType}
                    onChange={handleCourtTypeChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="All" value="all" />
                    <Tab label="Indoor" value="indoor" />
                    <Tab label="Outdoor" value="outdoor" />
                    <Tab label="Rooftop" value="rooftop" />
                  </Tabs>
                </Grid>
              </Grid>
            </Box>

            {/* Courts Grid */}
            {courtsLoading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : courts.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No courts found matching your criteria.
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {courts.map((court) => (
                    <Grid item xs={12} sm={6} key={court.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Typography
                              variant="h6"
                              component="h3"
                              gutterBottom
                            >
                              {court.courtName}
                            </Typography>
                            <Chip
                              size="small"
                              label={getCourtTypeName(court.courtType)}
                              color={
                                court.courtType === 1
                                  ? "primary"
                                  : court.courtType === 2
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Box>

                          <Box display="flex" alignItems="center" mb={1}>
                            <Spa
                              fontSize="small"
                              sx={{ color: "text.secondary", mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {court.sportName || "Unknown Sport"}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" mb={1}>
                            <Event
                              fontSize="small"
                              sx={{ color: "text.secondary", mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Slot Duration:{" "}
                              {court.slotDuration?.substring(0, 5) || "1:00"}{" "}
                              hour
                            </Typography>
                          </Box>

                          {court.facilities && court.facilities.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="subtitle2" gutterBottom>
                                Facilities:
                              </Typography>
                              <List dense disablePadding>
                                {court.facilities
                                  .slice(0, 3)
                                  .map((facility, index) => (
                                    <ListItem
                                      key={index}
                                      disablePadding
                                      sx={{ py: 0.5 }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 24 }}>
                                        <Check
                                          fontSize="small"
                                          color="success"
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={facility.name} />
                                    </ListItem>
                                  ))}
                                {court.facilities.length > 3 && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    +{court.facilities.length - 3} more
                                  </Typography>
                                )}
                              </List>
                            </Box>
                          )}
                        </CardContent>
                        <Box p={2} pt={0}>
                          <Button
                            variant="contained"
                            fullWidth
                            component={Link}
                            to={`/book-court/${court.id}`}
                            color="primary"
                          >
                            Book Court
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* Image Gallery */}
          {sportCenter.imageUrls && sportCenter.imageUrls.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Photo Gallery
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ImageList cols={3} gap={8}>
                {sportCenter.imageUrls.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      loading="lazy"
                      style={{
                        borderRadius: 8,
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          )}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Map Location */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Location
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <LoadScript googleMapsApiKey="AIzaSyBqdZHDyUoIWsJJSOEjdmN2AQK1B4xUQHc">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </LoadScript>
            <Box mt={2}>
              <Typography variant="body2">
                <Box component="span" fontWeight="bold">
                  Address:
                </Box>{" "}
                {fullAddress}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <Box component="span" fontWeight="bold">
                  Coordinates:
                </Box>{" "}
                {sportCenter.latitude}, {sportCenter.longitude}
              </Typography>
            </Box>
          </Paper>

          {/* Additional Info */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              <Box display="flex" alignItems="center">
                <CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">
                  Created:{" "}
                  {format(new Date(sportCenter.createdAt), "MMMM dd, yyyy")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">
                  Last Modified:{" "}
                  {format(new Date(sportCenter.lastModified), "MMMM dd, yyyy")}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={Link}
                  to={`/sports-centers/${sportCenter.id}/all-courts`}
                >
                  View All Courts
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SportCenterDetails;
