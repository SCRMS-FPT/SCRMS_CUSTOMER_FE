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
        Môn thể thao được chơi nhiều
      </Typography>
      <Grid container spacing={2}>
        {popularSports.map((sport) => (
          <Grid key={sport.name} size={6}>
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
      <Typography
        variant="h6"
        fontWeight="bold"
        color="text.primary"
        mt={4}
        mb={2}
      >
        Lựa chọn môn thể thao
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
              (
                sportsData.find((s) => s.name === selectedSport) ||
                sportsData[0]
              ).icon
            }
            alt={selectedSport}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          {selectedSport}
        </Box>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {sportsData.map((sport) => (
          <MenuItem
            key={sport.name}
            onClick={() => handleMenuItemClick(sport.name)}
          >
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
