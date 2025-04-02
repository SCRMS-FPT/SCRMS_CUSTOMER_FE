import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Fade,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SportIcon from "@/components/SportIcon";
import { RespondRequest } from "@/API/MatchingApi";

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

function PendingMatchesTab({ matchingClient }) {
  const [loading, setLoading] = useState(true);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [respondingTo, setRespondingTo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch pending matches
  useEffect(() => {
    const fetchPendingMatches = async () => {
      setLoading(true);
      try {
        const response = await matchingClient.getPendingSwipes();
        setPendingMatches(response || []);
      } catch (error) {
        console.error("Error fetching pending matches:", error);
        setPendingMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingMatches();
  }, [matchingClient, refreshKey]);

  const handleRespond = async (swipeId, decision) => {
    setRespondingTo(swipeId);
    try {
      await matchingClient.respondToSwipe(
        new RespondRequest({
          swipeActionId: swipeId,
          decision,
        })
      );

      // Refresh the list after response
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error responding to match:", error);
    } finally {
      setRespondingTo(null);
    }
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
        ) : pendingMatches.length === 0 ? (
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
              {pendingMatches.map((match) => (
                <Grid item xs={12} md={6} key={match.id}>
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
                              <Chip
                                icon={
                                  <SportIcon
                                    sport={match.sportName}
                                    size={16}
                                  />
                                }
                                label={match.sportName}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Chip
                                icon={<TrophyOutlined />}
                                label={match.skillLevel}
                                size="small"
                                variant="outlined"
                                color={
                                  match.skillLevel === "Beginner"
                                    ? "info"
                                    : match.skillLevel === "Intermediate"
                                    ? "success"
                                    : match.skillLevel === "Advanced"
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </Box>
                          </Box>
                        </Box>

                        {match.message && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {match.message}
                            </Typography>
                          </>
                        )}
                      </MatchContent>

                      <MatchActions>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseCircleOutlined />}
                          onClick={() => handleRespond(match.id, "reject")}
                          disabled={respondingTo === match.id}
                        >
                          Từ chối
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={
                            respondingTo === match.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleOutlined />
                            )
                          }
                          onClick={() => handleRespond(match.id, "accept")}
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
    </Box>
  );
}

export default PendingMatchesTab;
