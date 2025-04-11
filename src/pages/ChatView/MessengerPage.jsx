import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import * as signalR from "@microsoft/signalr";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import EmojiPicker from "emoji-picker-react";
import Lottie from "react-lottie-player";

// MUI components
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  CircularProgress,
  InputAdornment,
  Tooltip,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  Chip,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem,
  useTheme,
  alpha,
  Skeleton,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import {
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  LoadingOutlined,
  UserOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  AimOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  EditOutlined,
  DeleteOutlined,
  BlockOutlined,
  MessageOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SyncOutlined,
  WarningOutlined,
} from "@ant-design/icons";

// API clients
import {
  Client as ChatClient,
  SendMessageRequest,
  CreateChatSessionRequest,
  EditMessageRequest,
} from "@/API/ChatApi";
import { Client as IdentityClient } from "@/API/IdentityApi";
import { Client as MatchingClient } from "@/API/MatchingApi";

// Loading animations
import loadingAnimation from "../../assets/animations/loading-chat.json";
import emptyAnimation from "../../assets/animations/empty-chat.json";
import connectionErrorAnimation from "../../assets/animations/connection-error.json";
import { API_CHAT_URL } from "@/API/config";

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);

const CHAT_HUB_URL = `${API_CHAT_URL}/chatHub`;

// Styled components
const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your header height
  backgroundColor: theme.palette.background.default,
  overflow: "hidden",
  position: "relative",
}));

const MatchedUsersContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
  backgroundImage: `radial-gradient(${alpha(
    theme.palette.primary.light,
    0.1
  )} 1px, transparent 1px)`,
  backgroundSize: "20px 20px",
}));

const UserDetailsContainer = styled(Paper)(({ theme }) => ({
  width: 300,
  height: "100%",
  borderRadius: 0,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("lg")]: {
    width: 280,
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(2),
  ".MuiOutlinedInput-root": {
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const UsersList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 3,
  },
}));

const UserItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  padding: theme.spacing(1.5, 2),
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  borderLeft: active
    ? `4px solid ${theme.palette.primary.main}`
    : "4px solid transparent",
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.action.hover, 0.1),
  },
}));

const ChatHeader = styled(AppBar)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  zIndex: 10,
}));

const MessagesList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 3,
  },
}));

const MessageInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const MessageInput = styled(TextField)(({ theme }) => ({
  ".MuiOutlinedInput-root": {
    borderRadius: 20,
    paddingRight: 10,
    backgroundColor: alpha(theme.palette.background.default, 0.7),
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.default, 0.9),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.default,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isOwn" && prop !== "isFirst" && prop !== "isEdited",
})(({ theme, isOwn, isFirst, isEdited }) => ({
  width: "auto",
  minWidth: 60,
  padding: theme.spacing(1.2, 2),
  borderRadius: 16,
  marginBottom: 4,
  position: "relative",
  wordBreak: "break-word",
  alignSelf: isOwn ? "flex-end" : "flex-start",
  backgroundColor: isOwn
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isOwn
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  "&::before": isFirst
    ? {
        content: '""',
        position: "absolute",
        [isOwn ? "right" : "left"]: -8,
        bottom: 10,
        width: 20,
        height: 20,
        backgroundColor: isOwn
          ? theme.palette.primary.main
          : theme.palette.background.paper,
        transform: "rotate(45deg)",
        zIndex: -1,
      }
    : {},
  "&::after": isEdited
    ? {
        content: '"edited"',
        position: "absolute",
        right: isOwn ? 8 : "auto",
        left: isOwn ? "auto" : 8,
        bottom: 2,
        fontSize: "8px",
        opacity: 0.7,
        fontStyle: "italic",
      }
    : {},
}));

const DateSeparator = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 2),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  textAlign: "center",
  margin: theme.spacing(2, 0),
  alignSelf: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
}));

const UserInfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const UserDetail = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  margin: theme.spacing(0.7, 0),
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: 16,
  },
}));

const OnlineStatusBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "0 auto",
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}));

const EmptyState = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const EmojiPickerContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "100%",
  right: 0,
  marginBottom: theme.spacing(1),
  zIndex: 100,
  boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
  borderRadius: 8,
}));

const MessageOptions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: -20,
  right: (isOwn) => (isOwn ? 10 : "auto"),
  left: (isOwn) => (isOwn ? "auto" : 10),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 20,
  padding: theme.spacing(0.5),
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  zIndex: 2,
  display: "flex",
}));

