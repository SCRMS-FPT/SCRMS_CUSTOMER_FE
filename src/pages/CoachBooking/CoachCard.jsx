import React from "react";
import { Paper, Grid, Box, Typography, Button, Divider } from "@mui/material";
import { SportsTennis, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const CoachCard = ({ coach }) => {
  const sportIcon = (sport) => {
    switch (sport) {
      case "Football":
        return <i className="fas fa-futbol" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Basketball":
        return <i className="fas fa-basketball-ball" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Swimming":
        return <i className="fas fa-swimmer" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Tennis":
        return <i className="fas fa-table-tennis" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Volleyball":
        return <i className="fas fa-volleyball-ball" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Running":
        return <i className="fas fa-running" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Gym":
        return <i className="fas fa-dumbbell" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      case "Golf":
        return <i className="fas fa-golf-ball" style={{ fontSize: 18, color: "#6d6d6d" }} />;
      default:
        return <SportsTennis fontSize="small" color="action" />;
    }
  };

  return (
    <Paper
      component={Link}
      to={`/coach/${coach.id}`}
      sx={{
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <Grid container>
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <Box
            component="img"
            src={coach.image}
            alt={coach.name}
            sx={{
              width: "100%",
              height: { xs: 180, md: "100%" },
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 8
          }}>
          <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {coach.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {sportIcon(coach.sport)}
              <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                {coach.sport}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                {coach.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <i className="fas fa-dollar-sign" style={{ fontSize: 16, color: "#6d6d6d" }} />
              <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                ${coach.fee} per hour
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {coach.description}
            </Typography>
            <Box sx={{ mt: "auto", textAlign: "right", pt: 1 }}>
              <Button variant="contained" color="primary" size="small">
                View Details
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CoachCard;
