import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import sportsData from "@/data/sportsData";

const SportFilterCheckbox = ({ selectedSports, setSelectedSports, loadingSports }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedSports(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="sport-filter-checkbox-label">Sport</InputLabel>
      <Select
        labelId="sport-filter-checkbox-label"
        multiple
        value={selectedSports}
        onChange={handleChange}
        label="Sport"
        disabled={loadingSports}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selected.map((sportName) => {
              const sport = sportsData.find((s) => s.name === sportName);
              return (
                <Box key={sportName} sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={sport?.icon} sx={{ width: 24, height: 24, mr: 0.5 }} />
                  <Typography variant="body1" noWrap>
                    {sportName}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      >
        {sportsData.map((sport) => (
          <MenuItem key={sport.name} value={sport.name}>
            <Checkbox checked={selectedSports.indexOf(sport.name) > -1} />
            <ListItemIcon>
              <Avatar src={sport.icon} sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary={sport.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SportFilterCheckbox;
