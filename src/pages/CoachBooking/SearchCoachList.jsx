import React, { useState, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchCoachList = ({ onSearch }) => {
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  return (
    <Box
      sx={{
        backgroundImage: "url('/src/assets/HLV/banner-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: { xs: 150, md: 200 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 500, position: "relative" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for coaches..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: 3,
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchCoachList;
