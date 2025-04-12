import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  UserOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SportIcon from "@/components/SportIcon";
import { RespondRequest } from "@/API/MatchingApi";
import { Client as IdentityClient } from "@/API/IdentityApi";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  margin: theme.spacing(0, 0, 3, 0),
}));

const PendingMatchItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
}));

const MatchHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
  color: "#fff",
}));

const MatchContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const MatchActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2, 2, 2),
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case "pending":
        return theme.palette.warning.main;
      case "accepted":
        return theme.palette.success.main;
      case "rejected":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    backgroundColor: getColor(),
    color: "#fff",
    fontWeight: "bold",
  };
});

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
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

function PendingMatchesTab({ matchingClient }) {
  const [loading, setLoading] = useState(true);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [respondingTo, setRespondingTo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingWithDetails, setPendingWithDetails] = useState([]);
  const [detailedViewOpen, setDetailedViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const identityClient = new IdentityClient();
  const navigate = useNavigate();

  // Fetch pending matches
  useEffect(() => {
    const fetchPendingMatches = async () => {
      setLoading(true);
      try {
        // Get basic pending swipes data
        const response = await matchingClient.getPendingSwipes();
        const pendingData = response || [];
        setPendingMatches(pendingData);

        // Fetch detailed user information for each swiper
        if (pendingData.length > 0) {
          const detailedPending = await Promise.all(
            pendingData.map(async (swipe) => {
              try {
                // Get user profile details
                const userProfile = await identityClient.profile(
                  swipe.swiperId
                );

                return {
                  id: swipe.swiperId,
                  swipeActionId: swipe.swipeActionId, // Store correct swipeActionId
                  createdAt: swipe.createdAt,
                  senderName: `${userProfile.firstName} ${userProfile.lastName}`,
                  senderAvatar:
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
                };
              } catch (error) {
                console.error(
                  `Error fetching details for user ${swipe.swiperId}:`,
                  error
                );
                return {
                  id: swipe.swiperId,
                  swipeActionId: swipe.swipeActionId, // Still store the correct ID
                  createdAt: swipe.createdAt,
                  senderName: "Unknown User",
                  senderAvatar: null,
                };
              }
            })
          );

          setPendingWithDetails(detailedPending);
        } else {
          setPendingWithDetails([]);
        }
      } catch (error) {
        console.error("Error fetching pending matches:", error);
        setPendingMatches([]);
        setPendingWithDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingMatches();
  }, [matchingClient, refreshKey]);

  const handleRespond = async (swipeId, decision) => {
    setRespondingTo(swipeId);
    try {
      const response = await matchingClient.respondToSwipe(
        new RespondRequest({
          swipeActionId: swipeId,
          decision,
        })
      );

      // If accepted, navigate to the messenger
      if (decision === "accepted") {
        // The response should include the new match ID
        if (response && response.matchId) {
          navigate(`/messenger/${response.matchId}`);
        } else {
          // Refresh the list after response
          setRefreshKey((prev) => prev + 1);
        }
      } else {
        // Refresh the list after response
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error responding to match:", error);
    } finally {
      setRespondingTo(null);
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
  const handleOpenDetailedView = (user) => {
    setSelectedUser(user);
    setDetailedViewOpen(true);
  };

  // Close detailed view
  const handleCloseDetailedView = () => {
    setDetailedViewOpen(false);
    setSelectedUser(null);
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
          <TeamOutlined /> Lời mời ghép trận
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Danh sách người chơi đã thích bạn và đang chờ phản hồi
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : pendingWithDetails.length === 0 ? (
          <EmptyState>
            <FieldTimeOutlined
              style={{ fontSize: 60, opacity: 0.3, marginBottom: 16 }}
            />
            <Typography variant="h6">Không có lời mời ghép trận nào</Typography>
            <Typography variant="body2" color="text.secondary">
              Khi có người chơi thích bạn, họ sẽ xuất hiện ở đây
            </Typography>
          </EmptyState>
        ) : (
          <AnimatePresence>
            <Grid container spacing={2}>
              {pendingWithDetails.map((match) => (
                <Grid
                  key={match.id}
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PendingMatchItem>
                      <MatchHeader>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            Lời mời từ {match.senderName}
                          </Typography>
                          <StatusChip
                            label="Đang chờ"
                            status="pending"
                            icon={<FieldTimeOutlined />}
                            size="small"
                          />
                        </Box>
                      </MatchHeader>

                      <MatchContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            src={match.senderAvatar}
                            sx={{ width: 64, height: 64 }}
                          >
                            <UserOutlined />
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {match.senderName}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                mt: 0.5,
                              }}
                            >
                              {match.gender && (
                                <Chip
                                  label={
                                    match.gender === "Male"
                                      ? "Nam"
                                      : match.gender === "Female"
                                      ? "Nữ"
                                      : "Khác"
                                  }
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              )}

                              {match.birthDate && (
                                <Chip
                                  icon={<CalendarOutlined />}
                                  label={`${calculateAge(
                                    match.birthDate
                                  )} tuổi`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}

                              {match.sports && match.sports.length > 0 && (
                                <Chip
                                  icon={<TrophyOutlined />}
                                  label={`${match.sports.length} môn thể thao`}
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        {match.selfIntroduction && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {match.selfIntroduction.length > 100
                                ? `${match.selfIntroduction.substring(
                                    0,
                                    100
                                  )}...`
                                : match.selfIntroduction}
                            </Typography>
                          </>
                        )}

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
                      </MatchContent>

                      <MatchActions>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseCircleOutlined />}
                          onClick={() =>
                            handleRespond(match.swipeActionId, "reject")
                          }
                          disabled={respondingTo === match.swipeActionId}
                        >
                          Từ chối
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={
                            respondingTo === match.swipeActionId ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleOutlined />
                            )
                          }
                          onClick={() => handleRespond(match.id, "accepted")}
                          disabled={respondingTo === match.id}
                        >
                          Chấp nhận
                        </Button>
                      </MatchActions>
                    </PendingMatchItem>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
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
        {selectedUser && (
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
                    src={selectedUser.senderAvatar}
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
                      {selectedUser.senderName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.gender === "Male"
                        ? "Nam"
                        : selectedUser.gender === "Female"
                        ? "Nữ"
                        : "Khác"}
                      {selectedUser.birthDate &&
                        ` • ${calculateAge(selectedUser.birthDate)} tuổi`}
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
                    {selectedUser.email && (
                      <ProfileDetail>
                        <MailOutlined /> {selectedUser.email}
                      </ProfileDetail>
                    )}

                    {selectedUser.phone && (
                      <ProfileDetail>
                        <PhoneOutlined /> {selectedUser.phone}
                      </ProfileDetail>
                    )}

                    {selectedUser.birthDate && (
                      <ProfileDetail>
                        <CalendarOutlined />{" "}
                        {formatDate(selectedUser.birthDate)}
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
                    {selectedUser.selfIntroduction ||
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
                    {selectedUser.sports?.map((sport) => (
                      <Chip
                        key={sport.sportId}
                        icon={<TrophyOutlined />}
                        label={`${sport.sportName}: ${sport.skillLevel}`}
                        color="primary"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    {(!selectedUser.sports ||
                      selectedUser.sports.length === 0) && (
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

                  {selectedUser.imageUrls &&
                  selectedUser.imageUrls.length > 0 ? (
                    <ImageList cols={2} gap={8}>
                      {selectedUser.imageUrls.map((imageUrl, index) => (
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
                color="error"
                onClick={() => {
                  handleRespond(selectedUser.swipeActionId, "reject");
                  handleCloseDetailedView();
                }}
                startIcon={<CloseCircleOutlined />}
                yy
                sx={{
                  borderRadius: "20px",
                }}
              >
                Từ chối
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleOutlined />}
                onClick={() => {
                  handleRespond(selectedUser.swipeActionId, "accepted");
                  handleCloseDetailedView();
                }}
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 8px rgba(0,128,0,0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 12px rgba(0,128,0,0.3)",
                  },
                }}
              >
                Chấp nhận
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default PendingMatchesTab;
