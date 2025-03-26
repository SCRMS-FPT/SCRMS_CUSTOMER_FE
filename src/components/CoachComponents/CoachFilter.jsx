import React from "react";
import { Box, Typography, Button, TextField, Grid } from "@mui/material";
import { FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import sportsData from "../../data/sportsData";

const CoachFilter = ({
  selectedSport,
  setSelectedSport,
  selectedLocation,
  setSelectedLocation,
  selectedFee,
  setSelectedFee,
  applyFilters,
  clearFilters,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose Sport
      </Typography>
      <Grid container spacing={2}>
        {sportsData.slice(0, 6).map((sport) => (
          <Grid item xs={4} key={sport.name}>
            <Button
              fullWidth
              variant={selectedSport === sport.name ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedSport(sport.name)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              <Box
                component="img"
                src={sport.icon}
                alt={sport.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              {sport.name}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Location
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                <FaMapMarkerAlt style={{ color: "#6d6d6d" }} />
              </Box>
            ),
          }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Max Fee
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter max fee"
          type="number"
          value={selectedFee || ""}
          onChange={(e) => setSelectedFee(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                <FaDollarSign style={{ color: "#6d6d6d" }} />
              </Box>
            ),
          }}
        />
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-around" }}>
        <Button variant="outlined" onClick={clearFilters} sx={{ textTransform: "none" }}>
          Clear
        </Button>
        <Button variant="contained" onClick={applyFilters} sx={{ textTransform: "none" }}>
          Filter
        </Button>
      </Box>
    </Box>
  );
};

export default CoachFilter;
