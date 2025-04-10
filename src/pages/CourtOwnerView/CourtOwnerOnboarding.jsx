import React, { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Fade,
  Zoom,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Spin,
  notification,
  Upload,
  Timeline,
  Badge,
  Progress,
  Tag,
  Collapse,
  Typography as AntTypography,
} from "antd";
import {
  SportsTennisOutlined,
  LocalOfferOutlined,
  ScheduleOutlined,
  CheckCircleOutline,
  CelebrationOutlined,
  PhotoCamera,
  ArrowForwardIos,
  ArrowBackIos,
  SportsSoccerOutlined as SportsCenterOutlined,
  AddCircleOutlined,
  PlayArrowRounded,
  DeleteOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Client } from "@/API/CourtApi";

const { Panel } = Collapse;
const { Title, Text } = AntTypography;

// Helper functions for time validation
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + (seconds || 0) / 60;
};

const isDivisibleBySlotDuration = (timeString, slotDuration) => {
  const timeMinutes = convertTimeToMinutes(timeString);
  const durationMinutes = convertTimeToMinutes(slotDuration);
  return timeMinutes % durationMinutes === 0;
};

const hasOverlap = (newSchedule, existingSchedules, excludeIndex = -1) => {
  const newStart = convertTimeToMinutes(newSchedule.startTime);
  const newEnd = convertTimeToMinutes(newSchedule.endTime);

  for (let i = 0; i < existingSchedules.length; i++) {
    if (i === excludeIndex) continue;

    const existingSchedule = existingSchedules[i];
    const hasCommonDay = existingSchedule.days.some((day) =>
      newSchedule.days.includes(day)
    );

    if (hasCommonDay) {
      const existingStart = convertTimeToMinutes(existingSchedule.startTime);
      const existingEnd = convertTimeToMinutes(existingSchedule.endTime);

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }
  }

  return false;
};

// Default operating hours format - same as in CourtCreateView
const defaultSchedules = [
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "07:00",
    endTime: "17:00",
    priceSlot: 150000,
    name: "Giờ làm việc bình thường trong tuần",
  },
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "17:00",
    endTime: "22:00",
    priceSlot: 200000,
    name: "Giờ làm việc trong tuần buổi tối",
  },
  {
    days: [6, 7], // Saturday and Sunday (7 is Sunday)
    startTime: "08:00",
    endTime: "22:00",
    priceSlot: 250000,
    name: "Cuối tuần",
  },
];

// Day options for schedule selection
const dayOptions = [
  { label: "Thứ 2", value: 1 },
  { label: "Thứ 3", value: 2 },
  { label: "Thứ 4", value: 3 },
  { label: "Thứ 5", value: 4 },
  { label: "Thứ 6", value: 5 },
  { label: "Thứ 7", value: 6 },
  { label: "Chủ nhật", value: 7 },
];

const CourtOwnerOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sportCenter, setSportCenter] = useState({
    name: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    district: "",
    commune: "",
    description: "",
    imageUrls: [],
    avatar: "",
  });
  const [schedules, setSchedules] = useState(defaultSchedules);
  // Add these new state variables for tracking actual files
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Add state for tracking previews
  const [avatarPreview, setAvatarPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [court, setCourt] = useState({
    courtName: "",
    sportId: "",
    description: "",
    facilities: [], // Add initial empty array for facilities
    slotDuration: "01:00:00",
    minDepositPercentage: 30,
    courtType: 1,
    cancellationWindowHours: 24,
    refundPercentage: 50,
    courtSchedules: [], // Add initial empty array for court schedules
  });

  // Add state to manage a new facility input
  const [newFacility, setNewFacility] = useState({ name: "", description: "" });

  // Add state to manage a new schedule input
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: [],
    startTime: "08:00:00",
    endTime: "17:00:00",
    priceSlot: 100000,
  });
  const [sports, setSports] = useState([]);
  const [sportCenterId, setSportCenterId] = useState("");
  const [scheduleErrors, setScheduleErrors] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userProfile);

  // Fetch sports when component mounts
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const client = new Client();
        const response = await client.getSports();
        setSports(response.sports || []);
      } catch (error) {
        console.error("Error fetching sports:", error);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể hiển thị các môn thể thao. Vui lòng thử lại sau.",
        });
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
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      // Store file in state
      setAvatarFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setSportCenter({
          ...sportCenter,
          avatar: reader.result, // For display purposes only
        });
      };
      reader.readAsDataURL(file);

      // Simulate success to update Ant Design component state
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    } catch (error) {
      console.error("Error handling avatar upload:", error);
      notification.error({
        message: "Tải lên thất bại",
        description: "Không thể xử lý ảnh đại diện.",
      });
    }
  };
  const addSchedule = () => {
    const newSchedule = {
      days: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "17:00",
      priceSlot: 150000,
      name: `Schedule ${schedules.length + 1}`,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (index) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };

  const validateScheduleTimes = (index, field, value) => {
    const newErrors = [...scheduleErrors];

    if (!newErrors[index]) {
      newErrors[index] = {};
    }

    // If updating startTime or endTime, check if divisible by slotDuration
    if (field === "startTime" || field === "endTime") {
      if (!isDivisibleBySlotDuration(`${value}:00`, court.slotDuration)) {
        newErrors[index][
          field
        ] = `Thời gian phải chia hết cho thời lượng slot (${court.slotDuration})`;
      } else {
        delete newErrors[index][field];
      }
    }

    // Check for schedule overlap
    const currentSchedule = { ...schedules[index] };
    currentSchedule[field] = value;

    if (hasOverlap(currentSchedule, schedules, index)) {
      newErrors[index].overlap =
        "Lịch này bị trùng với lịch khác trong cùng ngày";
    } else {
      delete newErrors[index].overlap;
    }

    setScheduleErrors(newErrors);
  };

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);

    // Validate the schedule after update
    validateScheduleTimes(index, field, value);
  };
  // Custom upload handler for gallery images
  const customGalleryUpload = async ({ file, onSuccess }) => {
    try {
      // Check max files limit
      if (galleryFiles.length >= 5) {
        notification.warning({
          message: "Vượt giới hạn tải lên",
          description: "You can only upload up to 5 images",
        });
        return;
      }

      // Store file in state
      setGalleryFiles((prev) => [...prev, file]);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        const newPreview = reader.result;
        setGalleryPreviews((prev) => [...prev, newPreview]);
        setSportCenter({
          ...sportCenter,
          imageUrls: [...sportCenter.imageUrls, newPreview], // For display purposes only
        });
      };
      reader.readAsDataURL(file);

      // Simulate success
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    } catch (error) {
      console.error("Error handling gallery upload:", error);
      notification.error({
        message: "Tải lên thất bại",
        description: "Không thể xử lý ảnh tải lên.",
      });
    }
  };

  const handleCreateSportCenter = async () => {
    setLoading(true);
    try {
      // Validate form
      if (!sportCenter.name || !sportCenter.phoneNumber || !avatarFile) {
        notification.error({
          message: "Sai định dạng thông tin",
          description:
            "Vui lòng điền đầy đủ các trường bắt buộc và tải lên logo của trung tâm thể thao.",
        });
        setLoading(false);
        return;
      }

      // Create the model object expected by the API
      const sportCenterModel = {
        name: sportCenter.name,
        phoneNumber: sportCenter.phoneNumber,
        addressLine: sportCenter.addressLine,
        city: sportCenter.city,
        district: sportCenter.district,
        commune: sportCenter.commune,
        description: sportCenter.description,
        // Pass the actual File objects, not the data URLs
        avatarImage: avatarFile,
        galleryImages: galleryFiles,
      };

      const client = new Client();
      const response = await client.createSportCenter(sportCenterModel);

      if (response.id) {
        setSportCenterId(response.id);
        notification.success({
          message: "Thành công",
          description: "Trung tâm thể thao đã được tạo thành công!",
        });
        handleNext();
      }
    } catch (error) {
      console.error("Error creating sport center:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo trung tâm thể thao. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourt = async () => {
    try {
      setLoading(true);

      // Format facilities
      const formattedFacilities = court.facilities.map((facility) => ({
        name: facility.name,
        description: facility.description,
      }));

      // Format schedules - similar to CourtOwnerCourtCreateView
      const courtSchedules = schedules.map((schedule) => ({
        dayOfWeek: schedule.days,
        startTime: `${schedule.startTime}:00`, // Add seconds to match API format
        endTime: `${schedule.endTime}:00`, // Add seconds to match API format
        priceSlot: schedule.priceSlot,
      }));

      // Prepare request data
      const requestData = {
        court: {
          courtName: court.courtName,
          sportId: court.sportId,
          sportCenterId: sportCenterId,
          description: court.description || "",
          facilities: formattedFacilities,
          slotDuration: court.slotDuration,
          minDepositPercentage: court.minDepositPercentage,
          courtType: court.courtType,
          courtSchedules: courtSchedules,
          cancellationWindowHours: court.cancellationWindowHours,
          refundPercentage: court.refundPercentage,
        },
      };

      const client = new Client();
      const response = await client.createCourt(requestData);

      // Success, go to next step
      handleNext();
    } catch (error) {
      console.error("Error creating court:", error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };
  const handleFinish = () => {
    window.location.href = "/court-owner/dashboard";
  };
  // Add facility to court
  const addFacility = () => {
    if (!newFacility.name) {
      notification.warning({
        message: "Validation Error",
        description: "Tên cơ sở vật chất là yêu cầu bắt buộc",
      });
      return;
    }

    setCourt({
      ...court,
      facilities: [...court.facilities, { ...newFacility }],
    });

    // Reset the input
    setNewFacility({ name: "", description: "" });
  };

  // Remove facility from court
  const removeFacility = (index) => {
    const updatedFacilities = [...court.facilities];
    updatedFacilities.splice(index, 1);
    setCourt({
      ...court,
      facilities: updatedFacilities,
    });
  };

  // Custom file upload component
  const customUpload = async ({ file, onSuccess }) => {
    // In a real app, you would upload to server
    // For this example, we'll just simulate it
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const handleSlotDurationChange = (e) => {
    const newSlotDuration = e.target.value;
    setCourt({
      ...court,
      slotDuration: newSlotDuration,
    });

    // Kiểm tra lại tất cả các lịch trình hiện có
    schedules.forEach((schedule, index) => {
      validateScheduleTimes(index, "startTime", schedule.startTime);
      validateScheduleTimes(index, "endTime", schedule.endTime);
    });
  };

  const steps = [
    {
      label: "Chào mừng bạn đến với Cổng thông tin Chủ Sở Hữu Sân",
      description: `Xin chào ${
        user?.name || "bạn"
      }! Hãy bắt đầu bằng cách thiết lập trung tâm thể thao đầu tiên của bạn.`,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              boxShadow: 3,
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(145deg, #ffffff 30%, #f0f7ff 90%)",
            }}
          >
            <Box
              sx={{
                height: "8px",
                background: "linear-gradient(90deg, #2196f3, #1565c0)",
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Box
                display="flex"
                justifyContent="center"
                mb={3}
                sx={{
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(255,255,255,0) 70%)",
                    zIndex: -1,
                  },
                }}
              >
                <Zoom in={true}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "primary.main",
                      boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 12px 20px rgba(33, 150, 243, 0.4)",
                      },
                    }}
                  >
                    <CelebrationOutlined style={{ fontSize: 50 }} />
                  </Avatar>
                </Zoom>
              </Box>

              <Fade in={true} timeout={800}>
                <Typography
                  variant="h4"
                  component="div"
                  textAlign="center"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "primary.dark",
                    mb: 3,
                  }}
                >
                  Chào mừng bạn đến với hệ thống quản lý đặt sân!
                </Typography>
              </Fade>

              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{
                  fontSize: "1.1rem",
                  textAlign: "center",
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Chúng tôi rất vui khi bạn gia nhập nền tảng của chúng tôi! Trình
                hướng dẫn thiết lập này sẽ giúp bạn thiết lập trung tâm thể
                thao, sân thi đấu và chuẩn bị mọi thứ sẵn sàng cho khách hàng
                của bạn.
              </Typography>

              <Box
                sx={{
                  my: 4,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "rgba(33, 150, 243, 0.05)",
                  border: "1px dashed rgba(33, 150, 243, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary.dark"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Các bước bắt đầu của bạn:
                </Typography>

                <Timeline mode="left" style={{ marginTop: 20 }}>
                  <Timeline.Item
                    dot={
                      <SportsCenterOutlined
                        style={{ fontSize: 24, color: "#1976d2" }}
                      />
                    }
                    color="blue"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Tạo trung tâm thể thao của bạn
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thiết lập thông tin, vị trí và hình ảnh cho trung tâm thể
                      thao của bạn
                    </Typography>
                  </Timeline.Item>

                  <Timeline.Item
                    dot={
                      <SportsTennisOutlined
                        style={{ fontSize: 24, color: "#1976d2" }}
                      />
                    }
                    color="blue"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Thêm sân vào trung tâm thể thao của bạn
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thiết lập các thông tin và tiện ích cho sân của bạn
                    </Typography>
                  </Timeline.Item>

                  <Timeline.Item
                    dot={
                      <ScheduleOutlined
                        style={{ fontSize: 24, color: "#1976d2" }}
                      />
                    }
                    color="blue"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Thiết lập lịch sân
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tùy chọn giờ hoạt động và khung giờ cho việc đặt sân
                    </Typography>
                  </Timeline.Item>

                  <Timeline.Item
                    dot={
                      <LocalOfferOutlined
                        style={{ fontSize: 24, color: "#1976d2" }}
                      />
                    }
                    color="blue"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Tạo các gói ưu đãi (tùy chọn)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thu hút khách hàng với các ưu đãi và giảm giá đặc biệt
                    </Typography>
                  </Timeline.Item>
                </Timeline>
              </Box>

              <Box display="flex" justifyContent="center" mt={4}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    size="large"
                    endIcon={<PlayArrowRounded />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                      background:
                        "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                      },
                    }}
                  >
                    Cùng bắt đầu tại đây
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Tạo Trung Tâm Thể Thao Của Bạn",
      description: "Nhập thông tin về trung tâm thể thao của bạn",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              boxShadow: 3,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
              <Typography variant="h5" fontWeight={600}>
                <SportsCenterOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                Thông tin Trung Tâm Thể Thao
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                Hãy cùng thiết lập trung tâm thể thao đầu tiên của bạn
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                {/* <Progress
                  percent={33}
                  steps={3}
                  strokeColor="#1976d2"
                  size="small"
                /> */}
                <LinearProgress
                  variant="determinate"
                  value={33} // Giá trị tiến độ (0 - 100)
                  sx={{
                    height: 8,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                  }} // Tùy chỉnh kiểu dáng
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Tên trung tâm thể thao"
                      variant="outlined"
                      value={sportCenter.name}
                      onChange={(e) =>
                        setSportCenter({ ...sportCenter, name: e.target.value })
                      }
                      required
                      margin="normal"
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      variant="outlined"
                      value={sportCenter.phoneNumber}
                      onChange={(e) =>
                        setSportCenter({
                          ...sportCenter,
                          phoneNumber: e.target.value,
                        })
                      }
                      required
                      margin="normal"
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      variant="outlined"
                      value={sportCenter.addressLine}
                      onChange={(e) =>
                        setSportCenter({
                          ...sportCenter,
                          addressLine: e.target.value,
                        })
                      }
                      required
                      margin="normal"
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Tỉnh/Thành phố"
                          variant="outlined"
                          value={sportCenter.city}
                          onChange={(e) =>
                            setSportCenter({
                              ...sportCenter,
                              city: e.target.value,
                            })
                          }
                          required
                          margin="normal"
                          InputProps={{
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Quận/Huyện"
                          variant="outlined"
                          value={sportCenter.district}
                          onChange={(e) =>
                            setSportCenter({
                              ...sportCenter,
                              district: e.target.value,
                            })
                          }
                          required
                          margin="normal"
                          InputProps={{
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Xã/Phường"
                          variant="outlined"
                          value={sportCenter.commune}
                          onChange={(e) =>
                            setSportCenter({
                              ...sportCenter,
                              commune: e.target.value,
                            })
                          }
                          required
                          margin="normal"
                          InputProps={{
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </motion.div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Mô tả"
                      variant="outlined"
                      value={sportCenter.description}
                      onChange={(e) =>
                        setSportCenter({
                          ...sportCenter,
                          description: e.target.value,
                        })
                      }
                      multiline
                      rows={4}
                      margin="normal"
                      placeholder="Mô tả trung tâm thể thao của bạn, các tiện ích và điều gì làm cho nó đặc biệt..."
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        <PhotoCamera sx={{ mr: 1, color: "primary.main" }} />
                        Tải lên ảnh trung tâm thể thao (Tối đa 5 ảnh)
                      </Typography>

                      <Upload
                        listType="picture-card"
                        fileList={galleryFiles.map((file, index) => ({
                          uid: index,
                          name: file.name,
                          status: "done",
                          url: URL.createObjectURL(file),
                        }))}
                        customRequest={customGalleryUpload}
                        onRemove={(file) => {
                          const index = galleryFiles.indexOf(file);
                          const newGalleryFiles = [...galleryFiles];
                          newGalleryFiles.splice(index, 1);
                          setGalleryFiles(newGalleryFiles);

                          const newGalleryPreviews = [...galleryPreviews];
                          newGalleryPreviews.splice(index, 1);
                          setGalleryPreviews(newGalleryPreviews);

                          setSportCenter({
                            ...sportCenter,
                            imageUrls: sportCenter.imageUrls.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      >
                        {galleryFiles.length >= 5 ? null : (
                          <div>
                            <AddCircleOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên</div>
                          </div>
                        )}
                      </Upload>
                    </Paper>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        <Badge count="Yêu cầu" color="#1976d2" offset={[28, 0]}>
                          <PhotoCamera sx={{ mr: 1, color: "primary.main" }} />
                          Tải lên Logo của trung tâm thể thao
                        </Badge>
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
                                  url: URL.createObjectURL(avatarFile), // Tạo URL tạm thời cho ảnh
                                },
                              ]
                            : []
                        }
                        customRequest={customAvatarUpload}
                        onRemove={() => {
                          setAvatarFile(null);
                          setAvatarPreview("");
                          setSportCenter({
                            ...sportCenter,
                            avatar: "",
                          });
                        }}
                        maxCount={1}
                        previewFile={(file) => {
                          // Hàm previewFile giúp hiển thị ảnh tạm thời
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          });
                        }}
                      >
                        {avatarFile ? null : (
                          <div>
                            <AddCircleOutlined />
                            <div style={{ marginTop: 8 }}>Logo</div>
                          </div>
                        )}
                      </Upload>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            <Box
              display="flex"
              justifyContent="space-between"
              p={2}
              sx={{ bgcolor: "background.default" }}
            >
              <Button
                onClick={handleBack}
                startIcon={<ArrowBackIos fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                Quay lại
              </Button>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCreateSportCenter}
                  variant="contained"
                  disabled={
                    loading ||
                    !sportCenter.name ||
                    !sportCenter.phoneNumber ||
                    !sportCenter.addressLine
                  }
                  endIcon={
                    loading ? (
                      <Spin size="small" />
                    ) : (
                      <ArrowForwardIos fontSize="small" />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  {loading ? "Đang tạo..." : "Tạo & Tiếp tục"}
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Tạo sân đầu tiên của bạn",
      description: "Thiết lập sân đầu tiên trong trung tâm thể thao",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              boxShadow: 3,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
              <Typography variant="h5" fontWeight={600}>
                <SportsTennisOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                Court Information
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                Set up your first court
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                {/* <Progress
                  percent={67}
                  steps={3}
                  strokeColor="#1976d2"
                  size="small"
                /> */}
                <LinearProgress
                  variant="determinate"
                  value={67} // Giá trị tiến độ (0 - 100)
                  sx={{
                    height: 8,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                  }} // Tùy chỉnh kiểu dáng
                />
              </Box>

              <Grid container spacing={3}>
                {/* General court info - first column */}
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Tên sân"
                      variant="outlined"
                      value={court.courtName}
                      onChange={(e) =>
                        setCourt({ ...court, courtName: e.target.value })
                      }
                      required
                      margin="normal"
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <FormControl
                      fullWidth
                      margin="normal"
                      required
                      sx={{ borderRadius: 2 }}
                    >
                      <InputLabel id="sport-label">Môn thể thao</InputLabel>
                      <Select
                        labelId="sport-label"
                        value={court.sportId}
                        label="Môn thể thao"
                        onChange={(e) =>
                          setCourt({ ...court, sportId: e.target.value })
                        }
                        sx={{ borderRadius: 2 }}
                      >
                        {sports.length > 0 ? (
                          sports.map((sport) => (
                            <MenuItem key={sport.id} value={sport.id}>
                              {sport.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            Đang tải thông tin các môn thể thao...
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="court-type-label">Loại sân</InputLabel>
                      <Select
                        labelId="court-type-label"
                        value={court.courtType}
                        label="Court Type"
                        onChange={(e) =>
                          setCourt({ ...court, courtType: e.target.value })
                        }
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={1}>Trong nhà</MenuItem>
                        <MenuItem value={2}>Ngoài trời</MenuItem>
                        <MenuItem value={3}>Hỗn hợp</MenuItem>
                      </Select>
                    </FormControl>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Thời lượng 1 Slot (hh:mm:ss)"
                      variant="outlined"
                      value={court.slotDuration}
                      onChange={handleSlotDurationChange}
                      required
                      margin="normal"
                      placeholder="01:00:00"
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>
                </Grid>

                {/* Second column */}
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Mô tả"
                      variant="outlined"
                      value={court.description}
                      onChange={(e) =>
                        setCourt({ ...court, description: e.target.value })
                      }
                      multiline
                      rows={4}
                      margin="normal"
                      placeholder="Mô tả sân của bạn, các đặc điểm và tiện ích đặc biệt..."
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </motion.div>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      gutterBottom
                    >
                      Cài đặt đặt sân
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <TextField
                            fullWidth
                            label="Đặt cọc tối thiểu (%)"
                            variant="outlined"
                            type="number"
                            value={court.minDepositPercentage}
                            onChange={(e) =>
                              setCourt({
                                ...court,
                                minDepositPercentage: Number(e.target.value),
                              })
                            }
                            InputProps={{
                              inputProps: { min: 0, max: 100 },
                              sx: { borderRadius: 2 },
                            }}
                            required
                            margin="normal"
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={6}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                        >
                          <TextField
                            fullWidth
                            label="Phần trăm hoàn tiền (%)"
                            variant="outlined"
                            type="number"
                            value={court.refundPercentage}
                            onChange={(e) =>
                              setCourt({
                                ...court,
                                refundPercentage: Number(e.target.value),
                              })
                            }
                            InputProps={{
                              inputProps: { min: 0, max: 100 },
                              sx: { borderRadius: 2 },
                            }}
                            required
                            margin="normal"
                          />
                        </motion.div>
                      </Grid>
                    </Grid>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <TextField
                        fullWidth
                        label="Giới hạn hủy đặt sân (giờ)"
                        variant="outlined"
                        type="number"
                        value={court.cancellationWindowHours}
                        onChange={(e) =>
                          setCourt({
                            ...court,
                            cancellationWindowHours: Number(e.target.value),
                          })
                        }
                        required
                        margin="normal"
                        helperText="Khách hàng có thể hủy đặt sân trước bao nhiêu giờ so với thời gian đặt"
                        InputProps={{
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </motion.div>
                  </Paper>
                </Grid>
              </Grid>

              {/* New section for Court Schedules - similar to CourtOwnerCourtCreateView */}
              <Box sx={{ mt: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Lịch đặt sân
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Xác định thời gian sân của bạn có sẵn và thiết lập giá cho
                    các khung giờ khác nhau.
                  </Typography>

                  <Collapse defaultActiveKey={["0"]} sx={{ mb: 2 }}>
                    {schedules.map((schedule, index) => (
                      <Panel
                        header={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Typography>{schedule.name}</Typography>
                            <Tag color="blue">
                              {schedule.startTime} - {schedule.endTime}
                            </Tag>
                          </Box>
                        }
                        key={index}
                        extra={
                          <Button
                            color="error"
                            size="small"
                            startIcon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSchedule(index);
                            }}
                            sx={{ minWidth: "auto" }}
                          >
                            Xóa
                          </Button>
                        }
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mb: 2,
                              }}
                            >
                              {dayOptions.map((day) => (
                                <Tag
                                  key={day.value}
                                  color={
                                    schedule.days.includes(day.value)
                                      ? "blue"
                                      : "default"
                                  }
                                  style={{
                                    cursor: "pointer",
                                    margin: "0 4px 8px 0",
                                  }}
                                  onClick={() => {
                                    const newDays = schedule.days.includes(
                                      day.value
                                    )
                                      ? schedule.days.filter(
                                          (d) => d !== day.value
                                        )
                                      : [...schedule.days, day.value];
                                    updateSchedule(index, "days", newDays);
                                  }}
                                >
                                  {day.label}
                                </Tag>
                              ))}
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Thời gian bắt đầu (HH:MM)"
                              variant="outlined"
                              value={schedule.startTime}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              InputProps={{ sx: { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Thời giân kết thúc (HH:MM)"
                              variant="outlined"
                              value={schedule.endTime}
                              onChange={(e) =>
                                updateSchedule(index, "endTime", e.target.value)
                              }
                              InputProps={{ sx: { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Giá tiền theo giờ (₫)"
                              variant="outlined"
                              type="number"
                              value={schedule.priceSlot}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "priceSlot",
                                  Number(e.target.value)
                                )
                              }
                              InputProps={{ sx: { borderRadius: 2 } }}
                            />
                          </Grid>
                        </Grid>
                      </Panel>
                    ))}
                  </Collapse>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddCircleOutlined />}
                    onClick={addSchedule}
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Thêm lịch
                  </Button>
                </Paper>
              </Box>
            </CardContent>

            <Divider />

            <Box
              display="flex"
              justifyContent="space-between"
              p={2}
              sx={{ bgcolor: "background.default" }}
            >
              <Button
                onClick={handleBack}
                startIcon={<ArrowBackIos fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                Quay lại
              </Button>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCreateCourt}
                  variant="contained"
                  disabled={loading || !court.courtName || !court.sportId}
                  endIcon={
                    loading ? (
                      <Spin size="small" />
                    ) : (
                      <ArrowForwardIos fontSize="small" />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  {loading ? "Đang tạo..." : "Tạo & Tiếp tục"}
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Xin chúc mừng!",
      description:
        "Tất cả thông tin đã được thiết lập, bạn đã sẵn sàng để bắt đầu!",
      content: (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              boxShadow: 3,
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(145deg, #ffffff 30%, #e6f7ff 90%)",
            }}
          >
            <Box
              sx={{
                height: "8px",
                background: "linear-gradient(90deg, #52c41a, #389e0d)",
              }}
            />

            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box sx={{ mb: 3 }}>
                {/* <Progress
                  percent={100}
                  steps={3}
                  strokeColor="#52c41a"
                  size="small"
                /> */}
                <LinearProgress
                  variant="determinate"
                  value={100} // Giá trị tiến độ (0 - 100)
                  sx={{
                    height: 8,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                  }} // Tùy chỉnh kiểu dáng
                />
              </Box>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "success.main",
                    mx: "auto",
                    boxShadow: "0 8px 16px rgba(82, 196, 26, 0.3)",
                  }}
                >
                  <CheckCircleOutline style={{ fontSize: 60 }} />
                </Avatar>
              </motion.div>

              <Fade in={true} timeout={800}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    mt: 3,
                    fontWeight: 600,
                    color: "success.dark",
                  }}
                >
                  Thiết lập thành công!
                </Typography>
              </Fade>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  fontWeight: "normal",
                }}
              >
                Trung tâm thể thao và sân của bạn đã được thiết lập thành công.
                Bạn có thể bắt đầu quản lý lịch đặt sân và khách hàng ngay bây
                giờ.
              </Typography>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleFinish}
                  startIcon={<CheckCircleOutline />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  Quay về bảng điều khiển
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <Box mt={4}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight={600}
              sx={{
                borderLeft: "4px solid #1976d2",
                pl: 2,
                py: 1,
              }}
            >
              Cần làm gì tiếp theo?
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                mt: 2,
                background: "linear-gradient(145deg, #ffffff 30%, #fafafa 90%)",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: "100%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            width: 70,
                            height: 70,
                            bgcolor: "primary.light",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <ScheduleOutlined style={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Thiết lập lịch đặt sân
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Thiết lập thời gian sân của bạn có sẵn và thiết lập
                          giá cho các khung giờ khác nhau.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/schedule")}
                        >
                          Tạo lịch đặt sân
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: "100%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            width: 70,
                            height: 70,
                            bgcolor: "primary.light",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <LocalOfferOutlined style={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Thiết lập gói khuyến mãi
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Thu hút khách hàng với các ưu đãi và giảm giá đặc biệt
                          cho sân của bạn.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/promotions")}
                        >
                          Tạo gói khuyến mãi
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: "100%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            width: 70,
                            height: 70,
                            bgcolor: "primary.light",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <SportsTennisOutlined style={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Tạo thêm sân
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Mở rộng dịch vụ của bạn bằng cách thêm các loại sân
                          khác nhau vào trung tâm thể thao của bạn.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/courts/create")}
                        >
                          Tạo sân
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </motion.div>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          fontWeight="bold"
          sx={{
            borderBottom: "2px solid #1976d2",
            pb: 1,
            mb: 3,
            display: "inline-block",
          }}
        >
          Thiết lập chủ sở hữu sân
        </Typography>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            ".MuiStepConnector-line": {
              borderLeft: "2px dashed rgba(25, 118, 210, 0.3)",
              minHeight: 20,
              marginLeft: 1,
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    width: 40,
                    height: 40,
                    "&.Mui-active": {
                      color: "primary.main",
                      boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.15)",
                      borderRadius: "50%",
                    },
                    "&.Mui-completed": {
                      color: "success.main",
                      boxShadow: "0 0 0 8px rgba(76, 175, 80, 0.15)",
                      borderRadius: "50%",
                    },
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight="600">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent
                sx={{
                  borderLeft: "2px dashed rgba(25, 118, 210, 0.3)",
                  ml: 2.5,
                  pl: 2.5,
                  pb: 3,
                }}
              >
                <Typography color="text.secondary" mb={2}>
                  {step.description}
                </Typography>
                <Box my={2}>{step.content}</Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default CourtOwnerOnboarding;
