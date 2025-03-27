import React from "react";
import { Box, Typography, TextField, Grid, Button, InputAdornment } from "@mui/material";
import { Search, Clear, LocationOn } from "@mui/icons-material";
import SportFilterCheckbox from "./SportFilterCheckbox";

const CoachFilter = ({
  searchTerm,
  setSearchTerm,
  selectedSports,
  setSelectedSports,
  selectedLocation,
  setSelectedLocation,
  handleClearFilters,
}) => {
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search coaches by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Box sx={{ cursor: "pointer" }} onClick={() => setSearchTerm("")}>
                    <Clear color="primary" />
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* Sport Filter (multi-select with checkboxes) */}
        <Grid item xs={12} md={4}>
          <SportFilterCheckbox
            selectedSports={selectedSports}
            setSelectedSports={setSelectedSports}
            loadingSports={false}
          />
        </Grid>
        {/* Location Filter */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Filter by location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* Clear Button */}
        <Grid item xs={12} md={1}>
          <Button fullWidth variant="outlined" onClick={handleClearFilters}>
            <Clear />
          </Button>
        </Grid>
      </Grid>
      {/* Future Advanced Filters */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Additional filters (e.g., fee range, rating) can be added here.
        </Typography>
      </Box>
    </Box>
  );
};

export default CoachFilter;
