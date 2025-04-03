import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
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
  Button,
  Chip,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Client as ChatClient,
  SendMessageRequest,
  CreateChatSessionRequest,
} from "@/API/ChatApi";
import { Client as IdentityClient } from "@/API/IdentityApi";
import { Client as MatchingClient } from "@/API/MatchingApi";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

// Styled Components
const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 64px)",
  backgroundColor: theme.palette.background.default,
  overflow: "hidden",
}));

const ConversationListContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
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
}));

const UserInfoContainer = styled(Paper)(({ theme }) => ({
  width: 300,
  height: "100%",
  borderRadius: 0,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
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
      boxShadow: "0 0 0 2px rgba(24, 144, 255, 0.2)",
    },
  },
}));

const ConversationList = styled(Box)(({ theme }) => ({
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

const ConversationItem = styled(Box, {
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

const ChatMessages = styled(Box)(({ theme }) => ({
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
      boxShadow: "0 0 0 2px rgba(24, 144, 255, 0.2)",
    },
  },
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOwn" && prop !== "isFirst",
})(({ theme, isOwn, isFirst }) => ({
  maxWidth: "70%",
  minWidth: 100,
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
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 0),
  textAlign: "center",
  margin: theme.spacing(1, 0),
}));

const UserInfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const UserStat = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  margin: theme.spacing(0.7, 0),
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: 16,
  },
}));

