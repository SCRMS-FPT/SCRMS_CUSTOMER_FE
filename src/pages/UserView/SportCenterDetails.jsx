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
  Avatar,
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
  Star,
  Info,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Client } from "../../API/CourtApi";

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
            ? "Indoor"
            : courtType === "outdoor"
            ? "Outdoor"
            : courtType === "rooftop"
            ? "Rooftop"
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
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error || "Sport center not found"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/sports-centers"
        >
          Quay trở lại danh sách
        </Button>
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
        sx={{ mb: 3 }}
        variant="outlined"
      >
          Quay trở lại danh sách
      </Button>

      {/* Main Info Card - Improved layout */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Grid container>
          {/* Left side - Image */}
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="300"
              image={
                sportCenter.avatar ||
                "https://via.placeholder.com/800x400?text=No+Image"
              }
              alt={sportCenter.name}
              sx={{ objectFit: "cover", height: "100%" }}
            />
          </Grid>
          {/* Right side - Info */}
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Typography
                gutterBottom
                variant="h4"
                component="h1"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                {sportCenter.name}
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center">
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">{fullAddress}</Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Phone color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {sportCenter.phoneNumber}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Info color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Được tạo ngày:{" "}
                    {new Date(sportCenter.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/sports-centers/${sportCenter.id}/all-courts`}
                sx={{ mt: 2 }}
              >
                Xem tất cả các sân
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <Description sx={{ mr: 1 }} />
              Thông tin mô tả
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {sportCenter.description || "No description available."}
            </Typography>
          </Paper>

          {/* Courts Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <SportsTennis sx={{ mr: 1 }} />
              Các sân đang mở
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Filters */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="sport-select-label">Môn thể thao</InputLabel>
                    <Select
                      labelId="sport-select-label"
                      value={selectedSport}
                      label="Sport"
                      onChange={handleSportChange}
                    >
                      <MenuItem value="">Tất cả các môn thể thao</MenuItem>
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
                    <Tab label="Tất cả" value="all" />
                    <Tab label="Trong nhà" value="indoor" />
                    <Tab label="Ngoài trời" value="outdoor" />
                    <Tab label="Có mái che" value="rooftop" />
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
                  Không tìm thấy sân phù hợp tiêu chí của bạn.
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
                              sx={{ fontWeight: 500 }}
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
                              Thời gian:{" "}
                              {court.slotDuration?.substring(0, 5) || "1:00"}{" "}
                              tiếng
                            </Typography>
                          </Box>

                          {court.facilities && court.facilities.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="subtitle2" gutterBottom>
                                Cơ sở vật chất:
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
                                    +{court.facilities.length - 3} thêm
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
                            to={{
                              pathname: `/book-court/${sportCenter.id}`,
                              search: `?courtId=${court.id}`,
                            }}
                            state={{
                              preselectedCourt: court.id,
                              sportCenterId: sportCenter.id,
                              courtName: court.courtName,
                              sportName: court.sportName,
                            }}
                            color="primary"
                          >
                            Đặt sân
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

          {/* Image Gallery - Improved */}
          {sportCenter.imageUrls && sportCenter.imageUrls.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Ảnh sân
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ImageList cols={2} gap={16} sx={{ mb: 2 }}>
                {sportCenter.imageUrls.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      loading="lazy"
                      style={{
                        borderRadius: 8,
                        height: 220,
                        width: "100%",
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
          {/* Map Location - Using OpenStreetMap Embed instead of Google Maps */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Địa chỉ
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* OpenStreetMap embed that doesn't require API key */}
            <iframe
              width="100%"
              height="250"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                sportCenter.longitude - 0.01
              }%2C${sportCenter.latitude - 0.01}%2C${
                sportCenter.longitude + 0.01
              }%2C${sportCenter.latitude + 0.01}&amp;layer=mapnik&amp;marker=${
                sportCenter.latitude
              }%2C${sportCenter.longitude}`}
              style={{ borderRadius: 8, border: "1px solid #ddd" }}
            ></iframe>

            <Box mt={2}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Địa chỉ:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {fullAddress}
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
                Tọa độ:
              </Typography>
              <Typography variant="body2">
                {sportCenter.latitude.toFixed(4)},{" "}
                {sportCenter.longitude.toFixed(4)}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mt: 2 }}
                href={`https://www.openstreetmap.org/?mlat=${sportCenter.latitude}&mlon=${sportCenter.longitude}#map=16/${sportCenter.latitude}/${sportCenter.longitude}`}
                target="_blank"
              >
                Xem trên Maps
              </Button>
            </Box>
          </Paper>

          {/* Additional Info */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Thông tin thêm
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  ID của trung tâm thể thao:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  {sportCenter.id}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Tạo ra vào ngày:
                </Typography>
                <Typography variant="body2">
                  {new Date(sportCenter.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Lần cập nhật cuối:
                </Typography>
                <Typography variant="body2">
                  {new Date(sportCenter.lastModified).toLocaleString()}
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
                  Xem tất cả các sân
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
