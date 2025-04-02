import React, { useState, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterOutlined,
  UserOutlined,
  HeartOutlined,
  CloseOutlined,
  SearchOutlined,
  TrophyOutlined,
  HeartFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";

// Styled components
const SwipeContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 450,
  overflow: "hidden",
  margin: "0 auto",
  maxWidth: 600,
}));

const SwipeCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  backgroundImage: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
  overflow: "hidden",
  padding: 0,
}));

const CardTop = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  height: 160,
  width: "100%",
  position: "relative",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: "5px solid white",
  position: "absolute",
  bottom: -60,
  left: "50%",
  transform: "translateX(-50%)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}));

const CardDetails = styled(CardContent)(({ theme }) => ({
  marginTop: 70,
  textAlign: "center",
  padding: theme.spacing(2, 3, 3, 3),
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor:
    color === "like" ? theme.palette.success.light : theme.palette.error.light,
  color:
    color === "like" ? theme.palette.success.main : theme.palette.error.main,
  width: 64,
  height: 64,
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor:
      color === "like" ? theme.palette.success.main : theme.palette.error.main,
    color: "#fff",
    transform: "scale(1.1)",
  },
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
}));

import PropTypes from "prop-types";

function FindOpponentsTab({ userSkills, sports, matchingClient }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const cardRefs = useRef([]);

  // Initial load of suggestions
  useEffect(() => {
    // Only load suggestions once we have user skills or when user specifically
    // wants no filters (we're checking userSkills is defined not just non-empty)
    if (userSkills !== undefined) {
      loadSuggestions();
    }
  }, [userSkills]);

  // Load suggestions based on filters
  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Create filter string for API - default to undefined
      let filterStr = undefined;

      if (selectedFilters.length > 0) {
        // Only apply filters if user has explicitly selected them
        filterStr = JSON.stringify(selectedFilters);
      }

      console.log("Applying filter:", filterStr);

      // Pass filterStr which will be undefined if no filters
      const response = await matchingClient.suggestions(1, 10, filterStr);
      setSuggestions(response || []);
    } catch (error) {
      console.error("Error loading suggestions:", error);
      setAlertType("error");
      setAlertMessage("Không thể tải danh sách gợi ý. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle swipe action
  const handleSwipe = async (direction, player, index) => {
    // Remove card from the UI immediately for better UX
    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(index, 1);
    setSuggestions(updatedSuggestions);

    try {
      // Call API to record the swipe
      await matchingClient.swipe({
        swipedUserId: player.id,
        decision: direction === "right" ? "accept" : "reject",
      });

      // Show alert for like
      if (direction === "right") {
        setAlertType("success");
        setAlertMessage(`Đã gửi yêu cầu ghép trận tới ${player.fullName}`);
      }

      // If we're running low on suggestions, load more
      if (updatedSuggestions.length < 3) {
        loadSuggestions();
      }
    } catch (error) {
      console.error("Error processing swipe:", error);
      setAlertType("error");
      setAlertMessage("Không thể xử lý thao tác. Vui lòng thử lại.");
    }
  };

  // Add filter
  const handleAddFilter = () => {
    // If user has skills, add the first one as default filter
    if (userSkills.length > 0 && selectedFilters.length === 0) {
      setSelectedFilters([
        {
          sportId: userSkills[0].sportId,
          skillLevel: userSkills[0].skillLevel,
        },
      ]);
    } else {
      // Add a blank filter
      setSelectedFilters([
        ...selectedFilters,
        {
          sportId: sports[0]?.id || "",
          skillLevel: "Intermediate",
        },
      ]);
    }
  };

  // Update filter
  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...selectedFilters];
    updatedFilters[index] = {
      ...updatedFilters[index],
      [field]: value,
    };
    setSelectedFilters(updatedFilters);
  };

  // Remove filter
  const handleRemoveFilter = (index) => {
    const updatedFilters = [...selectedFilters];
    updatedFilters.splice(index, 1);
    setSelectedFilters(updatedFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    loadSuggestions();
    setFilterOpen(false);
  };

  // Handle manual button swipe
  const handleButtonSwipe = (direction, index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].swipe(direction);
    }
  };

  // Show profile preview
  const handleShowProfile = (player) => {
    setPreviewProfile(player);
  };

  // Close profile preview
  const handleClosePreview = () => {
    setPreviewProfile(null);
  };

  return (
    <Box>
      <Collapse in={!!alertMessage}>
        <Alert
          severity={alertType}
          onClose={() => setAlertMessage(null)}
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Tìm đối thủ
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FilterOutlined />}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Bộ lọc
        </Button>
      </Box>

      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterPaper>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Lọc theo kỹ năng
              </Typography>

              {selectedFilters.map((filter, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Môn thể thao</InputLabel>
                      <Select
                        value={filter.sportId}
                        label="Môn thể thao"
                        onChange={(e) =>
                          handleFilterChange(index, "sportId", e.target.value)
                        }
                      >
                        {sports.map((sport) => (
                          <MenuItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Trình độ</InputLabel>
                      <Select
                        value={filter.skillLevel}
                        label="Trình độ"
                        onChange={(e) =>
                          handleFilterChange(
                            index,
                            "skillLevel",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Novice">Novice</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Expert">Expert</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFilter(index)}
                      size="small"
                    >
                      <CloseOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleAddFilter}
                  startIcon={<FilterOutlined />}
                >
                  Thêm bộ lọc
                </Button>

                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  startIcon={<SearchOutlined />}
                >
                  Áp dụng
                </Button>
              </Box>
            </FilterPaper>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <CircularProgress />
        </Box>
      ) : suggestions.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography color="text.secondary">
              Không có đối thủ nào phù hợp với bộ lọc của bạn
            </Typography>
          }
        />
      ) : (
        <>
          <SwipeContainer>
            {suggestions.map((player, index) => (
              <TinderCard
                key={player.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onSwipe={(dir) => handleSwipe(dir, player, index)}
                preventSwipe={["up", "down"]}
              >
                <SwipeCard>
                  <CardTop />
                  <ProfileAvatar src={player.avatarUrl}>
                    <UserOutlined style={{ fontSize: 60 }} />
                  </ProfileAvatar>

                  <CardDetails>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {player.fullName}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {player.sports?.map((sport) => (
                        <Chip
                          key={sport.sportId}
                          icon={<TrophyOutlined />}
                          label={`${sport.sportName}: ${sport.skillLevel}`}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {player.selfIntroduction?.substring(0, 120)}
                      {player.selfIntroduction?.length > 120 ? "..." : ""}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleShowProfile(player)}
                      startIcon={<InfoCircleOutlined />}
                    >
                      Xem thông tin
                    </Button>
                  </CardDetails>
                </SwipeCard>
              </TinderCard>
            ))}
          </SwipeContainer>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}
          >
            <ActionButton
              color="reject"
              onClick={() => handleButtonSwipe("left", 0)}
            >
              <CloseOutlined style={{ fontSize: 24 }} />
            </ActionButton>

            <ActionButton
              color="like"
              onClick={() => handleButtonSwipe("right", 0)}
            >
              <HeartOutlined style={{ fontSize: 24 }} />
            </ActionButton>
          </Box>
        </>
      )}

      {/* Profile Preview Dialog */}
      <Dialog
        open={!!previewProfile}
        onClose={handleClosePreview}
        maxWidth="sm"
        fullWidth
      >
        {previewProfile && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={previewProfile.avatarUrl}
                  sx={{ width: 50, height: 50 }}
                >
                  <UserOutlined />
                </Avatar>
                <Typography variant="h6">{previewProfile.fullName}</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Giới thiệu
              </Typography>
              <Typography variant="body2" paragraph>
                {previewProfile.selfIntroduction ||
                  "Không có thông tin giới thiệu"}
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Kỹ năng
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {previewProfile.sports?.map((sport) => (
                  <Chip
                    key={sport.sportId}
                    icon={<TrophyOutlined />}
                    label={`${sport.sportName}: ${sport.skillLevel}`}
                    color="primary"
                  />
                ))}
                {(!previewProfile.sports ||
                  previewProfile.sports.length === 0) && (
                  <Typography variant="body2">
                    Không có thông tin kỹ năng
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClosePreview}>Đóng</Button>
              <Button
                variant="contained"
                startIcon={<HeartFilled />}
                onClick={() => {
                  handleClosePreview();
                  handleButtonSwipe(
                    "right",
                    suggestions.findIndex((p) => p.id === previewProfile.id)
                  );
                }}
              >
                Ghép trận
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

FindOpponentsTab.propTypes = {
  userSkills: PropTypes.arrayOf(
    PropTypes.shape({
      sportId: PropTypes.string.isRequired,
      skillLevel: PropTypes.string.isRequired,
    })
  ).isRequired,
  sports: PropTypes.array.isRequired,
  matchingClient: PropTypes.object.isRequired,
};

export default FindOpponentsTab;
