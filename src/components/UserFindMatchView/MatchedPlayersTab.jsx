import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageOutlined,
  CheckCircleFilled,
  UserOutlined,
  StarOutlined,
  TrophyOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CloseOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import SportIcon from "@/components/SportIcon";
import { Client as IdentityClient } from "@/API/IdentityApi";
import { useNavigate } from "react-router-dom";

// Styled components remain the same
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}));

const MatchCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
}));

const MatchHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundImage:
      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "0 0 0 100%",
  },
}));

const CardAvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: -32,
  position: "relative",
  zIndex: 10,
}));

const StatusBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.success.main,
  color: "#fff",
  borderRadius: "50%",
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.palette.background.paper}`,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
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

function MatchedPlayersTab({ matchingClient }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [matchesWithDetails, setMatchesWithDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailedViewOpen, setDetailedViewOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const identityClient = new IdentityClient();
  const navigate = useNavigate();

  // Fetch all matches
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await matchingClient.getMatches(page, 10);
        const matchList = response || [];
        setMatches(matchList);
        setTotalPages(response.totalPages || 1);

        // Fetch user details for each match
        if (matchList.length > 0) {
          const detailedMatches = await Promise.all(
            matchList.map(async (match) => {
              try {
                // Get user profile using partnerId
                const userProfile = await identityClient.profile(
                  match.partnerId
                );

                return {
                  id: match.id,
                  matchedDate: match.matchTime,
                  partnerId: match.partnerId,
                  matchedUser: {
                    id: match.partnerId,
                    fullName: `${userProfile.firstName} ${userProfile.lastName}`,
                    avatarUrl:
                      userProfile.imageUrls && userProfile.imageUrls.length > 0
                        ? userProfile.imageUrls[0]
                        : null,
                    email: userProfile.email,
                    phone: userProfile.phone,
                    gender: userProfile.gender,
                    birthDate: userProfile.birthDate,
                    selfIntroduction: userProfile.selfIntroduction,
                    imageUrls: userProfile.imageUrls || [],
                    sports: userProfile.sports || [],
                  },
                };
              } catch (error) {
                console.error(
                  `Error fetching details for match ${match.id}:`,
                  error
                );
                // Return basic match data if profile fetch fails
                return {
                  id: match.id,
                  matchedDate: match.matchTime,
                  partnerId: match.partnerId,
                  matchedUser: {
                    id: match.partnerId,
                    fullName: "Unknown User",
                    avatarUrl: null,
                  },
                };
              }
            })
          );

          setMatchesWithDetails(detailedMatches);
        } else {
          setMatchesWithDetails([]);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]);
        setMatchesWithDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [matchingClient, page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Open detailed view
  const handleOpenDetailedView = (match) => {
    setSelectedMatch(match);
    setDetailedViewOpen(true);
  };

  // Close detailed view
  const handleCloseDetailedView = () => {
    setDetailedViewOpen(false);
    setSelectedMatch(null);
  };

  return (
    <Box>
      <StyledPaper
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TeamOutlined /> Người chơi đã ghép
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Danh sách người chơi đã được ghép trận với bạn
        </Typography>

        {loading && page === 1 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : matchesWithDetails.length === 0 ? (
          <EmptyState>
            <TeamOutlined
              style={{ fontSize: 60, opacity: 0.3, marginBottom: 16 }}
            />
            <Typography variant="h6">
              Bạn chưa có người chơi nào được ghép
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy swipe qua các người chơi trong tab "Tìm người chơi" để bắt đầu
            </Typography>
          </EmptyState>
        ) : (
          <>
            <AnimatePresence>
              <Grid container spacing={3}>
                {matchesWithDetails.map((match) => (
                  <Grid
                    key={match.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4
                    }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      style={{ height: "100%" }}
                    >
                      <MatchCard>
                        <MatchHeader>
                          <Typography variant="subtitle2" fontWeight="medium">
                            Ghép trận thành công
                          </Typography>
                          <Typography variant="caption">
                            {new Date(match.matchedDate).toLocaleDateString()}
                          </Typography>
                        </MatchHeader>

                        <CardContent sx={{ flex: 1, pt: 0 }}>
                          <CardAvatarContainer>
                            <Avatar
                              src={match.matchedUser.avatarUrl}
                              sx={{
                                width: 80,
                                height: 80,
                                border: "4px solid white",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              }}
                            >
                              <UserOutlined />
                            </Avatar>
                            <StatusBadge>
                              <CheckCircleFilled style={{ fontSize: 14 }} />
                            </StatusBadge>
                          </CardAvatarContainer>

                          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {match.matchedUser.fullName}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              {match.matchedUser.gender && (
                                <Chip
                                  icon={
                                    match.matchedUser.gender === "Male" ? (
                                      <ManOutlined />
                                    ) : match.matchedUser.gender ===
                                      "Female" ? (
                                      <WomanOutlined />
                                    ) : null
                                  }
                                  label={
                                    match.matchedUser.gender === "Male"
                                      ? "Nam"
                                      : match.matchedUser.gender === "Female"
                                      ? "Nữ"
                                      : "Khác"
                                  }
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              )}

                              {match.matchedUser.birthDate && (
                                <Chip
                                  icon={<CalendarOutlined />}
                                  label={`${calculateAge(
                                    match.matchedUser.birthDate
                                  )} tuổi`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>

                            {match.matchedUser.sports &&
                              match.matchedUser.sports.length > 0 && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  {match.matchedUser.sports
                                    .slice(0, 2)
                                    .map((sport) => (
                                      <Chip
                                        key={sport.sportId}
                                        icon={<TrophyOutlined />}
                                        label={`${sport.sportName}: ${sport.skillLevel}`}
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        sx={{ m: 0.5 }}
                                      />
                                    ))}

                                  {match.matchedUser.sports.length > 2 && (
                                    <Chip
                                      icon={<TrophyOutlined />}
                                      label={`+${
                                        match.matchedUser.sports.length - 2
                                      } môn khác`}
                                      size="small"
                                      variant="outlined"
                                      color="info"
                                      sx={{ m: 0.5 }}
                                    />
                                  )}
                                </Box>
                              )}
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {match.matchedUser.selfIntroduction
                              ? match.matchedUser.selfIntroduction.length > 120
                                ? `${match.matchedUser.selfIntroduction.substring(
                                    0,
                                    120
                                  )}...`
                                : match.matchedUser.selfIntroduction
                              : "Người chơi này chưa có giới thiệu."}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <Button
                              size="small"
                              variant="text"
                              color="primary"
                              startIcon={<InfoCircleOutlined />}
                              onClick={() => handleOpenDetailedView(match)}
                            >
                              Xem chi tiết
                            </Button>
                          </Box>
                        </CardContent>

                        <CardActions sx={{ justifyContent: "center", p: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<MessageOutlined />}
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                            }}
                            onClick={() => navigate(`/messenger/${match.id}`)}
                          >
                            Nhắn tin
                          </Button>
                        </CardActions>
                      </MatchCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>

            {page < totalPages && (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Xem thêm"}
                </Button>
              </Box>
            )}
          </>
        )}
      </StyledPaper>
      {/* Detailed User Profile Dialog */}
      <Dialog
        open={detailedViewOpen}
        onClose={handleCloseDetailedView}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        {selectedMatch && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={selectedMatch.matchedUser.avatarUrl}
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
                      {selectedMatch.matchedUser.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMatch.matchedUser.gender === "Male"
                        ? "Nam"
                        : selectedMatch.matchedUser.gender === "Female"
                        ? "Nữ"
                        : "Khác"}
                      {selectedMatch.matchedUser.birthDate &&
                        ` • ${calculateAge(
                          selectedMatch.matchedUser.birthDate
                        )} tuổi`}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDetailedView}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
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
                    {selectedMatch.matchedUser.email && (
                      <ProfileDetail>
                        <MailOutlined /> {selectedMatch.matchedUser.email}
                      </ProfileDetail>
                    )}

                    {selectedMatch.matchedUser.phone && (
                      <ProfileDetail>
                        <PhoneOutlined /> {selectedMatch.matchedUser.phone}
                      </ProfileDetail>
                    )}

                    {selectedMatch.matchedUser.birthDate && (
                      <ProfileDetail>
                        <CalendarOutlined />{" "}
                        {formatDate(selectedMatch.matchedUser.birthDate)}
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
                    {selectedMatch.matchedUser.selfIntroduction ||
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
                    {selectedMatch.matchedUser.sports?.map((sport) => (
                      <Chip
                        key={sport.sportId}
                        icon={<TrophyOutlined />}
                        label={`${sport.sportName}: ${sport.skillLevel}`}
                        color="primary"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    {(!selectedMatch.matchedUser.sports ||
                      selectedMatch.matchedUser.sports.length === 0) && (
                      <Typography variant="body2">
                        Không có thông tin kỹ năng
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
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

                  {selectedMatch.matchedUser.imageUrls &&
                  selectedMatch.matchedUser.imageUrls.length > 0 ? (
                    <ImageList cols={2} gap={8}>
                      {selectedMatch.matchedUser.imageUrls.map(
                        (imageUrl, index) => (
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
                        )
                      )}
                    </ImageList>
                  ) : (
                    <Typography variant="body2">
                      Người chơi chưa thêm hình ảnh
                    </Typography>
                  )}

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
                    Thông tin ghép trận
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <ProfileDetail>
                      <TeamOutlined /> Ghép trận vào lúc:{" "}
                      {formatDate(selectedMatch.matchedDate)}{" "}
                      {new Date(selectedMatch.matchedDate).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </ProfileDetail>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDetailedView}
                sx={{
                  borderRadius: "20px",
                }}
              >
                Đóng
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<MessageOutlined />}
                onClick={() => navigate(`/messenger/${selectedMatch.id}`)}
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 8px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 12px rgba(33, 150, 243, 0.4)",
                  },
                }}
              >
                Nhắn tin
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

MatchedPlayersTab.propTypes = {
  matchingClient: PropTypes.object.isRequired,
};

export default MatchedPlayersTab;
