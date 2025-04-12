import React from "react";
import CourtCard from "./CourtCard";
import { Grid, Typography, Box } from "@mui/material";

const CourtList = ({ courts, animationClass }) => {
  return (
    <Box className={animationClass}>
      <Grid container spacing={3}>
        {courts.length > 0 ? (
          courts.map((court) => (
            <Grid
              key={court.court_id}
              size={{
                xs: 12,
                sm: 6
              }}>
              <CourtCard court={court} />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
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
