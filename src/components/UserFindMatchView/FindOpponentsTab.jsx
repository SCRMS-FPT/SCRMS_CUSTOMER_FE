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
  Alert,
  Collapse,
  ImageList,
  ImageListItem,
  Divider,
  Skeleton,
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
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";
import PropTypes from "prop-types";
import { Client as IdentityClient } from "@/API/IdentityApi";
import { Client as CourtClient } from "@/API/CourtApi";

// Updated SwipeContainer with better positioning
const SwipeContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 550,
  margin: "0 auto",
  maxWidth: 600,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden", // Change to hidden to prevent positioning issues
  perspective: "1000px",
}));

// Updated SwipeCard styling to better accommodate the carousel
const SwipeCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  backgroundImage: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
  overflow: "hidden",
  padding: 0,
  top: 0,
  left: 0,
  zIndex: 1,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    transform: "translateY(-5px)",
  },
}));

const CardTop = styled(Box)(({ theme }) => ({
  height: 220,
  width: "100%",
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&::after": {
    // Add gradient overlay
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
    zIndex: 1,
  },
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
  zIndex: 2,
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateX(-50%) scale(1.05)",
  },
}));

// Updated CardDetails to start immediately below the carousel
const CardDetails = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2, 3, 3, 3),
  overflow: "auto",
  maxHeight: "calc(100% - 280px)", // Adjusted for new carousel height
}));

// Enhanced action buttons with better visual feedback
const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor:
    color === "like" ? theme.palette.success.light : theme.palette.error.light,
  color:
    color === "like" ? theme.palette.success.main : theme.palette.error.main,
  width: 64,
  height: 64,
  transition: "all 0.2s",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor:
      color === "like" ? theme.palette.success.main : theme.palette.error.main,
    color: "#fff",
    transform: "scale(1.1)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
}));

const ProfileDetail = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: theme.spacing(0.5, 0),
  color: theme.palette.text.secondary,
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: 16,
  },
}));

const ArrowButton = styled(IconButton)(({ theme, direction }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  color: theme.palette.grey[800],
  ...(direction === "left" ? { left: 10 } : { right: 10 }),
  zIndex: 2,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
}));

// Enhanced chip for skills with better visual appeal
const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
  },
}));

// Enhanced ProfileImageCarousel component
const ProfileImageCarousel = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) {
    return (
      <CardTop
        sx={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 280, // Increased height for better visibility
        }}
      >
        <UserOutlined
          style={{
            fontSize: 80,
            color: "rgba(255,255,255,0.4)",
            zIndex: 2,
          }}
        />
        {name && (
          <Typography
            variant="h6"
            sx={{
              color: "white",
              position: "absolute",
              bottom: 20,
              left: 20,
              zIndex: 5,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontWeight: "bold",
            }}
          >
            {name}
          </Typography>
        )}
      </CardTop>
    );
  }

  return (
    <CardTop
      sx={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        position: "relative",
        height: 280, // Increased height for better visibility
      }}
    >
      {/* Image counter indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 4,
          px: 1.5,
          py: 0.5,
          zIndex: 10,
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          {currentImageIndex + 1}/{images.length}
        </Typography>
      </Box>

      {/* Name overlay on the image */}
      <Typography
        variant="h6"
        sx={{
          color: "white",
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 5,
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          fontWeight: "bold",
        }}
      >
        {name}
      </Typography>

      {images.length > 1 && (
        <>
          <ArrowButton direction="left" onClick={handlePrevious}>
            <LeftOutlined />
          </ArrowButton>
          <ArrowButton direction="right" onClick={handleNext}>
            <RightOutlined />
          </ArrowButton>
        </>
      )}
    </CardTop>
  );
};