const ConnectionStatusBar = styled(Box)(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case "connected":
        return theme.palette.success.main;
      case "disconnected":
        return theme.palette.error.main;
      case "reconnecting":
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  return {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: getColor(),
    color: "#fff",
    textAlign: "center",
    padding: theme.spacing(0.5),
    zIndex: 1000,
    transition: "transform 0.3s ease",
    transform: status === "hidden" ? "translateY(-100%)" : "translateY(0)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };
});

// Message Component with Options
const Message = ({
  message,
  isOwn,
  isFirst,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const isEdited =
    message.updatedAt && new Date(message.updatedAt) > new Date(message.sentAt);
  const canModify = message.senderId === currentUserId;
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "85%", // CHANGED: Increased from 70% to 85% for wider bubbles
          position: "relative",
        }}
        onMouseEnter={() => setShowOptions(canModify)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {showOptions && (
          <MessageOptions isOwn={isOwn}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(message)}
                sx={{ fontSize: 16 }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(message)}
                sx={{ fontSize: 16 }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </MessageOptions>
        )}

        <MessageBubble isOwn={isOwn} isFirst={isFirst} isEdited={isEdited}>
          {message.messageText}
        </MessageBubble>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOwn ? "flex-end" : "flex-start",
            mt: 0.3,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              color: "text.secondary",
            }}
          >
            {dayjs(message.sentAt).format("HH:mm")}
          </Typography>

          {message.readAt && isOwn && (
            <Tooltip title="Read">
              <CheckCircleOutlined
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  color: theme.palette.primary.main,
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};
// Add PropTypes for Message component
Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    senderId: PropTypes.string,
    messageText: PropTypes.string,
    sentAt: PropTypes.string,
    updatedAt: PropTypes.string,
    readAt: PropTypes.string,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Function to group messages by date
const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) return [];

  const groupedMessages = [];
  let currentDate = null;
  let currentGroup = null;

  messages.forEach((message) => {
    const messageDate = dayjs(message.sentAt).format("YYYY-MM-DD");

    if (messageDate !== currentDate) {
      currentDate = messageDate;
      currentGroup = { date: messageDate, messages: [] };
      groupedMessages.push(currentGroup);
    }

    currentGroup.messages.push(message);
  });

  return groupedMessages;
};

// Conversation list item component
const UserListItem = ({
  user,
  active,
  onClick,
  lastMessage = null,
  unreadCount = 0,
}) => {
  return (
    <UserItem active={active} onClick={onClick}>
      <OnlineStatusBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={user.online ? "dot" : "standard"}
      >
        <UserAvatar src={user.avatarUrl}>
          <UserOutlined />
        </UserAvatar>
      </OnlineStatusBadge>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="subtitle2"
            noWrap
            fontWeight={unreadCount > 0 ? 600 : 400}
          >
            {user.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {lastMessage?.sentAt && dayjs(lastMessage.sentAt).format("HH:mm")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            color={unreadCount > 0 ? "text.primary" : "text.secondary"}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "70%",
              fontWeight: unreadCount > 0 ? 500 : 400,
            }}
          >
            {lastMessage?.messageText || "No messages yet"}
          </Typography>

          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  height: 20,
                  minWidth: 20,
                },
              }}
            />
          )}
        </Box>
      </Box>
    </UserItem>
  );
};

// Add PropTypes for UserListItem component
UserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    avatarUrl: PropTypes.string,
    online: PropTypes.bool,
  }).isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  lastMessage: PropTypes.shape({
    messageText: PropTypes.string,
    sentAt: PropTypes.string,
  }),
  unreadCount: PropTypes.number,
};

// Default props
UserListItem.defaultProps = {
  lastMessage: null,
  unreadCount: 0,
};

