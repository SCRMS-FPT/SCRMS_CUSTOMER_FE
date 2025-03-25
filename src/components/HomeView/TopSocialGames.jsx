import React, { useState } from "react";
import socialGames from "../../data/socialGames";
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Pagination,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CalendarToday,
  LocationOn,
  People,
  ArrowForward,
} from "@mui/icons-material";

const sportIcons = {
  Badminton: "🏸",
  Pickleball: "🏓",
  Futsal: "⚽",
  All: "🏆",
};

const TopSocialGames = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 3;

  // Filter available games by selected sport
  const filteredGames = socialGames.filter(
    (game) =>
      game.status === "Available" &&
      (selectedSport === "All" || game.sport === selectedSport)
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage) || 1;

  // Get games for the current page
  const currentGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            position: "relative",
            display: "inline-block",
            mb: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 3,
              backgroundColor: "primary.main",
              borderRadius: 3,
            },
          }}
        >
          Social Games Near You
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Find and join other players in these upcoming social games. Make new
          friends and enjoy your favorite sports!
        </Typography>
      </Box>

      {/* Sport Filter Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        {["All", "Badminton", "Pickleball", "Futsal"].map((sport) => (
          <motion.div
            key={sport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedSport === sport ? "contained" : "outlined"}
              onClick={() => {
                setSelectedSport(sport);
                setCurrentPage(1);
              }}
              sx={{
                borderRadius: 4,
                px: 3,
                py: 1,
                textTransform: "none",
                fontSize: "1rem",
              }}
              startIcon={
                <Typography component="span" fontSize="1.2rem">
                  {sportIcons[sport]}
                </Typography>
              }
            >
              {sport}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* Games Grid */}
      {currentGames.length > 0 ? (
        <Grid container spacing={3}>
          {currentGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                      transform: "translateY(-5px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={game.image}
                      alt={game.name}
                      style={{
                        height: 180,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Chip
                      label={game.sport}
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {game.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                      <LocationOn
                        sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {game.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                      <CalendarToday
                        sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {game.date} • {game.time}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <People sx={{ color: "success.main", mr: 1 }} />
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="bold"
                        >
                          Looking for players
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        color="primary"
                        endIcon={<ArrowForward />}
                        sx={{ textTransform: "none" }}
                      >
                        Join
                      </Button>
                    </Box>

                    {game.organizer && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 3,
                          pt: 2,
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Avatar
                          src={game.organizer.avatar || ""}
                          alt={game.organizer.name}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Organized by
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {game.organizer.name || "Community Member"}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "action.hover",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No available games for {selectedSport} at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later or try a different sport category.
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default TopSocialGames;