const AvatarBadge = styled(Badge)(({ theme }) => ({
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

const NoConversationState = styled(Box)(({ theme }) => ({
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

// Message component
const Message = ({ message, isOwn, isFirst, timestamp }) => {
  return (
    <Box sx={{ alignSelf: isOwn ? "flex-end" : "flex-start", maxWidth: "70%" }}>
      <MessageBubble isOwn={isOwn} isFirst={isFirst}>
        {message}
      </MessageBubble>
      <Typography
        variant="caption"
        sx={{
          fontSize: 10,
          textAlign: isOwn ? "right" : "left",
          display: "block",
          mt: 0.3,
          ml: isOwn ? 0 : 1,
          mr: isOwn ? 1 : 0,
          color: "text.secondary",
        }}
      >
        {dayjs(timestamp).format("HH:mm")}
      </Typography>
    </Box>
  );
};

// Function to group messages by date
const groupMessagesByDate = (messages) => {
  const groupedMessages = [];

  messages.forEach((message) => {
    const messageDate = dayjs(message.timestamp).format("YYYY-MM-DD");

    // Check if we already have a group for this date
    const existingGroup = groupedMessages.find(
      (group) => group.date === messageDate
    );

    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groupedMessages.push({
        date: messageDate,
        messages: [message],
      });
    }
  });

  return groupedMessages;
};

// Conversation list item component
const Conversation = ({
  conversation,
  active,
  onClick,
  lastMessage,
  unreadCount,
}) => {
  const theme = useTheme();

  return (
    <ConversationItem active={active} onClick={onClick}>
      <AvatarBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={conversation.online ? "dot" : "standard"}
      >
        <UserAvatar src={conversation.avatar}>
          <UserOutlined />
        </UserAvatar>
      </AvatarBadge>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="subtitle2"
            noWrap
            fontWeight={unreadCount > 0 ? 600 : 400}
          >
            {conversation.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {lastMessage?.timestamp &&
              dayjs(lastMessage.timestamp).format("HH:mm")}
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
            {lastMessage?.content || "No messages yet"}
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
    </ConversationItem>
  );
};

// Main Component
const MessengerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // State
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userDetailsMobileOpen, setUserDetailsMobileOpen] = useState(false);
  const [conversationListMobileOpen, setConversationListMobileOpen] =
    useState(false);

  // API clients
  const chatClient = new ChatClient();
  const identityClient = new IdentityClient();
  const matchingClient = new MatchingClient();

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Get all matched players
        const matchedPlayers = await matchingClient.getMatches(1, 100);

        // For each match, get user profile and create conversation object
        const conversationPromises = matchedPlayers.items.map(async (match) => {
          try {
            const userProfile = await identityClient.profile(match.partnerId);

            return {
              id: match.id, // Match ID can be used to create chat session
              userId: match.partnerId,
              name: `${userProfile.firstName} ${userProfile.lastName}`,
              avatar:
                userProfile.imageUrls && userProfile.imageUrls.length > 0
                  ? userProfile.imageUrls[0]
                  : null,
              lastActive: match.matchTime,
              online: false, // This would come from a real-time service
              userProfile: userProfile,
            };
          } catch (error) {
            console.error("Error fetching profile for match:", error);
            return null;
          }
        });

        const conversationResults = await Promise.all(conversationPromises);
        const validConversations = conversationResults.filter(
          (conv) => conv !== null
        );

        setConversations(validConversations);

        // If chatId is provided in URL, set it as active
        if (chatId && validConversations.length > 0) {
          const selectedConversation = validConversations.find(
            (c) => c.id === chatId
          );
          if (selectedConversation) {
            setActiveConversation(selectedConversation);
            fetchMessages(selectedConversation.id);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [chatId]);

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      // In a real app, this would fetch messages from the API
      // For demo, we'll use mock data

      // This would be replaced with actual API call:
      // const messages = await chatClient.getChatMessages(conversationId, 1, 50);

      const mockMessages = [
        {
          id: 1,
          senderId: "current-user-id", // This would be the current user ID
          content: "Hey, I saw your profile and we matched!",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          isRead: true,
        },
        {
          id: 2,
          senderId: "other-user-id", // This would be the conversation partner's ID
          content:
            "Hi there! Nice to meet you, I'm looking forward to playing together!",
          timestamp: new Date(Date.now() - 82800000).toISOString(),
          isRead: true,
        },
        {
          id: 3,
          senderId: "current-user-id",
          content: "Great! Are you free this weekend for a match?",
          timestamp: new Date(Date.now() - 79200000).toISOString(),
          isRead: true,
        },
        {
          id: 4,
          senderId: "other-user-id",
          content: "Yes, I can play on Saturday afternoon. How about 3 PM?",
          timestamp: new Date(Date.now() - 75600000).toISOString(),
          isRead: true,
        },
        {
          id: 5,
          senderId: "current-user-id",
          content:
            "Perfect, that works for me. Let's meet at the sports center on Nguyen Hue street.",
          timestamp: new Date(Date.now() - 72000000).toISOString(),
          isRead: true,
        },
        {
          id: 6,
          senderId: "other-user-id",
          content: "Sounds good! I'll be there. Looking forward to it!",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: false,
        },
      ];

      setMessages(mockMessages);

      // Scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    try {
      setSendingMessage(true);

      // In a real app, this would send the message through the API
      // await chatClient.sendMessage(activeConversation.id, new SendMessageRequest({
      //   messageText: messageText
      // }));

      // For demo, we'll add the message locally
      const newMessage = {
        id: messages.length + 1,
        senderId: "current-user-id", // This would be the current user ID
        content: messageText,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setMessages([...messages, newMessage]);
      setMessageText("");

      // Close emoji picker if open
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      }

      // Scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation.id);
    // Update URL
    navigate(`/chat/${conversation.id}`);

    // On mobile, close conversation list drawer
    if (isMobile) {
      setConversationListMobileOpen(false);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
    // Focus input after selecting emoji
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Filter conversations by search term
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format the date for message groups
  const formatMessageDate = (dateString) => {
    const date = dayjs(dateString);
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return date.format("MMMM D, YYYY");
    }
  };

  // User details section
  const renderUserDetails = () => {
    if (!activeConversation) return null;

    const user = activeConversation.userProfile;

    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          {isMobile && (
            <IconButton onClick={() => setUserDetailsMobileOpen(false)}>
              <CloseOutlined />
            </IconButton>
          )}
        </Box>

        <UserInfoSection sx={{ textAlign: "center" }}>
          <LargeAvatar src={activeConversation.avatar}>
            <UserOutlined style={{ fontSize: 60 }} />
          </LargeAvatar>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {activeConversation.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {user.gender === "Male"
              ? "Nam"
              : user.gender === "Female"
              ? "Nữ"
              : "Khác"}
            {user.birthDate && ` • ${calculateAge(user.birthDate)} tuổi`}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Tooltip title="Audio call">
              <IconButton color="primary" sx={{ mx: 1 }}>
                <PhoneOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Video call">
              <IconButton color="primary" sx={{ mx: 1 }}>
                <VideoCameraOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="View profile">
              <IconButton color="primary" sx={{ mx: 1 }}>
                <UserOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        </UserInfoSection>

        <UserInfoSection>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thông tin cá nhân
          </Typography>

          {user.email && (
            <UserStat>
              <MailOutlined /> {user.email}
            </UserStat>
          )}

          {user.phone && (
            <UserStat>
              <PhoneOutlined /> {user.phone}
            </UserStat>
          )}

          {user.birthDate && (
            <UserStat>
              <CalendarOutlined /> {formatDate(user.birthDate)}
            </UserStat>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Giới thiệu
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {user.selfIntroduction ||
              "Người chơi chưa thêm thông tin giới thiệu"}
          </Typography>
        </UserInfoSection>

        {user.sports && user.sports.length > 0 && (
          <UserInfoSection>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Kỹ năng thể thao
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user.sports.map((sport) => (
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

        {user.imageUrls && user.imageUrls.length > 0 && (
          <UserInfoSection>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Hình ảnh
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user.imageUrls.map((url, index) => (
                <Box
                  key={index}
                  component="img"
                  src={url}
                  alt={`Profile ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
            </Box>
          </UserInfoSection>
        )}
      </Box>
    );
  };

  // Helper function for calculating age
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    return dayjs().diff(dayjs(birthDate), "year");
  };

  // Helper function for formatting date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <RootContainer>
      {/* Conversation list - visible on desktop, drawer on mobile */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={conversationListMobileOpen}
          onClose={() => setConversationListMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 320,
              boxSizing: "border-box",
            },
          }}
        >
          <ConversationListContent
            conversations={filteredConversations}
            activeConversation={activeConversation}
            handleSelectConversation={handleSelectConversation}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Drawer>
      ) : (
        <ConversationListContainer>
          <ConversationListContent
            conversations={filteredConversations}
            activeConversation={activeConversation}
            handleSelectConversation={handleSelectConversation}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </ConversationListContainer>
      )}

      {/* Chat area */}
      <ChatContainer>
        {activeConversation ? (
          <>
            <ChatHeader position="static">
              <Toolbar sx={{ minHeight: 64, px: 2, gap: 1 }}>
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setConversationListMobileOpen(true)}
                  >
                    <ArrowLeftOutlined />
                  </IconButton>
                )}

                <UserAvatar src={activeConversation.avatar}>
                  <UserOutlined />
                </UserAvatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {activeConversation.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activeConversation.online
                      ? "Online"
                      : "Last seen " +
                        dayjs(activeConversation.lastActive).fromNow()}
                  </Typography>
                </Box>

                <IconButton
                  color="primary"
                  onClick={() => setUserDetailsMobileOpen(true)}
                >
                  <InfoCircleOutlined />
                </IconButton>
              </Toolbar>
            </ChatHeader>

            <ChatMessages>
              {groupMessagesByDate(messages).map((group, groupIndex) => (
                <React.Fragment key={`group-${groupIndex}`}>
                  <TimeStamp>{formatMessageDate(group.date)}</TimeStamp>

                  {group.messages.map((msg, msgIndex) => {
                    const isOwn = msg.senderId === "current-user-id";
                    const isFirst =
                      msgIndex === 0 ||
                      group.messages[msgIndex - 1].senderId !== msg.senderId;

                    return (
                      <Message
                        key={msg.id}
                        message={msg.content}
                        isOwn={isOwn}
                        isFirst={isFirst}
                        timestamp={msg.timestamp}
                      />
                    );
                  })}
                </React.Fragment>
              ))}

              <div ref={messagesEndRef} />
            </ChatMessages>

            <MessageInputContainer>
              <Box sx={{ position: "relative" }}>
                {showEmojiPicker && (
                  <EmojiPickerContainer>
                    <EmojiPicker
                      onEmojiClick={handleEmojiSelect}
                      width={320}
                      height={400}
                    />
                  </EmojiPickerContainer>
                )}

                <MessageInput
                  fullWidth
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  inputRef={messageInputRef}
                  multiline
                  maxRows={4}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <SmileOutlined
                            style={{ color: theme.palette.primary.main }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={sendMessage}
                          disabled={!messageText.trim() || sendingMessage}
                        >
                          {sendingMessage ? (
                            <LoadingOutlined
                              style={{ color: theme.palette.primary.main }}
                            />
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
          <NoConversationState>
            <TeamOutlined
              style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              Select a conversation
            </Typography>
            <Typography variant="body2">
              Choose a player to start chatting with them
            </Typography>

            {isMobile && conversations.length > 0 && (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setConversationListMobileOpen(true)}
              >
                Show Conversations
              </Button>
            )}
          </NoConversationState>
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
        activeConversation && (
          <UserInfoContainer>{renderUserDetails()}</UserInfoContainer>
        )
      )}
    </RootContainer>
  );
};

// Separate component for conversation list content to avoid duplication
const ConversationListContent = ({
  conversations,
  activeConversation,
  handleSelectConversation,
  loading,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight="bold">
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chat with your matched players
        </Typography>
      </Box>

      <SearchBar
        placeholder="Search conversations..."
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

      <ConversationList>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <Conversation
              key={conv.id}
              conversation={conv}
              active={activeConversation?.id === conv.id}
              onClick={() => handleSelectConversation(conv)}
              lastMessage={{
                content: "Click to start chatting",
                timestamp: conv.lastActive,
              }}
              unreadCount={0}
            />
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              {searchTerm ? "No conversations found" : "No matched players yet"}
            </Typography>
          </Box>
        )}
      </ConversationList>
    </>
  );
};

// PropTypes validation for ConversationListContent
ConversationListContent.propTypes = {
  conversations: PropTypes.array.isRequired,
  activeConversation: PropTypes.object,
  handleSelectConversation: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

// PropTypes validation for Conversation component
Conversation.propTypes = {
  conversation: PropTypes.object.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  lastMessage: PropTypes.object,
  unreadCount: PropTypes.number,
};

// PropTypes validation for Message component
Message.propTypes = {
  message: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default MessengerPage;
