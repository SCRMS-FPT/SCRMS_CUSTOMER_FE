import React from "react";
import { Box, Card, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Các preset cho mức kỹ năng
const presets = [
  { level: 2, label: "Trình độ tập sự" },
  { level: 6, label: "Trình độ trung bình" },
  { level: 9, label: "Trình độ cao cấp" },
];

// Sử dụng shouldForwardProp để không truyền prop "presetColor" xuống DOM
const PresetCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "presetColor",
})(({ theme, presetColor }) => ({
  width: 300,
  height: 450,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  margin: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: presetColor,
  color: theme.palette.getContrastText(presetColor),
  transition: "transform 0.3s ease, boxShadow 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}));

// Hàm trả về màu nền tương ứng cho từng preset
function getPresetColor(level) {
  switch (level) {
    case 2:
      return "rgba(179,229,252,0.6)"; // Light blue
    case 6:
      return "rgba(200,230,201,0.6)"; // Light green
    case 9:
      return "rgba(255,235,179,0.6)"; // Light amber
    default:
      return "rgba(200,230,201,0.6)";
  }
}

function SkillPresetSelection({ onSelectPreset, onChooseCustom }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Trình độ đội bạn muốn tìm kiếm?
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        {presets.map((preset) => (
          <PresetCard
            key={preset.level}
            presetColor={getPresetColor(preset.level)}
            onClick={() => onSelectPreset(preset.level)}
          >
            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {preset.label}
              </Typography>
              <Typography variant="subtitle1">Mức {preset.level}</Typography>
            </Box>
          </PresetCard>
        ))}
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
        Tự tùy chỉnh
      </Button>
    </Box>
  );
}

export default SkillPresetSelection;
