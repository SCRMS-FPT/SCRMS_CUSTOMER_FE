import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SportSelection from "@/components/FindCourtBySportView/SportSelection";
import CourtList from "@/components/FindCourtBySportView/CourtList";
import LoadingIndicator from "@/components/FindCourtBySportView/LoadingIndicator";
import Pagination from "@/components/FindCourtBySportView/Pagination";
import "@/styles/animations.css";
import data from "@/data/court_mock_data";
import sportsData from "@/data/sportsData"; // Import sports data

import { Container, Grid, Box, Typography, Paper } from "@mui/material";

const ITEMS_PER_PAGE = 6;

// Derive valid sports names from the imported sportsData array
const VALID_SPORTS = sportsData.map((item) => item.name);

const formatSportType = (sport) => {
  if (!sport) return "All Sports"; // Default
  return sport
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FindCourtBySportView = () => {
  const { sportType } = useParams(); // Get sport from URL
  const navigate = useNavigate();
  const formattedSport = formatSportType(decodeURIComponent(sportType || ""));
  // Validate sport using VALID_SPORTS derived from sportsData
  const initialSport = VALID_SPORTS.includes(formattedSport)
    ? formattedSport
    : "All Sports";

  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [animationClass, setAnimationClass] = useState("slide-in");

  useEffect(() => {
    setLoading(true);
    setAnimationClass("slide-out");
    setTimeout(() => {
      const courts =
        selectedSport === "All Sports"
          ? data
          : data.filter((court) => court.sport_type === selectedSport);
      setFilteredCourts(courts);
      setCurrentPage(1); // Reset to first page when changing sport
      setLoading(false);
      setAnimationClass("slide-in");
    }, 100);
  }, [selectedSport]);

  // Update the URL when the sport is selected
  const handleSportChange = (newSport) => {
    setSelectedSport(newSport);
    const sportURL =
      newSport === "All Sports"
        ? "/courts/sport"
        : `/courts/sport/${encodeURIComponent(newSport)}`;
    navigate(sportURL, { replace: true }); // Update URL without reloading
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourts.length / ITEMS_PER_PAGE);
  const paginatedCourts = filteredCourts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mt: 0, mb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Tìm sân theo môn thể thao bạn lựa chọn
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Sidebar - Sport Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2 }} elevation={3}>
            <SportSelection
              selectedSport={selectedSport}
              setSelectedSport={handleSportChange}
            />
          </Paper>
        </Grid>

        {/* Courts List Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2 }} elevation={3}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <CourtList courts={paginatedCourts} animationClass={animationClass} />
            )}
            {filteredCourts.length > ITEMS_PER_PAGE && (
              <Box sx={{ mt: 2 }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FindCourtBySportView;