// Main Component
const MessengerPage = () => {
  console.log(
    "SignalR library check:",
    typeof signalR !== "undefined" ? "✅ Loaded" : "❌ Missing"
  );

  // Check API configuration
  console.log("API_CHAT_URL:", API_CHAT_URL);
  console.log("CHAT_HUB_URL:", CHAT_HUB_URL);
  // Theme and responsive utilities
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Router hooks
  const { userId } = useParams();
  const navigate = useNavigate();

  // Refs
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hubConnection = useRef(null);
  const hasEffectRun = useRef(false);

  // State for users and conversations
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [currentChatSession, setCurrentChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userDetailsMobileOpen, setUserDetailsMobileOpen] = useState(false);
  const [usersListMobileOpen, setUsersListMobileOpen] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState({
    users: true,
    messages: false,
    session: false,
  });
  const [error, setError] = useState(null);
  const [messageError, setMessageError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Connection state
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [retryCount, setRetryCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  // API clients
  const chatClient = useMemo(() => new ChatClient(), []);
  const identityClient = useMemo(() => new IdentityClient(), []);
  const matchingClient = useMemo(() => new MatchingClient(), []);
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log("🔍 Testing API connection to:", API_CHAT_URL);
        const response = await fetch(`${API_CHAT_URL}/health`, {
          method: "GET",
          headers: { Accept: "application/json" },
          mode: "cors",
        });

        console.log("✅ API connection test result:", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        });
      } catch (error) {
        console.error("❌ Cannot connect to API server:", error);
        setError(
          `Cannot connect to chat server (${API_CHAT_URL}). Please check your network connection or try again later.`
        );
        setConnectionStatus("disconnected");
      }
    };

    testApiConnection();
  }, []);
  // Memoize fetchMessages function FIRST
  const fetchMessages = useCallback(
    async (chatSessionId) => {
      if (!chatSessionId) return;

      try {
        setLoading((prev) => ({ ...prev, messages: true }));

        const response = await chatClient.getChatMessages(chatSessionId, 1, 50);

        if (response && Array.isArray(response)) {
          const sortedMessages = response.sort(
            (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
          );

          setMessages(sortedMessages);

          if (activeUser) {
            sortedMessages.forEach((message) => {
              if (message.senderId !== currentUserId && !message.readAt) {
                markMessageAsRead(message);
              }
            });

            setUnreadCounts((prev) => ({ ...prev, [activeUser.id]: 0 }));
          }

          scrollToBottom();
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessageError("Failed to load messages. Please try refreshing.");
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }));
      }
    },
    [chatClient, activeUser, currentUserId]
  );

  // Define connectToSignalR AFTER fetchMessages is defined
  // Replace your connectToSignalR function with this simpler version
  const connectToSignalR = useCallback(
    async (chatSessionId) => {
      if (!chatSessionId) {
        console.error("No chat session ID provided");
        setConnectionStatus("disconnected");
        return;
      }

      // Stop existing connection
      if (hubConnection.current) {
        await hubConnection.current.stop();
      }

      const token = localStorage.getItem("token");

      try {
        setConnectionStatus("connecting");
        console.log("Creating SignalR connection to:", CHAT_HUB_URL);

        // Create a very simple connection first to test
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(CHAT_HUB_URL, {
            accessTokenFactory: () => token,
            // Try without specifying transport to let SignalR choose
          })
          .configureLogging(signalR.LogLevel.Debug) // Enable detailed logging
          .build();

        // Basic handlers
        connection.onclose(() => {
          console.log("Connection closed");
          setConnectionStatus("disconnected");
        });

        // Inside the connectToSignalR function
        connection.on("ReceiveMessage", (message) => {
          console.log("SignalR message received:", message);

          // Add the message to the messages state
          setMessages((prevMessages) => {
            // Check if message already exists (prevents duplicates)
            const exists = prevMessages.some((m) => m.id === message.id);
            if (exists) return prevMessages;

            // Add new message and sort by sent time
            const updatedMessages = [...prevMessages, message].sort(
              (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
            );

            return updatedMessages;
          });

          // Update last message for the chat list
          if (message.senderId !== currentUserId) {
            // Update last message display in sidebar
            setLastMessages((prev) => ({
              ...prev,
              [message.senderId]: message,
            }));

            // Auto-read if this chat is active
            if (activeUser && activeUser.id === message.senderId) {
              markMessageAsRead(message);
            } else {
              // Or increment unread count
              setUnreadCounts((prev) => ({
                ...prev,
                [message.senderId]: (prev[message.senderId] || 0) + 1,
              }));
            }
          } else {
            // It's your own message - update in the last messages list
            setLastMessages((prev) => {
              // Add null check for currentChatSession
              if (!currentChatSession) {
                console.warn(
                  "Chat session is null when processing own message"
                );
                return prev;
              }

              const otherUserId =
                currentChatSession.user1_id === currentUserId
                  ? currentChatSession.user2_id
                  : currentChatSession.user1_id;

              return {
                ...prev,
                [otherUserId]: message,
              };
            });
          }

          // Scroll to bottom to show new message
          scrollToBottom();
        });

        // Try to start with explicit error catching
        console.log("Starting SignalR connection...");
        await connection.start();
        console.log("Connection started successfully!");

        console.log("Joining chat session:", chatSessionId);
        await connection.invoke("JoinChatSession", chatSessionId);
        console.log("Joined chat session successfully!");

        hubConnection.current = connection;
        setConnectionStatus("connected");
      } catch (error) {
        console.error("SignalR connection error:", error);
        setConnectionStatus("disconnected");
        setError(`Connection error: ${error.message}`);
      }
    },
    [currentUserId]
  );
  // Get current user ID (from localStorage/auth)
  useEffect(() => {
    const storedUserData = localStorage.getItem("userProfile");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Fetch matched users
  useEffect(() => {
    const fetchMatchedUsers = async () => {
      // Prevent running multiple times in development due to React StrictMode
      if (hasEffectRun.current) return;
      hasEffectRun.current = true;

      try {
        setLoading((prev) => ({ ...prev, users: true }));
        // Get all matched players
        const matchesResponse = await matchingClient.getMatches(1, 100);

        if (!matchesResponse) {
          setMatchedUsers([]);
          return;
        }

        // For each match, get user profile
        const usersPromises = matchesResponse.map(async (match) => {
          try {
            const userProfile = await identityClient.profile(match.partnerId);

            return {
              id: match.partnerId,
              matchId: match.id,
              fullName: `${userProfile.firstName} ${userProfile.lastName}`,
              avatarUrl:
                userProfile.imageUrls && userProfile.imageUrls.length > 0
                  ? userProfile.imageUrls[0]
                  : null,
              gender: userProfile.gender,
              birthDate: userProfile.birthDate,
              email: userProfile.email,
              phone: userProfile.phone,
              selfIntroduction: userProfile.selfIntroduction,
              sports: userProfile.sports || [],
              imageUrls: userProfile.imageUrls || [],
              matchTime: match.matchTime,
              online: false,
            };
          } catch (error) {
            console.error(
              `Error fetching user profile for ${match.partnerId}:`,
              error
            );
            return null;
          }
        });

        const usersResults = await Promise.all(usersPromises);
        const validUsers = usersResults.filter((user) => user !== null);

        setMatchedUsers(validUsers);

        // Carefully handle navigation and active user selection to avoid loops
        if (userId && validUsers.length > 0) {
          const selectedUser = validUsers.find((u) => u.id === userId);
          if (selectedUser) {
            setActiveUser(selectedUser);
            // Don't call navigate here - we're already at the right URL
          } else if (validUsers.length > 0) {
            setActiveUser(validUsers[0]);
            // Use replace to avoid adding to navigation history
            navigate(`/messenger/${validUsers[0].id}`, { replace: true });
          }
        } else if (validUsers.length > 0 && !activeUser) {
          setActiveUser(validUsers[0]);
          navigate(`/messenger/${validUsers[0].id}`, { replace: true });
        }
      } catch (error) {
        console.error("Error fetching matched users:", error);
        setError("Failed to load matched users. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchMatchedUsers();

    // Cleanup function to reset the effect run flag
    return () => {
      hasEffectRun.current = false;
    };

    // Only deps that should trigger a refetch
  }, [userId, matchingClient, identityClient, navigate, activeUser]);

  // Initialize or find chat session
  const initiateChatSession = useCallback(
    async (partnerId) => {
      console.log("🔄 Initiating chat session with partner:", partnerId);
      console.log("🔑 Current user ID:", currentUserId);

      if (!partnerId || !currentUserId) {
        console.error(
          "❌ Missing partnerId or currentUserId, cannot initiate chat"
        );
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, session: true }));

        // Check if session already exists
        let sessionResponse;
        try {
          sessionResponse = await chatClient.getChatSessionByUsers(
            currentUserId,
            partnerId
          );
          if (!sessionResponse) {
            const createSessionRequest = new CreateChatSessionRequest({
              user2Id: partnerId,
            });

            sessionResponse = await chatClient.createChatSession(
              createSessionRequest
            );
          }
        } catch (error) {
          // If 404, create new session
          if (error.status === 404) {
            const createSessionRequest = new CreateChatSessionRequest({
              user2Id: partnerId,
            });

            sessionResponse = await chatClient.createChatSession(
              createSessionRequest
            );
          } else {
            throw error;
          }
        }

        if (sessionResponse && sessionResponse.chat_session_id) {
          setCurrentChatSession(sessionResponse);

          // Fetch messages for this session
          await fetchMessages(sessionResponse.chat_session_id);

          // Connect to SignalR and join chat session
          await connectToSignalR(sessionResponse.chat_session_id);
        }
      } catch (error) {
        console.error("Error initiating chat session:", error);
        setError("Failed to start chat session. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, session: false }));
      }
    },
    [currentUserId, chatClient, connectToSignalR, fetchMessages]
  );

  // Effect to handle chat session when active user changes
  useEffect(() => {
    if (activeUser && currentUserId) {
      initiateChatSession(activeUser.id);
    }

    // Cleanup function to disconnect from SignalR when component unmounts or user changes
    return () => {
      if (hubConnection.current) {
        hubConnection.current.stop();
      }
    };
  }, [activeUser, currentUserId, initiateChatSession]);

  // Mark message as read
  const markMessageAsRead = async (message) => {
    if (!message.id || !message.chatSessionId || message.readAt) return;

    try {
      await chatClient.markMessageAsRead(message.chatSessionId, message.id);

      // Update message in state
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.id === message.id ? { ...m, readAt: new Date().toISOString() } : m
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    console.log("Send button clicked");
    console.log("Connection status:", connectionStatus);
    console.log("Current chat session:", currentChatSession);
    console.log("Message text:", messageText);

    if (
      !messageText.trim() ||
      !currentChatSession ||
      !currentChatSession.chat_session_id
    ) {
      console.log("Cannot send - conditions not met");
      return;
    }

    try {
      setMessageError(null);

      if (editingMessage) {
        // Edit existing message
        const request = new EditMessageRequest({
          messageText: messageText,
        });

        await chatClient.editMessage(
          currentChatSession.chat_session_id,
          editingMessage.id,
          request
        );

        // Update UI optimistically
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m.id === editingMessage.id
              ? {
                  ...m,
                  messageText: messageText,
                  updatedAt: new Date().toISOString(),
                }
              : m
          )
        );

        // Clear editing state
        setEditingMessage(null);
      } else {
        // Send new message
        const request = new SendMessageRequest({
          messageText: messageText,
        });

        const response = await chatClient.sendMessage(
          currentChatSession.chat_session_id,
          request
        );

        // if (response) {
        //   setMessages((prevMessages) => [...prevMessages, response]);

        //   // Update last message state for the user list
        //   const otherUserId =
        //     currentChatSession.user1_id === currentUserId
        //       ? currentChatSession.user2_id
        //       : currentChatSession.user1_id;

        //   setLastMessages((prev) => ({
        //     ...prev,
        //     [otherUserId]: response,
        //   }));

        //   scrollToBottom();
        // }
      }

      // Clear message input
      setMessageText("");

      // Close emoji picker if open
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Handle rate limiting error
      if (error.status === 429) {
        setMessageError(
          "You're sending too many messages. Please wait a moment and try again."
        );
      } else {
        setMessageError("Failed to send message. Please try again.");
      }
    }
  };

  // Handle editing a message
  const handleEditMessage = (message) => {
    if (message.senderId !== currentUserId) return;

    setEditingMessage(message);
    setMessageText(message.messageText);

    // Focus input
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Handle deleting a message (placeholder - implement actual API call)
  const handleDeleteMessage = async (message) => {
    if (message.senderId !== currentUserId) return;

    try {
      // This would be the API call to delete the message
      // await chatClient.deleteMessage(message.chatSessionId, message.id);

      // For now, just filter it out locally
      setMessages((prevMessages) =>
        prevMessages.filter((m) => m.id !== message.id)
      );

      setSnackbar({
        open: true,
        message: "Message deleted",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete message",
        severity: "error",
      });
    }
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    // If already selected, do nothing
    if (activeUser && user.id === activeUser.id) return;

    setActiveUser(user);
    setMessages([]);
    navigate(`/messenger/${user.id}`);

    // On mobile, close drawer
    if (isMobile) {
      setUsersListMobileOpen(false);
    }

    // Reset unread count for this user
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
  };

  // Handle emoji selection
  const handleEmojiSelect = ({ emoji }) => {
    setMessageText((prev) => prev + emoji);

    // Focus input after selecting emoji
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Manual reconnect button handler
  const handleReconnect = () => {
    if (currentChatSession && currentChatSession.chat_session_id) {
      connectToSignalR(currentChatSession.chat_session_id);
    }
  };

  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    return dayjs().diff(dayjs(birthDate), "year");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("MMM D, YYYY");
  };

  // Format message date
  const formatMessageDate = (dateString) => {
    const date = dayjs(dateString);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");

    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return date.format("MMMM D, YYYY");
    }
  };

  // Filter users by search term
  const filteredUsers = matchedUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  // Render user details panel
  const renderUserDetails = () => {
    if (!activeUser) return null;

    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Profile</Typography>

          {isMobile && (
            <IconButton onClick={() => setUserDetailsMobileOpen(false)}>
              <CloseOutlined />
            </IconButton>
          )}
        </Box>

        <UserInfoSection sx={{ textAlign: "center" }}>
          <LargeAvatar src={activeUser.avatarUrl}>
            <UserOutlined style={{ fontSize: 60 }} />
          </LargeAvatar>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {activeUser.fullName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {activeUser.gender === "Male"
              ? "Nam"
              : activeUser.gender === "Female"
              ? "Nữ"
              : "Khác"}
            {activeUser.birthDate &&
              ` • ${calculateAge(activeUser.birthDate)} tuổi`}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Tooltip title="Audio call">
              <IconButton
                color="primary"
                sx={{
                  mx: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: "scale(1.1)",
                  },
                }}
              >
                <PhoneOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Video call">
              <IconButton
                color="secondary"
                sx={{
                  mx: 1,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    transform: "scale(1.1)",
                  },
                }}
              >
                <VideoCameraOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        </UserInfoSection>

        <UserInfoSection>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thông tin cá nhân
          </Typography>

          {activeUser.email && (
            <UserDetail>
              <MailOutlined /> {activeUser.email}
            </UserDetail>
          )}

          {activeUser.phone && (
            <UserDetail>
              <PhoneOutlined /> {activeUser.phone}
            </UserDetail>
          )}

          {activeUser.birthDate && (
            <UserDetail>
              <CalendarOutlined /> {formatDate(activeUser.birthDate)}
            </UserDetail>
          )}

          <UserDetail>
            <TeamOutlined /> Ghép trận vào: {formatDate(activeUser.matchTime)}
          </UserDetail>
        </UserInfoSection>

        {activeUser.selfIntroduction && (
          <UserInfoSection>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Giới thiệu
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              {activeUser.selfIntroduction}
            </Typography>
          </UserInfoSection>
        )}

        {activeUser.sports && activeUser.sports.length > 0 && (
          <UserInfoSection>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Kỹ năng thể thao
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {activeUser.sports.map((sport) => (
                <Chip
                  key={sport.sportId}
                  icon={<TrophyOutlined />}
                  label={`${sport.sportName}: ${sport.skillLevel}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </UserInfoSection>
        )}

        {activeUser.imageUrls && activeUser.imageUrls.length > 0 && (
          <UserInfoSection>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Hình ảnh
            </Typography>

            <ImageList cols={2} gap={8}>
              {activeUser.imageUrls.map((url, index) => (
                <Zoom
                  in={true}
                  key={index}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ImageListItem>
                    <img
                      src={url}
                      alt={`${activeUser.fullName} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </ImageListItem>
                </Zoom>
              ))}
            </ImageList>
          </UserInfoSection>
        )}
      </Box>
    );
  };

  // Make sure to add this return statement at the end of your component
  return (
    <RootContainer>
      <ConnectionStatusBar
        status={connectionStatus === "connected" ? "hidden" : connectionStatus}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {connectionStatus === "connecting" && (
            <>
              <SyncOutlined spin style={{ marginRight: 8 }} />
              Connecting to chat server...
            </>
          )}

          {connectionStatus === "reconnecting" && (
            <>
              <SyncOutlined spin style={{ marginRight: 8 }} />
              Reconnecting to chat server...
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 2, color: "white", borderColor: "white" }}
                onClick={handleReconnect}
              >
                Retry Now
              </Button>
            </>
          )}

          {connectionStatus === "disconnected" && (
            <>
              <WarningOutlined style={{ marginRight: 8 }} />
              Disconnected from chat server
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 2, color: "white", borderColor: "white" }}
                onClick={handleReconnect}
              >
                Reconnect
              </Button>
            </>
          )}
        </Box>
      </ConnectionStatusBar>

      {/* Rest of your UI components */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={usersListMobileOpen}
          onClose={() => setUsersListMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 320,
              boxSizing: "border-box",
            },
          }}
        >
          <UsersListContent
            users={filteredUsers}
            activeUser={activeUser}
            handleSelectUser={handleSelectUser}
            loading={loading.users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            lastMessages={lastMessages}
            unreadCounts={unreadCounts}
          />
        </Drawer>
      ) : (
        <MatchedUsersContainer>
          <UsersListContent
            users={filteredUsers}
            activeUser={activeUser}
            handleSelectUser={handleSelectUser}
            loading={loading.users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            lastMessages={lastMessages}
            unreadCounts={unreadCounts}
          />
        </MatchedUsersContainer>
      )}

      <ChatContainer>
        {activeUser ? (
          <>
            <ChatHeader position="static">
              <Toolbar sx={{ minHeight: 64, px: 2, gap: 1 }}>
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setUsersListMobileOpen(true)}
                  >
                    <ArrowLeftOutlined />
                  </IconButton>
                )}

                <UserAvatar src={activeUser.avatarUrl}>
                  <UserOutlined />
                </UserAvatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {activeUser.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activeUser.online ? "Online" : "Last seen recently"}
                  </Typography>
                </Box>

                <IconButton
                  color="primary"
                  onClick={() => setUserDetailsMobileOpen(true)}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <InfoCircleOutlined />
                </IconButton>
              </Toolbar>
            </ChatHeader>

            <MessagesList>
              {loading.messages ? (
                <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                  <Lottie
                    loop
                    animationData={loadingAnimation}
                    play
                    style={{ width: 150, height: 150 }}
                  />
                </Box>
              ) : messageError ? (
                <Alert
                  severity="error"
                  sx={{ m: 2 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setMessageError(null);
                        if (currentChatSession) {
                          fetchMessages(currentChatSession.chat_session_id);
                        }
                      }}
                    >
                      Retry
                    </Button>
                  }
                >
                  {messageError}
                </Alert>
              ) : messages.length === 0 ? (
                <EmptyState>
                  <Lottie
                    loop
                    animationData={emptyAnimation}
                    play
                    style={{ width: 200, height: 200 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No messages yet
                  </Typography>
                  <Typography variant="body2">
                    Start the conversation by sending a message
                  </Typography>
                </EmptyState>
              ) : (
                <AnimatePresence>
                  {groupedMessages.map((group, groupIndex) => (
                    <motion.div
                      key={`group-${groupIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                    >
                      <DateSeparator>
                        {formatMessageDate(group.date)}
                      </DateSeparator>

                      {group.messages.map((msg, msgIndex) => {
                        const isOwn = msg.senderId === currentUserId;
                        const isFirst =
                          msgIndex === 0 ||
                          group.messages[msgIndex - 1].senderId !==
                            msg.senderId;

                        return (
                          <Message
                            key={msg.id}
                            message={msg}
                            isOwn={isOwn}
                            isFirst={isFirst}
                            currentUserId={currentUserId}
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
                          />
                        );
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              <div ref={messagesEndRef} />
            </MessagesList>

            <MessageInputContainer>
              {editingMessage && (
                <Box
                  sx={{
                    p: 1,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption">
                    <EditOutlined style={{ marginRight: 8 }} />
                    Editing message
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingMessage(null);
                      setMessageText("");
                    }}
                  >
                    <CloseOutlined />
                  </IconButton>
                </Box>
              )}

              <Box sx={{ position: "relative" }}>
                {showEmojiPicker && (
                  <EmojiPickerContainer>
                    <EmojiPicker
                      onEmojiClick={handleEmojiSelect}
                      width={320}
                      height={400}
                      previewConfig={{ showPreview: false }}
                    />
                  </EmojiPickerContainer>
                )}

                <MessageInput
                  fullWidth
                  placeholder={
                    connectionStatus !== "connected"
                      ? "Connecting to chat server..."
                      : "Type a message..."
                  }
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  inputRef={messageInputRef}
                  multiline
                  maxRows={4}
                  disabled={connectionStatus !== "connected"}
                  error={!!messageError}
                  helperText={messageError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          disabled={connectionStatus !== "connected"}
                        >
                          <SmileOutlined
                            style={{
                              color:
                                connectionStatus === "connected"
                                  ? theme.palette.primary.main
                                  : theme.palette.text.disabled,
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={sendMessage}
                          disabled={
                            !messageText.trim() ||
                            connectionStatus !== "connected"
                          }
                          sx={{
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: messageText.trim()
                                ? "scale(1.1)"
                                : "none",
                            },
                          }}
                        >
                          {connectionStatus !== "connected" ? (
                            <SyncOutlined spin />
                          ) : (
                            <SendOutlined
                              style={{
                                color: messageText.trim()
                                  ? theme.palette.primary.main
                                  : "inherit",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </MessageInputContainer>
          </>
        ) : (
          <EmptyState>
            {error ? (
              <>
                <Lottie
                  loop
                  animationData={connectionErrorAnimation}
                  play
                  style={{ width: 200, height: 200 }}
                />
                <Typography variant="h6" gutterBottom color="error">
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                  sx={{ mt: 2 }}
                >
                  Reload Page
                </Button>
              </>
            ) : loading.users ? (
              <>
                <CircularProgress size={50} sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Loading your matches...
                </Typography>
              </>
            ) : filteredUsers.length === 0 ? (
              <>
                <TeamOutlined
                  style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }}
                />
                <Typography variant="h6" gutterBottom>
                  No matched players yet
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Match with players to start chatting with them
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/find-match")}
                >
                  Find Players to Match
                </Button>
              </>
            ) : (
              <>
                <MessageOutlined
                  style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }}
                />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2">
                  Choose a player to start chatting
                </Typography>

                {isMobile && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => setUsersListMobileOpen(true)}
                  >
                    Show Matched Players
                  </Button>
                )}
              </>
            )}
          </EmptyState>
        )}
      </ChatContainer>

      {/* User details panel - visible on desktop, drawer on mobile/tablet */}
      {isMobile || isTablet ? (
        <Drawer
          anchor="right"
          open={userDetailsMobileOpen}
          onClose={() => setUserDetailsMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 300,
              boxSizing: "border-box",
            },
          }}
        >
          {renderUserDetails()}
        </Drawer>
      ) : (
        activeUser && (
          <UserDetailsContainer>{renderUserDetails()}</UserDetailsContainer>
        )
      )}

      {/* Error snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          action={
            snackbar.action && (
              <Button color="inherit" size="small" onClick={snackbar.action}>
                Reconnect
              </Button>
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </RootContainer>
  );
};

// Users list content component
const UsersListContent = ({
  users,
  activeUser,
  handleSelectUser,
  loading,
  searchTerm,
  setSearchTerm,
  lastMessages,
  unreadCounts,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            `linear-gradient(45deg, ${alpha(
              theme.palette.primary.light,
              0.1
            )}, ${alpha(theme.palette.primary.main, 0.05)})`,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <MessageOutlined style={{ marginRight: 8 }} />
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chat with your matched players
        </Typography>
      </Box>

      <SearchBar
        placeholder="Search players..."
        variant="outlined"
        fullWidth
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined style={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      <UsersList>
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, index) => (
              <Box
                key={index}
                sx={{ p: 2, display: "flex", alignItems: "center" }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ width: "100%" }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>
            ))
        ) : users.length > 0 ? (
          users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              active={activeUser?.id === user.id}
              onClick={() => handleSelectUser(user)}
              lastMessage={lastMessages[user.id]}
              unreadCount={unreadCounts[user.id] || 0}
            />
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              {searchTerm ? "No matches found" : "No matched players yet"}
            </Typography>

            {!searchTerm && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate("/find-match")}
              >
                Find Players
              </Button>
            )}
          </Box>
        )}
      </UsersList>
    </>
  );
};

// Add PropTypes for UsersListContent component
UsersListContent.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      online: PropTypes.bool,
    })
  ).isRequired,
  activeUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  handleSelectUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  lastMessages: PropTypes.object.isRequired,
  unreadCounts: PropTypes.object.isRequired,
};

export default MessengerPage;
