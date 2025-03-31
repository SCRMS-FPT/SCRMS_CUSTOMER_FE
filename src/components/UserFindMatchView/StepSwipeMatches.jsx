import React, { useState, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

// Container bao quanh toàn bộ card swipe với chiều cao lớn hơn một chút
const SwipeContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 450,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Styled card để hiển thị thông tin của match với giao diện card hiện đại
const SwipeCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  width: 320,
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: theme.shadows[6],
  background: "linear-gradient(135deg, #ffffff 0%, #e6e9f0 100%)",
  transition: "transform 0.3s ease-out",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
}));

/**
 * Component StepSwipeMatches:
 * - Hiển thị loading spinner trong thời gian lấy dữ liệu.
 * - Sử dụng react-tinder-card để hiển thị các card với hiệu ứng swipe.
 * - Khi swipe sang phải: gọi onLike(matchItem)
 * - Khi swipe sang trái: gọi onReject(matchItem)
 * - Lưu lại danh sách các thẻ đã "like" và "reject" riêng
 *
 * Sử dụng default value cho suggestedMatches để tránh lỗi nếu prop không được truyền.
 */
function StepSwipeMatches({
  suggestedMatches = [],
  onLike,
  onReject,
  onNextStep,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [likedMatches, setLikedMatches] = useState([]);
  const [rejectedMatches, setRejectedMatches] = useState([]);
  const childRefs = useRef([]);

  // Giả lập loading dữ liệu (ví dụ 1.5 giây)
  useEffect(() => {
    if (suggestedMatches?.length > 0) {
      const timer = setTimeout(() => {
        setCards(suggestedMatches);
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCards([]);
      setIsLoading(false);
    }
  }, [suggestedMatches]);

  // Callback khi swipe một card
  const handleSwipe = (direction, matchItem) => {
    if (direction === "right") {
      onLike(matchItem);
      setLikedMatches((prev) => [...prev, matchItem]);
    } else if (direction === "left") {
      onReject(matchItem);
      setRejectedMatches((prev) => [...prev, matchItem]);
    }
    // Xóa card đã swipe khỏi danh sách bằng cách dùng giá trị duy nhất: user_id
    setCards((prevCards) =>
      prevCards.filter((card) => card.user_id !== matchItem.user_id)
    );
  };

  // Callback khi card ra khỏi màn hình (có thể dùng để log hoặc xử lý thêm)
  const handleCardLeftScreen = (identifier) => {
    console.log("Card left the screen:", identifier);
  };

  // Ví dụ: Swipe tất cả các thẻ theo một hướng (bulk swipe)
  const swipeAll = (direction) => {
    childRefs.current.forEach((ref, index) => {
      if (ref && cards[index]) {
        ref.swipe(direction);
      }
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        Bước 2: Tìm Trận (Swipe)
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <SwipeContainer>
          {cards.length === 0 ? (
            <Typography variant="body1" align="center">
              Không còn trận nào để gợi ý.
            </Typography>
          ) : (
            cards.map((matchItem, index) => (
              <TinderCard
                key={matchItem.user_id || matchItem.id}
                ref={(el) => (childRefs.current[index] = el)}
                onSwipe={(dir) => handleSwipe(dir, matchItem)}
                onCardLeftScreen={() =>
                  handleCardLeftScreen(matchItem.user_id || matchItem.id)
                }
                preventSwipe={["up", "down"]}
              >
                <SwipeCard>
                  <Stack spacing={2} alignItems="center">
                    <Avatar
                      src={matchItem.avatar}
                      alt={matchItem.full_name}
                      sx={{ width: 100, height: 100, mb: 1 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {matchItem.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(matchItem.skill_level || "N/A").toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Môn: {matchItem.sport_id}
                    </Typography>
                  </Stack>
                  {/* Nút dự phòng nếu người dùng không swipe */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 3,
                    }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => {
                        childRefs.current[index].swipe("left");
                      }}
                    >
                      <CloseIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        childRefs.current[index].swipe("right");
                      }}
                    >
                      <FavoriteIcon fontSize="large" />
                    </IconButton>
                  </Box>
                </SwipeCard>
              </TinderCard>
            ))
          )}
        </SwipeContainer>
      )}

      {/* Nút bulk swipe: ví dụ swipe tất cả thẻ sang bên phải */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={() => swipeAll("right")}
          disabled={isLoading || cards.length === 0}
        >
          Swipe All Right
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button variant="contained" onClick={onNextStep} disabled={isLoading}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
}

export default StepSwipeMatches;
