import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Box, Tooltip, Avatar, Typography, Badge, Drawer } from "@mui/material";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Client as CoachClient } from "../../API/CoachApi";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import PropTypes from "prop-types";

// Menu items configuration
const menuItems = [
  {
    key: "/coach/dashboard",
    icon: "material-symbols:dashboard",
    label: "Bảng điều khiển",
    path: "/coach/dashboard",
  },
  {
    key: "/coach-profile",
    icon: "mdi:account-circle-outline",
    label: "Thông tin",
    path: "/coach-profile",
  },
  {
    key: "/coach-schedules",
    icon: "mdi:calendar-month-outline",
    label: "Lịch",
    path: "/coach-schedules",
  },
  {
    key: "/coach-packages",
    icon: "tabler:package",
    label: "Gói huấn luyện",
    path: "/coach-packages",
  },
  {
    key: "/coach-bookings",
    icon: "mdi:clipboard-text-clock-outline",
    label: "Lịch huấn luyện",
    path: "/coach-bookings",
  },
  {
    key: "/coach-promotions",
    icon: "mdi:ticket-percent",
    label: "Ưu đãi",
    path: "/coach-promotions",
  },
  {
    key: "/coach-reviews",
    icon: "material-symbols:comment-outline",
    label: "Đánh giá",
    path: "/coach-reviews",
  },
];

const bottomMenuItems = [
  {
    key: "/home",
    icon: "mdi:home-outline",
    label: "Trang chủ",
    path: "/home",
  },
  {
    key: "/logout",
    icon: "mdi:logout-variant",
    label: "Đăng xuất",
    path: "/login",
  },
];

