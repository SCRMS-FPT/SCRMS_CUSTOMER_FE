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
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on 'Forgot Password' at the login screen and following the instructions.",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "You can contact our support team via email at support@courtsite.com or call us at (123) 456-7890.",
    },
    {
      question: "How do I change my account details?",
      answer:
        "Go to your account settings, where you can update your email, phone number, and other details.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Refunds are available under specific conditions. Please check our refund policy for more details.",
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
        text: "Your message has been sent! We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: "Failed to send message. Please try again.",
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
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
            sx={{ mb: 1 }}
          >
            Support Center
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            We're here to help! Contact us or find answers to your questions.
          </Typography>
        </Box>

        {/* Featured Support Cards */}
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} md={4}>
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
                  Call Us
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our support team is available Mon-Fri, 9am to 5pm
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

          <Grid item xs={12} md={4}>
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
                  Email Support
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Send us an email and we'll respond within 24 hours
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

          <Grid item xs={12} md={4}>
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
                  Live Chat
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Live chat support will be available soon!
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<ChatIcon />}
                  disabled
                  size="large"
                  fullWidth
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* FAQs Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <QuestionAnswerIcon
                  color="primary"
                  fontSize="large"
                  sx={{ mr: 1.5 }}
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Frequently Asked Questions
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

            {/* Help Articles */}
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
                  Help Articles
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
                    primary="How to book a court?"
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
                    primary="Troubleshooting login issues"
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
                    primary="Understanding membership benefits"
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Contact Form */}
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <ContactSupportIcon
                  color="primary"
                  fontSize="large"
                  sx={{ mr: 1.5 }}
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Send Us a Message
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
                  label="Your Name"
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
                  label="Email Address"
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
                  label="Your Message"
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
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>

              {/* Company Location */}
              <Box mt={4}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Visit Our Office
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <LocationIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>123 Sports Street, NY, USA</Typography>
                </Box>

                {/* Map Placeholder - you could add Google Maps here */}
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
                    Map integration coming soon
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Social Media */}
        <Box mt={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Connect With Us
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