// Swipe indicator components with animations
const SwipeIndicator = styled(Box)(({ direction, opacity = 0 }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "30%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  opacity: opacity,
  zIndex: 10,
  transition: "opacity 0.2s ease",
  pointerEvents: "none", // This ensures the indicator doesn't interfere with card interaction
  ...(direction === "right"
    ? {
        right: 0,
        backgroundColor: "rgba(59, 177, 90, 0.2)",
        borderLeft: "2px dashed rgba(59, 177, 90, 0.6)",
      }
    : {
        left: 0,
        backgroundColor: "rgba(225, 70, 70, 0.2)",
        borderRight: "2px dashed rgba(225, 70, 70, 0.6)",
      }),
}));

const IndicatorIcon = styled(Box)(({ direction }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
  backgroundColor: direction === "right" ? "#3BB15A" : "#E14646",
  color: "#fff",
  fontSize: 26,
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
}));

function FindOpponentsTab({ userSkills, sports, matchingClient }) {
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [sportDetails, setSportDetails] = useState({});
  const [dragDirection, setDragDirection] = useState(null);
  const [dragAmount, setDragAmount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const identityClient = new IdentityClient();
  const courtClient = new CourtClient();

  // Initial load of suggestions
  useEffect(() => {
    if (userSkills !== undefined) {
      loadSuggestions();
    }
  }, [userSkills]);

  // Cache sport details
  useEffect(() => {
    const loadSportDetails = async () => {
      const sportMap = {};
      for (const sport of sports) {
        sportMap[sport.id] = sport;
      }
      setSportDetails(sportMap);
    };

    if (sports && sports.length > 0) {
      loadSportDetails();
    }
  }, [sports]);

  // Load suggestions based on filters
  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Create filter string for API - default to undefined
      let filterStr = undefined;

      if (selectedFilters.length > 0) {
        filterStr = JSON.stringify(selectedFilters);
      }

      console.log("Applying filter:", filterStr);

      // Get user suggestions
      const suggestionResponse = await matchingClient.suggestions(
        1,
        10,
        filterStr
      );

      if (!suggestionResponse || suggestionResponse.length === 0) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      // Fetch detailed information for each user
      const enhancedSuggestions = await Promise.all(
        suggestionResponse.map(async (suggestion) => {
          try {
            // Fetch user profile details
            const userProfile = await identityClient.profile(suggestion.id);

            // Fetch sport details and merge them
            const enhancedSports = await Promise.all(
              suggestion.sports.map(async (sport) => {
                let sportInfo = sportDetails[sport.sportId];

                // If sport not in our cache, fetch it
                if (!sportInfo) {
                  try {
                    sportInfo = await courtClient.getSportById(sport.sportId);
                  } catch (err) {
                    console.error("Error fetching sport:", err);
                    sportInfo = { name: "Unknown Sport" };
                  }
                }

                return {
                  ...sport,
                  sportName: sportInfo?.name || "Unknown Sport",
                  sportIcon: sportInfo?.icon,
                };
              })
            );

            // Combine all data
            return {
              id: suggestion.id,
              fullName: `${userProfile.firstName || ""} ${
                userProfile.lastName || ""
              }`.trim(),
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              email: userProfile.email,
              phone: userProfile.phone,
              gender: userProfile.gender,
              birthDate: userProfile.birthDate,
              selfIntroduction: userProfile.selfIntroduction,
              avatarUrl: userProfile.avatarUrl,
              imageUrls: userProfile.imageUrls || [],
              sports: enhancedSports,
            };
          } catch (err) {
            console.error("Error enhancing suggestion:", err);
            return null;
          }
        })
      );

      // Filter out any failed fetches
      const validSuggestions = enhancedSuggestions.filter((s) => s !== null);
      setSuggestions(validSuggestions);
      console.log("Loaded suggestions:", validSuggestions);
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

  // Show profile preview
  const handleShowProfile = (player) => {
    setLoadingDetails(true);

    // We could fetch additional details here if needed
    setPreviewProfile(player);

    setTimeout(() => {
      setLoadingDetails(false);
    }, 500);
  };

  // Close profile preview
  const handleClosePreview = () => {
    setPreviewProfile(null);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Age calculator
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
          <Box
            sx={{
              position: "relative",
              height: 550,
              maxWidth: 600,
              mx: "auto",
              overflow: "visible",
            }}
          >
            {suggestions.length > 0 &&
              suggestions.map(
                (player, index) =>
                  index === activeIndex && (
                    <motion.div
                      key={player.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDrag={(_, info) => {
                        const x = info.offset.x;
                        setDragAmount(Math.abs(x) / 100);
                        setDragDirection(x > 0 ? "right" : "left");
                      }}
                      onDragEnd={(_, info) => {
                        const x = info.offset.x;
                        if (Math.abs(x) > 100) {
                          // Swipe threshold met
                          if (x > 0) {
                            handleSwipe("right", player, activeIndex);
                          } else {
                            handleSwipe("left", player, activeIndex);
                          }
                          setActiveIndex((prev) =>
                            Math.min(prev + 1, suggestions.length - 1)
                          );
                        }
                        setDragDirection(null);
                        setDragAmount(0);
                      }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        zIndex: 10,
                        rotate: dragDirection
                          ? dragDirection === "right"
                            ? dragAmount * 15
                            : -dragAmount * 15
                          : 0,
                        x: dragDirection
                          ? dragDirection === "right"
                            ? dragAmount * 50
                            : -dragAmount * 50
                          : 0,
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          overflow: "hidden",
                          height: "100%",
                          position: "relative",
                          boxShadow: dragDirection
                            ? dragDirection === "right"
                              ? `0 10px 20px rgba(59, 177, 90, ${
                                  dragAmount * 0.5
                                })`
                              : `0 10px 20px rgba(225, 70, 70, ${
                                  dragAmount * 0.5
                                })`
                            : "0 8px 32px rgba(0,0,0,0.15)",
                        }}
                      >
                        {/* Left reject indicator */}
                        <SwipeIndicator
                          direction="left"
                          opacity={dragDirection === "left" ? dragAmount : 0}
                        >
                          <IndicatorIcon direction="left">
                            <CloseOutlined />
                          </IndicatorIcon>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#E14646",
                              fontWeight: "bold",
                              textShadow: "0 0 10px rgba(255,255,255,0.8)",
                            }}
                          >
                            Bỏ qua
                          </Typography>
                        </SwipeIndicator>

                        {/* Right match indicator */}
                        <SwipeIndicator
                          direction="right"
                          opacity={dragDirection === "right" ? dragAmount : 0}
                        >
                          <IndicatorIcon direction="right">
                            <HeartFilled />
                          </IndicatorIcon>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#3BB15A",
                              fontWeight: "bold",
                              textShadow: "0 0 10px rgba(255,255,255,0.8)",
                            }}
                          >
                            Ghép trận
                          </Typography>
                        </SwipeIndicator>

                        <ProfileImageCarousel
                          images={[
                            player.avatarUrl,
                            ...(player.imageUrls || []),
                          ].filter(Boolean)}
                          name={player.fullName}
                        />

                        <CardContent sx={{ textAlign: "center", pt: 3 }}>
                          {/* Card content from CardDetails */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              sx={{ mr: 1 }}
                            >
                              {player.fullName}
                            </Typography>
                            {player.gender &&
                              (player.gender === "Male" ? (
                                <ManOutlined style={{ color: "#1890ff" }} />
                              ) : player.gender === "Female" ? (
                                <WomanOutlined style={{ color: "#eb2f96" }} />
                              ) : null)}
                          </Box>

                          {player.birthDate && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {calculateAge(player.birthDate)} tuổi
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            {player.sports?.map((sport) => (
                              <SkillChip
                                key={sport.sportId}
                                icon={<TrophyOutlined />}
                                label={`${sport.sportName}: ${sport.skillLevel}`}
                                color="primary"
                                size="small"
                              />
                            ))}
                          </Box>

                          {player.selfIntroduction && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 3 }}
                            >
                              {player.selfIntroduction?.substring(0, 120)}
                              {player.selfIntroduction?.length > 120
                                ? "..."
                                : ""}
                            </Typography>
                          )}

                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowProfile(player);
                            }}
                            startIcon={<InfoCircleOutlined />}
                            sx={{
                              borderRadius: "20px",
                              transition: "all 0.2s",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
              )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 4,
              mb: 2,
            }}
          >
            <ActionButton
              color="reject"
              onClick={() => {
                if (suggestions.length > activeIndex) {
                  // Manually trigger swipe left
                  handleSwipe("left", suggestions[activeIndex], activeIndex);
                  setActiveIndex((prev) =>
                    Math.min(prev + 1, suggestions.length - 1)
                  );
                }
              }}
            >
              <CloseOutlined style={{ fontSize: 24 }} />
            </ActionButton>

            <ActionButton
              color="like"
              onClick={() => {
                if (suggestions.length > activeIndex) {
                  // Manually trigger swipe right
                  handleSwipe("right", suggestions[activeIndex], activeIndex);
                  setActiveIndex((prev) =>
                    Math.min(prev + 1, suggestions.length - 1)
                  );
                }
              }}
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        {loadingDetails ? (
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          </DialogContent>
        ) : (
          previewProfile && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={previewProfile.avatarUrl}
                    sx={{
                      width: 60,
                      height: 60,
                      border: "2px solid #f0f0f0",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <UserOutlined />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {previewProfile.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {previewProfile.gender === "Male"
                        ? "Nam"
                        : previewProfile.gender === "Female"
                        ? "Nữ"
                        : "Khác"}
                      {previewProfile.birthDate &&
                        ` • ${calculateAge(previewProfile.birthDate)} tuổi`}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>

              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        pb: 1,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Thông tin cá nhân
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {previewProfile.email && (
                        <ProfileDetail>
                          <MailOutlined /> {previewProfile.email}
                        </ProfileDetail>
                      )}

                      {previewProfile.phone && (
                        <ProfileDetail>
                          <PhoneOutlined /> {previewProfile.phone}
                        </ProfileDetail>
                      )}

                      {previewProfile.birthDate && (
                        <ProfileDetail>
                          <CalendarOutlined />{" "}
                          {formatDate(previewProfile.birthDate)}
                        </ProfileDetail>
                      )}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        mt: 3,
                        pb: 1,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Giới thiệu
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {previewProfile.selfIntroduction ||
                        "Người chơi chưa thêm thông tin giới thiệu"}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        mt: 3,
                        pb: 1,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Kỹ năng thể thao
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {previewProfile.sports?.map((sport) => (
                        <SkillChip
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
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        pb: 1,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Hình ảnh
                    </Typography>

                    {previewProfile.avatarUrl ||
                    (previewProfile.imageUrls &&
                      previewProfile.imageUrls.length > 0) ? (
                      <ImageList cols={2} gap={8}>
                        {previewProfile.avatarUrl && (
                          <ImageListItem>
                            <img
                              src={previewProfile.avatarUrl}
                              alt="Avatar"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </ImageListItem>
                        )}

                        {previewProfile.imageUrls?.map((imageUrl, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={imageUrl}
                              alt={`Profile image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    ) : (
                      <Typography variant="body2">
                        Người chơi chưa thêm hình ảnh
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleClosePreview}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  Đóng
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HeartFilled />}
                  onClick={() => {
                    handleClosePreview();
                    handleSwipe(
                      "right",
                      suggestions.find((p) => p.id === previewProfile.id),
                      activeIndex
                    );
                    setActiveIndex((prev) =>
                      Math.min(prev + 1, suggestions.length - 1)
                    );
                  }}
                  sx={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 8px rgba(0,128,0,0.2)",
                    "&:hover": {
                      boxShadow: "0 6px 12px rgba(0,128,0,0.3)",
                    },
                  }}
                >
                  Ghép trận ngay
                </Button>
              </DialogActions>
            </>
          )
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
