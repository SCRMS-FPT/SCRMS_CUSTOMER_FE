import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaFutbol,
  FaBasketballBall,
  FaSwimmer,
  FaTableTennis,
  FaVolleyballBall,
  FaRunning,
  FaDumbbell,
  FaGolfBall,
} from "react-icons/fa";

const CoachCard = ({ coach }) => {
  const sportIcon = (sport) => {
    switch (sport) {
      case "Football":
        return <FaFutbol style={{ color: "#6d6d6d" }} />;
      case "Basketball":
        return <FaBasketballBall style={{ color: "#6d6d6d" }} />;
      case "Swimming":
        return <FaSwimmer style={{ color: "#6d6d6d" }} />;
      case "Tennis":
        return <FaTableTennis style={{ color: "#6d6d6d" }} />;
      case "Volleyball":
        return <FaVolleyballBall style={{ color: "#6d6d6d" }} />;
      case "Running":
        return <FaRunning style={{ color: "#6d6d6d" }} />;
      case "Gym":
        return <FaDumbbell style={{ color: "#6d6d6d" }} />;
      case "Golf":
        return <FaGolfBall style={{ color: "#6d6d6d" }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      component={Link}
      to={`/coach/${coach.id}`}
      sx={{
        display: "flex",
        mb: 3,
        textDecoration: "none",
        color: "inherit",
        transition: "background 0.3s, transform 0.3s",
        "&:hover": { backgroundColor: "grey.100", transform: "translateY(-4px)" },
      }}
    >
      <CardMedia
        component="img"
        image={coach.image}
        alt={coach.name}
        sx={{
          width: { xs: "100%", md: 200 },
          height: 200,
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ flex: 1, p: 2 }}>
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
          <FaMapMarkerAlt style={{ color: "#6d6d6d" }} />
          <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
            {coach.location}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FaDollarSign style={{ color: "#6d6d6d" }} />
          <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
            ${coach.fee} per hour
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {coach.description}
        </Typography>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button variant="contained" color="primary" size="small">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
