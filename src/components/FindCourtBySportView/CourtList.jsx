import React from "react";
import CourtCard from "./CourtCard";
import { Grid, Typography, Box } from "@mui/material";

const CourtList = ({ courts, animationClass }) => {
  return (
    <Box className={animationClass}>
      <Grid container spacing={3}>
        {courts.length > 0 ? (
          courts.map((court) => (
            <Grid item xs={12} sm={6} key={court.court_id}>
              <CourtCard court={court} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="text.secondary">
              Không có sân phù hợp.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CourtList;
