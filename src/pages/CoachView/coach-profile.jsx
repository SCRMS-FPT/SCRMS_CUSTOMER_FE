"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "../../API/CoachApi";
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
  Chip,
  Divider,
  IconButton,
  Rating,
  Paper,
  Badge,
  Tooltip,
} from "@mui/material";

// Ant Design imports
import { Tabs, Tag, Skeleton, Statistic, Progress } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  DollarOutlined,
  TrophyOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  StarOutlined,
  HeartOutlined,
  MessageOutlined,
  FileTextOutlined,
  TeamOutlined,
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

export default function CoachProfile() {
  const navigate = useNavigate();
  const coachClient = new Client();

  // State for coach data
  const [coachData, setCoachData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [skills, setSkills] = useState([
    { name: "Fitness", level: 95 },
    { name: "Yoga", level: 85 },
    { name: "Nutrition", level: 80 },
    { name: "Cardio", level: 90 },
  ]);

  // Mock stats
  const stats = {
    sessions: 127,
    clients: 48,
    reviews: 38,
    rating: 4.8,
  };

  // Fetch coach data on component mount
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const data = await coachClient.getMyCoachProfile();
        setCoachData({
          ...data,
          yearsExperience: data.yearsExperience || 5,
          certificates: data.certificates || [
            "Certified Personal Trainer",
            "Nutrition Specialist",
          ],
        });
        setEditedData({
          ...data,
          yearsExperience: data.yearsExperience || 5,
          certificates: data.certificates || [
            "Certified Personal Trainer",
            "Nutrition Specialist",
          ],
        });
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setEditedData((prev) => ({ ...prev, avatar: fileUrl }));
      setAvatarFile(file);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("fullName", editedData.fullName || "");
      formData.append("email", editedData.email || "");
      formData.append("phone", editedData.phone || "");
      formData.append("bio", editedData.bio || "");
      formData.append("ratePerHour", editedData.ratePerHour?.toString() || "0");

      // Handle sports if needed
      if (editedData.sportIds && editedData.sportIds.length > 0) {
        editedData.sportIds.forEach((sportId) => {
          formData.append("listSport", sportId);
        });
      }

      // Add avatar file if changed
      if (avatarFile) {
        formData.append("newAvatar", avatarFile);
      }

      // Keep existing image URLs if any
      if (editedData.imageUrls && editedData.imageUrls.length > 0) {
        editedData.imageUrls.forEach((url) => {
          formData.append("existingImageUrls", url);
        });
      }

      await coachClient.updateMyProfile(formData);
      setCoachData(editedData);
      setIsEditing(false);
      toast.success("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
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

                  <Box className="mt-4 sm:mt-0 sm:ml-6 flex-1" style={{ marginTop: "" }}>            
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
                          sx: { borderRadius: "10px", },
                        }}
                        style={{ marginTop: "" }}
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
                      <Tag color="blue" icon={<TrophyOutlined />}>
                        {editedData.yearsExperience || 5} năm kinh nghiệm
                      </Tag>
                      <Tag color="gold" icon={<StarOutlined />}>
                        {stats.rating} sao ({stats.reviews} đánh giá)
                      </Tag>
                      <Tag color="green" icon={<TeamOutlined />}>
                        {stats.clients} học viên
                      </Tag>
                      <Tag color="purple" icon={<CalendarOutlined />}>
                        {stats.sessions} buổi học
                      </Tag>
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
                            className="hover:scale-110 transition-transform"
                            sx={{
                              bgcolor: "indigo.50",
                              boxShadow: "0 2px 10px rgba(99, 102, 241, 0.2)",
                            }}
                          >
                            <SaveOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy">
                          <IconButton
                            color="error"
                            onClick={() => {
                              setEditedData(coachData);
                              setIsEditing(false);
                            }}
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

          {/* Tabs section */}
          <motion.div variants={itemVariants}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              type="card"
              className="bg-white rounded-xl shadow-sm mb-6"
              tabBarStyle={{
                margin: 0,
                padding: "8px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <TabPane
                tab={
                  <span className="flex items-center gap-2">
                    <UserOutlined />
                    Thông tin cá nhân
                  </span>
                }
                key="1"
              >
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

                  <Box className="mb-6">
                    <Typography
                      variant="h6"
                      component="h2"
                      className="text-gray-800 font-bold mb-4 flex items-center gap-2"
                    >
                      <Icon
                        icon="mdi:certificate"
                        className="text-indigo-600"
                        width={24}
                      />
                      Chứng chỉ & Bằng cấp
                    </Typography>

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(
                        coachData.certificates || [
                          "Certified Personal Trainer",
                          "Nutrition Specialist",
                        ]
                      ).map((cert, index) => (
                        <Box
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
                        >
                          <Box className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                            <CheckCircleOutlined className="text-green-600" />
                          </Box>
                          <Typography
                            variant="body2"
                            className="text-gray-700 font-medium"
                          >
                            {cert}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center gap-2">
                    <Icon icon="mdi:graph" width={16} />
                    Kỹ năng
                  </span>
                }
                key="2"
              >
                <Paper
                  className="p-6 mt-6 rounded-xl"
                  sx={{
                    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-gray-800 font-bold mb-6 flex items-center gap-2"
                  >
                    <Icon
                      icon="mdi:lightbulb"
                      className="text-indigo-600"
                      width={24}
                    />
                    Kỹ năng & Chuyên môn
                  </Typography>

                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {skills.map((skill, index) => (
                      <Box key={index} className="mb-2">
                        <Box className="flex justify-between mb-1">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-700"
                          >
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {skill.level}%
                          </Typography>
                        </Box>
                        <Progress
                          percent={skill.level}
                          showInfo={false}
                          strokeColor={{
                            "0%": "#818cf8",
                            "100%": "#4f46e5",
                          }}
                          trailColor="#e2e8f0"
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center gap-2">
                    <Icon icon="mdi:chart-bar" width={16} />
                    Số liệu thống kê
                  </span>
                }
                key="3"
              >
                <Paper
                  className="p-6 mt-6 rounded-xl"
                  sx={{
                    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-gray-800 font-bold mb-6 flex items-center gap-2"
                  >
                    <Icon
                      icon="mdi:chart-donut"
                      className="text-indigo-600"
                      width={24}
                    />
                    Số liệu hoạt động
                  </Typography>

                  <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <Box className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow">
                      <Box className="mb-2">
                        <Icon icon="mdi:calendar-check" width={28} />
                      </Box>
                      <Statistic
                        title={
                          <span className="text-blue-100">
                            Buổi tập đã hoàn thành
                          </span>
                        }
                        value={stats.sessions}
                        valueStyle={{ color: "white", fontSize: "28px" }}
                      />
                    </Box>

                    <Box className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white hover:shadow-lg transition-shadow">
                      <Box className="mb-2">
                        <Icon icon="mdi:account-group" width={28} />
                      </Box>
                      <Statistic
                        title={
                          <span className="text-purple-100">Học viên</span>
                        }
                        value={stats.clients}
                        valueStyle={{ color: "white", fontSize: "28px" }}
                      />
                    </Box>

                    <Box className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white hover:shadow-lg transition-shadow">
                      <Box className="mb-2">
                        <Icon icon="mdi:star" width={28} />
                      </Box>
                      <Statistic
                        title={<span className="text-amber-100">Đánh giá</span>}
                        value={stats.reviews}
                        valueStyle={{ color: "white", fontSize: "28px" }}
                      />
                    </Box>

                    <Box className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white hover:shadow-lg transition-shadow">
                      <Box className="mb-2">
                        <Icon icon="mdi:thumb-up" width={28} />
                      </Box>
                      <Box className="mt-1">
                        <Typography
                          variant="body2"
                          className="text-emerald-100"
                        >
                          Đánh giá trung bình
                        </Typography>
                        <Box className="flex items-center mt-1">
                          <Typography
                            variant="h4"
                            component="span"
                            className="font-bold mr-2"
                          >
                            {stats.rating}
                          </Typography>
                          <Rating
                            value={stats.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </TabPane>
            </Tabs>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
