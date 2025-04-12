import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Chat as ChatIcon,
  Article as ArticleIcon,
  Send as SendIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";

const SupportView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const faqs = [
    {
      question: "Làm thế nào để đặt lại mật khẩu của tôi?",
      answer:
        "Bạn có thể đặt lại mật khẩu bằng cách nhấp vào 'Quên mật khẩu' tại màn hình đăng nhập và làm theo hướng dẫn.",
    },
    {
      question: "Làm thế nào để liên hệ với dịch vụ khách hàng?",
      answer:
        "Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua email tại support@courtsite.com hoặc gọi cho chúng tôi theo số (123) 456-7890.",
    },
    {
      question: "Làm thế nào để thay đổi thông tin tài khoản của tôi?",
      answer:
        "Hãy vào cài đặt tài khoản của bạn, nơi bạn có thể cập nhật email, số điện thoại và các thông tin khác.",
    },
    {
      question: "Bạn có cung cấp hoàn tiền không?",
      answer:
        "Chúng tôi có chính sách hoàn tiền trong một số điều kiện cụ thể. Vui lòng kiểm tra chính sách hoàn tiền của chúng tôi để biết thêm chi tiết.",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      // Simulated API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmissionMessage({
        type: "success",
        text: "Tin nhắn của bạn đã được gửi! Chúng tôi sẽ liên hệ lại với bạn sớm.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: "Gửi tin nhắn thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(245, 247, 250, 1)",
        py: 6,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
            sx={{ mb: 1 }}
          >
            Trung Tâm Hỗ Trợ
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn! Liên hệ với chúng tôi hoặc tìm câu trả lời cho các câu hỏi của bạn.
          </Typography>
        </Box>

        <Grid container spacing={3} mb={6}>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    width: 70,
                    height: 70,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <PhoneIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Gọi Điện
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Đội ngũ hỗ trợ của chúng tôi làm việc từ Thứ 2 - Thứ 6, 9h sáng đến 5h chiều
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  size="large"
                  fullWidth
                >
                  (123) 456-7890
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "success.light",
                    width: 70,
                    height: 70,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <EmailIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Hỗ Trợ Qua Email
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Gửi email cho chúng tôi và bạn sẽ nhận được phản hồi trong vòng 24 giờ
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<EmailIcon />}
                  size="large"
                  fullWidth
                >
                  support@courtsite.com
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "warning.light",
                    width: 70,
                    height: 70,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <ChatIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Trò Chuyện Trực Tiếp
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Hỗ trợ trò chuyện trực tiếp sẽ sớm được ra mắt!
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<ChatIcon />}
                  disabled
                  size="large"
                  fullWidth
                >
                  Sắp Ra Mắt
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Cột Bên Trái */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            {/* Phần Câu Hỏi Thường Gặp */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <QuestionAnswerIcon
                  color="primary"
                  fontSize="large"
                  sx={{ mr: 1.5 }}
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Câu Hỏi Thường Gặp
                </Typography>
              </Box>

              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 1,
                    boxShadow: "none",
                    "&:before": { display: "none" },
                    borderRadius: "8px !important",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <Typography fontWeight="medium" color="primary.dark">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>

            {/* Bài Viết Hỗ Trợ */}
            <Paper
              elevation={3}
              sx={{ p: 3, mb: { xs: 4, md: 0 }, borderRadius: 2 }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <ArticleIcon
                  color="primary"
                  fontSize="large"
                  sx={{ mr: 1.5 }}
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Bài Viết Hỗ Trợ
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem
                  component={Link}
                  href="#"
                  underline="hover"
                  sx={{ color: "text.primary", py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Làm thế nào để đặt sân?"
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  href="#"
                  underline="hover"
                  sx={{ color: "text.primary", py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Khắc phục sự cố đăng nhập"
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  href="#"
                  underline="hover"
                  sx={{ color: "text.primary", py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hiểu về lợi ích thành viên"
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Cột Bên Phải */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            {/* Form Liên Hệ */}
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <ContactSupportIcon
                  color="primary"
                  fontSize="large"
                  sx={{ mr: 1.5 }}
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Gửi Tin Nhắn Cho Chúng Tôi
                </Typography>
              </Box>

              {submissionMessage && (
                <Alert
                  severity={submissionMessage.type}
                  sx={{ mb: 3 }}
                  onClose={() => setSubmissionMessage(null)}
                >
                  {submissionMessage.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Tên Của Bạn"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={isSubmitting}
                />
                <TextField
                  fullWidth
                  label="Địa Chỉ Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={isSubmitting}
                />
                <TextField
                  fullWidth
                  label="Tin Nhắn Của Bạn"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  multiline
                  rows={4}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                >
                  {isSubmitting ? "Đang Gửi..." : "Gửi Tin Nhắn"}
                </Button>
              </form>

              {/* Địa Chỉ Công Ty */}
              <Box mt={4}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Văn Phòng Chúng Tôi
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <LocationIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>123 Sports Street, NY, USA</Typography>
                </Box>

                {/* Placeholder Bản Đồ - bạn có thể thêm Google Maps tại đây */}
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 2,
                    height: 200,
                    width: "100%",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    Tích hợp bản đồ sẽ sớm ra mắt
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Mạng Xã Hội */}
        <Box mt={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Kết Nối Với Chúng Tôi
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <IconButton
              color="primary"
              aria-label="Facebook"
              component="a"
              href="#"
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <FacebookIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="info"
              aria-label="Twitter"
              component="a"
              href="#"
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <TwitterIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="secondary"
              aria-label="Instagram"
              component="a"
              href="#"
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <InstagramIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="LinkedIn"
              component="a"
              href="#"
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <LinkedInIcon fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SupportView;
