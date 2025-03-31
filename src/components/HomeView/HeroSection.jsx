import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";

// Import images from src/assets
import img1 from "@/assets/badminton_01.png";
import img2 from "@/assets/gym_01.jpg";
import img3 from "@/assets/soccer_01.jpg";
import img4 from "@/assets/swimming_01.jpg";
import img5 from "@/assets/soccer_02.jpg";
import img6 from "@/assets/tennis_01.jpg";
import FilterForm from "@/components/HomeView/FilterForm";

const HeroSection = () => {
  const images = [img1, img2, img3, img4, img5, img6];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: {
          xs: "600px",
          md: "700px",
          lg: "800px",
        },
        overflow: "hidden",
      }}
    >
      {/* Background Image Slideshow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transition: "opacity 1s",
        }}
      >
        {images.map((img, index) => (
          <Box
            component="img"
            key={index}
            src={img}
            alt={`slide-${index}`}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 1s ease",
              opacity: index === currentImage ? 1 : 0,
            }}
          />
        ))}
      </Box>

      {/* Light Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Content */}
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            color: "black",
            px: 2,
          }}
        >
          <Typography
            variant="h2"
            component="h3"
            sx={{
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              fontWeight: 600,
              color: "white",
              textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
              mb: 1,
            }}
          >
            FIND YOUR SPORT
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem", md: "1.3rem" },
              fontWeight: 300,
              color: "white",
              textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              mb: 6,
            }}
          >
            SEARCH. BOOK. PLAY. REPEAT.
          </Typography>

          <FilterForm />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
