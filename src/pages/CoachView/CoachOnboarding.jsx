import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Container,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Upload,
  Spin,
  message,
  TimePicker,
  Collapse,
  Typography as AntTypography,
  Select as AntSelect,
} from "antd";
import {
  FitnessCenterOutlined,
  CheckCircleOutline,
  CelebrationOutlined,
  ArrowForwardIos,
  ArrowBackIos,
  AddCircleOutlined,
  DeleteOutlined,
  SportsTennisOutlined,
  SportsBasketballOutlined,
  DirectionsRunOutlined,
  EmojiEventsOutlined,
  InfoOutlined,
  Close,
  EventAvailable,
  AccessTime,
} from "@mui/icons-material";
import { PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Client } from "@/API/CoachApi";
import { Client as CourtClient } from "@/API/CourtApi";
import dayjs from "dayjs";

const { Panel } = Collapse;
const { Title, Text } = AntTypography;
const { Option } = AntSelect;

// Day options for schedule selection
const dayOptions = [
  { label: "Thứ hai", value: 1 },
  { label: "Thứ ba", value: 2 },
  { label: "Thứ tư", value: 3 },
  { label: "Thứ năm", value: 4 },
  { label: "Thứ sáu", value: 5 },
  { label: "Thứ bảy", value: 6 },
  { label: "Chủ nhật", value: 7 },
];

// Define background patterns outside of the component
const backgroundPatterns = [
  {
    top: "5%",
    right: "10%",
    icon: <SportsTennisOutlined style={{ fontSize: 120, opacity: 0.07 }} />,
  },
  {
    bottom: "15%",
    left: "5%",
    icon: <SportsBasketballOutlined style={{ fontSize: 150, opacity: 0.07 }} />,
  },
  {
    top: "40%",
    left: "8%",
    icon: <DirectionsRunOutlined style={{ fontSize: 100, opacity: 0.05 }} />,
  },
  {
    bottom: "10%",
    right: "8%",
    icon: <EmojiEventsOutlined style={{ fontSize: 130, opacity: 0.07 }} />,
  },
];

