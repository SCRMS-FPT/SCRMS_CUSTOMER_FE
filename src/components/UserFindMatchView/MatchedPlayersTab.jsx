import React, { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import SportIcon from "@/components/SportIcon";

// Styled components
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

function MatchedPlayersTab({ matchingClient }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all matches
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await matchingClient.getMatches(page, 10);
        setMatches(response.items || []);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]);
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
        ) : matches.length === 0 ? (
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
                {matches.map((match) => (
                  <Grid item xs={12} sm={6} md={4} key={match.id}>
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
                                gap: 1,
                                mt: 1,
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

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {match.matchedUser.selfIntroduction ||
                              "Người chơi này chưa có giới thiệu."}
                          </Typography>
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
    </Box>
  );
}

export default MatchedPlayersTab;
