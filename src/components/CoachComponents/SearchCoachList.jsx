import React, { useState, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";

const SearchCoachList = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch style={{ color: "#6d6d6d" }} />
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
