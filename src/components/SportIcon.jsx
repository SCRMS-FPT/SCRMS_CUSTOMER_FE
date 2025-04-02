import React from "react";
import {
  SportsSoccerOutlined,
  SportsTennisOutlined,
  SportsBasketballOutlined,
  SportsVolleyballOutlined,
  SportsFootballOutlined,
  FitnessCenterOutlined,
  DirectionsRunOutlined,
  DirectionsBikeOutlined,
  PoolOutlined,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { Box } from "@mui/material";

function SportIcon({ sport, size = 24, color }) {
  if (!sport) return null;

  const getIcon = () => {
    const sportName = sport.toLowerCase();

    if (sportName.includes("soccer") || sportName.includes("football")) {
      return <SportsSoccerOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("tennis")) {
      return <SportsTennisOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("basketball")) {
      return <SportsBasketballOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("volleyball")) {
      return <SportsVolleyballOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("american football")) {
      return <SportsFootballOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("gym") || sportName.includes("fitness")) {
      return <FitnessCenterOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("running")) {
      return <DirectionsRunOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("cycling") || sportName.includes("bike")) {
      return <DirectionsBikeOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("swimming") || sportName.includes("pool")) {
      return <PoolOutlined sx={{ fontSize: size, color }} />;
    }
    if (sportName.includes("badminton")) {
      return (
        <Icon icon="mdi:badminton" width={size} height={size} color={color} />
      );
    }
    if (sportName.includes("pickleball")) {
      return (
        <Icon
          icon="game-icons:tennis-ball"
          width={size}
          height={size}
          color={color}
        />
      );
    }
    if (sportName.includes("table tennis") || sportName.includes("ping pong")) {
      return (
        <Icon
          icon="mdi:table-tennis"
          width={size}
          height={size}
          color={color}
        />
      );
    }
    if (sportName.includes("golf")) {
      return <Icon icon="mdi:golf" width={size} height={size} color={color} />;
    }

    // Default icon
    return <DirectionsRunOutlined sx={{ fontSize: size, color }} />;
  };

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {getIcon()}
    </Box>
  );
}

export default SportIcon;
