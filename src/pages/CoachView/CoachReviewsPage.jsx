import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Rating,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Badge,
  Modal,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Comment as CommentIcon,
  Flag as FlagIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
  Report as ReportIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Client as ReviewClient,
  ReplyToReviewRequest,
  FlagReviewRequest,
} from "@/API/ReviewApi";
import { styled } from "@mui/material/styles";

// Styled components
const ReviewCard = styled(motion(Card))(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const ReviewHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  border: "2px solid #fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}));

const ReviewContent = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(0),
}));

const ReviewActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ReplyArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px dashed ${theme.palette.divider}`,
}));

// Fix the error by ensuring a default value when theme.palette.action.hover is undefined
const ReplyCard = styled(Box)(({ theme }) => ({
  background: theme.palette?.action?.hover || "#f5f5f5",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  position: "relative",
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90%",
  backgroundColor: theme.palette?.background?.paper || "#fff",
  borderRadius: 8,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
  padding: theme.spacing(4),
}));

const FilterBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  overflowX: "auto",
  padding: theme.spacing(0.5, 0),
  "&::-webkit-scrollbar": {
    height: 6,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.divider,
    borderRadius: 3,
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: "#FFB400",
  },
  "& .MuiRating-iconEmpty": {
    color: "#FFB400",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette?.background?.paper || "#fff"}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

// Empty state component
const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
}));

function CoachReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // API uses 0-based pagination
  const [hasMore, setHasMore] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flaggedReviewId, setFlaggedReviewId] = useState(null);
  const [flagReason, setFlagReason] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [filter, setFilter] = useState("all");

  const reviewClient = new ReviewClient();
  const limit = 5;
  const theme = useTheme();
  const loadMoreRef = useRef(null);

  // Fetch reviews on component mount and when page changes
  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  // Fetch reviews from API
  const fetchReviews = async () => {
    if (page === 0) {
      setLoading(true);
      setReviews([]);
    }

    try {
      // Convert from 0-based to 1-based pagination when calling API
      const response = await reviewClient.getSelfReviewsByCoach(
        page + 1,
        limit
      );

      if (page === 0) {
        setReviews(response.data || []);
      } else {
        setReviews((prev) => [...prev, ...(response.data || [])]);
      }

      setHasMore((response.data || []).length === limit);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle reply to review
  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const replyRequest = new ReplyToReviewRequest({
        replyText: replyText.trim(),
      });

      await reviewClient.replyToReview(reviewId, replyRequest);

      // Update local state to show the new reply
      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            return {
              ...review,
              replies: [
                ...(review.replies || []),
                {
                  id: Date.now().toString(), // Temporary ID
                  replyText: replyText.trim(),
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
          return review;
        })
      );

      setReplyText("");
      setActiveReplyId(null);
      setSubmitSuccess("Phản hồi đã được gửi thành công!");

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (err) {
      console.error("Error replying to review:", err);
      setError("Không thể gửi phản hồi. Vui lòng thử lại.");

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle flagging a review
  const handleFlagReview = async () => {
    if (!flaggedReviewId || !flagReason.trim()) return;

    setSubmitting(true);
    try {
      const flagRequest = new FlagReviewRequest({
        flagReason: flagReason.trim(),
      });

      await reviewClient.flagReview(flaggedReviewId, flagRequest);

      setFlagModalOpen(false);
      setFlaggedReviewId(null);
      setFlagReason("");
      setSubmitSuccess("Báo cáo đã được gửi thành công!");

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (err) {
      console.error("Error flagging review:", err);
      setError("Không thể gửi báo cáo. Vui lòng thử lại.");

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Open flag modal
  const openFlagModal = (reviewId) => {
    setFlaggedReviewId(reviewId);
    setFlagModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    if (filter !== newFilter) {
      setFilter(newFilter);
      setPage(0);
      setReviews([]);
    }
  };

  // Filter reviews based on rating
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "neutral") return review.rating === 3;
    if (filter === "negative") return review.rating <= 2;
    return true;
  });

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Đánh giá từ khách hàng
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Quản lý và phản hồi đánh giá từ người học của bạn
          </Typography>
        </Box>
      </motion.div>

      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert severity="success" sx={{ mb: 3 }}>
            {submitSuccess}
          </Alert>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <FilterBox>
          <Chip
            label="Tất cả"
            color={filter === "all" ? "primary" : "default"}
            onClick={() => handleFilterChange("all")}
            sx={{ fontWeight: filter === "all" ? "bold" : "normal" }}
          />
          <Chip
            label="Tích cực (4-5 sao)"
            color={filter === "positive" ? "success" : "default"}
            onClick={() => handleFilterChange("positive")}
            sx={{ fontWeight: filter === "positive" ? "bold" : "normal" }}
          />
          <Chip
            label="Trung bình (3 sao)"
            color={filter === "neutral" ? "warning" : "default"}
            onClick={() => handleFilterChange("neutral")}
            sx={{ fontWeight: filter === "neutral" ? "bold" : "normal" }}
          />
          <Chip
            label="Tiêu cực (1-2 sao)"
            color={filter === "negative" ? "error" : "default"}
            onClick={() => handleFilterChange("negative")}
            sx={{ fontWeight: filter === "negative" ? "bold" : "normal" }}
          />
        </FilterBox>
      </Paper>

      {loading && page === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredReviews.length > 0 ? (
        <AnimatePresence>
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewHeader>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={review.verified ? "dot" : "standard"}
                >
                  <StyledAvatar
                    src={review.reviewerAvatarUrl}
                    alt={review.reviewerName || "User"}
                  >
                    <PersonIcon />
                  </StyledAvatar>
                </StyledBadge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {review.reviewerName || "Người dùng ẩn danh"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StyledRating
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      icon={<StarIcon fontSize="inherit" />}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      size="small"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  size="small"
                  label={
                    review.rating >= 4
                      ? "Tích cực"
                      : review.rating === 3
                      ? "Trung bình"
                      : "Tiêu cực"
                  }
                  color={
                    review.rating >= 4
                      ? "success"
                      : review.rating === 3
                      ? "warning"
                      : "error"
                  }
                  sx={{ fontWeight: "500" }}
                />
              </ReviewHeader>

              <ReviewContent>
                <Typography variant="body1" paragraph>
                  {review.comment}
                </Typography>

                {/* Display existing replies */}
                {review.replies && review.replies.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    {review.replies.map((reply) => (
                      <ReplyCard key={reply.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <ReplyIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                          <Typography variant="subtitle2" fontWeight="medium">
                            Phản hồi của bạn
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {formatDate(reply.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {reply.replyText}
                        </Typography>
                      </ReplyCard>
                    ))}
                  </Box>
                )}

                {/* Reply form */}
                <ReviewActions>
                  {activeReplyId === review.id ? (
                    <ReplyArea>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Viết phản hồi của bạn..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={submitting}
                        variant="outlined"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText("");
                          }}
                          disabled={submitting}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<SendIcon />}
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim() || submitting}
                        >
                          {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                        </Button>
                      </Box>
                    </ReplyArea>
                  ) : (
                    <>
                      <Button
                        size="small"
                        startIcon={<CommentIcon />}
                        onClick={() => setActiveReplyId(review.id)}
                        sx={{
                          borderRadius: 20,
                          px: 2,
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        Phản hồi
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<FlagIcon />}
                        onClick={() => openFlagModal(review.id)}
                        sx={{
                          borderRadius: 20,
                          px: 2,
                          "&:hover": {
                            backgroundColor: "error.lighter",
                          },
                        }}
                      >
                        Báo cáo
                      </Button>
                    </>
                  )}
                </ReviewActions>
              </ReviewContent>
            </ReviewCard>
          ))}
        </AnimatePresence>
      ) : (
        <EmptyState>
          <CommentIcon
            sx={{ fontSize: 60, color: "text.secondary", opacity: 0.3, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có đánh giá nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Khi học viên đánh giá về bạn, các đánh giá sẽ xuất hiện ở đây.
          </Typography>
        </EmptyState>
      )}

      {/* Loading indicator for pagination */}
      {loading && page > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      {/* Invisible element for intersection observer */}
      {hasMore && !loading && <Box ref={loadMoreRef} sx={{ height: 20 }} />}

      {/* Flag Review Modal */}
      <Modal
        open={flagModalOpen}
        onClose={() => {
          setFlagModalOpen(false);
          setFlaggedReviewId(null);
          setFlagReason("");
        }}
      >
        <ModalBox>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Báo cáo đánh giá
            </Typography>
            <IconButton
              onClick={() => {
                setFlagModalOpen(false);
                setFlaggedReviewId(null);
                setFlagReason("");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Vui lòng cho chúng tôi biết lý do bạn cho rằng đánh giá này không
            phù hợp. Nhóm quản trị sẽ xem xét báo cáo của bạn.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Lý do báo cáo..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            disabled={submitting}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFlagModalOpen(false);
                setFlaggedReviewId(null);
                setFlagReason("");
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<ReportIcon />}
              onClick={handleFlagReview}
              disabled={!flagReason.trim() || submitting}
            >
              {submitting ? "Đang gửi..." : "Báo cáo"}
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </Container>
  );
}

export default CoachReviewsPage;
