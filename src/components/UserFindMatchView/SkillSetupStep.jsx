import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Slider,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckOutlined,
  TagOutlined,
  TrophyOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// Replace LoadingButton with a customized Button
const LoadingButton = ({ loading, children, ...props }) => (
  <Button {...props} disabled={props.disabled || loading}>
    {loading ? (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        {children}
      </Box>
    ) : (
      children
    )}
  </Button>
);

const StepContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: "0 auto",
}));

const StyledCard = styled(Card)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: selected
    ? `0 8px 24px ${theme.palette.primary.main}33`
    : "0 4px 12px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
  transform: selected ? "translateY(-8px)" : "none",
  border: selected ? `2px solid ${theme.palette.primary.main}` : "none",
  overflow: "hidden",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
}));

const SkillLevelWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  background: "#fff",
  marginTop: theme.spacing(4),
}));

const SkillMarker = styled(Box)(({ theme, active }) => ({
  width: active ? 34 : 20,
  height: active ? 34 : 20,
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: active ? 14 : 10,
  fontWeight: "bold",
  transition: "all 0.2s",
  zIndex: 1,
  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
}));

const SkillLabel = styled(Typography)(({ theme, active }) => ({
  fontSize: active ? "0.875rem" : "0.75rem",
  fontWeight: active ? 600 : 400,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: "all 0.2s",
  marginTop: theme.spacing(1),
}));

const SelectedSportItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  position: "relative",
}));

const skillLevels = [
  {
    value: 1,
    label: "Beginner",
    description: "Mới bắt đầu, chưa có kinh nghiệm",
  },
  {
    value: 2,
    label: "Novice",
    description: "Đã chơi vài lần, biết luật cơ bản",
  },
  {
    value: 3,
    label: "Intermediate",
    description: "Chơi thường xuyên, có kỹ thuật cơ bản",
  },
  {
    value: 4,
    label: "Advanced",
    description: "Chơi tốt, có kỹ thuật nâng cao",
  },
  {
    value: 5,
    label: "Expert",
    description: "Chơi rất giỏi, có thể thi đấu chuyên nghiệp",
  },
];

function SkillSetupStep({ sports, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSports, setSelectedSports] = useState([]);
  const [currentSportId, setCurrentSportId] = useState(null);
  const [currentSkillLevel, setCurrentSkillLevel] = useState(3);
  const [loading, setLoading] = useState(false);

  // Handle selecting a sport
  const handleSelectSport = (sport) => {
    setCurrentSportId(sport.id);
    setActiveStep(1);
  };

  // Handle setting the skill level
  const handleSetSkillLevel = (event, value) => {
    setCurrentSkillLevel(value);
  };

  // Add current sport and skill level to the selected list
  const handleAddSportSkill = () => {
    // Find the sport object
    const sport = sports.find((s) => s.id === currentSportId);

    // Create the skill object
    const skillObj = {
      sportId: currentSportId,
      sportName: sport.name,
      skillLevel: skillLevels.find((level) => level.value === currentSkillLevel)
        .label,
    };

    // Add to selected sports
    setSelectedSports((prev) => [...prev, skillObj]);

    // Reset for next selection
    setCurrentSportId(null);
    setCurrentSkillLevel(3);
    setActiveStep(0);
  };

  // Remove a sport from the selected list
  const handleRemoveSport = (sportId) => {
    setSelectedSports((prev) =>
      prev.filter((item) => item.sportId !== sportId)
    );
  };

  // Submit all selected skills
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onComplete(selectedSports);
    } catch (error) {
      console.error("Error submitting skills:", error);
      setLoading(false);
    }
  };

  return (
    <StepContainer>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        fontWeight="bold"
      >
        Thiết lập kỹ năng
      </Typography>

      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Hãy chọn các môn thể thao bạn chơi và cấp độ kỹ năng tương ứng
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Chọn môn thể thao</StepLabel>
        </Step>
        <Step>
          <StepLabel>Đánh giá kỹ năng</StepLabel>
        </Step>
      </Stepper>

      <AnimatePresence mode="wait">
        {activeStep === 0 ? (
          <motion.div
            key="sport-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Show currently selected sports */}
            {selectedSports.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Các môn thể thao đã chọn:
                </Typography>

                {selectedSports.map((item) => (
                  <SelectedSportItem key={item.sportId} elevation={0}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {item.sportName}
                      </Typography>
                      <Chip
                        icon={<TrophyOutlined />}
                        label={item.skillLevel}
                        color="primary"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CloseOutlined />}
                      onClick={() => handleRemoveSport(item.sportId)}
                    >
                      Xóa
                    </Button>
                  </SelectedSportItem>
                ))}

                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            <Typography variant="h6" gutterBottom>
              Chọn môn thể thao mới:
            </Typography>

            <Grid container spacing={3}>
              {sports
                .filter(
                  (sport) =>
                    !selectedSports.some((item) => item.sportId === sport.id)
                )
                .map((sport) => (
                  <Grid item xs={12} sm={6} md={4} key={sport.id}>
                    <StyledCard
                      selected={currentSportId === sport.id}
                      onClick={() => handleSelectSport(sport)}
                    >
                      <CardActionArea sx={{ height: "100%" }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={
                            sport.imageUrl ||
                            `https://source.unsplash.com/random/300x200/?${sport.name}`
                          }
                          alt={sport.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {sport.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {sport.description ||
                              `Chọn để thiết lập kỹ năng cho môn ${sport.name}`}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </StyledCard>
                  </Grid>
                ))}
            </Grid>

            {selectedSports.length > 0 && (
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <LoadingButton
                  variant="contained"
                  size="large"
                  loading={loading}
                  onClick={handleSubmit}
                  startIcon={!loading && <CheckOutlined />}
                >
                  Hoàn tất thiết lập
                </LoadingButton>
              </Box>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="skill-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SkillLevelWrapper>
              <Typography variant="h6" gutterBottom>
                Đánh giá kỹ năng cho môn{" "}
                {sports.find((s) => s.id === currentSportId)?.name}:
              </Typography>

              <Box sx={{ my: 4, px: 2 }}>
                <Slider
                  value={currentSkillLevel}
                  onChange={handleSetSkillLevel}
                  step={1}
                  marks={true}
                  min={1}
                  max={5}
                  valueLabelDisplay="off"
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    position: "relative",
                  }}
                >
                  {skillLevels.map((level) => (
                    <Box
                      key={level.value}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 80,
                      }}
                    >
                      <SkillMarker active={currentSkillLevel === level.value}>
                        {level.value}
                      </SkillMarker>
                      <SkillLabel
                        active={currentSkillLevel === level.value}
                        variant="body2"
                      >
                        {level.label}
                      </SkillLabel>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{ p: 2, bgcolor: "primary.light", borderRadius: 2, mt: 2 }}
              >
                <Typography variant="body2">
                  <strong>
                    {
                      skillLevels.find(
                        (level) => level.value === currentSkillLevel
                      ).label
                    }
                    :
                  </strong>{" "}
                  {
                    skillLevels.find(
                      (level) => level.value === currentSkillLevel
                    ).description
                  }
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button variant="outlined" onClick={() => setActiveStep(0)}>
                  Quay lại
                </Button>

                <Button
                  variant="contained"
                  onClick={handleAddSportSkill}
                  endIcon={<CheckOutlined />}
                >
                  Xác nhận
                </Button>
              </Box>
            </SkillLevelWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  );
}

export default SkillSetupStep;
