import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Paper,
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TimeField, DateField } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Save,
  DeleteOutline,
  Add,
  AccessTime,
  SportsSoccer,
  Description,
  EventAvailable,
  MonetizationOn,
  PercentOutlined,
  CardGiftcard,
  Edit,
  InsertDriveFile,
  InfoOutlined,
  CalendarMonth,
  Discount,
  ArrowBackIos,
} from "@mui/icons-material";
import { Client } from "@/API/CourtApi";
import {
  message,
  Table,
  Switch,
  Popconfirm,
  Tag,
  Spin,
  Empty,
  Steps,
  Segmented,
  Radio,
  DatePicker as AntDatePicker,
  Space,
  Modal,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";

const daysOfWeek = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

// Add court status options
const courtStatusOptions = [
  { value: 0, label: "Mở", color: "green" },
  { value: 1, label: "Đóng cửa", color: "red" },
  { value: 2, label: "Bảo trì", color: "orange" },
];

const CourtOwnerCourtUpdateView = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sports, setSports] = useState([]);
  const [court, setCourt] = useState({
    courtName: "",
    sportId: "",
    description: "",
    slotDuration: "01:00:00",
    facilities: [],
    status: 0, // Default to Open
    courtType: 1,
    minDepositPercentage: 30,
    cancellationWindowHours: 24,
    refundPercentage: 50,
  });

  // For schedules
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    courtId: courtId,
    dayOfWeek: [1], // Monday by default
    startTime: "08:00:00",
    endTime: "17:00:00",
    priceSlot: 100000,
    status: 0, // Available by default
  });

  // For promotions
  const [promotions, setPromotions] = useState([]);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [promotionModalVisible, setPromotionModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    description: "",
    discountType: "Percentage", // Percentage or Fixed
    discountValue: 10,
    validFrom: dayjs(),
    validTo: dayjs().add(30, "day"),
  });

  // For adding facilities
  const [facilityName, setFacilityName] = useState("");
  const [facilityDesc, setFacilityDesc] = useState("");

  // For validation
  const [errors, setErrors] = useState({});

  const courtClient = new Client();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fetch court details, schedules, and promotions
  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        setLoading(true);

        // Fetch court details
        const courtResponse = await courtClient.getCourtDetails(courtId);
        if (courtResponse && courtResponse.court) {
          setCourt({
            courtName: courtResponse.court.courtName || "",
            sportId: courtResponse.court.sportId || "",
            description: courtResponse.court.description || "",
            slotDuration: courtResponse.court.slotDuration || "01:00:00",
            facilities: courtResponse.court.facilities || [],
            status: courtResponse.court.status || 0,
            courtType: courtResponse.court.courtType || 1,
            minDepositPercentage:
              courtResponse.court.minDepositPercentage || 30,
            cancellationWindowHours:
              courtResponse.court.cancellationWindowHours || 24,
            refundPercentage: courtResponse.court.refundPercentage || 50,
          });
        }

        // Fetch schedules
        const schedulesResponse = await courtClient.getCourtSchedulesByCourtId(
          courtId
        );
        if (schedulesResponse) {
          setSchedules(schedulesResponse);
        }

        // Fetch promotions
        const promotionsResponse = await courtClient.getCourtPromotions(
          courtId
        );
        if (promotionsResponse) {
          setPromotions(promotionsResponse);
        }

        // Fetch sports
        const sportsResponse = await courtClient.getSports();
        if (sportsResponse && sportsResponse.sports) {
          setSports(sportsResponse.sports);
        }
      } catch (error) {
        console.error("Error fetching court data:", error);
        message.error(
          "Gặp lỗi trong quá trình tải dữ liệu sân đấu. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchCourtData();
    }
  }, [courtId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes (including status)
  const handleSelectChange = (name, value) => {
    setCourt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle court update
  const handleUpdateCourt = async () => {
    try {
      setSubmitLoading(true);

      // Validate form
      const validationErrors = {};
      if (!court.courtName)
        validationErrors.courtName = "Court name is required";
      if (!court.sportId) validationErrors.sportId = "Sport is required";

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setSubmitLoading(false);
        return;
      }

      // Create request object
      const updateRequest = {
        court: {
          courtName: court.courtName,
          sportId: court.sportId,
          description: court.description,
          facilities: court.facilities,
          slotDuration: court.slotDuration,
          status: parseInt(court.status), // Ensure status is a number
          courtType: parseInt(court.courtType),
          minDepositPercentage: court.minDepositPercentage,
          cancellationWindowHours: court.cancellationWindowHours,
          refundPercentage: court.refundPercentage,
        },
      };

      // Update court
      const response = await courtClient.updateCourt(courtId, updateRequest);

      if (response && response.isSuccess) {
        message.success("Thông tin sân được cập nhật thành công!");
        navigate("/court-owner/courts");
      } else {
        message.error("Failed to update court. Please try again.");
      }
    } catch (error) {
      console.error("Error updating court:", error);
      message.error(
        "Gặp lỗi trong quá trình cập nhật thông tin sân: " +
          (error.message || "Lỗi không xác định")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add facility
  const handleAddFacility = () => {
    if (!facilityName) {
      setErrors((prev) => ({
        ...prev,
        facilityName: "Facility name is required",
      }));
      return;
    }

    const newFacility = {
      name: facilityName,
      description: facilityDesc,
    };

    setCourt((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));

    setFacilityName("");
    setFacilityDesc("");
    setErrors((prev) => ({ ...prev, facilityName: "" }));
  };

  // Remove facility
  const handleRemoveFacility = (index) => {
    setCourt((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin sân...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.background.default,
          0.8
        )}, ${theme.palette.background.paper})`,
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cập nhật thông tin sân: {court.courtName}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => navigate("/court-owner/courts")}
            startIcon={<ArrowBackIos />}
          >
            Quay trở lại danh sách sân
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              fontWeight: 600,
              py: 1.5,
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab
            icon={<SportsSoccer />}
            label="Thông tin sân"
            iconPosition="start"
          />
          <Tab
            icon={<EventAvailable />}
            label="Lịch đặt sân"
            iconPosition="start"
            sx={{ "& .MuiBadge-badge": { top: 8, right: -15 } }}
          />
          <Tab
            icon={<CardGiftcard />}
            label="Khuyến mãi"
            iconPosition="start"
            sx={{ "& .MuiBadge-badge": { top: 8, right: -15 } }}
          />
        </Tabs>

        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="court-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: alpha(theme.palette.primary.light, 0.1),
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      <SportsSoccer
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Thông tin cơ bản
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Tên sân"
                      name="courtName"
                      value={court.courtName}
                      onChange={handleInputChange}
                      error={!!errors.courtName}
                      helperText={errors.courtName}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={!!errors.sportId} required>
                      <InputLabel>Môn thể thao</InputLabel>
                      <Select
                        name="sportId"
                        value={court.sportId}
                        onChange={handleInputChange}
                        label="Sport"
                        sx={{ borderRadius: 2 }}
                      >
                        {sports.map((sport) => (
                          <MenuItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.sportId && (
                        <FormHelperText>{errors.sportId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={court.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      placeholder="Provide a detailed description of your court..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  {/* Court Type and Settings */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: alpha(theme.palette.primary.light, 0.1),
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        mt: 2,
                      }}
                    >
                      <EventAvailable
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Loại sân và cài đặt
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Loại sân</InputLabel>
                      <Select
                        name="courtType"
                        value={court.courtType}
                        onChange={handleInputChange}
                        label="Loại sân"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={1}>Trong nhà</MenuItem>
                        <MenuItem value={2}>Ngoài trời</MenuItem>
                        <MenuItem value={3}>Mixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        name="status"
                        value={court.status}
                        onChange={(e) =>
                          handleSelectChange("status", e.target.value)
                        }
                        label="Trạng thái"
                        sx={{ borderRadius: 2 }}
                      >
                        {courtStatusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: option.color,
                                  mr: 1,
                                }}
                              />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Cập nhật trạng thái hoạt động của sân
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeField
                        label="Thời lượng slot (HH:mm:ss)"
                        value={dayjs(`2022-01-01T${court.slotDuration}`)}
                        onChange={(newValue) => {
                          setCourt((prev) => ({
                            ...prev,
                            slotDuration: newValue
                              ? newValue.format("HH:mm:ss")
                              : "01:00:00",
                          }));
                        }}
                        format="HH:mm:ss"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Save Court Button */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateCourt}
                        startIcon={
                          submitLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Save />
                          )
                        }
                        disabled={submitLoading}
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.2,
                          borderRadius: 2,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: `0 4px 10px ${alpha(
                            theme.palette.primary.main,
                            0.25
                          )}`,
                          "&:hover": {
                            boxShadow: `0 6px 15px ${alpha(
                              theme.palette.primary.main,
                              0.35
                            )}`,
                          },
                        }}
                      >
                        {submitLoading
                          ? "Đang cập nhật..."
                          : "Cập nhật thông tin sân"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
};

export default CourtOwnerCourtUpdateView;
