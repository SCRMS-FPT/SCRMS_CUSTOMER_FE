"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Client as CoachClient } from "../../API/CoachApi";
import { Client as CourtClient } from "../../API/CourtApi";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { toast, Toaster } from "react-hot-toast";

// Material UI imports
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Badge,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

// Ant Design imports
import { Tabs, Tag, Spin, Empty, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  DollarOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export default function CoachProfile() {
  const navigate = useNavigate();
  const coachClient = new CoachClient();
  const courtClient = new CourtClient();
  const fileInputRef = useRef(null);

  // State for coach data
  const [coachData, setCoachData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [sports, setSports] = useState([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setSportsLoading(true);
        const response = await courtClient.getSports();
        setSports(response.sports || []);
      } catch (error) {
        console.error("Error fetching sports:", error);
        toast.error("Không thể tải danh sách môn thể thao");
      } finally {
        setSportsLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Fetch coach data on component mount
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setIsLoading(true);
        const data = await coachClient.getMyCoachProfile();

        setCoachData(data);
        setEditedData({
          ...data,
        });

        // Set preview images from existing imageUrls
        if (data.imageUrls && data.imageUrls.length > 0) {
          setPreviewImages(
            data.imageUrls.map((url) => ({
              uid: `existing-${Math.random().toString(36).substring(2, 9)}`,
              name: url.split("/").pop(),
              status: "done",
              url: url,
              isExisting: true,
              originalUrl: url,
            }))
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachData();
  }, []);

  // Get sport name by sportId
  const getSportName = (sportId) => {
    const sport = sports.find((s) => s.id === sportId);
    return sport ? sport.name : "Không xác định";
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle sports selection
  const handleSportsChange = (event) => {
    const { value } = event.target;
    setEditedData((prev) => ({ ...prev, sportIds: value }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setEditedData((prev) => ({ ...prev, avatar: fileUrl }));
      setAvatarFile(file);
    }
  };

  // Handle gallery image upload
  const handleGalleryUpload = (fileList) => {
    const newFiles = Array.from(fileList);

    // Validate file size
    const oversizeFiles = newFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizeFiles.length > 0) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setGalleryFiles((prev) => [...prev, ...newFiles]);

    // Create preview URLs for new files
    const newPreviews = newFiles.map((file) => ({
      uid: `new-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      status: "done",
      url: URL.createObjectURL(file),
      file: file,
      isNew: true,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (image) => {
    if (image.isExisting) {
      // Add to list of images to delete on the server
      setImagesToDelete((prev) => [...prev, image.originalUrl]);
    }

    // Remove from preview images
    setPreviewImages((prev) => prev.filter((img) => img.uid !== image.uid));

    // Remove from gallery files if it's a new file
    if (image.isNew) {
      setGalleryFiles((prev) =>
        prev.filter((file) => {
          // Find by comparing file name since the File object reference might be different
          return file.name !== image.name;
        })
      );
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      setProfileUpdating(true);
      const formData = new FormData();

      // Add basic information
      formData.append("fullName", editedData.fullName || "");
      formData.append("email", editedData.email || "");
      formData.append("phone", editedData.phone || "");
      formData.append("bio", editedData.bio || "");
      formData.append("ratePerHour", editedData.ratePerHour?.toString() || "0");

      // Handle sports
      if (editedData.sportIds && editedData.sportIds.length > 0) {
        editedData.sportIds.forEach((sportId) => {
          formData.append("listSport", sportId);
        });
      }

      // Add avatar file if changed
      if (avatarFile) {
        formData.append("newAvatar", avatarFile);
      }

      // Add new gallery images
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file, index) => {
          formData.append(`newImages`, file);
        });
      }

      // Add existing images that should be kept
      const existingImages = previewImages
        .filter((img) => img.isExisting)
        .map((img) => img.originalUrl);

      if (existingImages.length > 0) {
        existingImages.forEach((url) => {
          formData.append("existingImageUrls", url);
        });
      }

      // Add images to delete
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach((url) => {
          formData.append("imagesToDelete", url);
        });
      }

      await coachClient.updateMyProfile(formData);

      // Update the coach data with the edited data
      setCoachData({
        ...editedData,
        imageUrls: [
          // Keep existing images that weren't deleted
          ...existingImages,
          // We'll need to fetch the new URLs from the server in a real app
          // For now, we'll just use the local URLs
          ...previewImages.filter((img) => img.isNew).map((img) => img.url),
        ],
      });

      // Reset edit state
      setIsEditing(false);
      setGalleryFiles([]);
      setImagesToDelete([]);
      setAvatarFile(null);

      toast.success("Thông tin đã được cập nhật thành công!");

      // In a real app, we should refetch the coach data to get the new URLs for uploaded images
      const refreshedData = await coachClient.getMyCoachProfile();
      setCoachData(refreshedData);
      setEditedData(refreshedData);
      setPreviewImages(
        refreshedData.imageUrls?.map((url) => ({
          uid: `existing-${Math.random().toString(36).substring(2, 9)}`,
          name: url.split("/").pop(),
          status: "done",
          url: url,
          isExisting: true,
          originalUrl: url,
        })) || []
      );
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    } finally {
      setProfileUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedData(coachData);
    setIsEditing(false);
    setAvatarFile(null);
    setGalleryFiles([]);
    setImagesToDelete([]);

    // Reset preview images to original state
    if (coachData.imageUrls && coachData.imageUrls.length > 0) {
      setPreviewImages(
        coachData.imageUrls.map((url) => ({
          uid: `existing-${Math.random().toString(36).substring(2, 9)}`,
          name: url.split("/").pop(),
          status: "done",
          url: url,
          isExisting: true,
          originalUrl: url,
        }))
      );
    } else {
      setPreviewImages([]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CircularProgress size={60} className="text-indigo-600" />
          <Typography variant="h6" className="mt-4 text-gray-700">
            Đang tải thông tin...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <Toaster position="top-right" />
      {/* Header with back button */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:arrow-left" />}
          onClick={() => navigate(-1)}
          className="hover:shadow-md transition-all duration-300 bg-white text-indigo-700 hover:bg-indigo-50"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          Quay lại
        </Button>
      </motion.div>
      <Box className="max-w-7xl mx-auto">
        {/* Profile main card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              className="mb-8 overflow-hidden rounded-xl"
              sx={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                borderRadius: "20px",
                overflow: "hidden",
                background: "white",
              }}
            >
              {/* Profile banner */}
              <Box
                className="h-48 bg-gradient-to-r from-indigo-600 to-blue-500 relative overflow-hidden"
                sx={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(to right, rgba(79, 70, 229, 0.8), rgba(45, 212, 191, 0.8))",
                  },
                }}
              >
                <Box className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/40 to-transparent"></Box>
              </Box>

              <Box className="px-6 sm:px-8 pt-0 pb-6 relative mt-8">
                {/* Avatar - positioned to overlap banner */}
                <Box className="flex flex-col sm:flex-row sm:items-end -mt-20 mb-6 relative">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      isEditing ? (
                        <IconButton
                          sx={{
                            bgcolor: "white",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                          }}
                          className="shadow-lg"
                          component="label"
                          size="small"
                        >
                          <input
                            type="file"
                            hidden
                            onChange={handleAvatarChange}
                            accept="image/*"
                          />
                          <Icon
                            icon="mdi:camera"
                            className="text-indigo-600"
                            width={20}
                          />
                        </IconButton>
                      ) : null
                    }
                  >
                    <Avatar
                      src={editedData.avatar}
                      alt={editedData.fullName}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Badge>

                  <Box className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    {isEditing ? (
                      <TextField
                        name="fullName"
                        label="Họ và tên"
                        value={editedData.fullName || ""}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1 }}
                        InputProps={{
                          sx: { borderRadius: "10px" },
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h4"
                        component="h1"
                        className="font-bold text-gray-800"
                      >
                        {coachData.fullName}
                      </Typography>
                    )}

                    <Box className="flex flex-wrap items-center gap-2 mt-2">
                      {isEditing ? (
                        <FormControl
                          sx={{ mt: 1, width: "100%" }}
                          variant="outlined"
                          size="small"
                        >
                          <InputLabel
                            id="sports-select-label"
                            sx={{ backgroundColor: "white", px: 1 }}
                          >
                            Môn thể thao
                          </InputLabel>
                          <Select
                            labelId="sports-select-label"
                            multiple
                            value={editedData.sportIds || []}
                            onChange={handleSportsChange}
                            input={<OutlinedInput label="Môn thể thao" />}
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
                                    label={getSportName(value)}
                                    size="small"
                                    sx={{
                                      bgcolor: "rgba(79, 70, 229, 0.1)",
                                      color: "rgb(79, 70, 229)",
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          >
                            {sportsLoading ? (
                              <MenuItem disabled>
                                <CircularProgress size={20} />
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                  Đang tải dữ liệu...
                                </Typography>
                              </MenuItem>
                            ) : (
                              sports.map((sport) => (
                                <MenuItem key={sport.id} value={sport.id}>
                                  {sport.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        editedData.sportIds &&
                        editedData.sportIds.map((sportId) => (
                          <Tag key={sportId} color="blue">
                            {getSportName(sportId)}
                          </Tag>
                        ))
                      )}
                    </Box>
                  </Box>

                  {/* Edit/Save buttons */}
                  <Box className="mt-4 sm:mt-0">
                    {isEditing ? (
                      <Box className="flex gap-2">
                        <Tooltip title="Lưu thay đổi">
                          <IconButton
                            color="primary"
                            onClick={handleSaveChanges}
                            disabled={profileUpdating}
                            className="hover:scale-110 transition-transform"
                            sx={{
                              bgcolor: "indigo.50",
                              boxShadow: "0 2px 10px rgba(99, 102, 241, 0.2)",
                            }}
                          >
                            {profileUpdating ? (
                              <Spin size="small" />
                            ) : (
                              <SaveOutlined />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy">
                          <IconButton
                            color="error"
                            onClick={handleCancelEdit}
                            disabled={profileUpdating}
                            className="hover:scale-110 transition-transform"
                            sx={{ bgcolor: "red.50" }}
                          >
                            <CloseOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title="Chỉnh sửa hồ sơ">
                        <IconButton
                          color="primary"
                          onClick={() => setIsEditing(true)}
                          className="hover:scale-110 transition-transform"
                          sx={{
                            bgcolor: "white",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Contact info */}
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Box className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 transition-all duration-300 hover:shadow-md">
                    <Box className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <MailOutlined style={{ fontSize: "20px" }} />
                    </Box>
                    <Box className="flex-1">
                      <Typography
                        variant="caption"
                        className="text-blue-600 font-medium"
                      >
                        Email
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="email"
                          value={editedData.email || ""}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          variant="standard"
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          className="font-medium text-gray-800"
                        >
                          {coachData.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box className="flex items-center gap-3 p-4 rounded-lg bg-green-50 transition-all duration-300 hover:shadow-md">
                    <Box className="rounded-full bg-green-100 p-2 text-green-600">
                      <PhoneOutlined style={{ fontSize: "20px" }} />
                    </Box>
                    <Box className="flex-1">
                      <Typography
                        variant="caption"
                        className="text-green-600 font-medium"
                      >
                        Số điện thoại
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="phone"
                          value={editedData.phone || ""}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          variant="standard"
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          className="font-medium text-gray-800"
                        >
                          {coachData.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 transition-all duration-300 hover:shadow-md">
                    <Box className="rounded-full bg-purple-100 p-2 text-purple-600">
                      <DollarOutlined style={{ fontSize: "20px" }} />
                    </Box>
                    <Box className="flex-1">
                      <Typography
                        variant="caption"
                        className="text-purple-600 font-medium"
                      >
                        Giá mỗi giờ
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="ratePerHour"
                          value={editedData.ratePerHour || ""}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          variant="standard"
                          InputProps={{
                            endAdornment: (
                              <Typography variant="caption">VNĐ</Typography>
                            ),
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          className="font-medium text-gray-800"
                        >
                          {coachData.ratePerHour?.toLocaleString()} VNĐ/giờ
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Content section */}
          <motion.div variants={itemVariants}>
            <Paper
              className="p-6 mt-6 rounded-xl"
              sx={{
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                borderRadius: "16px",
              }}
            >
              <Box className="mb-6">
                <Typography
                  variant="h6"
                  component="h2"
                  className="text-gray-800 font-bold mb-4 flex items-center gap-2"
                >
                  <Icon
                    icon="mdi:account-details"
                    className="text-indigo-600"
                    width={24}
                  />
                  Giới thiệu bản thân
                </Typography>

                {isEditing ? (
                  <TextField
                    name="bio"
                    value={editedData.bio || ""}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Viết một đoạn giới thiệu về bản thân..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    className="text-gray-600 leading-relaxed"
                  >
                    {coachData.bio || "Chưa có thông tin giới thiệu."}
                  </Typography>
                )}
              </Box>

              <Divider className="my-6" />

              {/* Photo gallery section */}
              <Box className="mb-6">
                <Typography
                  variant="h6"
                  component="h2"
                  className="text-gray-800 font-bold mb-4 flex items-center gap-2"
                >
                  <Icon
                    icon="mdi:image-multiple"
                    className="text-indigo-600"
                    width={24}
                  />
                  Thư viện ảnh
                  {isEditing && (
                    <Tooltip title="Thêm ảnh">
                      <IconButton
                        color="primary"
                        component="label"
                        sx={{ ml: 1 }}
                      >
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={(e) => handleGalleryUpload(e.target.files)}
                        />
                        <PlusOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>

                {previewImages.length > 0 ? (
                  <Grid container spacing={2}>
                    {previewImages.map((image) => (
                      <Grid
                        key={image.uid}
                        size={{
                          xs: 6,
                          sm: 4,
                          md: 3,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card
                            sx={{
                              position: "relative",
                              borderRadius: "12px",
                              overflow: "hidden",
                              height: "180px",
                            }}
                            elevation={2}
                            className="hover:shadow-lg transition-shadow duration-300"
                          >
                            <CardMedia
                              component="img"
                              image={image.url}
                              alt={image.name}
                              sx={{
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {isEditing && (
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "rgba(0, 0, 0, 0.5)",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.8)",
                                  },
                                }}
                                size="small"
                                onClick={() => handleRemoveGalleryImage(image)}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            )}
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box className="bg-gray-50 rounded-lg p-6 text-center">
                    <Empty
                      image={
                        <PictureOutlined
                          style={{ fontSize: 64, color: "#d9d9d9" }}
                        />
                      }
                      description={
                        <Typography variant="body2" color="textSecondary">
                          Chưa có ảnh nào trong thư viện
                        </Typography>
                      }
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
