import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import sportsData from "@/data/sportsData";

const SportSelection = ({ selectedSport, setSelectedSport }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Filter popular sports: Football, Tennis, Badminton, Basketball.
  const popularSports = sportsData.filter(
    (sport) =>
      sport.name === "Football" ||
      sport.name === "Tennis" ||
      sport.name === "Badminton" ||
      sport.name === "Basketball"
  );

  const handlePopularClick = (sportName) => {
    setSelectedSport(sportName);
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (sportName) => {
    setSelectedSport(sportName);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
        Popular Sports:
      </Typography>
      <Grid container spacing={2}>
        {popularSports.map((sport) => (
          <Grid item xs={6} key={sport.name}>
            <Button
              fullWidth
              variant={selectedSport === sport.name ? "contained" : "outlined"}
              color="primary"
              onClick={() => handlePopularClick(sport.name)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              <Avatar
                src={sport.icon}
                alt={sport.name}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              {sport.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight="bold" color="text.primary" mt={4} mb={2}>
        Select Sport:
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleButtonClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={
              (sportsData.find((s) => s.name === selectedSport) || sportsData[0])
                .icon
            }
            alt={selectedSport}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          {selectedSport}
        </Box>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {sportsData.map((sport) => (
          <MenuItem key={sport.name} onClick={() => handleMenuItemClick(sport.name)}>
            <Avatar
              src={sport.icon}
              alt={sport.name}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            {sport.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SportSelection;
