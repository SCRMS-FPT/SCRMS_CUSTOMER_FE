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
} from "@mui/material";
import CoachCard from "@/pages/CoachBooking/CoachCard";
import CoachFilter from "@/pages/CoachBooking/CoachFilter";
import coachesData from "@/data/coachesData";

const CoachListView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSports, setSelectedSports] = useState(["All Sports"]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredCoaches, setFilteredCoaches] = useState(coachesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;

  // Clear filters helper passed to CoachFilter
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSports(["All Sports"]);
    setSelectedLocation("");
  };

  useEffect(() => {
    setLoading(true);
    const filtered = coachesData.filter((coach) => {
      const matchesSport =
        selectedSports.includes("All Sports") ||
        selectedSports.includes(coach.sport);
      const matchesLocation =
        !selectedLocation ||
        coach.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSport && matchesLocation && matchesSearch;
    });
    setFilteredCoaches(filtered);
    setCurrentPage(1);
    setLoading(false);
  }, [searchTerm, selectedSports, selectedLocation]);

  const paginatedCoaches = filteredCoaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f8f9fa, #ffffff)", minHeight: "100vh" }}>
      {/* Inline Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 180, md: 240 },
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
          boxShadow: 3,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('/src/assets/HLV/banner-1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ ml: 2, color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            Find Your Perfect Coach
          </Typography>
          <Typography variant="subtitle1">
            Search and filter coaches by sport, location and fee.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4, position: "relative", zIndex: 2 }}>
        {/* CoachFilter Component: encapsulates search field, sport filter, and location filter */}
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 4 }}>
          <CoachFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSports={selectedSports}
            setSelectedSports={setSelectedSports}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            handleClearFilters={handleClearFilters}
          />
        </Paper>

        {/* Coach Cards List */}
        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredCoaches.length === 0 ? (
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No coaches found matching your criteria.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {paginatedCoaches.map((coach) => (
                <Grid item xs={12} md={6} key={coach.id}>
                  <Fade in={true} timeout={600}>
                    <Box>
                      <CoachCard coach={coach} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Pagination */}
        {filteredCoaches.length > itemsPerPage && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredCoaches.length / itemsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CoachListView;
