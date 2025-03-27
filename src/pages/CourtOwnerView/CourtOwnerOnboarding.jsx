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

// Default operating hours format - same as in CourtCreateView
const defaultSchedules = [
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "07:00",
    endTime: "17:00",
    priceSlot: 150000,
    name: "Weekday Regular Hours",
  },
  {
    days: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: "17:00",
    endTime: "22:00",
    priceSlot: 200000,
    name: "Weekday Evening Hours",
  },
  {
    days: [6, 7], // Saturday and Sunday (7 is Sunday)
    startTime: "08:00",
    endTime: "22:00",
    priceSlot: 250000,
    name: "Weekend Hours",
  },
];

// Day options for schedule selection
const dayOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
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
          message: "Error",
          description: "Failed to load sports. Please try again later.",
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
        message: "Upload Failed",
        description: "Failed to process avatar image.",
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

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };
  // Custom upload handler for gallery images
  const customGalleryUpload = async ({ file, onSuccess }) => {
    try {
      // Check max files limit
      if (galleryFiles.length >= 5) {
        notification.warning({
          message: "Upload Limit",
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
        message: "Upload Failed",
        description: "Failed to process gallery image.",
      });
    }
  };

  const handleCreateSportCenter = async () => {
    setLoading(true);
    try {
      // Validate form
      if (!sportCenter.name || !sportCenter.phoneNumber || !avatarFile) {
        notification.error({
          message: "Validation Error",
          description:
            "Please fill all required fields and upload a center logo.",
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
          message: "Success",
          description: "Sport center created successfully!",
        });
        handleNext();
      }
    } catch (error) {
      console.error("Error creating sport center:", error);
      notification.error({
        message: "Error",
        description: "Failed to create sport center. Please try again.",
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
        description: "Facility name is required",
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

  const steps = [
    {
      label: "Welcome to Court Owner Portal",
      description: `Hello ${
        user?.name || "Court Owner"
      }! Let's get started by setting up your first sports center.`,
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
                  Welcome to the Court Management System!
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
                We're excited to have you join our platform! This setup wizard
                will guide you through creating your sports center, courts, and
                getting everything ready for your customers.
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
                  Your Onboarding Steps:
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
                      Create your sports center
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set up your venue's details, location and images
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
                      Add courts to your center
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure your courts' specifications and facilities
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
                      Set court schedules
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Define operating hours and time slots for bookings
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
                      Create promotions (optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attract customers with special discounts and offers
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
                    Let's Get Started
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Create your Sports Center",
      description: "Enter details about your sports center",
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
                Sports Center Information
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                Let's set up your first venue
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Progress
                  percent={33}
                  steps={3}
                  strokeColor="#1976d2"
                  size="small"
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
                      label="Center Name"
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
                      label="Phone Number"
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
                      label="Address"
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
                          label="City"
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
                          label="District"
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
                          label="Commune"
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
                      label="Description"
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
                      placeholder="Describe your sports center, its facilities and what makes it special..."
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
                        Upload Center Images (Max 5)
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
                            <div style={{ marginTop: 8 }}>Upload</div>
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
                        <Badge
                          count="Required"
                          color="#1976d2"
                          offset={[10, 0]}
                        >
                          <PhotoCamera sx={{ mr: 1, color: "primary.main" }} />
                          Upload Center Logo
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
                                  url: URL.createObjectURL(avatarFile),
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
                Back
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
                  {loading ? "Creating..." : "Create & Continue"}
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Add your first Court",
      description: "Set up your first court in the sports center",
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
                <Progress
                  percent={67}
                  steps={3}
                  strokeColor="#1976d2"
                  size="small"
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
                      label="Court Name"
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
                      <InputLabel id="sport-label">Sport</InputLabel>
                      <Select
                        labelId="sport-label"
                        value={court.sportId}
                        label="Sport"
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
                          <MenuItem disabled>Loading sports...</MenuItem>
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
                      <InputLabel id="court-type-label">Court Type</InputLabel>
                      <Select
                        labelId="court-type-label"
                        value={court.courtType}
                        label="Court Type"
                        onChange={(e) =>
                          setCourt({ ...court, courtType: e.target.value })
                        }
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={1}>Indoor</MenuItem>
                        <MenuItem value={2}>Outdoor</MenuItem>
                        <MenuItem value={3}>Mixed</MenuItem>
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
                      label="Slot Duration (hh:mm:ss)"
                      variant="outlined"
                      value={court.slotDuration}
                      onChange={(e) =>
                        setCourt({ ...court, slotDuration: e.target.value })
                      }
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
                      label="Description"
                      variant="outlined"
                      value={court.description}
                      onChange={(e) =>
                        setCourt({ ...court, description: e.target.value })
                      }
                      multiline
                      rows={4}
                      margin="normal"
                      placeholder="Describe your court, its features and any special amenities..."
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
                      Booking Settings
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
                            label="Min Deposit (%)"
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
                            label="Refund Percentage"
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
                        label="Cancellation Window (hours)"
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
                        helperText="How many hours before the booking can a customer cancel"
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
                    Court Schedules
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Define when your court is available and set pricing for
                    different times.
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
                            Remove
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
                              label="Start Time (HH:MM)"
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
                              label="End Time (HH:MM)"
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
                              label="Price per hour (₫)"
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
                    Add Schedule
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
                Back
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
                  {loading ? "Creating..." : "Create & Continue"}
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      ),
    },
    {
      label: "Congratulations!",
      description: "You're all set up and ready to go!",
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
                <Progress
                  percent={100}
                  steps={3}
                  strokeColor="#52c41a"
                  size="small"
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
                  Setup Complete!
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
                Your sports center and court have been created successfully.
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
                  Go to Dashboard
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
              What's Next?
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
                          Set Up Court Schedules
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Define when your courts are available and set pricing
                          for different time slots.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/schedule")}
                        >
                          Set Schedules
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
                          Create Promotions
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Attract customers with special offers and discounts
                          for your courts.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/promotions")}
                        >
                          Add Promotions
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
                          Add More Courts
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                          Expand your offerings by adding different types of
                          courts to your sports center.
                        </Typography>

                        <Button
                          variant="outlined"
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate("/court-owner/courts/create")}
                        >
                          Add Courts
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
          Court Owner Setup
        </Typography>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            ".MuiStepConnector-line": {
              borderLeft: "2px dashed rgba(25, 118, 210, 0.3)",
              minHeight: 20,
              marginLeft: 1
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
