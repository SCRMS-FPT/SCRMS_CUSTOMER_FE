import React from "react";
import { Box, Card, CardActionArea, CardMedia, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Import ảnh từ assets
import soccerImg from "@/assets/football.png";
import badmintonImg from "@/assets/badminton.jpg";
import basketballImg from "@/assets/basketball.png";

// Styled Card theo tỉ lệ 3:5 với hiệu ứng transition và hover
const SportCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: "100%",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  margin: theme.spacing(1),
  transition: "transform 0.3s ease, boxShadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}));

function SportCardsSelection({ onSelectSport, onChooseCustom }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Bạn muốn tìm trận cho môn thể thao nào?
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        {/* Thẻ Bóng đá */}
        <SportCard>
          <CardActionArea onClick={() => onSelectSport("sport-001")}>
            <CardMedia
              component="img"
              image={soccerImg}
              alt="Bóng đá"
              sx={{
                height: 450,
                objectFit: "cover",
                objectPosition: "center 10%",
                filter: "brightness(0.75)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                  textAlign: "center",
                }}
              >
                Bóng đá
              </Typography>
            </Box>
          </CardActionArea>
        </SportCard>

        {/* Thẻ Cầu lông */}
        <SportCard>
          <CardActionArea onClick={() => onSelectSport("sport-002")}>
            <CardMedia
              component="img"
              image={badmintonImg}
              alt="Cầu lông"
              sx={{
                height: 450,
                objectFit: "cover",
                objectPosition: "top",
                filter: "brightness(0.75)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                  textAlign: "center",
                }}
              >
                Cầu lông
              </Typography>
            </Box>
          </CardActionArea>
        </SportCard>

        {/* Thẻ Bóng rổ */}
        <SportCard>
          <CardActionArea onClick={() => onSelectSport("sport-003")}>
            <CardMedia
              component="img"
              image={basketballImg}
              alt="Bóng rổ"
              sx={{
                height: 450,
                objectFit: "cover",
                objectPosition: "top center",
                filter: "brightness(0.75)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "common.white",
                  textAlign: "center",
                }}
              >
                Bóng rổ
              </Typography>
            </Box>
          </CardActionArea>
        </SportCard>
      </Box>

      <Button
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        onClick={onChooseCustom}
        sx={{
          textTransform: "none",
          mt: 2,
          transition: "background-color 0.3s ease, transform 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            transform: "translateY(-2px)",
          },
        }}
      >
        Tôi sẽ tự tìm môn thể thao
      </Button>
    </Box>
  );
}

export default SportCardsSelection;
