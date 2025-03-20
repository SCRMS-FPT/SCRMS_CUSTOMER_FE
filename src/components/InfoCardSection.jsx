import React from "react";
import { Card, CardContent, Typography, Box, Container } from "@mui/material";
import { motion } from "framer-motion";

const InfoCardSection = ({ title, cards }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          fontWeight: 700, 
          mb: 4, 
          textAlign: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 3,
            backgroundColor: "primary.main",
            borderRadius: 3
          }
        }}
      >
        {title}
      </Typography>
      <Box 
        sx={{ 
          display: "flex", 
          gap: 3, 
          overflowX: "auto", 
          py: 2,
          "&::-webkit-scrollbar": {
            display: "none"
          }
        }}
      >
        {cards.map((card, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              sx={{ 
                minWidth: 200, 
                borderRadius: 3, 
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                  transform: "translateY(-5px)"
                }
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1 
                  }}
                >
                  {card}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};

export default InfoCardSection;