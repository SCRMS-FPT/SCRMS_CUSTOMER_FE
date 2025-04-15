import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import logo from "../../assets/logo.svg";
import defaultAvatar from "../../assets/default_avatar.jpg";
import { Client as PaymentClient } from "../../API/PaymentApi";
import { Client as NotificationClient } from "@/API/NotificationApi";
import { formatDistanceToNow, isToday } from "date-fns";

// Import MUI components
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Tooltip,
  Container,
  Badge,
  CircularProgress,
  alpha,
  Paper,
  Fade,
  Chip,
  useScrollTrigger,
  Zoom,
  Fab,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ExploreIcon from "@mui/icons-material/Explore";
import SportsIcon from "@mui/icons-material/Sports";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AppsIcon from "@mui/icons-material/Apps";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Scroll to top button component
import PropTypes from "prop-types";
import { SignalRService } from "@/hooks/signalRService";
import { API_GATEWAY_URL } from "@/API/config";
import { notification } from "antd";
import {
  addNotification,
  fetchNavbarNotifications,
  fetchNotifications,
} from "@/store/notificationSlice";

function ScrollTop(props) {
  const { children } = props;

  ScrollTop.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [discoverAnchorEl, setDiscoverAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [appsMenuAnchorEl, setAppsMenuAnchorEl] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // For navbar elevation on scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Get user avatar
  const userAvatar =
    user?.imageUrls && user.imageUrls.length > 0
      ? user.imageUrls[0]
      : defaultAvatar;

  // Check if user has specific roles
  const isCoach = user?.roles?.includes("Coach");
  const isCourtOwner = user?.roles?.includes("CourtOwner");

  // Set active tab based on current location
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/home") {
      setTabValue(0);
    } else if (
      pathname.includes("/browse-courts") ||
      pathname.includes("/court/") ||
      pathname.includes("/courts/sport")
    ) {
      setTabValue(1);
    } else if (pathname.includes("/coaches") || pathname.includes("/coach/")) {
      setTabValue(2);
    } else if (pathname.includes("/pricing")) {
      setTabValue(3);
    } else if (
      pathname.includes("/find-match") ||
      pathname.includes("/matches/list")
    ) {
      setTabValue(4);
    } else if (pathname.includes("/support")) {
      setTabValue(5);
    } else {
      setTabValue(false);
    }
  }, [location]);

  // Check active route for highlighting
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch wallet balance when dropdown opens
  const fetchWalletBalance = async () => {
    if (!user) return;

    try {
      setLoadingBalance(true);
      const apiClient = new PaymentClient();
      const response = await apiClient.getWalletBalance();
      setWalletBalance(response);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    // Fetch wallet balance when menu opens
    fetchWalletBalance();
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigate to wallet
  const navigateToWallet = () => {
    navigate("/wallet");
    handleProfileMenuClose();
    setIsOpen(false);
  };

  // Navigate to user dashboard
  const navigateToUserDashboard = () => {
    navigate("/user/dashboard");
    handleProfileMenuClose();
    setIsOpen(false);
  };

  // Discover menu handlers
  const handleDiscoverMenuOpen = (event) => {
    setDiscoverAnchorEl(event.currentTarget);
  };

  const handleDiscoverMenuClose = () => {
    setDiscoverAnchorEl(null);
  };

  // Apps menu handlers
  const handleAppsMenuOpen = (event) => {
    setAppsMenuAnchorEl(event.currentTarget);
  };

  const handleAppsMenuClose = () => {
    setAppsMenuAnchorEl(null);
  };

  // Notification handlers
  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    // TODO: Refresh the time
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate("/login");
  };

  // Navigate to dashboard based on role
  const navigateToDashboard = (path) => {
    navigate(path);
    handleProfileMenuClose();
    setIsOpen(false);
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.m4a");
    audio.play();
  };

  // const [notifications, setNotifications] = useState([]);
  const { navbarNotifications, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const [isNewNotification, setIsNewNotification] = useState(false);

  const signalRService = new SignalRService();
  // const notificationClient = new NotificationClient();
  // const fetchNotifications = async () => {
  // try {
  // const fetchData = await notificationClient.getNotifications(
  //   undefined,
  //   undefined,
  //   1,
  //   10
  // );
  // setNotifications(fetchData.data);

  // } catch (error) {
  //   console.log(error);
  // }
  // };

  const authKey = localStorage.getItem("token");

  const handleReadAllNotification = async () => {
    // try {
    //   await notificationClient.readAllNotifications();
    //   setNotifications((prev) => {
    //     const updated = [...prev];
    //     updated.forEach((n) => {
    //       n.isRead = true;
    //     });
    //     return updated;
    //   });
    // } catch (error) {
    //   notification.error({
    //     description: "Không thể thực hiện hành động",
    //     message: "Lỗi",
    //   });
    // }
    // dispatch(markAllAsRead());
  };

  const handleNavigateToNotificationPage = () => {
    handleNotificationClose();
    navigate("/notifications");
  };

  useEffect(() => {
    if (authKey) {
      // fetchNotifications();
      signalRService.startConnection(authKey).then(() => {
        signalRService.onReceiveNotification((notification) => {
          // setNotifications((prev) => [notification, ...prev].slice(0, 10));
          dispatch(addNotification(notification));

          playNotificationSound();
          setIsNewNotification(true);
          setTimeout(() => setIsNewNotification(false), 1000);
          // console.log(`${notification.title}: ${notification.content}`);
        });
      });
    }

    return () => {
      signalR.stopConnection();
    };
  }, [authKey]);

  useEffect(() => {
    dispatch(fetchNavbarNotifications());
  }, [dispatch]);

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: "white",
          borderBottom: trigger ? "none" : "1px solid rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s",
        }}
      >
        {/* Main toolbar with logo and user controls */}
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", py: 0.5 }}
          >
            {/* Logo section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Courtsite"
                  style={{
                    height: "36px",
                    marginRight: "10px",
                    transition: "transform 0.3s",
                  }}
                  className="logo-hover"
                />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "#2563eb",
                    display: { xs: "none", md: "flex" },
                    letterSpacing: "-0.5px",
                  }}
                >
                  Courtsite
                </Typography>
              </Link>
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                color="primary"
                aria-label="menu"
                onClick={() => setIsOpen(true)}
                sx={{
                  transition: "transform 0.3s, background 0.3s",
                  borderRadius: 2,
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: alpha("#2563eb", 0.08),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Desktop right controls */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* Apps menu button */}
              <Tooltip title="Các lựa chọn khác" arrow>
                <IconButton
                  onClick={handleAppsMenuOpen}
                  sx={{
                    transition: "all 0.3s",
                    backgroundColor: Boolean(appsMenuAnchorEl)
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                    mr: 0.5,
                  }}
                >
                  <AppsIcon />
                </IconButton>
              </Tooltip>

              {/* Apps Menu */}
              <Menu
                anchorEl={appsMenuAnchorEl}
                open={Boolean(appsMenuAnchorEl)}
                onClose={handleAppsMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    mt: 1.5,
                    width: 320,
                    padding: 1,
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: -5,
                      right: 28,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ px: 2, py: 1, color: "text.secondary" }}
                >
                  Truy cập nhanh
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    px: 1,
                  }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/support");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <HelpIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                    <Typography variant="body2" align="center">
                      Hỗ trợ
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/wallet");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <AccountBalanceWalletIcon
                      sx={{ color: "#2563eb", mb: 0.5 }}
                    />
                    <Typography variant="body2" align="center">
                      Ví
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/user/bookings");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <CalendarMonthIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                    <Typography variant="body2" align="center">
                      Lịch đặt của tôi
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/user/dashboard");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <DashboardIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                    <Typography variant="body2" align="center">
                      Bảng điều khiển
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/user/coachings");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <SportsIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                    <Typography variant="body2" align="center">
                      Huấn luyện viên
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => {
                      handleAppsMenuClose();
                      navigate("/user/matching");
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <PersonSearchIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                    <Typography variant="body2" align="center">
                      Tìm trận
                    </Typography>
                  </Paper>
                </Box>

                {/* Professional services section */}
                {(isCoach || isCourtOwner) && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ px: 2, py: 1, color: "text.secondary" }}
                    >
                      Dịch vụ chuyên nghiệp
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, px: 1, pb: 1 }}>
                      {isCoach && (
                        <Paper
                          elevation={0}
                          onClick={() => {
                            handleAppsMenuClose();
                            navigate("/coach/dashboard");
                          }}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: 2,
                            flex: 1,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: alpha("#2563eb", 0.08),
                            },
                          }}
                        >
                          <SportsIcon sx={{ color: "#2563eb", mb: 0.5 }} />
                          <Typography variant="body2" align="center">
                            Bảng điều khiển huấn luyện viên
                          </Typography>
                        </Paper>
                      )}

                      {isCourtOwner && (
                        <Paper
                          elevation={0}
                          onClick={() => {
                            handleAppsMenuClose();
                            navigate("/court-owner/dashboard");
                          }}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: 2,
                            flex: 1,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: alpha("#2563eb", 0.08),
                            },
                          }}
                        >
                          <SportsTennisIcon
                            sx={{ color: "#2563eb", mb: 0.5 }}
                          />
                          <Typography variant="body2" align="center">
                            Bảng điều khiển chủ sân
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </>
                )}
              </Menu>

              {/* Role-based dashboard buttons */}
              {isCoach && (
                <Tooltip title="Bảng điều khiển huấn luyện viên" arrow>
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/coach/dashboard")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 0.75,
                      transition: "all 0.3s",
                      border: "1.5px solid",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                        border: "1.5px solid",
                      },
                    }}
                  >
                    Huấn luyện viên
                  </Button>
                </Tooltip>
              )}

              {isCourtOwner && (
                <Tooltip title="Bảng điều khiển chủ sân" arrow>
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/court-owner/dashboard")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 0.75,
                      transition: "all 0.3s",
                      border: "1.5px solid",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                        border: "1.5px solid",
                      },
                    }}
                  >
                    Chủ sân
                  </Button>
                </Tooltip>
              )}

              {/* Wallet Button - Show if user is logged in */}
              {user && (
                <Tooltip title="Ví của bạn" arrow>
                  <IconButton
                    onClick={navigateToWallet}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                      backgroundColor: isActive("/wallet")
                        ? alpha("#2563eb", 0.08)
                        : "transparent",
                    }}
                  >
                    <AccountBalanceWalletIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* User profile or auth buttons */}
              {user ? (
                <>
                  <Tooltip title="Thông báo" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleNotificationOpen}
                      sx={{
                        transition: "all 0.3s",
                        animation: isNewNotification
                          ? "shake 0.5s ease"
                          : "none",
                        "&:hover": {
                          backgroundColor: alpha("#2563eb", 0.08),
                        },
                        backgroundColor: notificationAnchorEl
                          ? alpha("#2563eb", 0.08)
                          : "transparent",
                      }}
                    >
                      <Badge
                        badgeContent={
                          // notifications.filter((n) => !n.isRead).length
                          unreadCount
                        }
                        color="error"
                        overlap="circular"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "10px",
                            minWidth: "16px",
                            height: "16px",
                            padding: 0,
                          },
                        }}
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        borderRadius: 2,
                        mt: 1.5,
                        width: 360,
                        maxHeight: 400,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: -5,
                          right: 16,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "background.paper", // Important for sticky behavior
                        zIndex: 1, // Ensure it's above the scrollable content
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Thông báo
                      </Typography>
                    </Box>

                    {/* Scrollable Notification List */}
                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                      {navbarNotifications.map((notification, index) => {
                        const { isRead, title, content, type, createdAt } =
                          notification;
                        const createdAtDate = new Date(createdAt);

                        const timeDisplay = isToday(createdAtDate)
                          ? `${formatDistanceToNow(createdAtDate, {
                              addSuffix: true,
                            })}`
                          : createdAtDate.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });

                        return (
                          <MenuItem
                            key={index}
                            onClick={handleNotificationClose}
                            sx={{
                              py: 2,
                              backgroundColor: !isRead
                                ? alpha("#2563eb", 0.04)
                                : "transparent",
                              "&:hover": {
                                backgroundColor: alpha("#2563eb", 0.08),
                              },
                            }}
                          >
                            <Box sx={{ width: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="body1">{title}</Typography>
                                {!isRead && (
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      bgcolor: "error.main",
                                      ml: 1,
                                      mt: 1,
                                    }}
                                  />
                                )}
                              </Box>

                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#2563eb",
                                  fontWeight: 500,
                                  mt: 0.3,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {type}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {content}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {timeDisplay}
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Box>

                    {/* Fixed Footer */}
                    <Box
                      sx={{
                        p: 1,
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1.5,
                        backgroundColor: "background.paper",
                        position: "sticky",
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <Button
                        color="primary"
                        variant="text"
                        size="small"
                        onClick={handleNavigateToNotificationPage}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.85rem",
                          padding: "6px 12px",
                          color: "#2563eb",
                          "&:hover": {
                            backgroundColor: alpha("#2563eb", 0.05),
                          },
                        }}
                      >
                        Xem tất cả thông báo
                      </Button>
                    </Box>
                  </Menu>

                  <Button
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    endIcon={
                      <KeyboardArrowDownIcon
                        sx={{
                          transition: "transform 0.3s",
                          transform: anchorEl ? "rotate(180deg)" : "rotate(0)",
                        }}
                      />
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 1,
                      py: 0.75,
                      ml: 0.5,
                      transition: "all 0.3s",
                      backgroundColor: anchorEl
                        ? alpha("#2563eb", 0.08)
                        : "transparent",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                    startIcon={
                      <Avatar
                        src={userAvatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{
                          width: 32,
                          height: 32,
                          border: "2px solid #e5e7eb",
                        }}
                      />
                    }
                  >
                    <Typography variant="body1" fontWeight={500} color="#444">
                      {user.firstName}
                    </Typography>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        borderRadius: 2,
                        mt: 1.5,
                        minWidth: 240,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        overflow: "visible",
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: -5,
                          right: 16,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    {/* User info */}
                    <Box
                      sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          src={userAvatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          sx={{
                            width: 42,
                            height: 42,
                            mr: 1.5,
                            border: "2px solid #e5e7eb",
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Wallet Balance */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: alpha("#2563eb", 0.05),
                        borderRadius: 1.5,
                        mx: 1.5,
                        my: 1.5,
                      }}
                    >
                      <AccountBalanceWalletIcon
                        fontSize="small"
                        sx={{ color: "#2563eb", mr: 1.5 }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          component="div"
                          color="text.secondary"
                        >
                          Số dư ví
                        </Typography>
                        {loadingBalance ? (
                          <CircularProgress size={16} sx={{ my: 0.5 }} />
                        ) : (
                          <Typography
                            variant="body2"
                            component="div"
                            fontWeight="bold"
                          >
                            {walletBalance?.balance?.toLocaleString()} VND
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        navigate("/profile");
                      }}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: 1.5,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: alpha("#2563eb", 0.08),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircleIcon
                          fontSize="small"
                          sx={{ color: "#2563eb" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1">Xem hồ sơ</Typography>
                    </MenuItem>

                    {/* Dashboard Link */}
                    <MenuItem
                      onClick={navigateToUserDashboard}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: 1.5,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: alpha("#2563eb", 0.08),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DashboardIcon
                          fontSize="small"
                          sx={{ color: "#2563eb" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1">
                        Bảng điều khiển của tôi
                      </Typography>
                    </MenuItem>

                    {/* Wallet Menu Item */}
                    <MenuItem
                      onClick={navigateToWallet}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: 1.5,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: alpha("#2563eb", 0.08),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AccountBalanceWalletIcon
                          fontSize="small"
                          sx={{ color: "#2563eb" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1">Quản lý ví</Typography>
                    </MenuItem>

                    {isCoach && (
                      <MenuItem
                        onClick={() => navigateToDashboard("/coach/dashboard")}
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderRadius: 1.5,
                          mx: 1,
                          "&:hover": {
                            backgroundColor: alpha("#2563eb", 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <DashboardIcon
                            fontSize="small"
                            sx={{ color: "#2563eb" }}
                          />
                        </ListItemIcon>
                        <Typography variant="body1">
                          Bảng điều khiển huấn luyện viên
                        </Typography>
                      </MenuItem>
                    )}
                    {isCourtOwner && (
                      <MenuItem
                        onClick={() =>
                          navigateToDashboard("/court-owner/dashboard")
                        }
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderRadius: 1.5,
                          mx: 1,
                          "&:hover": {
                            backgroundColor: alpha("#2563eb", 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <DashboardIcon
                            fontSize="small"
                            sx={{ color: "#2563eb" }}
                          />
                        </ListItemIcon>
                        <Typography variant="body1">
                          Bảng điều khiển chủ sân
                        </Typography>
                      </MenuItem>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: 1.5,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: alpha("#ef4444", 0.08),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon
                          fontSize="small"
                          sx={{ color: "#ef4444" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1" sx={{ color: "#ef4444" }}>
                        Đăng xuất
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/signup"
                    startIcon={<PersonAddIcon />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      py: 0.75,
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    Đăng kí
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 0.75,
                      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 15px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
        {/* Secondary navigation bar with tabs */}
        <Box
          sx={{
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            display: { xs: "none", md: "block" },
          }}
        >
          <Container maxWidth="xl">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="standard"
              centered
              aria-label="main navigation tabs"
              sx={{
                "& .MuiTabs-scroller": {
                  display: "flex",
                },
                "& .MuiTabs-flexContainer": {
                  gap: "8px",
                  width: "100%",
                },
                "& .MuiTab-root": {
                  py: 0.75, // Reduced height
                  px: 1,
                  minWidth: 0,
                  maxWidth: "none",
                  fontSize: "0.85rem",
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#555",
                  borderRadius: "8px 8px 0 0",
                  "&:hover": {
                    backgroundColor: alpha("#2563eb", 0.04),
                    color: "#2563eb",
                  },
                },
                "& .Mui-selected": {
                  color: "#2563eb !important",
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab
                icon={<HomeIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Trang chủ"
                onClick={() => navigate("/")}
              />
              <Tab
                icon={<SportsTennisIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Sân đấu"
                onClick={() => navigate("/browse-courts")}
              />
              <Tab
                icon={<SportsIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Huấn luyện viên"
                onClick={() => navigate("/coaches")}
              />
              <Tab
                icon={<PriceCheckIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Các gói dịch vụ"
                onClick={() => navigate("/pricing")}
              />
              <Tab
                icon={<PersonSearchIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Tìm đối thủ"
                onClick={() => navigate("/find-match")}
              />
              {user && (
                <Tab
                  icon={<ShoppingCartIcon sx={{ fontSize: "0.9rem" }} />}
                  iconPosition="start"
                  label="Lịch đặt của tôi"
                  onClick={() => navigate("/user/bookings")}
                />
              )}
              <Tab
                icon={<HelpIcon sx={{ fontSize: "0.9rem" }} />}
                iconPosition="start"
                label="Hỗ trợ"
                onClick={() => navigate("/support")}
              />
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        <Box sx={{ width: "100%" }} role="presentation">
          <List>
            <ListItem sx={{ pb: 2, pt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#2563eb" }}
                >
                  <SportsTennisIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Courtsite
                </Typography>
                <IconButton
                  onClick={() => setIsOpen(false)}
                  size="small"
                  sx={{
                    backgroundColor: alpha("#2563eb", 0.08),
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.12),
                    },
                  }}
                >
                  <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>

            {/* User info if logged in */}
            {user && (
              <Box
                sx={{ px: 2, py: 1.5, backgroundColor: alpha("#2563eb", 0.03) }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={userAvatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    sx={{
                      width: 42,
                      height: 42,
                      mr: 1.5,
                      border: "2px solid #e5e7eb",
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Wallet balance in drawer */}
                {walletBalance !== null && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: alpha("#2563eb", 0.05),
                      borderRadius: 1.5,
                    }}
                  >
                    <AccountBalanceWalletIcon
                      fontSize="small"
                      sx={{ color: "#2563eb", mr: 1.5 }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        Số dư ví
                      </Typography>
                      {loadingBalance ? (
                        <CircularProgress size={16} sx={{ my: 0.5 }} />
                      ) : (
                        <Typography
                          variant="body2"
                          component="div"
                          fontWeight="bold"
                        >
                          {walletBalance?.balance?.toLocaleString()} VND
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Divider />

            {/* Main Navigation Items */}
            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor:
                  isActive("/") || isActive("/home")
                    ? alpha("#2563eb", 0.08)
                    : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <HomeIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/browse-courts");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor: location.pathname.includes("/browse-courts")
                  ? alpha("#2563eb", 0.08)
                  : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <SportsTennisIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Browse Courts"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/coaches");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor: location.pathname.includes("/coaches")
                  ? alpha("#2563eb", 0.08)
                  : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <SportsIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Coaches"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/pricing");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor: isActive("/pricing")
                  ? alpha("#2563eb", 0.08)
                  : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <PriceCheckIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Pricing"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/match-opponents");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor: isActive("/match-opponents")
                  ? alpha("#2563eb", 0.08)
                  : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <PersonSearchIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Find Opponents"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/support");
              }}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                backgroundColor: isActive("/support")
                  ? alpha("#2563eb", 0.08)
                  : "transparent",
                "&:hover": {
                  backgroundColor: alpha("#2563eb", 0.08),
                },
              }}
            >
              <ListItemIcon>
                <HelpIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Support"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            {user && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ px: 3, py: 1, color: "text.secondary" }}
                >
                  Tài khoản của tôi
                </Typography>

                <ListItem
                  button
                  onClick={navigateToUserDashboard}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: location.pathname.includes(
                      "/user/dashboard"
                    )
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: isActive("/profile")
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/user/bookings");
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: location.pathname.includes(
                      "/user/bookings"
                    )
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <CalendarMonthIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Bookings"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/user/coachings");
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: location.pathname.includes(
                      "/user/coachings"
                    )
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <SportsIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Coaching"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/user/matching");
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: location.pathname.includes(
                      "/user/matching"
                    )
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonSearchIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Matches"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                {/* Wallet mobile menu item */}
                <ListItem
                  button
                  onClick={navigateToWallet}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: location.pathname.includes("/wallet")
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quản lý ví"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                {/* Professional services in mobile */}
                {(isCoach || isCourtOwner) && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ px: 3, py: 1, color: "text.secondary" }}
                    >
                      Dịch vụ chuyên nghiệp
                    </Typography>

                    {isCoach && (
                      <ListItem
                        button
                        onClick={() => navigateToDashboard("/coach/dashboard")}
                        sx={{
                          py: 1.5,
                          borderRadius: 1.5,
                          mx: 1,
                          my: 0.5,
                          backgroundColor: location.pathname.includes(
                            "/coach/dashboard"
                          )
                            ? alpha("#2563eb", 0.08)
                            : "transparent",
                          "&:hover": {
                            backgroundColor: alpha("#2563eb", 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <DashboardIcon sx={{ color: "#2563eb" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Coach Dashboard"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )}

                    {isCourtOwner && (
                      <ListItem
                        button
                        onClick={() =>
                          navigateToDashboard("/court-owner/dashboard")
                        }
                        sx={{
                          py: 1.5,
                          borderRadius: 1.5,
                          mx: 1,
                          my: 0.5,
                          backgroundColor: location.pathname.includes(
                            "/court-owner/dashboard"
                          )
                            ? alpha("#2563eb", 0.08)
                            : "transparent",
                          "&:hover": {
                            backgroundColor: alpha("#2563eb", 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <DashboardIcon sx={{ color: "#2563eb" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Court Owner Dashboard"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )}
                  </>
                )}

                <Divider sx={{ my: 1 }} />

                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    "&:hover": {
                      backgroundColor: alpha("#ef4444", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#ef4444" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Log Out"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: "#ef4444",
                    }}
                  />
                </ListItem>
              </>
            )}

            {!user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/signup");
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonAddIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sign Up"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  sx={{
                    py: 1.5,
                    m: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#2563eb",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LoginIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Log In"
                    primaryTypographyProps={{ fontWeight: 600, color: "white" }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Scroll to top button */}
      <ScrollTop>
        <Fab
          color="primary"
          size="small"
          aria-label="scroll back to top"
          sx={{
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default Navbar;
