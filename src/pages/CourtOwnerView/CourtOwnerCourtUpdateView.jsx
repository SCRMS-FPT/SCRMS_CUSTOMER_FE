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
  { value: 1, label: "Thứ Hai" },
  { value: 2, label: "Thứ Ba" },
  { value: 3, label: "Thứ Tư" },
  { value: 4, label: "Thứ Năm" },
  { value: 5, label: "Thứ Sáu" },
  { value: 6, label: "Thứ Bảy" },
  { value: 7, label: "Chủ Nhật" },
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
    status: 0,
    courtType: 1,
    minDepositPercentage: 30,
    cancellationWindowHours: 24,
    refundPercentage: 50,
  });

  // For schedules
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    courtId: courtId,
    dayOfWeek: [1], // Thứ Hai by default
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
    discountType: "Phần trăm", // Percentage or Fixed
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
            courtType: courtResponse.court.courtType || 0,
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
        message.error("Không thể tải dữ liệu sân. Vui lòng thử lại.");
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
      if (!court.courtName) validationErrors.courtName = "Tên sân là bắt buộc";
      if (!court.sportId) validationErrors.sportId = "Môn thể thao là bắt buộc";

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
        message.success("Cập nhật sân thành công!");
        navigate("/court-owner/courts");
      } else {
        message.error("Cập nhật sân không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating court:", error);
      message.error(
        "Lỗi cập nhật sân: " + (error.message || "Lỗi không xác định")
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
        facilityName: "Tên tiện ích là bắt buộc",
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
      message.error("Vui lòng điền đầy đủ thông tin lịch trình");
      return;
    }

    // Check for time validity
    if (newSchedule.startTime >= newSchedule.endTime) {
      message.error("Thời gian kết thúc phải sau thời gian bắt đầu");
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
            message.success("Thêm lịch trình thành công!");

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
            "Thêm lịch trình không thành công: " +
              (error.message || "Lỗi không xác định")
          );
        });
    } catch (error) {
      console.error("Error adding schedule:", error);
      message.error(
        "Thêm lịch trình không thành công: " +
          (error.message || "Lỗi không xác định")
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
        message.success("Cập nhật lịch trình thành công!");

        // Refresh schedules
        const schedulesResponse = await courtClient.getCourtSchedulesByCourtId(
          courtId
        );
        if (schedulesResponse) {
          setSchedules(schedulesResponse);
        }
      } else {
        message.error(
          "Cập nhật lịch trình không thành công. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      message.error(
        "Lỗi cập nhật lịch trình: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await courtClient.deleteCourtSchedule(scheduleId);

      if (response && response.isSuccess) {
        message.success("Xóa lịch trình thành công!");
        setSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== scheduleId)
        );
      } else {
        message.error("Xóa lịch trình không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error(
        "Lỗi xóa lịch trình: " + (error.message || "Lỗi không xác định")
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
      message.error("Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại.");
    } finally {
      setPromotionLoading(false);
    }
  };

  // Check if two date ranges overlap
  const datesOverlap = (startA, endA, startB, endB) => {
    // Convert to comparable format
    const startADate = new Date(startA);
    const endADate = new Date(endA);
    const startBDate = new Date(startB);
    const endBDate = new Date(endB);

    // Check for overlap: startA <= endB AND startB <= endA
    return startADate <= endBDate && startBDate <= endADate;
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
      setPromotionLoading(true);

      // Check for date overlaps with existing promotions
      const hasOverlap = promotions.some((promotion) => {
        // Skip checking against the promotion being edited
        if (editingPromotion && promotion.id === editingPromotion.id) {
          return false;
        }

        return datesOverlap(
          newPromotion.validFrom.format("YYYY-MM-DD"),
          newPromotion.validTo.format("YYYY-MM-DD"),
          promotion.validFrom,
          promotion.validTo
        );
      });

      if (hasOverlap) {
        message.error(
          "Khuyến mãi mới trùng thời gian hiệu lực với khuyến mãi đã tồn tại."
        );
        setPromotionLoading(false);
        return;
      }

      if (editingPromotion) {
        // Update existing promotion
        const updateRequest = {
          description: newPromotion.description,
          discountType:
            newPromotion.discountType === "Phần trăm" ? "Percentage" : "Fixed",
          discountValue: parseFloat(newPromotion.discountValue),
          validFrom: newPromotion.validFrom.toDate(),
          validTo: newPromotion.validTo.toDate(),
        };

        await courtClient.updateCourtPromotion(
          editingPromotion.id,
          updateRequest
        );
        message.success("Cập nhật khuyến mãi thành công!");
      } else {
        // Create new promotion
        const createRequest = {
          description: newPromotion.description,
          discountType:
            newPromotion.discountType === "Phần trăm" ? "Percentage" : "Fixed",
          discountValue: parseFloat(newPromotion.discountValue),
          validFrom: newPromotion.validFrom.toDate(),
          validTo: newPromotion.validTo.toDate(),
        };

        await courtClient.createCourtPromotion(courtId, createRequest);
        message.success("Thêm khuyến mãi thành công!");
      }

      // Refresh promotions list
      await fetchPromotions();
      setPromotionModalVisible(false);
      setEditingPromotion(null);
      setNewPromotion({
        description: "",
        discountType: "Phần trăm",
        discountValue: 10,
        validFrom: dayjs(),
        validTo: dayjs().add(30, "day"),
      });
    } catch (error) {
      console.error("Error submitting promotion:", error);
      message.error(error.message || "Có lỗi xảy ra khi xử lý khuyến mãi.");
    } finally {
      setPromotionLoading(false);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      setPromotionLoading(true);
      await courtClient.deleteCourtPromotion(promotionId);
      message.success("Xóa khuyến mãi thành công!");

      // Refresh promotions list
      await fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      message.error(
        "Xóa khuyến mãi không thành công: " +
          (error.message || "Lỗi không xác định")
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
        return <Tag color="green">Khả dụng</Tag>;
      case 1:
        return <Tag color="blue">Đã đặt</Tag>;
      case 2:
        return <Tag color="orange">Bảo trì</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  // Table columns for schedules
  const scheduleColumns = [
    {
      title: "Ngày trong tuần",
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
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Giá",
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
      title: "Tình trạng",
      dataIndex: "status",
      key: "availability",
      render: (status, record) => (
        <Switch
          checked={status === 0}
          onChange={() => handleToggleScheduleStatus(record.id, status)}
          checkedChildren="Khả dụng"
          unCheckedChildren="Bảo trì"
          disabled={status === 1} // Disable toggle if booked
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa lịch trình này?"
          onConfirm={() => handleDeleteSchedule(record.id)}
          okText="Có"
          cancelText="Không"
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) => (
        <Chip
          label={type === "Percentage" ? "Phần trăm" : "Cố định"}
          color={type === "Percentage" ? "primary" : "secondary"}
          size="small"
        />
      ),
    },
    {
      title: "Giá trị",
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
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Không hoạt động</Tag>
        );
      },
    },
    {
      title: "Thao tác",
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
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa khuyến mãi này?"
            onConfirm={() => handleDeletePromotion(record.id)}
            okText="Có"
            cancelText="Không"
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
            Cập nhật Sân: {court.courtName}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => navigate("/court-owner/courts")}
            startIcon={<ArrowBackIos />}
          >
            Quay lại danh sách sân
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
            label="Lịch trình"
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
                        label="Môn thể thao"
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
                      label="Mô tả"
                      name="description"
                      value={court.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      placeholder="Cung cấp mô tả chi tiết về sân của bạn..."
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
                        <MenuItem value={3}>Hỗn hợp</MenuItem>
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
                        onChange={handleInputChange}
                        label="Trạng thái"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={0}>Hoạt động</MenuItem>
                        <MenuItem value={1}>Không hoạt động</MenuItem>
                        <MenuItem value={2}>Bảo trì</MenuItem>
                      </Select>
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
                        label="Thời lượng khung giờ"
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
                      <MonetizationOn
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Chính sách đặt sân và hủy
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
                    <TextField
                      fullWidth
                      label="Tiền đặt cọc tối thiểu (%)"
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
                      Phần trăm tổng giá mà khách hàng phải trả khi đặt cọc
                    </FormHelperText>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Thời hạn hủy (giờ)"
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
                      Số giờ trước thời điểm đặt sân cho phép hủy
                    </FormHelperText>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Phần trăm hoàn tiền"
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
                      Phần trăm tiền đặt cọc sẽ được hoàn trả khi hủy
                    </FormHelperText>
                  </Grid>

                  {/* Facilities */}
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
                      <SportsSoccer
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Tiện ích
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 5,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Tên tiện ích"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      error={!!errors.facilityName}
                      helperText={errors.facilityName}
                      placeholder="Ví dụ: Phòng tắm, Phòng thay đồ, v.v."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 5,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Mô tả tiện ích"
                      value={facilityDesc}
                      onChange={(e) => setFacilityDesc(e.target.value)}
                      placeholder="Mô tả ngắn gọn về tiện ích này"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 2,
                    }}
                  >
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
                      Thêm
                    </Button>
                  </Grid>

                  <Grid size={12}>
                    {court.facilities.length > 0 ? (
                      <Table
                        dataSource={court.facilities.map((facility, index) => ({
                          key: index,
                          ...facility,
                        }))}
                        columns={[
                          {
                            title: "Tên",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Mô tả",
                            dataIndex: "description",
                            key: "description",
                          },
                          {
                            title: "Thao tác",
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
                        Chưa có tiện ích nào được thêm. Hãy thêm tiện ích để
                        nâng cao sự hấp dẫn của sân.
                      </Alert>
                    )}
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
                        {submitLoading ? "Đang cập nhật..." : "Cập nhật sân"}
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
                    Quản lý lịch trình sân
                  </Typography>

                  <Chip
                    label={`${schedules.length} Lịch trình`}
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
                    Thêm lịch trình mới
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 3,
                      }}
                    >
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

                    <Grid
                      size={{
                        xs: 12,
                        md: 2,
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          label="Giờ bắt đầu"
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

                    <Grid
                      size={{
                        xs: 12,
                        md: 2,
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          label="Giờ kết thúc"
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

                    <Grid
                      size={{
                        xs: 12,
                        md: 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Giá mỗi khung giờ (VND)"
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

                    <Grid
                      size={{
                        xs: 12,
                        md: 2,
                      }}
                    >
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
                        Thêm lịch trình
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Lịch trình hiện tại
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
                        Chưa có lịch trình nào được thêm. Hãy thêm lịch trình
                        đầu tiên bằng biểu mẫu ở trên.
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
                    Lưu ý
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    - Bạn không thể xóa lịch trình đã được đặt.
                    <br />
                    - Trạng thái "Khả dụng" có nghĩa là lịch trình đang mở cho
                    đặt sân.
                    <br />
                    - Trạng thái "Bảo trì" có nghĩa là lịch trình tạm thời không
                    khả dụng.
                    <br />- Trạng thái "Đã đặt" được đặt tự động khi khách hàng
                    đặt khung giờ này.
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
                    Thêm khuyến mãi mới
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
                    Khuyến mãi cho phép bạn cung cấp giảm giá khi đặt sân để thu
                    hút nhiều khách hàng hơn. Bạn có thể tạo giảm giá theo phần
                    trăm (ví dụ: giảm 10%) hoặc giảm giá cố định (ví dụ: giảm
                    50.000 VND). Đặt phạm vi ngày để kiểm soát thời gian khuyến
                    mãi có hiệu lực.
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
                        Chưa có khuyến mãi nào được thêm. Tạo khuyến mãi đầu
                        tiên của bạn để thu hút nhiều khách hàng hơn.
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
            {editingPromotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={newPromotion.description}
                  onChange={(e) =>
                    handlePromotionInputChange("description", e.target.value)
                  }
                  placeholder="Ví dụ: Khuyến mãi hè, Giảm giá cuối tuần"
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Loại giảm giá</InputLabel>
                  <Select
                    value={newPromotion.discountType}
                    onChange={(e) =>
                      handlePromotionInputChange("discountType", e.target.value)
                    }
                    label="Loại giảm giá"
                  >
                    <MenuItem value="Percentage">Phần trăm (%)</MenuItem>
                    <MenuItem value="Fixed">Số tiền cố định (VND)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label={
                    newPromotion.discountType === "Percentage"
                      ? "Phần trăm giảm giá"
                      : "Số tiền giảm giá (VND)"
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

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
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

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
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
              Hủy
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
              {promotionLoading ? "Đang lưu..." : "Lưu khuyến mãi"}
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
