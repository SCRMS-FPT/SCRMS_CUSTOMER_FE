import { useState, useEffect } from "react";
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
  Tooltip,
  Zoom,
  Fade,
  Chip,
  alpha,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Article as ArticleIcon,
  Send as SendIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";

// Import Iconify for better icons
import { Iconify } from "@/components/iconify";

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
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Animation effect when component mounts
  const [animationComplete, setAnimationComplete] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      question: "Làm thế nào để đặt lại mật khẩu của tôi?",
      answer:
        "Bạn có thể đặt lại mật khẩu bằng cách nhấp vào 'Quên mật khẩu' tại màn hình đăng nhập và làm theo hướng dẫn.",
    },
    {
      question: "Làm thế nào để liên hệ với dịch vụ khách hàng?",
      answer:
        "Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua email tại lthang.forwork@gmail.com hoặc gọi cho chúng tôi theo số 0834398268.",
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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setActiveAccordion(isExpanded ? panel : null);
  };

  // Social media links with updated information
  const socialLinks = [
    {
      name: "Facebook",
      icon: "ic:baseline-facebook",
      color: "#1877F2",
      url: "https://www.facebook.com/lethangd/",
    },
    {
      name: "Instagram",
      icon: "mdi:instagram",
      color: "#E4405F",
      url: `https://www.instagram.com/lethangd058`,
    },
    {
      name: "LinkedIn",
      icon: "mdi:linkedin",
      color: "#0A66C2",
      url: "https://www.linkedin.com/in/l%C3%AA-th%E1%BA%AFng-249162302/",
    },
    {
      name: "Twitter",
      icon: "mdi:twitter",
      color: "#1DA1F2",
      url: "#",
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.background.default, 0.6)})`,
        py: 6,
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          backgroundImage: "url('/support-bg-pattern.svg')",
          backgroundSize: "cover",
          opacity: 0.03,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary"
              sx={{
                mb: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px",
                textShadow: "0px 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              Trung Tâm Hỗ Trợ
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
              }}
            >
              Chúng tôi luôn sẵn sàng hỗ trợ bạn! Liên hệ với chúng tôi hoặc tìm
              câu trả lời cho các câu hỏi của bạn.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} mb={6}>
          {[
            {
              icon: "solar:phone-bold-duotone",
              title: "Gọi Điện",
              description:
                "Đội ngũ hỗ trợ của chúng tôi làm việc từ Thứ 2 - Thứ 6, 9h sáng đến 5h chiều",
              action: "0834398268",
              color: theme.palette.primary.main,
              btnIcon: <PhoneIcon />,
              delay: 200,
            },
            {
              icon: "solar:letter-bold-duotone",
              title: "Hỗ Trợ Qua Email",
              description:
                "Gửi email cho chúng tôi và bạn sẽ nhận được phản hồi trong vòng 24 giờ",
              action: "lthang.forwork@gmail.com",
              color: theme.palette.success.main,
              btnIcon: <EmailIcon />,
              delay: 400,
            },
            {
              icon: "solar:chat-round-dots-bold-duotone",
              title: "Trò Chuyện Trực Tiếp",
              description: "Hỗ trợ trò chuyện trực tiếp sẽ sớm được ra mắt!",
              action: "Sắp Ra Mắt",
              color: theme.palette.warning.main,
              disabled: true,
              btnIcon: <Iconify icon="solar:chat-round-dots-bold" />,
              delay: 600,
            },
          ].map((item, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Zoom
                in={animationComplete}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <Card
                  elevation={4}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transition: "all 0.35s ease",
                    transform: "translateY(0)",
                    position: "relative",
                    overflow: "visible",
                    background: `linear-gradient(145deg, ${
                      theme.palette.background.paper
                    }, ${alpha(theme.palette.background.paper, 0.9)})`,
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: `0 14px 24px ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                      "& .contact-icon": {
                        transform: "scale(1.1) translateY(-5px)",
                        boxShadow: `0 12px 20px ${alpha(item.color, 0.3)}`,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "100%",
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(
                        item.color,
                        0.08
                      )} 0%, ${alpha(theme.palette.background.paper, 0)} 60%)`,
                      zIndex: 0,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <Avatar
                      className="contact-icon"
                      sx={{
                        bgcolor: alpha(item.color, 0.1),
                        color: item.color,
                        width: 80,
                        height: 80,
                        mb: 3,
                        mx: "auto",
                        transition:
                          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        boxShadow: `0 8px 16px ${alpha(item.color, 0.2)}`,
                        "& .MuiSvgIcon-root": {
                          fontSize: "2.5rem",
                        },
                      }}
                    >
                      <Iconify icon={item.icon} width={36} height={36} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                      sx={{
                        mb: 3,
                        minHeight: "60px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color={
                        item.color === theme.palette.primary.main
                          ? "primary"
                          : item.color === theme.palette.success.main
                          ? "success"
                          : "warning"
                      }
                      startIcon={item.btnIcon}
                      size="large"
                      disabled={item.disabled}
                      fullWidth
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        borderWidth: "1.5px",
                        fontWeight: "medium",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderWidth: "1.5px",
                          boxShadow: !item.disabled
                            ? `0 5px 10px ${alpha(item.color, 0.25)}`
                            : "none",
                          transform: !item.disabled
                            ? "translateY(-3px)"
                            : "none",
                        },
                      }}
                    >
                      {item.action}
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Cột Bên Trái - FAQ */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Fade in={animationComplete} timeout={600}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  height: "100%",
                  boxShadow: `0 5px 20px ${alpha(
                    theme.palette.common.black,
                    0.08
                  )}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 8px 25px ${alpha(
                      theme.palette.common.black,
                      0.12
                    )}`,
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <QuestionAnswerIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    Câu Hỏi Thường Gặp
                  </Typography>
                </Box>

                <Box>
                  {faqs.map((faq, index) => (
                    <Accordion
                      key={index}
                      expanded={activeAccordion === index}
                      onChange={handleAccordionChange(index)}
                      sx={{
                        mb: 1.5,
                        boxShadow: "none",
                        "&:before": { display: "none" },
                        borderRadius: "10px !important",
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor:
                          activeAccordion === index
                            ? alpha(theme.palette.primary.main, 0.5)
                            : alpha(theme.palette.divider, 0.6),
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeAccordion === index
                            ? alpha(theme.palette.primary.main, 0.05)
                            : "transparent",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <Iconify
                            icon="solar:arrow-down-bold-duotone"
                            sx={{
                              color:
                                activeAccordion === index
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary,
                              transition: "transform 0.3s ease",
                              transform:
                                activeAccordion === index
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                            }}
                          />
                        }
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.04
                            ),
                          },
                          padding: "0.7rem 1.5rem",
                        }}
                      >
                        <Typography
                          fontWeight="medium"
                          color={
                            activeAccordion === index
                              ? "primary.main"
                              : "text.primary"
                          }
                        >
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          p: "0.5rem 1.5rem 1.5rem",
                          borderTop: "1px dashed",
                          borderColor: alpha(theme.palette.divider, 0.5),
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>

                {/* Bài Viết Hỗ Trợ */}
                <Box mt={5}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        mr: 2,
                      }}
                    >
                      <ArticleIcon />
                    </Avatar>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      Bài Viết Hỗ Trợ
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2.5 }} />

                  <List disablePadding>
                    {[
                      {
                        title: "Làm thế nào để đặt sân?",
                        icon: "solar:bookmarks-bold-duotone",
                      },
                      {
                        title: "Khắc phục sự cố đăng nhập",
                        icon: "solar:lock-password-bold-duotone",
                      },
                      {
                        title: "Hiểu về lợi ích thành viên",
                        icon: "solar:user-id-bold-duotone",
                      },
                    ].map((article, idx) => (
                      <ListItem
                        key={idx}
                        component={Link}
                        href="#"
                        underline="none"
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderRadius: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            transform: "translateX(5px)",
                            "& .article-icon": {
                              color: theme.palette.primary.main,
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "44px",
                          }}
                        >
                          <Iconify
                            icon={article.icon}
                            width={24}
                            className="article-icon"
                            sx={{
                              transition: "all 0.3s ease",
                              color: theme.palette.info.main,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={article.title}
                          primaryTypographyProps={{
                            fontWeight: "medium",
                            color: "text.primary",
                          }}
                        />
                        <Iconify
                          icon="eva:arrow-ios-forward-fill"
                          width={18}
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.5,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Cột Bên Phải - Contact Form */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Fade in={animationComplete} timeout={800}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  boxShadow: `0 5px 20px ${alpha(
                    theme.palette.common.black,
                    0.08
                  )}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 8px 25px ${alpha(
                      theme.palette.common.black,
                      0.12
                    )}`,
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <ContactSupportIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    Gửi Tin Nhắn Cho Chúng Tôi
                  </Typography>
                </Box>

                {submissionMessage && (
                  <Alert
                    severity={submissionMessage.type}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        alignItems: "center",
                      },
                    }}
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
                    sx={{
                      mb: 2.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                            mr: 1.5,
                          }}
                        >
                          <Iconify icon="solar:user-bold-duotone" width={20} />
                        </Box>
                      ),
                    }}
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
                    sx={{
                      mb: 2.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                            mr: 1.5,
                          }}
                        >
                          <Iconify
                            icon="solar:letter-bold-duotone"
                            width={20}
                          />
                        </Box>
                      ),
                    }}
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
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                            mr: 1.5,
                            mt: 1.5,
                          }}
                        >
                          <Iconify
                            icon="solar:chat-round-dots-bold-duotone"
                            width={20}
                          />
                        </Box>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 20px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 10px 25px ${alpha(
                          theme.palette.primary.main,
                          0.35
                        )}`,
                        transform: "translateY(-3px)",
                      },
                    }}
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
                <Box mt={5}>
                  <Divider sx={{ my: 3 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    mb={2}
                  >
                    Văn Phòng Chúng Tôi
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          width: 36,
                          height: 36,
                          mr: 2,
                        }}
                      >
                        <LocationIcon fontSize="small" />
                      </Avatar>
                      <Typography>Khu Công Nghệ Cao Hòa Lạc, km 29</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          width: 36,
                          height: 36,
                          mr: 2,
                        }}
                      >
                        <PhoneIcon fontSize="small" />
                      </Avatar>
                      <Typography>0834398268</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          width: 36,
                          height: 36,
                          mr: 2,
                        }}
                      >
                        <EmailIcon fontSize="small" />
                      </Avatar>
                      <Typography>lthang.forwork@gmail.com</Typography>
                    </Box>
                  </Stack>

                  {/* Simple Map Placeholder */}
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 3,
                      height: 180,
                      width: "100%",
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    }}
                  >
                    <Box textAlign="center">
                      <Iconify
                        icon="solar:map-bold-duotone"
                        width={40}
                        height={40}
                        sx={{
                          color: alpha(theme.palette.text.secondary, 0.7),
                          mb: 1,
                        }}
                      />
                      <Typography color="text.secondary">
                        Tích hợp bản đồ sẽ sớm ra mắt
                      </Typography>
                      <Chip
                        label="Đang phát triển"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        {/* Social Media Section */}
        <Box mt={6} textAlign="center">
          <Fade in={animationComplete} timeout={1000}>
            <div>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Kết Nối Với Chúng Tôi
              </Typography>
              <Stack
                direction="row"
                spacing={2.5}
                justifyContent="center"
                mt={3}
              >
                {socialLinks.map((social, index) => (
                  <Tooltip
                    title={social.name}
                    key={index}
                    arrow
                    TransitionComponent={Zoom}
                    placement="top"
                  >
                    <IconButton
                      color="primary"
                      aria-label={social.name}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: alpha(social.color, 0.1),
                        color: social.color,
                        transition:
                          "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.1)",
                          bgcolor: social.color,
                          color: "#fff",
                          boxShadow: `0 5px 15px ${alpha(social.color, 0.4)}`,
                        },
                        width: 50,
                        height: 50,
                      }}
                    >
                      <Iconify icon={social.icon} width={24} height={24} />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </div>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default SupportView;