// Memoized MenuItem component with display name and prop types
const MenuItem = memo(({ item, collapsed, handleLogout, isActive }) => {
  const active = isActive(item.path);
  const isLogout = item.path === "/logout";
  const isPresent = useIsPresent();

  // Prevent navigation and handle logout for logout menu item
  const handleClick = (e) => {
    if (isLogout) {
      e.preventDefault();
      handleLogout();
    }
  };

  return (
    <Tooltip
      title={collapsed ? item.label : ""}
      placement="right"
      arrow
      disableHoverListener={!collapsed}
    >
      <motion.div
        className="relative mb-0.5"
        layout
        initial={false}
        animate={{
          opacity: isPresent ? 1 : 0,
          y: isPresent ? 0 : 5,
        }}
        style={{
          pointerEvents: isPresent ? "auto" : "none",
        }}
      >
        <RouterLink
          to={isLogout ? "#" : item.path}
          className="block"
          onClick={handleClick}
        >
          <motion.div
            className={`
              flex items-center px-3 py-2 mx-1 rounded-xl transition-all duration-200
              ${
                active
                  ? "bg-indigo-500 text-white shadow-md"
                  : isLogout
                  ? "text-gray-600 hover:text-red-500 hover:bg-red-50"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
            initial={false}
            whileHover={{
              scale: active ? 1 : 1.02,
              transition: { duration: 0.2 },
            }}
            style={{
              boxShadow: active ? "0 4px 12px rgba(99, 102, 241, 0.15)" : "",
              transition: "background 0.3s, color 0.3s, transform 0.2s",
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full">
              <Icon
                icon={item.icon}
                width={20}
                height={20}
                className={
                  active
                    ? "text-white"
                    : isLogout
                    ? "text-gray-500 group-hover:text-red-500"
                    : "text-gray-500"
                }
              />
            </div>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: 1,
                    width: "auto",
                    transition: { duration: 0.2 },
                  }}
                  exit={{ opacity: 0, width: 0 }}
                  className={`ml-2 font-medium text-xs whitespace-nowrap overflow-hidden transition-colors`}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {active && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-2 w-1 h-8 rounded-full bg-white/50"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.div>
        </RouterLink>
      </motion.div>
    </Tooltip>
  );
});

// Add display name for MenuItem
MenuItem.displayName = "MenuItem";

// Add prop types for MenuItem
MenuItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  collapsed: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  isActive: PropTypes.func.isRequired,
};

const CoachSidebar = memo(({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coachProfile, setCoachProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize functions to prevent recreating on every render
  const isActive = useCallback(
    (path) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  // Fetch coach profile data only once
  useEffect(() => {
    let isMounted = true;
    const fetchCoachProfile = async () => {
      try {
        setIsLoading(true);
        const coachClient = new CoachClient();
        const profileData = await coachClient.getMyCoachProfile();

        if (isMounted) {
          setCoachProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching coach profile:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCoachProfile();

    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, []);

  // Only close mobile drawer when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Memoized avatar getter
  const getCoachAvatar = useMemo(() => {
    if (coachProfile?.avatar) {
      return coachProfile.avatar;
    } else if (coachProfile?.imageUrls && coachProfile.imageUrls.length > 0) {
      return coachProfile.imageUrls[0];
    }
    return "https://randomuser.me/api/portraits/men/32.jpg"; // Fallback
  }, [coachProfile]);

  // Animation variants - defined outside of render to prevent recreation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // Memoized SidebarContent to prevent recreating on every render
  const SidebarContent = memo(() => (
    <Box
      className="h-full flex flex-col relative overflow-hidden"
      sx={{
        background: "linear-gradient(to bottom, #ffffff, #f9fafc)",
      }}
    >
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-2/3 h-2/3 bg-contain bg-no-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            transform: "rotate(30deg)",
          }}
        />
      </div>

      {/* Header with collapse button */}
      <Box className="p-3 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Box className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg"
          >
            <Icon
              icon="fluent:sport-basketball-24-filled"
              className="text-white"
              width={collapsed ? 20 : 18}
              height={collapsed ? 20 : 18}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="title"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col"
              >
                <Typography
                  variant="subtitle2"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                  sx={{ letterSpacing: "0.5px" }}
                >
                  SCMRS Coach
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full p-1 bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Icon
            icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
            width={16}
            height={16}
          />
        </motion.button>
      </Box>

      {/* Profile section */}
      <Box className="px-3 py-3">
        <motion.div
          className={`
            flex ${collapsed ? "justify-center" : "items-center"} 
            bg-gradient-to-r from-indigo-50 to-blue-50 
            p-2 rounded-xl border border-indigo-100/50 
            transition-all duration-300
          `}
          whileHover={{ boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)" }}
          layout
          initial={false}
        >
          {collapsed ? (
            <Box className="flex flex-col items-center">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <div className="bg-green-500 border-2 border-white rounded-full w-3 h-3" />
                }
              >
                <Avatar
                  src={getCoachAvatar}
                  alt="Coach profile"
                  sx={{ width: 38, height: 38 }}
                  className="border-2 border-white shadow-sm mb-1"
                />
              </Badge>
            </Box>
          ) : (
            <>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <div className="bg-green-500 border-2 border-white rounded-full w-2 h-2" />
                }
              >
                <Avatar
                  src={getCoachAvatar}
                  alt="Coach profile"
                  sx={{ width: 38, height: 38 }}
                  className="border-2 border-white shadow-md"
                />
              </Badge>
              <Box className="ml-2 flex-1 overflow-hidden">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-gray-900 truncate"
                  sx={{ fontSize: "0.85rem" }}
                >
                  {isLoading
                    ? "Đang tải..."
                    : coachProfile?.fullName || "Coach"}
                </Typography>
                <Box className="flex items-center">
                  <div className="flex items-center">
                    <Icon
                      icon="mdi:check-decagram"
                      className="text-blue-500 mr-0.5"
                      width={12}
                      height={12}
                    />
                    <Typography
                      variant="caption"
                      className="text-gray-500 font-medium text-xs"
                    >
                      Huấn luyện viên
                    </Typography>
                  </div>
                </Box>
              </Box>
            </>
          )}
        </motion.div>
      </Box>

      {/* Decorative line */}
      <Box className="px-4 my-0.5">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />
      </Box>

      {/* Main menu */}
      <motion.div
        className="flex-1 px-2 py-2 overflow-y-auto custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              handleLogout={handleLogout}
              isActive={isActive}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom menu */}
      <Box className="px-2 py-2 mt-auto border-t border-gray-100">
        <div className="space-y-1">
          {bottomMenuItems.map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              handleLogout={handleLogout}
              isActive={isActive}
            />
          ))}
        </div>

        {/* Version info - only when not collapsed */}
        {!collapsed && (
          <Typography
            variant="caption"
            className="text-gray-400 block text-center mt-2 text-xs"
          >
            SCMRS Coach v1.2.4
          </Typography>
        )}
      </Box>
    </Box>
  ));

  // Add display name for SidebarContent
  SidebarContent.displayName = "SidebarContent";

  return (
    <Box className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar with layout persistence */}
      <motion.div
        animate={{
          width: collapsed ? 70 : 220,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          layout: { duration: 0.3 },
        }}
        layout
        className="hidden md:block h-screen sticky top-0 border-r border-gray-100 z-40 shadow-sm"
        style={{ boxShadow: "0 0 20px rgba(0,0,0,0.03)" }}
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Drawer with improved performance */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 220,
            boxSizing: "border-box",
            borderRadius: "0 16px 16px 0",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Content area with smooth transitions */}
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <Box
          className="md:hidden flex items-center justify-between px-4 h-16 sticky top-0 z-30 bg-white backdrop-blur-lg border-b border-gray-100"
          sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
        >
          <Box className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-md mr-2">
              <Icon
                icon="fluent:sport-basketball-24-filled"
                className="text-white"
                width={20}
                height={20}
              />
            </div>
            <Typography
              variant="subtitle1"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              SCMRS Coach
            </Typography>
          </Box>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
          >
            <Icon
              icon="mdi:menu"
              width={24}
              height={24}
              className="text-gray-700"
            />
          </motion.button>
        </Box>

        {/* Main content with layoutId for smooth transitions */}
        <motion.div layout="position" className="flex-1 overflow-y-auto">
          <Box
            component="main"
            className="p-4 md:p-6 lg:p-8"
            sx={{
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#E2E8F0",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#CBD5E1",
              },
            }}
          >
            {children}
          </Box>
        </motion.div>
      </Box>

      {/* Global Styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #E2E8F0 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E2E8F0;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #CBD5E1;
        }
      `}</style>
    </Box>
  );
});

// Add display name for CoachSidebar
CoachSidebar.displayName = "CoachSidebar";

// Add prop types for CoachSidebar
CoachSidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CoachSidebar;
