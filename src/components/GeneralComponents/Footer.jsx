import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Divider,
  Link,
  Stack,
  Tooltip,
  List,
  ListItem,
  InputAdornment,
  Button,
  alpha,
  useTheme,
  Paper,
} from "@mui/material";

// Icons
import { Iconify } from "@/components/iconify";

// Images
import logoImg from "@/assets/logo.png";

// Footer social media links
const socialMedia = [
  {
    name: "Facebook",
    icon: "eva:facebook-fill",
    url: "https://www.facebook.com/lethangd/",
  },
  { name: "Twitter", icon: "ic:baseline-x-twitter", url: "#" },
  {
    name: "Instagram",
    icon: "eva:instagram-fill",
    url: "https://www.instagram.com/lethangd058",
  },
  {
    name: "LinkedIn",
    icon: "eva:linkedin-fill",
    url: "https://www.linkedin.com/in/l%C3%AA-th%E1%BA%AFng-249162302/",
  },
];

// Footer quick links
const footerLinks = {
  company: [
    { name: "Về chúng tôi", url: "/about" },
    { name: "Các đối tác", url: "/partners" },
    { name: "Tuyển dụng", url: "/careers" },
    { name: "Blog", url: "/blog" },
  ],
  services: [
    { name: "Tìm kiếm sân", url: "/sports-centers" },
    { name: "Gói dịch vụ", url: "/packages" },
    { name: "Đặt lịch huấn luyện", url: "/coaches" },
    { name: "Tổ chức giải đấu", url: "/tournaments" },
  ],
  support: [
    { name: "Trung tâm hỗ trợ", url: "/help-center" },
    { name: "Điều khoản dịch vụ", url: "/terms" },
    { name: "Chính sách bảo mật", url: "/privacy" },
    { name: "Liên hệ", url: "/contact" },
  ],
};

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(to bottom, #0f172a, #1e293b)`,
        color: "white",
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          right: "-5%",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.15
          )}, transparent 70%)`,
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: { xs: "200px", md: "350px" },
          height: { xs: "200px", md: "350px" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Logo and Company Info */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)`,
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 3,
                border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
                boxShadow: `0 10px 30px -5px ${alpha(
                  theme.palette.common.black,
                  0.2
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 15px 35px -5px ${alpha(
                    theme.palette.common.black,
                    0.25
                  )}`,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src={logoImg}
                  alt="Courtify"
                  sx={{
                    height: 35,
                    mr: 1.5,
                    filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))",
                  }}
                />
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight={700}
                  sx={{
                    background: "linear-gradient(90deg, #fff, #a5b4fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: 0.5,
                  }}
                >
                  Courtify
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: alpha(theme.palette.common.white, 0.75),
                  lineHeight: 1.6,
                }}
              >
                Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam, kết nối
                người chơi với các sân chơi chất lượng và huấn luyện viên chuyên
                nghiệp.
              </Typography>

              <Stack direction="column" spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: "50%",
                      p: 1,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon="solar:map-point-bold-duotone"
                      width={18}
                      sx={{ color: theme.palette.primary.light }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color={alpha(theme.palette.common.white, 0.75)}
                  >
                    Khu Công Nghệ Cao Hòa Lạc, km 29
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: "50%",
                      p: 1,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon="solar:phone-bold-duotone"
                      width={18}
                      sx={{ color: theme.palette.primary.light }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color={alpha(theme.palette.common.white, 0.75)}
                  >
                    0834398268
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: "50%",
                      p: 1,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon="solar:letter-bold-duotone"
                      width={18}
                      sx={{ color: theme.palette.primary.light }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color={alpha(theme.palette.common.white, 0.75)}
                  >
                    lthang.forwork@gmail.com
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} mt={3}>
                {socialMedia.map((item) => (
                  <Tooltip
                    key={item.name}
                    title={item.name}
                    placement="top"
                    arrow
                  >
                    <IconButton
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.1),
                        color: "white",
                        backdropFilter: "blur(10px)",
                        width: 36,
                        height: 36,
                        "&:hover": {
                          bgcolor: theme.palette.primary.main,
                          transform: "translateY(-5px)",
                          boxShadow: `0 5px 15px ${alpha(
                            theme.palette.primary.main,
                            0.4
                          )}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Iconify icon={item.icon} width={18} height={18} />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    position: "relative",
                    fontWeight: 600,
                    color: theme.palette.common.white,
                    pb: 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: 40,
                      height: 2,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                    },
                  }}
                >
                  Công ty
                </Typography>
                <List
                  disablePadding
                  sx={{
                    mt: 1.5,
                    "& .MuiListItem-root": {
                      p: 0,
                      mb: 1,
                    },
                  }}
                >
                  {footerLinks.company.map((link) => (
                    <ListItem key={link.name}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        sx={{
                          color: alpha(theme.palette.common.white, 0.7),
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                          textDecoration: "none",
                          "&:hover": {
                            color: theme.palette.common.white,
                            transform: "translateX(5px)",
                            "& .arrow-icon": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <Iconify
                          icon="eva:chevron-right-fill"
                          width={14}
                          height={14}
                          className="arrow-icon"
                          sx={{
                            mr: 0.7,
                            opacity: 0,
                            transform: "translateX(-5px)",
                            transition: "all 0.2s",
                            color: theme.palette.primary.main,
                          }}
                        />
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    position: "relative",
                    fontWeight: 600,
                    color: theme.palette.common.white,
                    pb: 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: 40,
                      height: 2,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                    },
                  }}
                >
                  Dịch vụ
                </Typography>
                <List
                  disablePadding
                  sx={{
                    mt: 1.5,
                    "& .MuiListItem-root": {
                      p: 0,
                      mb: 1,
                    },
                  }}
                >
                  {footerLinks.services.map((link) => (
                    <ListItem key={link.name}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        sx={{
                          color: alpha(theme.palette.common.white, 0.7),
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                          textDecoration: "none",
                          "&:hover": {
                            color: theme.palette.common.white,
                            transform: "translateX(5px)",
                            "& .arrow-icon": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <Iconify
                          icon="eva:chevron-right-fill"
                          width={14}
                          height={14}
                          className="arrow-icon"
                          sx={{
                            mr: 0.7,
                            opacity: 0,
                            transform: "translateX(-5px)",
                            transition: "all 0.2s",
                            color: theme.palette.primary.main,
                          }}
                        />
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    position: "relative",
                    fontWeight: 600,
                    color: theme.palette.common.white,
                    pb: 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: 40,
                      height: 2,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                    },
                  }}
                >
                  Hỗ trợ
                </Typography>
                <List
                  disablePadding
                  sx={{
                    mt: 1.5,
                    "& .MuiListItem-root": {
                      p: 0,
                      mb: 1,
                    },
                  }}
                >
                  {footerLinks.support.map((link) => (
                    <ListItem key={link.name}>
                      <Link
                        component={RouterLink}
                        to={link.url}
                        sx={{
                          color: alpha(theme.palette.common.white, 0.7),
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                          textDecoration: "none",
                          "&:hover": {
                            color: theme.palette.common.white,
                            transform: "translateX(5px)",
                            "& .arrow-icon": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <Iconify
                          icon="eva:chevron-right-fill"
                          width={14}
                          height={14}
                          className="arrow-icon"
                          sx={{
                            mr: 0.7,
                            opacity: 0,
                            transform: "translateX(-5px)",
                            transition: "all 0.2s",
                            color: theme.palette.primary.main,
                          }}
                        />
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Grid>

          {/* Newsletter */}
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)`,
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 3,
                border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.common.white,
                  mb: 0.5,
                }}
              >
                Đăng ký thông tin
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: alpha(theme.palette.common.white, 0.75),
                  lineHeight: 1.6,
                }}
              >
                Nhận thông tin mới nhất về các khuyến mãi và sự kiện
              </Typography>

              <Box
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{ mb: 2 }}
              >
                <TextField
                  fullWidth
                  placeholder="Email của bạn"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    backgroundColor: alpha(theme.palette.common.white, 0.06),
                    borderRadius: 2,
                    ".MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: alpha(theme.palette.common.white, 0.1),
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.common.white,
                      fontSize: "0.9rem",
                      py: 1.5,
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: `0 5px 15px ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                    "&:hover": {
                      background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: `0 8px 25px ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                    },
                  }}
                  endIcon={<Iconify icon="solar:arrow-right-bold-duotone" />}
                >
                  Đăng ký ngay
                </Button>
              </Box>

              <Box
                sx={{
                  mt: "auto",
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                  borderRadius: 2,
                }}
              >
                <Iconify
                  icon="solar:shield-check-bold-duotone"
                  width={22}
                  sx={{
                    color: theme.palette.primary.light,
                    mr: 1.5,
                  }}
                />
                <Typography
                  variant="caption"
                  color={alpha(theme.palette.common.white, 0.7)}
                >
                  Chúng tôi cam kết giữ thông tin cá nhân của bạn an toàn
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider and Copyright */}
        <Divider
          sx={{ my: 5, borderColor: alpha(theme.palette.common.white, 0.1) }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            color={alpha(theme.palette.common.white, 0.6)}
          >
            © {new Date().getFullYear()}{" "}
            <Typography
              component="span"
              variant="body2"
              color={theme.palette.primary.light}
              sx={{ fontWeight: 600 }}
            >
              Courtify
            </Typography>
            . Tất cả quyền được bảo lưu.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 3 }}
            mt={{ xs: 2, sm: 0 }}
          >
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: alpha(theme.palette.common.white, 0.6),
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": {
                  color: theme.palette.common.white,
                },
              }}
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: alpha(theme.palette.common.white, 0.6),
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": {
                  color: theme.palette.common.white,
                },
              }}
            >
              Chính sách bảo mật
            </Link>
            <Link
              component={RouterLink}
              to="/sitemap"
              sx={{
                color: alpha(theme.palette.common.white, 0.6),
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": {
                  color: theme.palette.common.white,
                },
              }}
            >
              Sơ đồ trang
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
