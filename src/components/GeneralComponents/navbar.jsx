import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [discoverAnchorEl, setDiscoverAnchorEl] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Check if user has specific roles
  const isCoach = user?.roles?.includes("Coach");
  const isCourtOwner = user?.roles?.includes("Court Owner");

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

  return (
    <AppBar
      position="static"
      color="default"
      elevation={2}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
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
                style={{ height: "32px", marginRight: "8px" }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#2563eb",
                  display: { xs: "none", md: "flex" },
                }}
              >
                Courtsite
              </Typography>
            </Link>

            {/* Discover dropdown */}
            <Box sx={{ ml: 3, display: { xs: "none", md: "flex" } }}>
              <Button
                color="inherit"
                onClick={handleDiscoverMenuOpen}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<ExploreIcon />}
                sx={{
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                  },
                }}
              >
                Discover
              </Button>
              <Menu
                anchorEl={discoverAnchorEl}
                open={Boolean(discoverAnchorEl)}
                onClose={handleDiscoverMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { borderRadius: 1, mt: 1 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleDiscoverMenuClose();
                    navigate("/browse-courts");
                  }}
                  sx={{ minWidth: 180 }}
                >
                  <ListItemIcon>
                    <SportsTennisIcon fontSize="small" />
                  </ListItemIcon>
                  Browse Courts
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDiscoverMenuClose();
                    navigate("/coaches");
                  }}
                >
                  <ListItemIcon>
                    <SportsIcon fontSize="small" />
                  </ListItemIcon>
                  Coaches
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsOpen(true)}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
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
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
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
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
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
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                  },
                }}
              >
                Ví của tôi
              </Button>
            )}

            {/* Role-based dashboard buttons */}
            {isCoach && (
              <Tooltip title="Coach Dashboard">
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate("/coach/dashboard")}
                  sx={{
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Coach Portal
                </Button>
              </Tooltip>
            )}

            {isCourtOwner && (
              <Tooltip title="Court Owner Dashboard">
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate("/court-owner/dashboard")}
                  sx={{
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      transform: "translateY(-2px)",
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
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Button
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    textTransform: "none",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
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
                  {user.firstName}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 1, mt: 1, minWidth: 200 },
                  }}
                >
                  {/* Wallet Balance */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      borderRadius: "4px",
                      mx: 1,
                      mb: 1,
                    }}
                  >
                    <AccountBalanceWalletIcon
                      fontSize="small"
                      sx={{ color: "#2563eb", mr: 1 }}
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
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    View Profile
                  </MenuItem>

                  {/* Wallet Menu Item */}
                  <MenuItem onClick={navigateToWallet}>
                    <ListItemIcon>
                      <AccountBalanceWalletIcon fontSize="small" />
                    </ListItemIcon>
                    Quản lý ví
                  </MenuItem>

                  {isCoach && (
                    <MenuItem
                      onClick={() => navigateToDashboard("/coach/dashboard")}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Coach Dashboard
                    </MenuItem>
                  )}
                  {isCourtOwner && (
                    <MenuItem
                      onClick={() =>
                        navigateToDashboard("/court-owner/dashboard")
                      }
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Court Owner Dashboard
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" sx={{ color: "#ef4444" }} />
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
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
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
                    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 10px -1px rgba(37, 99, 235, 0.3)",
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

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Box sx={{ width: "100%" }} role="presentation">
          <List>
            <ListItem sx={{ pb: 2, pt: 2 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", color: "#2563eb" }}
              >
                <SportsTennisIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Courtsite
              </Typography>
            </ListItem>
            <Divider />

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/browse-courts");
              }}
            >
              <ListItemIcon>
                <SportsTennisIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Browse Courts" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/coaches");
              }}
            >
              <ListItemIcon>
                <SportsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Coaches" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/pricing");
              }}
            >
              <ListItemIcon>
                <PriceCheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Pricing" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                navigate("/support");
              }}
            >
              <ListItemIcon>
                <HelpIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItem>

            <Divider />

            {user ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="View Profile" />
                </ListItem>

                {/* Wallet mobile menu item */}
                <ListItem button onClick={navigateToWallet}>
                  <ListItemIcon>
                    <AccountBalanceWalletIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý ví" />
                </ListItem>

                {isCoach && (
                  <ListItem
                    button
                    onClick={() => navigateToDashboard("/coach/dashboard")}
                  >
                    <ListItemIcon>
                      <DashboardIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Coach Dashboard" />
                  </ListItem>
                )}

                {isCourtOwner && (
                  <ListItem
                    button
                    onClick={() =>
                      navigateToDashboard("/court-owner/dashboard")
                    }
                  >
                    <ListItemIcon>
                      <DashboardIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Court Owner Dashboard" />
                  </ListItem>
                )}

                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#ef4444" }} />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" sx={{ color: "#ef4444" }} />
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
                >
                  <ListItemIcon>
                    <PersonAddIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Sign Up" />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                >
                  <ListItemIcon>
                    <LoginIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Log In"
                    sx={{ color: "#2563eb", fontWeight: "bold" }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