const CoachOnboarding = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coach, setCoach] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    sportIds: [],
    ratePerHour: 200000,
  });

  // State variables for tracking actual files
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // State for tracking previews
  const [avatarPreview, setAvatarPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // State for schedule
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: 1,
    startTime: "08:00:00",
    endTime: "17:00:00",
  });

  const [sports, setSports] = useState([]);
  const [coachId, setCoachId] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userProfile);

  // Progress indicator
  const progress = ((activeStep + 1) / 4) * 100;

  // Add state for showing/hiding schedule notice
  const [showScheduleNotice, setShowScheduleNotice] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        // Create a new instance of CourtClient
        const courtClient = new CourtClient();
        // Call the getSports method
        const response = await courtClient.getSports();

        // Set the sports data
        if (response && response.sports) {
          setSports(response.sports);
        } else {
          message.warning("Không có dữ liệu thể thao");
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
        message.error(
          "Không thể tải dữ liệu thể thao: " +
            (error.message || "Lỗi không xác định")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Custom upload handler for avatar
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      setAvatarFile(file);
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Không thể tải lên ảnh đại diện");
    }
  };

  // Custom upload handler for gallery images
  const customGalleryUpload = async ({ file, onSuccess }) => {
    try {
      setGalleryFiles((prev) => [...prev, file]);
      const previewURL = URL.createObjectURL(file);
      setGalleryPreviews((prev) => [...prev, previewURL]);
      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Không thể tải lên hình ảnh");
    }
  };

  // Add schedule to list
  const addSchedule = () => {
    if (
      !newSchedule.dayOfWeek ||
      !newSchedule.startTime ||
      !newSchedule.endTime
    ) {
      message.error("Vui lòng điền đầy đủ thông tin lịch trình");
      return;
    }

    // Validate time slots
    if (newSchedule.startTime >= newSchedule.endTime) {
      message.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    // Check for overlapping schedules
    const daySchedules = schedules.filter(
      (s) => s.dayOfWeek === newSchedule.dayOfWeek
    );
    const overlapping = daySchedules.some(
      (s) =>
        (newSchedule.startTime >= s.startTime &&
          newSchedule.startTime < s.endTime) ||
        (newSchedule.endTime > s.startTime &&
          newSchedule.endTime <= s.endTime) ||
        (newSchedule.startTime <= s.startTime &&
          newSchedule.endTime >= s.endTime)
    );

    if (overlapping) {
      message.error("Lịch trình trùng với khoảng thời gian đã có");
      return;
    }

    setSchedules([...schedules, { ...newSchedule }]);

    // Reset new schedule form
    setNewSchedule({
      dayOfWeek: 1,
      startTime: "08:00:00",
      endTime: "17:00:00",
    });

    message.success("Đã thêm lịch trình");
  };

  // Remove schedule from list
  const removeSchedule = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
    message.success("Đã xóa lịch trình");
  };

  // Handle creating coach profile
  const handleCreateCoachProfile = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (
        !coach.fullName ||
        !coach.email ||
        !coach.phone ||
        !coach.sportIds.length
      ) {
        message.error("Vui lòng điền đầy đủ các trường bắt buộc");
        setLoading(false);
        return;
      }

      // Validate avatar
      if (!avatarFile) {
        message.error("Vui lòng tải lên ảnh đại diện");
        setLoading(false);
        return;
      }

      // Create a proper request object
      const requestObject = {
        fullName: coach.fullName,
        email: coach.email,
        phone: coach.phone,
        bio: coach.bio || "coach",
        ratePerHour: coach.ratePerHour,
        // For each sportId in the array, we need to create a request
        // The client will handle this by appending each sportId to the FormData
        sportId: coach.sportIds[0], // Primary sport ID (first one)
        // Files need to be passed directly
        avatar: avatarFile,
        images: galleryFiles,
      };

      // Call API to create coach profile
      const client = new Client();
      const response = await client.createCoach(requestObject);

      // Save the coach ID for future steps
      setCoachId(response.id);

      message.success("Hồ sơ huấn luyện viên đã được tạo thành công!");
      handleNext();
    } catch (error) {
      console.error("Error creating coach profile:", error);
      message.error("Không thể tạo hồ sơ huấn luyện viên: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating coach schedules
  const handleCreateCoachSchedules = async () => {
    try {
      setLoading(true);

      // Validate schedules
      if (schedules.length === 0) {
        message.error("Vui lòng thêm ít nhất một lịch trình");
        setLoading(false);
        return;
      }

      const client = new Client();

      // Create each schedule
      for (const schedule of schedules) {
        const createScheduleRequest = {
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };

        await client.createCoachSchedule(createScheduleRequest);
      }

      message.success("Lịch trình đã được tạo thành công!");
      handleNext();
    } catch (error) {
      console.error("Error creating coach schedules:", error);
      message.error("Không thể tạo lịch trình: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle finish button
  const handleFinish = () => {
    window.location.href = "/coach/dashboard";
  };

  // Enhanced step title
  const StepTitle = ({ title }) => (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0px 0px 1px rgba(0,0,0,0.05)",
      }}
    >
      {title}
    </Typography>
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.9
        )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        pt: 6,
        pb: 8,
      }}
    >
      {/* Decorative background elements - FIXED VERSION */}
      {backgroundPatterns.map((pattern, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: pattern.top,
            right: pattern.right,
            bottom: pattern.bottom,
            left: pattern.left,
            zIndex: 0,
            opacity: 0.7,
            pointerEvents: "none",
            color: theme.palette.primary.light,
            animation: `float${index} ${
              3 + index
            }s ease-in-out infinite alternate`,
          }}
        >
          {pattern.icon}
        </Box>
      ))}
      {/* Define keyframes as separate styles */}
      <style>
        {`
          @keyframes float0 {
            0% { transform: rotate(45deg) translateY(0px); }
            100% { transform: rotate(45deg) translateY(10px); }
          }
          @keyframes float1 {
            0% { transform: rotate(-15deg) translateY(0px); }
            100% { transform: rotate(-15deg) translateY(10px); }
          }
          @keyframes float2 {
            0% { transform: rotate(10deg) translateY(0px); }
            100% { transform: rotate(10deg) translateY(10px); }
          }
          @keyframes float3 {
            0% { transform: rotate(-5deg) translateY(0px); }
            100% { transform: rotate(-5deg) translateY(10px); }
          }
        `}
      </style>
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Box
            sx={{ textAlign: "center", mb: 5, position: "relative", zIndex: 1 }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Thiết Lập Hồ Sơ Huấn Luyện Viên
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Bắt đầu hành trình huấn luyện và kết nối với học viên
            </Typography>

            {/* Progress indicator */}
            <Box
              sx={{
                position: "relative",
                height: 6,
                width: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 3,
                mx: "auto",
                mt: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 3,
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: theme.palette.text.secondary }}
            >
              Bước {activeStep + 1} của 4
            </Typography>
          </Box>
        </motion.div>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: 1000,
            mx: "auto",
            borderRadius: 3,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            background: `rgba(255, 255, 255, 0.98)`,
            backdropFilter: "blur(10px)",
            position: "relative",
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 12px 50px rgba(0,0,0,0.16)",
            },
          }}
        >
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              "& .MuiStepConnector-line": {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                borderLeftWidth: 2,
              },
              "& .MuiStepLabel-iconContainer": {
                padding: 0.5,
                borderRadius: "50%",
                bgcolor:
                  activeStep === 0
                    ? "transparent"
                    : alpha(theme.palette.primary.main, 0.1),
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            {/* Welcome Step */}
            <Step>
              <StepLabel>
                <StepTitle title="Chào Mừng" />
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 3,
                          pb: 2,
                          borderBottom: `1px solid ${alpha(
                            theme.palette.divider,
                            0.7
                          )}`,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <FitnessCenterOutlined sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight={600}>
                            Chào mừng đến với Nền tảng Huấn luyện!
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Hành trình trở thành huấn luyện viên chuyên nghiệp
                            bắt đầu từ đây
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body1" paragraph>
                        Chúc mừng bạn đã thực hiện bước đầu tiên để trở thành
                        huấn luyện viên trên nền tảng của chúng tôi. Chúng tôi
                        rất vui mừng khi bạn tham gia vào cộng đồng giáo dục thể
                        thao!
                      </Typography>

                      <Box
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          p: 2,
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" paragraph>
                          <strong>Những gì chúng ta sẽ làm:</strong>
                        </Typography>
                        <List sx={{ pl: 0 }}>
                          <ListItem
                            sx={{
                              py: 1,
                              px: 2,
                              mb: 1,
                              borderRadius: 1,
                              bgcolor: "white",
                              transition: "all 0.2s",
                              "&:hover": {
                                boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <CheckCircleOutline
                              sx={{
                                mr: 1,
                                color: theme.palette.success.main,
                                fontSize: 22,
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight={500}>
                                  Tạo hồ sơ huấn luyện của bạn
                                </Typography>
                              }
                              secondary="Chia sẻ chuyên môn, kinh nghiệm và phong cách huấn luyện của bạn"
                            />
                          </ListItem>
                          <ListItem
                            sx={{
                              py: 1,
                              px: 2,
                              mb: 1,
                              borderRadius: 1,
                              bgcolor: "white",
                              transition: "all 0.2s",
                              "&:hover": {
                                boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <CheckCircleOutline
                              sx={{
                                mr: 1,
                                color: theme.palette.success.main,
                                fontSize: 22,
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight={500}>
                                  Thiết lập lịch trình sẵn có của bạn
                                </Typography>
                              }
                              secondary="Cho học viên biết khi nào bạn có thể huấn luyện"
                            />
                          </ListItem>
                          <ListItem
                            sx={{
                              py: 1,
                              px: 2,
                              borderRadius: 1,
                              bgcolor: "white",
                              transition: "all 0.2s",
                              "&:hover": {
                                boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <CheckCircleOutline
                              sx={{
                                mr: 1,
                                color: theme.palette.success.main,
                                fontSize: 22,
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight={500}>
                                  Sẵn sàng để huấn luyện
                                </Typography>
                              }
                              secondary="Bắt đầu chấp nhận đặt lịch và chia sẻ kiến thức của bạn"
                            />
                          </ListItem>
                        </List>
                      </Box>

                      <Typography variant="body1">
                        Quy trình thiết lập nhanh chóng này sẽ giúp bạn tạo hồ
                        sơ huấn luyện và lịch trình sẵn có để học viên có thể
                        tìm và đặt lịch học với bạn.
                      </Typography>
                    </CardContent>
                  </Card>
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                      endIcon={<ArrowForwardIos />}
                    >
                      Bắt Đầu
                    </Button>
                  </Box>
                </motion.div>
              </StepContent>
            </Step>

            {/* Create Profile Step */}
            <Step>
              <StepLabel>
                <StepTitle title="Tạo Hồ Sơ Của Bạn" />
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Thông Tin Hồ Sơ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hãy cho chúng tôi biết về bạn để học viên có thể hiểu
                        bạn hơn
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                        >
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <TextField
                              fullWidth
                              label="Họ Và Tên"
                              variant="outlined"
                              required
                              value={coach.fullName}
                              onChange={(e) =>
                                setCoach({ ...coach, fullName: e.target.value })
                              }
                              sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <TextField
                              fullWidth
                              label="Địa Chỉ Email"
                              variant="outlined"
                              type="email"
                              required
                              value={coach.email}
                              onChange={(e) =>
                                setCoach({ ...coach, email: e.target.value })
                              }
                              sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Số Điện Thoại"
                              variant="outlined"
                              required
                              value={coach.phone}
                              onChange={(e) =>
                                setCoach({ ...coach, phone: e.target.value })
                              }
                              sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                            >
                              <InputLabel>Môn Thể Thao</InputLabel>
                              <Select
                                multiple
                                required
                                value={coach.sportIds}
                                onChange={(e) =>
                                  setCoach({
                                    ...coach,
                                    sportIds: e.target.value,
                                  })
                                }
                                label="Môn Thể Thao"
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip
                                        key={value}
                                        label={
                                          sports.find(
                                            (sport) => sport.id === value
                                          )?.name || value
                                        }
                                        sx={{
                                          bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                          ),
                                          borderColor:
                                            theme.palette.primary.light,
                                          "& .MuiChip-label": {
                                            color: theme.palette.primary.dark,
                                          },
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {sports.map((sport) => (
                                  <MenuItem key={sport.id} value={sport.id}>
                                    {sport.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                          >
                            <TextField
                              fullWidth
                              label="Phí Theo Giờ (VND)"
                              variant="outlined"
                              type="number"
                              required
                              value={coach.ratePerHour}
                              onChange={(e) =>
                                setCoach({
                                  ...coach,
                                  ratePerHour: parseInt(e.target.value),
                                })
                              }
                              sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    VND
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </motion.div>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                        >
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              gutterBottom
                            >
                              Ảnh Đại Diện (Bắt buộc)
                            </Typography>
                            <Upload
                              listType="picture-card"
                              fileList={
                                avatarFile
                                  ? [
                                      {
                                        uid: "-1",
                                        name: avatarFile.name,
                                        status: "done",
                                        url: avatarPreview,
                                      },
                                    ]
                                  : []
                              }
                              customRequest={customAvatarUpload}
                              onRemove={() => {
                                setAvatarFile(null);
                                setAvatarPreview("");
                              }}
                              maxCount={1}
                            >
                              {!avatarFile && (
                                <div>
                                  <PlusOutlined />
                                  <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                              )}
                            </Upload>
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              gutterBottom
                              sx={{ mt: 2 }}
                            >
                              Hình Ảnh Thư Viện (Tùy chọn)
                            </Typography>
                            <Upload
                              listType="picture-card"
                              fileList={galleryFiles.map((file, index) => ({
                                uid: index,
                                name: file.name,
                                status: "done",
                                url: galleryPreviews[index],
                              }))}
                              customRequest={customGalleryUpload}
                              onRemove={(file) => {
                                const index = file.uid;
                                setGalleryFiles((prevFiles) =>
                                  prevFiles.filter((_, i) => i !== index)
                                );
                                setGalleryPreviews((prevPreviews) =>
                                  prevPreviews.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              {galleryFiles.length >= 5 ? null : (
                                <div>
                                  <PlusOutlined />
                                  <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                              )}
                            </Upload>
                          </motion.div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <TextField
                              fullWidth
                              label="Tiểu sử/Mô tả*"
                              variant="outlined"
                              multiline
                              rows={4}
                              value={coach.bio}
                              onChange={(e) =>
                                setCoach({ ...coach, bio: e.target.value })
                              }
                              placeholder="Hãy kể cho học viên tiềm năng về kinh nghiệm, phong cách huấn luyện và chuyên môn của bạn..."
                              sx={{
                                mt: 2,
                                "& .MuiOutlinedInput-root": {
                                  transition: "all 0.2s",
                                  "&:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                  },
                                },
                              }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                      startIcon={<ArrowBackIos sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                        },
                      }}
                    >
                      Quay Lại
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCreateCoachProfile}
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <Spin size="small" />
                        ) : (
                          <ArrowForwardIos sx={{ fontSize: 16 }} />
                        )
                      }
                      sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                    >
                      {loading ? "Đang Tạo..." : "Tiếp Tục"}
                    </Button>
                  </Box>
                </motion.div>
              </StepContent>
            </Step>

            {/* Create Schedule Step */}
            <Step>
              <StepLabel>
                <StepTitle title="Thiết Lập Lịch Trình" />
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Lịch Trình Của Bạn
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thiết lập thời gian bạn có thể huấn luyện học viên
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {/* Schedule Notice Alert */}
                      {showScheduleNotice && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert
                            severity="info"
                            icon={<InfoOutlined />}
                            sx={{
                              mb: 3,
                              borderRadius: 2,
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.info.main,
                                0.15
                              )}`,
                              position: "relative",
                              "& .MuiAlert-message": {
                                color: theme.palette.text.primary,
                              },
                            }}
                            action={
                              <Button
                                color="info"
                                size="small"
                                onClick={() => setShowScheduleNotice(false)}
                                endIcon={<Close fontSize="small" />}
                              >
                                Đã hiểu
                              </Button>
                            }
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{ mb: 0.5 }}
                            >
                              Lưu ý về lịch trình huấn luyện
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Các buổi tập mà bạn thiết lập ở đây sẽ được hiển
                              thị cho khách hàng đặt lịch học với bạn. Mỗi khung
                              giờ bạn tạo sẽ là thời gian bạn cam kết có thể
                              tham gia huấn luyện hàng tuần.
                            </Typography>
                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <EventAvailable
                                  fontSize="small"
                                  color="primary"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">
                                  Các buổi tập được lặp lại hàng tuần
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <AccessTime
                                  fontSize="small"
                                  color="primary"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">
                                  Học viên có thể đặt lịch trong các khung giờ
                                  này
                                </Typography>
                              </Box>
                            </Box>
                          </Alert>
                        </motion.div>
                      )}

                      <Box
                        sx={{
                          p: 2,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                          border: `1px dashed ${alpha(
                            theme.palette.secondary.main,
                            0.3
                          )}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 0 }}>
                          Thêm lịch trình hàng tuần của bạn bên dưới. Học viên
                          sẽ có thể đặt buổi học trong các khung giờ này.
                        </Typography>
                      </Box>

                      {/* Add new schedule form */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 2,
                            border: `1px solid ${alpha(
                              theme.palette.divider,
                              0.7
                            )}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              boxShadow: "0 5px 15px rgba(0,0,0,0.07)",
                              borderColor: alpha(
                                theme.palette.primary.main,
                                0.3
                              ),
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                          >
                            Thêm Buổi Tập Mới
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid
                              size={{
                                xs: 12,
                                sm: 3,
                              }}
                            >
                              <FormControl fullWidth>
                                <InputLabel>Thứ</InputLabel>
                                <Select
                                  value={newSchedule.dayOfWeek}
                                  onChange={(e) =>
                                    setNewSchedule({
                                      ...newSchedule,
                                      dayOfWeek: e.target.value,
                                    })
                                  }
                                  label="Thứ"
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      transition: "all 0.2s",
                                      "&:hover fieldset": {
                                        borderColor: theme.palette.primary.main,
                                      },
                                    },
                                  }}
                                >
                                  {dayOptions.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid
                              size={{
                                xs: 12,
                                sm: 3,
                              }}
                            >
                              <TimePicker
                                format="HH:mm"
                                placeholder="Thời Gian Bắt Đầu"
                                value={
                                  newSchedule.startTime
                                    ? dayjs(
                                        `2023-01-01T${newSchedule.startTime}`
                                      )
                                    : null
                                }
                                onChange={(time) =>
                                  setNewSchedule({
                                    ...newSchedule,
                                    startTime: time
                                      ? time.format("HH:mm:ss")
                                      : null,
                                  })
                                }
                                style={{ width: "100%" }}
                              />
                            </Grid>
                            <Grid
                              size={{
                                xs: 12,
                                sm: 3,
                              }}
                            >
                              <TimePicker
                                format="HH:mm"
                                placeholder="Thời Gian Kết Thúc"
                                value={
                                  newSchedule.endTime
                                    ? dayjs(`2023-01-01T${newSchedule.endTime}`)
                                    : null
                                }
                                onChange={(time) =>
                                  setNewSchedule({
                                    ...newSchedule,
                                    endTime: time
                                      ? time.format("HH:mm:ss")
                                      : null,
                                  })
                                }
                                style={{ width: "100%" }}
                              />
                            </Grid>
                            <Grid
                              size={{
                                xs: 12,
                                sm: 3,
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={addSchedule}
                                fullWidth
                                startIcon={<AddCircleOutlined />}
                                sx={{
                                  py: 1.5,
                                  borderRadius: 2,
                                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    boxShadow: `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.4
                                    )}`,
                                  },
                                }}
                              >
                                Thêm
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </motion.div>

                      {/* Display schedules */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Lịch Trình Của Bạn
                        </Typography>

                        {schedules.length === 0 ? (
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              textAlign: "center",
                              bgcolor: alpha(
                                theme.palette.background.default,
                                0.5
                              ),
                            }}
                          >
                            <Typography variant="body1" color="text.secondary">
                              Chưa có lịch trình nào. Hãy thêm lịch trình đầu
                              tiên ở trên.
                            </Typography>
                          </Box>
                        ) : (
                          <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                              borderRadius: 2,
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.7
                              )}`,
                              overflow: "hidden",
                            }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow
                                  sx={{
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.05
                                    ),
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Thứ
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Thời Gian Bắt Đầu
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Thời Gian Kết Thúc
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Thao Tác
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {schedules.map((schedule, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        bgcolor: alpha(
                                          theme.palette.primary.main,
                                          0.03
                                        ),
                                      },
                                      "&:nth-of-type(odd)": {
                                        bgcolor: alpha(
                                          theme.palette.background.default,
                                          0.3
                                        ),
                                      },
                                    }}
                                  >
                                    <TableCell>
                                      <Chip
                                        label={
                                          dayOptions.find(
                                            (day) =>
                                              day.value === schedule.dayOfWeek
                                          )?.label
                                        }
                                        size="small"
                                        sx={{
                                          bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                          ),
                                          color: theme.palette.primary.dark,
                                          fontWeight: 500,
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>{schedule.startTime}</TableCell>
                                    <TableCell>{schedule.endTime}</TableCell>
                                    <TableCell align="right">
                                      <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => removeSchedule(index)}
                                        sx={{
                                          transition: "all 0.2s",
                                          "&:hover": {
                                            bgcolor: alpha(
                                              theme.palette.error.main,
                                              0.1
                                            ),
                                            transform: "scale(1.1)",
                                          },
                                        }}
                                      >
                                        <DeleteOutlined />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </motion.div>
                    </CardContent>
                  </Card>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                      startIcon={<ArrowBackIos sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 2,
                        transition: "all 0.2s",
                      }}
                    >
                      Quay Lại
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCreateCoachSchedules}
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <Spin size="small" />
                        ) : (
                          <ArrowForwardIos sx={{ fontSize: 16 }} />
                        )
                      }
                      sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                    >
                      {loading ? "Đang Lưu..." : "Tiếp Tục"}
                    </Button>
                  </Box>
                </motion.div>
              </StepContent>
            </Step>

            {/* Completion Step */}
            <Step>
              <StepLabel>
                <StepTitle title="Hoàn Thành!" />
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      textAlign: "center",
                      py: 4,
                      borderRadius: 2,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      backgroundImage: `linear-gradient(135deg, ${alpha(
                        theme.palette.background.paper,
                        0.9
                      )} 0%, ${alpha(
                        theme.palette.background.paper,
                        0.95
                      )} 100%), 
                                  url("https://img.freepik.com/free-photo/sport-fitness-healthy-lifestyle-concept_53876-127182.jpg?w=1380&t=st=1711623459~exp=1711624059~hmac=2704d3d2a0b96da4968c5fe46c6f94fa68ae7d9d67c3c97a99ac6296adce4a8f")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            mb: 2,
                            p: 3,
                          }}
                        >
                          <CelebrationOutlined sx={{ fontSize: 60 }} />
                        </Avatar>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                              fontWeight: 800,
                              background: `linear-gradient(90deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            Chúc Mừng!
                          </Typography>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            Hồ sơ huấn luyện viên của bạn đã được hoàn tất
                          </Typography>
                        </motion.div>

                        <Divider sx={{ my: 3, width: "50%" }} />

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Typography variant="body1" paragraph>
                            Bạn đã sẵn sàng để bắt đầu hành trình huấn luyện của
                            mình. Học viên giờ đây có thể tìm thấy hồ sơ của bạn
                            và đặt lịch học với bạn.
                          </Typography>
                        </motion.div>

                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 500,
                            mx: "auto",
                            mt: 3,
                            textAlign: "left",
                            p: 3,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                          >
                            Các bước tiếp theo của bạn:
                          </Typography>
                          <List>
                            <ListItem
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                mb: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.background.paper,
                                    0.9
                                  ),
                                  transform: "translateX(5px)",
                                },
                              }}
                            >
                              <CheckCircleOutline
                                sx={{
                                  mr: 1,
                                  color: theme.palette.success.main,
                                  fontSize: 24,
                                }}
                              />
                              <ListItemText
                                primary={
                                  <Typography fontWeight={500}>
                                    Tạo các gói đào tạo
                                  </Typography>
                                }
                                secondary="Cung cấp các gói ưu đãi cho nhiều buổi học"
                              />
                            </ListItem>
                            <ListItem
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                mb: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.background.paper,
                                    0.9
                                  ),
                                  transform: "translateX(5px)",
                                },
                              }}
                            >
                              <CheckCircleOutline
                                sx={{
                                  mr: 1,
                                  color: theme.palette.success.main,
                                  fontSize: 24,
                                }}
                              />
                              <ListItemText
                                primary={
                                  <Typography fontWeight={500}>
                                    Thêm khuyến mãi
                                  </Typography>
                                }
                                secondary="Thu hút học viên mới với các ưu đãi khuyến mãi"
                              />
                            </ListItem>
                            <ListItem
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.background.paper,
                                    0.9
                                  ),
                                  transform: "translateX(5px)",
                                },
                              }}
                            >
                              <CheckCircleOutline
                                sx={{
                                  mr: 1,
                                  color: theme.palette.success.main,
                                  fontSize: 24,
                                }}
                              />
                              <ListItemText
                                primary={
                                  <Typography fontWeight={500}>
                                    Quản lý lịch đặt của bạn
                                  </Typography>
                                }
                                secondary="Theo dõi và quản lý các buổi học sắp tới của bạn"
                              />
                            </ListItem>
                          </List>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFinish}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 30,
                        fontSize: "1.1rem",
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: "0 8px 20px rgba(25, 118, 210, 0.4)",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: "0 12px 25px rgba(25, 118, 210, 0.5)",
                        },
                      }}
                    >
                      Đến Trang Tổng Quan
                    </Button>
                  </Box>
                </motion.div>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
      </Container>
    </Box>
  );
};

export default CoachOnboarding;
