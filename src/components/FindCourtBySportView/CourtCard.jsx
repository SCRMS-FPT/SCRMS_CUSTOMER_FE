import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourtCard = ({ court }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/court/${court.court_id}`);
  };

  return (
    <Card
      elevation={3}
      onClick={handleCardClick}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        image={court.images?.[0] || "https://placehold.co/200x200"}
        alt={court.name}
        sx={{
          width: { xs: "100%", sm: "33%" },
          height: isMobile ? 200 : "auto",
          objectFit: "cover",
        }}
      />
      <CardContent
        sx={{
          p: 2,
          width: { xs: "100%", sm: "67%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {court.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Địa chỉ: {court.venue?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Môn thể thao: {court.sport_type}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Mở cửa:{" "}
            {court.weekly_availability?.monday?.[0]?.start || "N/A"} -{" "}
            {court.weekly_availability?.monday?.[0]?.end || "N/A"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtCard;
