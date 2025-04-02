import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  CameraOutlined,
  DeleteOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  backgroundImage: "linear-gradient(to bottom, #ffffff, #f9fafc)",
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: "4px solid white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
}));

const AvatarInput = styled("input")({
  display: "none",
});

const AvatarEditButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  padding: 8,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const AvatarBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const ImageInput = styled("input")({
  display: "none",
});

const ImagePreviewItem = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const DeleteImageButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 4,
  right: 4,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  padding: 4,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

function ProfileUpdateStep({ userProfile, onComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    gender: userProfile?.gender || "",
    phone: userProfile?.phone || "",
    selfIntroduction: userProfile?.selfIntroduction || "",
    avatarFile: null,
    imageFiles: [],
    existingImageUrls: userProfile?.imageUrls || [],
    imagesToDelete: [],
  });
  const [avatarPreview, setAvatarPreview] = useState(
    userProfile?.avatarUrl || null
  );
  const [imageFilePreviews, setImageFilePreviews] = useState([]);

  const avatarInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for preview in UI
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl);

      // Store the file object directly
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
      }));
    }
  };

  const handleClearAvatar = () => {
    setAvatarPreview(null);
    setFormData((prev) => ({
      ...prev,
      avatarFile: null,
    }));

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleImagesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = [];

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === newFiles.length) {
            setImageFilePreviews([...imageFilePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...newFiles],
      }));
    }
  };

  const handleRemoveNewImage = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.imageFiles];
      updatedFiles.splice(index, 1);

      const updatedPreviews = [...imageFilePreviews];
      updatedPreviews.splice(index, 1);
      setImageFilePreviews(updatedPreviews);

      return {
        ...prev,
        imageFiles: updatedFiles,
      };
    });
  };

  const handleRemoveExistingImage = (url) => {
    setFormData((prev) => {
      const updatedUrls = prev.existingImageUrls.filter((i) => i !== url);
      const updatedToDelete = [...prev.imagesToDelete, url];

      return {
        ...prev,
        existingImageUrls: updatedUrls,
        imagesToDelete: updatedToDelete,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onComplete({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        phone: formData.phone,
        birthDate: userProfile?.birthDate,
        selfIntroduction: formData.selfIntroduction,
        avatarFile: formData.avatarFile,
        imageFiles: formData.imageFiles,
        existingImageUrls: formData.existingImageUrls,
        imagesToDelete: formData.imagesToDelete,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hoàn thiện hồ sơ của bạn
      </Typography>

      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Để tìm đối thủ phù hợp, chúng tôi cần thêm một số thông tin về bạn
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProfilePaper>
          <form onSubmit={handleSubmit}>
            <AvatarContainer>
              <Box sx={{ position: "relative" }}>
                <AvatarBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={formData.avatarFile ? "dot" : "standard"}
                >
                  <ProfileAvatar src={avatarPreview}>
                    <UserOutlined style={{ fontSize: 60 }} />
                  </ProfileAvatar>
                </AvatarBadge>

                <AvatarInput
                  ref={avatarInputRef}
                  accept="image/*"
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />

                <Box
                  sx={{
                    display: "flex",
                    mt: 1,
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    component="label"
                    htmlFor="avatar-upload"
                    variant="outlined"
                    size="small"
                    startIcon={<CameraOutlined />}
                  >
                    Thay ảnh
                  </Button>

                  {avatarPreview && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteOutlined />}
                      onClick={handleClearAvatar}
                    >
                      Xóa
                    </Button>
                  )}
                </Box>
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mt: 2 }}
              >
                {userProfile?.email}
              </Typography>
            </AvatarContainer>

            <FormSection>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <EditOutlined /> Thông tin cá nhân
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <StyledTextField
                  fullWidth
                  label="Họ"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Tên"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="gender-label">Giới tính</InputLabel>
                  <Select
                    labelId="gender-label"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Giới tính"
                    required
                  >
                    <MenuItem value="Male">Nam</MenuItem>
                    <MenuItem value="Female">Nữ</MenuItem>
                    <MenuItem value="Other">Khác</MenuItem>
                  </Select>
                </FormControl>

                <StyledTextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Box>
            </FormSection>

            <FormSection>
              <Typography variant="h6" gutterBottom>
                Giới thiệu bản thân
              </Typography>
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                label="Giới thiệu ngắn về bản thân, sở thích và kinh nghiệm chơi thể thao"
                name="selfIntroduction"
                value={formData.selfIntroduction}
                onChange={handleChange}
                variant="outlined"
                required
                helperText="Giới thiệu này sẽ hiển thị cho người chơi khác xem"
              />
            </FormSection>

            <FormSection>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PictureOutlined /> Hình ảnh hồ sơ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Thêm hình ảnh để giới thiệu bản thân tốt hơn với người chơi khác
              </Typography>

              <Box sx={{ mb: 2 }}>
                <ImageInput
                  ref={imagesInputRef}
                  accept="image/*"
                  id="images-upload"
                  type="file"
                  multiple
                  onChange={handleImagesChange}
                />

                <Button
                  component="label"
                  htmlFor="images-upload"
                  variant="outlined"
                  startIcon={<PlusOutlined />}
                >
                  Thêm hình ảnh
                </Button>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Hình ảnh đã chọn:
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {imageFilePreviews.map((preview, index) => (
                  <ImagePreviewItem key={`new-${index}`}>
                    <img
                      src={preview}
                      alt={`Upload preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <DeleteImageButton
                      size="small"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      <DeleteOutlined style={{ fontSize: 16 }} />
                    </DeleteImageButton>
                  </ImagePreviewItem>
                ))}

                {formData.existingImageUrls?.map((url, index) => (
                  <ImagePreviewItem key={`existing-${index}`}>
                    <img
                      src={url}
                      alt={`Profile image ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <DeleteImageButton
                      size="small"
                      onClick={() => handleRemoveExistingImage(url)}
                    >
                      <DeleteOutlined style={{ fontSize: 16 }} />
                    </DeleteImageButton>
                  </ImagePreviewItem>
                ))}

                {formData.imageFiles.length === 0 &&
                  (!formData.existingImageUrls ||
                    formData.existingImageUrls.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có hình ảnh nào được chọn
                    </Typography>
                  )}
              </Box>
            </FormSection>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveOutlined />
                  )
                }
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 10px 4px rgba(33, 150, 243, .3)",
                  },
                }}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật & Tiếp tục"}
              </Button>
            </Box>
          </form>
        </ProfilePaper>
      </motion.div>
    </Box>
  );
}

export default ProfileUpdateStep;
