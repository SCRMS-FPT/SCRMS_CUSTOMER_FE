import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Bước 3: Hoàn Tất & Xem Danh Sách
 * Hiển thị số trận đã like & nút chuyển sang trang danh sách
 */

function StepComplete({ likedMatches }) {
  const navigate = useNavigate();

  const handleViewMatchesList = () => {
    navigate("/matches/list?tab=0");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Hoàn tất!
      </Typography>
      <Typography>
        Bạn đã thích {likedMatches.length} trận. Hãy chờ phản hồi hoặc xem chi tiết.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleViewMatchesList}>
          Xem danh sách trận đã like
        </Button>
      </Box>
    </Box>
  );
}

export default StepComplete;
