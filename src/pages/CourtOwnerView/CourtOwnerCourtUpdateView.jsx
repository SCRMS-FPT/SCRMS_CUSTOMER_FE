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
    status: 1,
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
            status: courtResponse.court.status || 1,
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
        message.error("Gặp lỗi trong quá trình tải dữ liệu sân đấu. Vui lòng thử lại sau.");
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
          status: court.status,
          courtType: court.courtType,
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
        "Gặp lỗi trong quá trình cập nhật thông tin sân: " + (error.message || "Lỗi không xác định")
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

  // Handle schedule input changes
  const handleScheduleChange = (field, value) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add schedule
  const handleAddSchedule = () => {
    // Validate schedule
    if (
      !newSchedule.dayOfWeek.length ||
      !newSchedule.startTime ||
      !newSchedule.endTime ||
      !newSchedule.priceSlot
    ) {
      message.error("Vui lòng điền vào lịch đặt sân đấu đầy đủ");
      return;
    }

    // Check for time validity
    if (newSchedule.startTime >= newSchedule.endTime) {
      message.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
      return;
    }

    try {
      const createScheduleRequest = {
        courtId: courtId,
        dayOfWeek: newSchedule.dayOfWeek,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        priceSlot: newSchedule.priceSlot,
      };

      // Create new schedule
      courtClient
        .createCourtSchedule(createScheduleRequest)
        .then((response) => {
          if (response && response.id) {
            message.success("Lịch đặt sân được tạo thành công!");

            // Refresh schedules
            courtClient
              .getCourtSchedulesByCourtId(courtId)
              .then((schedulesResponse) => {
                if (schedulesResponse) {
                  setSchedules(schedulesResponse);
                }
              });

            // Reset form
            setNewSchedule({
              courtId: courtId,
              dayOfWeek: [1],
              startTime: "08:00:00",
              endTime: "17:00:00",
              priceSlot: 100000,
              status: 0,
            });
          }
        })
        .catch((error) => {
          console.error("Error adding schedule:", error);
          message.error(
            "Gặp lỗi trong quá trình thêm lịch đặt sân: " + (error.message || "Lỗi không xác định")
          );
        });
    } catch (error) {
      console.error("Error adding schedule:", error);
      message.error(
        "Gặp lỗi trong quá trình thêm lịch đặt sân: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  // Update schedule
  const handleUpdateSchedule = async (scheduleId, updatedData) => {
    try {
      const updateRequest = {
        courtSchedule: {
          id: scheduleId,
          dayOfWeek: updatedData.dayOfWeek,
          startTime: updatedData.startTime,
          endTime: updatedData.endTime,
          priceSlot: updatedData.priceSlot,
          status: updatedData.status,
        },
      };

      const response = await courtClient.updateCourtSchedule(updateRequest);

      if (response && response.isSuccess) {
        message.success("Thông tin lịch đặt sân được cập nhật thành công!");

        // Refresh schedules
        const schedulesResponse = await courtClient.getCourtSchedulesByCourtId(
          courtId
        );
        if (schedulesResponse) {
          setSchedules(schedulesResponse);
        }
      } else {
        message.error("Gặp lỗi trong quá trình cập nhật thông tin lịch đặt sân. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      message.error(
        "Gặp lỗi trong quá trình cập nhật lịch đặt sân: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await courtClient.deleteCourtSchedule(scheduleId);

      if (response && response.isSuccess) {
        message.success("Schedule deleted successfully!");
        setSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== scheduleId)
        );
      } else {
        message.error("Gặp lỗi trong quá trình xóa lịch đặt sân. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error(
        "Gặp lỗi trong quá trình xóa lịch đặt sân: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  // Toggle schedule status
  const handleToggleScheduleStatus = (scheduleId, currentStatus) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (schedule) {
      const updatedSchedule = {
        ...schedule,
        status: currentStatus === 0 ? 2 : 0,
      }; // Toggle between Available and Maintenance
      handleUpdateSchedule(scheduleId, updatedSchedule);
    }
  };

  // Promotion management functions
  const fetchPromotions = async () => {
    try {
      setPromotionLoading(true);
      const response = await courtClient.getCourtPromotions(courtId);
      if (response) {
        setPromotions(response);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      message.error("Gặp lỗi trong quá trình tải thông tin khuyến mãi: " + (error.message || "Lỗi không xác định"));
    } finally {
      setPromotionLoading(false);
    }
  };

  const handlePromotionInputChange = (field, value) => {
    setNewPromotion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openPromotionModal = (promotion = null) => {
    if (promotion) {
      // Edit existing promotion
      setEditingPromotion(promotion);
      setNewPromotion({
        description: promotion.description || "",
        discountType:
          promotion.discountType === "Percentage" ? "Percentage" : "Fixed",
        discountValue: promotion.discountValue || 0,
        validFrom: dayjs(promotion.validFrom),
        validTo: dayjs(promotion.validTo),
      });
    } else {
      // New promotion
      setEditingPromotion(null);
      setNewPromotion({
        description: "",
        discountType: "Percentage",
        discountValue: 10,
        validFrom: dayjs(),
        validTo: dayjs().add(30, "day"),
      });
    }
    setPromotionModalVisible(true);
  };

  const handlePromotionSubmit = async () => {
    try {
      // Validate input
      if (!newPromotion.description || !newPromotion.discountValue) {
        message.error("Vui lòng nhập đầy đủ thông tin yêu cầu");
        return;
      }

      setPromotionLoading(true);

      // Create request object
      const promotionRequest = {
        description: newPromotion.description,
        discountType: newPromotion.discountType,
        discountValue: newPromotion.discountValue,
        validFrom: newPromotion.validFrom.toDate(),
        validTo: newPromotion.validTo.toDate(),
      };

      let response;
      if (editingPromotion) {
        // Update existing promotion
        response = await courtClient.updateCourtPromotion(
          editingPromotion.id,
          promotionRequest
        );
        if (response) {
          message.success("Thông tin khuyến mãi được cập nhật thành công!");
        }
      } else {
        // Create new promotion
        response = await courtClient.createCourtPromotion(
          courtId,
          promotionRequest
        );
        if (response) {
          message.success("Khuyến mãi được tạo thành công!");
        }
      }

      // Refresh promotions list
      await fetchPromotions();
      setPromotionModalVisible(false);
    } catch (error) {
      console.error("Error saving promotion:", error);
      message.error(
        "Gặp lỗi trong quá trình lưu thông tin khuyến mãi: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setPromotionLoading(false);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      setPromotionLoading(true);
      await courtClient.deleteCourtPromotion(promotionId);
      message.success("Thông tin khuyến mãi đã được xóa thành công!");

      // Refresh promotions list
      await fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      message.error(
        "Gặp lỗi trong quá trình xóa thông tin khuyến mãi: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setPromotionLoading(false);
    }
  };

  // Format day of week display
  const formatDaysOfWeek = (days) => {
    if (!days || !Array.isArray(days)) return "";
    return days
      .map((day) => {
        const dayObj = daysOfWeek.find((d) => d.value === day);
        return dayObj ? dayObj.label.substring(0, 3) : "";
      })
      .join(", ");
  };

  // Get status tag for schedule
  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="green">Lịch trống</Tag>;
      case 1:
        return <Tag color="blue">Đã được đặt</Tag>;
      case 2:
        return <Tag color="orange">Đang bảo trì</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  // Table columns for schedules
  const scheduleColumns = [
    {
      title: "Ngày",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (days) => (
        <span>
          {days && Array.isArray(days)
            ? days.map((day) => (
              <Tag color="blue" key={day}>
                {daysOfWeek
                  .find((d) => d.value === day)
                  ?.label.substring(0, 3) || day}
              </Tag>
            ))
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Giá sân",
      dataIndex: "priceSlot",
      key: "priceSlot",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Tình trạng sân",
      dataIndex: "status",
      key: "availability",
      render: (status, record) => (
        <Switch
          checked={status === 0}
          onChange={() => handleToggleScheduleStatus(record.id, status)}
          checkedChildren="Lịch trống"
          unCheckedChildren="Đang bảo trì"
          disabled={status === 1} // Disable toggle if booked
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa lịch đặt này không?"
          onConfirm={() => handleDeleteSchedule(record.id)}
          okText="Yes"
          cancelText="No"
          disabled={record.status === 1} // Cannot delete if booked
        >
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutline />}
            disabled={record.status === 1} // Cannot delete if booked
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Table columns for promotions
  const promotionColumns = [
    {
      title: "Thông tin khuyến mãi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) => (
        <Chip
          label={type}
          color={type === "Percentage" ? "primary" : "secondary"}
          size="small"
        />
      ),
    },
    {
      title: "Mức giảm giá",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (value, record) => (
        <Typography variant="body2" fontWeight="medium">
          {record.discountType === "Percentage"
            ? `${value}%`
            : `${value.toLocaleString()} VND`}
        </Typography>
      ),
    },
    {
      title: "Có hiệu lực từ",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Có hiệu lực đến",
      dataIndex: "validTo",
      key: "validTo",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const now = dayjs();
        const isActive =
          now.isAfter(dayjs(record.validFrom)) &&
          now.isBefore(dayjs(record.validTo));
        return isActive ? (
          <Tag color="green">Còn hiệu lực</Tag>
        ) : (
          <Tag color="red">Hết hiệu lực</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={() => openPromotionModal(record)}
          >
            Cập nhật thông tin
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khuyến mãi này không?"
            onConfirm={() => handleDeletePromotion(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteOutline />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
                  <Grid item xs={12}>
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

                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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

                  <Grid item xs={12} md={4}>
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

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        name="status"
                        value={court.status}
                        onChange={handleInputChange}
                        label="Trạng thái"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={1}>Hoạt động</MenuItem>
                        <MenuItem value={0}>Không hoạt động</MenuItem>
                        <MenuItem value={2}>Đabg bảo trì</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
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

                  {/* Booking and Cancellation */}
                  <Grid item xs={12}>
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
                      <MonetizationOn
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Chính sách đặt sân và hủy đặt sân
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Mức đặt cọc tối thiểu (%)"
                      name="minDepositPercentage"
                      type="number"
                      value={court.minDepositPercentage}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentOutlined />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, max: 100 },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <FormHelperText>
                      Phần trăm của tổng giá mà khách hàng phải trả làm tiền đặt cọc
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Khung thời gian hủy đặt sân (giờ)"
                      name="cancellationWindowHours"
                      type="number"
                      value={court.cancellationWindowHours}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTime />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <FormHelperText>
                      Số giờ trước khi thời gian đặt sân mà khách hàng có thể hủy
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Phần trăm hoàn tiền (%)"
                      name="refundPercentage"
                      type="number"
                      value={court.refundPercentage}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentOutlined />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, max: 100 },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <FormHelperText>
                      Phần trăm của tiền đặt cọc mà khách hàng sẽ nhận lại khi hủy đặt sân
                    </FormHelperText>
                  </Grid>

                  {/* Facilities */}
                  <Grid item xs={12}>
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
                      <SportsSoccer
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Cơ sở vật chất
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Tên cơ sở vật chất"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      error={!!errors.facilityName}
                      helperText={errors.facilityName}
                      placeholder="Tủ đồ, khu nhà tắm, etc."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Thông tin mô tả cơ sở vật chất"
                      value={facilityDesc}
                      onChange={(e) => setFacilityDesc(e.target.value)}
                      placeholder="Mô tả chi tiết về cơ sở vật chất..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddFacility}
                      startIcon={<Add />}
                      sx={{
                        height: "56px",
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
                      Thêm mới
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    {court.facilities.length > 0 ? (
                      <Table
                        dataSource={court.facilities.map((facility, index) => ({
                          key: index,
                          ...facility,
                        }))}
                        columns={[
                          {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Description",
                            dataIndex: "description",
                            key: "description",
                          },
                          {
                            title: "Actions",
                            key: "actions",
                            render: (_, __, index) => (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleRemoveFacility(index)}
                                startIcon={<DeleteOutline />}
                              >
                                Xóa
                              </Button>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                      />
                    ) : (
                      <Alert
                        severity="info"
                        icon={<InfoOutlined />}
                        sx={{ borderRadius: 2 }}
                      >
                        Chưa có cơ sở vật chất nào được thêm vào. Vui lòng thêm mới.
                      </Alert>
                    )}
                  </Grid>

                  {/* Save Court Button */}
                  <Grid item xs={12}>
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
                        {submitLoading ? "Đang cập nhật..." : "Cập nhật thông tin sân"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="schedule-management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
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
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EventAvailable
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    Quản lý lịch đặt sân
                  </Typography>

                  <Chip
                    label={`${schedules.length} lịch đặt sân`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: alpha(theme.palette.info.light, 0.1),
                    borderRadius: 2,
                    border: `1px dashed ${alpha(theme.palette.info.main, 0.4)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    Tạo lịch đặt sân mới
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Ngày trong tuần</InputLabel>
                        <Select
                          multiple
                          value={newSchedule.dayOfWeek}
                          onChange={(e) =>
                            handleScheduleChange("dayOfWeek", e.target.value)
                          }
                          label="Ngày trong tuần"
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
                                  label={daysOfWeek
                                    .find((d) => d.value === value)
                                    ?.label.substring(0, 3)}
                                  size="small"
                                />
                              ))}
                            </Box>
                          )}
                          sx={{ borderRadius: 2 }}
                        >
                          {daysOfWeek.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                              {day.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          label="Thời gian bắt đầu"
                          value={dayjs(`2022-01-01T${newSchedule.startTime}`)}
                          onChange={(newValue) => {
                            handleScheduleChange(
                              "startTime",
                              newValue
                                ? newValue.format("HH:mm:ss")
                                : "08:00:00"
                            );
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

                    <Grid item xs={12} md={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          label="Thời gian kết thúc"
                          value={dayjs(`2022-01-01T${newSchedule.endTime}`)}
                          onChange={(newValue) => {
                            handleScheduleChange(
                              "endTime",
                              newValue
                                ? newValue.format("HH:mm:ss")
                                : "17:00:00"
                            );
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

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Giá thuê mỗi ca (VND)"
                        type="number"
                        value={newSchedule.priceSlot}
                        onChange={(e) =>
                          handleScheduleChange(
                            "priceSlot",
                            parseInt(e.target.value)
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MonetizationOn />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleAddSchedule}
                        startIcon={<Add />}
                        sx={{
                          height: "56px",
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
                        Thêm lịch mới
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Danh sách lịch đặt sân
                </Typography>

                {schedules.length > 0 ? (
                  <Table
                    dataSource={schedules.map((schedule) => ({
                      key: schedule.id,
                      ...schedule,
                    }))}
                    columns={scheduleColumns}
                    pagination={false}
                    bordered
                    rowClassName={(record) =>
                      record.status === 1
                        ? "ant-table-row-booked"
                        : record.status === 2
                          ? "ant-table-row-maintenance"
                          : ""
                    }
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Typography variant="body1" color="text.secondary">
                        Chưa có lịch đặt sân nào được thêm vào. Vui lòng thêm mới.
                      </Typography>
                    }
                  />
                )}

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.warning.light, 0.1),
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="warning.dark"
                  >
                    Ghi chú
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    - Bạn không thể xóa lịch đã được đặt.
                    <br />
                    - Trạng thái "Có sẵn" có nghĩa là lịch này có thể được đặt.
                    <br />
                    - Trạng thái "Bảo trì" có nghĩa là lịch này tạm thời không có sẵn.
                    <br />- Trạng thái "Đã đặt" sẽ được thiết lập tự động khi khách hàng đặt lịch này.

                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="promotion-management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
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
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CardGiftcard
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    Quản lý khuyến mãi sân
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => openPromotionModal()}
                    sx={{
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
                    Thêm mới khuyến mãi
                  </Button>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: alpha(theme.palette.info.light, 0.1),
                    borderRadius: 2,
                    border: `1px dashed ${alpha(theme.palette.info.main, 0.4)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    Về khuyến mãi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khuyến mãi cho phép bạn cung cấp các giảm giá cho các buổi đặt sân
                    để thu hút nhiều khách hàng hơn. Bạn có thể tạo các giảm giá theo
                    phần trăm (ví dụ, giảm 10%) hoặc giảm giá theo số tiền cố định
                    (ví dụ, giảm 50,000 VND). Thiết lập phạm vi ngày hợp lệ để kiểm soát
                    thời gian các chương trình khuyến mãi này có hiệu lực.
                  </Typography>
                </Box>

                {promotionLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 5 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : promotions.length > 0 ? (
                  <Table
                    dataSource={promotions.map((promo) => ({
                      key: promo.id,
                      ...promo,
                    }))}
                    columns={promotionColumns}
                    pagination={false}
                    bordered
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Typography variant="body1" color="text.secondary">
                        Chưa có chương trình khuyến mãi nào được thêm vào. Tạo chương trình
                        khuyến mãi đầu tiên của bạn để thu hút nhiều khách hàng hơn.
                      </Typography>
                    }
                  />
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promotion Modal */}
        <Dialog
          open={promotionModalVisible}
          onClose={() => setPromotionModalVisible(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ pb: 1 }}>
            {editingPromotion ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thông tin mô tả"
                  value={newPromotion.description}
                  onChange={(e) =>
                    handlePromotionInputChange("description", e.target.value)
                  }
                  placeholder="E.g., Khuyến mãi mùa hè, Giảm giá cho khách hàng mới"
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={newPromotion.discountType}
                    onChange={(e) =>
                      handlePromotionInputChange("discountType", e.target.value)
                    }
                    label="Loại giảm giá"
                  >
                    <MenuItem value="Percentage">Giảm giá phần trăm (%)</MenuItem>
                    <MenuItem value="Fixed">Giảm giá tiền (VND)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    newPromotion.discountType === "Percentage"
                      ? "Phần trăm giảm giá (%)"
                      : "Giá trị giảm giá (VND)"
                  }
                  type="number"
                  value={newPromotion.discountValue}
                  onChange={(e) =>
                    handlePromotionInputChange(
                      "discountValue",
                      parseInt(e.target.value)
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {newPromotion.discountType === "Percentage"
                          ? "%"
                          : "VND"}
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max:
                        newPromotion.discountType === "Percentage"
                          ? 100
                          : undefined,
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Có hiệu lực từ"
                    value={newPromotion.validFrom}
                    onChange={(newValue) =>
                      handlePromotionInputChange("validFrom", newValue)
                    }
                    sx={{ width: "100%", mb: 2 }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Có hiệu lực đến"
                    value={newPromotion.validTo}
                    onChange={(newValue) =>
                      handlePromotionInputChange("validTo", newValue)
                    }
                    sx={{ width: "100%", mb: 2 }}
                    minDate={newPromotion.validFrom}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setPromotionModalVisible(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromotionSubmit}
              variant="contained"
              color="primary"
              disabled={promotionLoading}
              startIcon={
                promotionLoading ? <CircularProgress size={20} /> : <Save />
              }
            >
              {promotionLoading ? "Đang lưu thông tin..." : "Lưu thông tin khuyến mại"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>

      {/* Custom CSS for booked and maintenance rows */}
      <style jsx global>{`
        .ant-table-row-booked {
          background-color: ${alpha(theme.palette.info.light, 0.2)};
        }
        .ant-table-row-maintenance {
          background-color: ${alpha(theme.palette.warning.light, 0.2)};
        }
      `}</style>
    </Box>
  );
};

export default CourtOwnerCourtUpdateView;
