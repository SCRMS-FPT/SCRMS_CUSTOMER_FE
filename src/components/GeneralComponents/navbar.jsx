import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import logo from "../../assets/logo.svg";
import defaultAvatar from "../../assets/default_avatar.jpg";
import { Client } from "../../API/PaymentApi";
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

// Scroll to top button component
import PropTypes from "prop-types";

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
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
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

  // Check if user has specific roles
  const isCoach = user?.roles?.includes("Coach");
  const isCourtOwner = user?.roles?.includes("CourtOwner");

  // Check active route for highlighting
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fetch wallet balance when dropdown opens
  const fetchWalletBalance = async () => {
    if (!user) return;

    try {
      setLoadingBalance(true);
      const apiClient = new Client();
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

  // Discover menu handlers
  const handleDiscoverMenuOpen = (event) => {
    setDiscoverAnchorEl(event.currentTarget);
  };

  const handleDiscoverMenuClose = () => {
    setDiscoverAnchorEl(null);
  };

  // Notification handlers
  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
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

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: "Your court reservation is confirmed",
      time: "10 mins ago",
      isNew: true,
    },
    {
      id: 2,
      message: "New coach schedule available",
      time: "2 hours ago",
      isNew: true,
    },
    { id: 3, message: "Payment successful", time: "Yesterday", isNew: false },
  ];

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
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", py: 0.5 }}
          >
            {/* Logo and discover (desktop) */}
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

              {/* Discover dropdown */}
              <Box sx={{ ml: 4, display: { xs: "none", md: "flex" } }}>
                <Button
                  color="inherit"
                  onClick={handleDiscoverMenuOpen}
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{
                        transition: "transform 0.3s",
                        transform: discoverAnchorEl
                          ? "rotate(180deg)"
                          : "rotate(0)",
                      }}
                    />
                  }
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#555",
                    transition: "all 0.3s",
                    backgroundColor: discoverAnchorEl
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  Discover
                </Button>
                <Menu
                  anchorEl={discoverAnchorEl}
                  open={Boolean(discoverAnchorEl)}
                  onClose={handleDiscoverMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 220,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: -5,
                        left: 32,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleDiscoverMenuClose();
                      navigate("/browse-courts");
                    }}
                    sx={{
                      minWidth: 180,
                      py: 1.5,
                      borderRadius: 1,
                      mx: 0.5,
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <SportsTennisIcon
                        fontSize="small"
                        sx={{ color: "#2563eb" }}
                      />
                    </ListItemIcon>
                    <Typography variant="body1">Browse Courts</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleDiscoverMenuClose();
                      navigate("/coaches");
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      mx: 0.5,
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <SportsIcon fontSize="small" sx={{ color: "#2563eb" }} />
                    </ListItemIcon>
                    <Typography variant="body1">Coaches</Typography>
                  </MenuItem>
                </Menu>
              </Box>
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

            {/* Desktop navigation links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                color="inherit"
                component={Link}
                to="/pricing"
                startIcon={<PriceCheckIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  color: isActive("/pricing") ? "#2563eb" : "#555",
                  backgroundColor: isActive("/pricing")
                    ? alpha("#2563eb", 0.08)
                    : "transparent",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: alpha("#2563eb", 0.08),
                  },
                }}
              >
                Pricing
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/support"
                startIcon={<HelpIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  color: isActive("/support") ? "#2563eb" : "#555",
                  backgroundColor: isActive("/support")
                    ? alpha("#2563eb", 0.08)
                    : "transparent",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: alpha("#2563eb", 0.08),
                  },
                }}
              >
                Support
              </Button>

              {/* Wallet Button - Show if user is logged in */}
              {user && (
                <Button
                  color="inherit"
                  onClick={navigateToWallet}
                  startIcon={<AccountBalanceWalletIcon />}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    color: isActive("/wallet") ? "#2563eb" : "#555",
                    backgroundColor: isActive("/wallet")
                      ? alpha("#2563eb", 0.08)
                      : "transparent",
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  Ví của tôi
                </Button>
              )}

              {/* Role-based dashboard buttons */}
              {isCoach && (
                <Tooltip title="Coach Dashboard" arrow>
                  <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/coach/dashboard")}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.3s",
                      border: "1.5px solid",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                        border: "1.5px solid",
                      },
                    }}
                  >
                    Coach Portal
                  </Button>
                </Tooltip>
              )}

              {isCourtOwner && (
                <Tooltip title="Court Owner Dashboard" arrow>
                  <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/court-owner/dashboard")}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.3s",
                      border: "1.5px solid",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                        border: "1.5px solid",
                      },
                    }}
                  >
                    Court Owner Portal
                  </Button>
                </Tooltip>
              )}

              {/* User profile or auth buttons */}
              {user ? (
                <>
                  <Tooltip title="Notifications" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleNotificationOpen}
                      sx={{
                        transition: "all 0.3s",
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
                          notifications.filter((n) => n.isNew).length
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

                  {/* Notifications Menu */}
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
                        overflow: "auto",
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
                    <Box
                      sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Notifications
                      </Typography>
                    </Box>
                    {notifications.map((notification) => (
                      <MenuItem
                        key={notification.id}
                        onClick={handleNotificationClose}
                        sx={{
                          py: 2,
                          position: "relative",
                          backgroundColor: notification.isNew
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
                            }}
                          >
                            <Typography variant="body1">
                              {notification.message}
                            </Typography>
                            {notification.isNew && (
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
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                    <Box
                      sx={{
                        p: 1,
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        color="primary"
                        size="small"
                        onClick={handleNotificationClose}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        View all notifications
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
                      px: 1.5,
                      py: 0.75,
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
                        src={user.profileImage || defaultAvatar}
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
                          src={user.profileImage || defaultAvatar}
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
                      <Typography variant="body1">View Profile</Typography>
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
                        <Typography variant="body1">Coach Dashboard</Typography>
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
                          Court Owner Dashboard
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
                        Log Out
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
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: alpha("#2563eb", 0.08),
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 15px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    Log In
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
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
                    src={user.profileImage || defaultAvatar}
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
                navigate("/support");
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
                <HelpIcon sx={{ color: "#2563eb" }} />
              </ListItemIcon>
              <ListItemText
                primary="Support"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {user ? (
              <>
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
                    "&:hover": {
                      backgroundColor: alpha("#2563eb", 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Profile"
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

                {isCoach && (
                  <ListItem
                    button
                    onClick={() => navigateToDashboard("/coach/dashboard")}
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
            ) : (
              <>
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
