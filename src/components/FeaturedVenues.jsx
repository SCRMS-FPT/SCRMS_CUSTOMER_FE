import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, Button, Typography, Box, Container, 
  Grid, IconButton, Chip, Skeleton, Pagination 
} from "@mui/material";
import { LocationOn, Phone, SportsSoccer, SportsTennis, AccessTime } from "@mui/icons-material";
import { getSportCenters } from "../API/SportCenterApi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeaturedVenues = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage, setVenuesPerPage] = useState(6);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await getSportCenters();
        if (response.sportCenters) {
          const transformedData = response.sportCenters.data.map(center => ({
            id: center.id,
            sport: center.sportNames.join(", "),
            name: center.name,
            location: center.address,
            phoneNumber: center.phoneNumber || "N/A",
            image: center.imageUrl || "https://placehold.co/400x200",
          }));
          setVenues(transformedData);
        } else {
          console.error("Error fetching venues: No data found");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

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

  const filteredVenues =
    selectedSport === "All"
      ? venues
      : venues.filter((venue) => venue.sport.includes(selectedSport));

  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage) || 1;
  const currentVenues = filteredVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  const handleBookClick = (id) => {
    navigate(`/court/${id}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSportIcon = (sport) => {
    if (sport.includes("Football") || sport.includes("Futsal")) return <SportsSoccer fontSize="small" />;
    if (sport.includes("Tennis") || sport.includes("Badminton") || sport.includes("Pickleball")) return <SportsTennis fontSize="small" />;
    return <AccessTime fontSize="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: "linear-gradient(90deg, #1976d2, #64b5f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Discover Sports Venues
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Find and book the perfect sports venue for your next game or training session
        </Typography>
      </Box>

      {/* Filter Buttons */}
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          flexWrap: "wrap", 
          gap: 1.5, 
          mb: 5,
          px: 2,
          py: 2,
          background: "rgba(240, 247, 255, 0.7)",
          borderRadius: 2,
          backdropFilter: "blur(8px)",
        }}
      >
        {["All", "Football", "Badminton", "Futsal", "Volleyball", "Pickleball", "Tennis"].map((sport) => (
          <motion.div key={sport} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedSport === sport ? "contained" : "outlined"}
              onClick={() => {
                setSelectedSport(sport);
                setCurrentPage(1);
              }}
              sx={{
                borderRadius: "50px",
                px: 2.5,
                py: 0.8,
                textTransform: "none",
                fontSize: "0.9rem",
                boxShadow: selectedSport === sport ? 2 : 0,
                backgroundColor: selectedSport === sport ? "primary.main" : "transparent",
                borderColor: selectedSport === sport ? "primary.main" : "rgba(25, 118, 210, 0.5)",
                "&:hover": {
                  backgroundColor: selectedSport === sport ? "primary.dark" : "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              {sport}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* Loading State or No Results */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Skeleton variant="rectangular" height={160} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="70%" height={30} animation="wave" />
                  <Skeleton variant="text" width="90%" height={20} animation="wave" />
                  <Skeleton variant="text" width="60%" height={20} animation="wave" />
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width="50%" height={36} animation="wave" />
                    <Skeleton variant="rectangular" width="50%" height={36} animation="wave" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : currentVenues.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No venues found for the selected filter.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setSelectedSport("All")} 
            sx={{ mt: 2, borderRadius: 2 }}
          >
            View All Venues
          </Button>
        </Box>
      ) : (
        <>
          {/* Venues Grid */}
          <Grid container spacing={3} sx={{ justifyContent: currentVenues.length < 3 ? "center" : "flex-start" }}>
            {currentVenues.map((venue) => (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    {/* Venue Image */}
                    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                      <img 
                        src={venue.image} 
                        alt={venue.name} 
                        style={{ 
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }} 
                      />
                      <Box 
                        sx={{ 
                          position: "absolute", 
                          top: 12, 
                          left: 12, 
                          background: "rgba(255,255,255,0.9)", 
                          borderRadius: 6,
                          px: 1.5,
                          py: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {getSportIcon(venue.sport)}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {venue.sport}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Venue Info */}
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1.5,
                          fontSize: "1.1rem", 
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {venue.name}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {venue.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Phone sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {venue.phoneNumber}
                        </Typography>
                      </Box>

                      {/* Buttons */}
                      <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ 
                            flex: 1, 
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => handleBookClick(venue.id)}
                        >
                          Book
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          sx={{ 
                            flex: 1, 
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => handleBookClick(venue.id)}
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    mx: 0.5,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default FeaturedVenues;