import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  RightOutlined,
} from "@ant-design/icons";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  backgroundImage: "linear-gradient(to bottom, #ffffff, #f9fafc)",
  maxWidth: 800,
  margin: "0 auto",
}));

const ProfileItem = styled(ListItem)(({ theme, isComplete }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  border: `1px solid ${
    isComplete ? theme.palette.success.light : theme.palette.error.light
  }`,
  backgroundColor: isComplete
    ? "rgba(76, 175, 80, 0.08)"
    : "rgba(244, 67, 54, 0.08)",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: isComplete
      ? "rgba(76, 175, 80, 0.12)"
      : "rgba(244, 67, 54, 0.12)",
    transform: "translateY(-2px)",
  },
}));

function ProfileCheckStep({
  userProfile,
  onProfileComplete,
  onProfileIncomplete,
}) {
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState({
    hasBasicInfo: false,
    hasSelfIntroduction: false,
    isComplete: false,
  });

  // Check profile completeness
  useEffect(() => {
    if (userProfile) {
      const hasBasicInfo = !!(
        userProfile.firstName &&
        userProfile.lastName &&
        userProfile.gender
      );

      const hasSelfIntroduction = !!userProfile.selfIntroduction;

      setProfileStatus({
        hasBasicInfo,
        hasSelfIntroduction,
        isComplete: hasBasicInfo && hasSelfIntroduction,
      });

      setLoading(false);

      // Notify parent component about profile status
      if (hasBasicInfo && hasSelfIntroduction) {
        onProfileComplete && onProfileComplete();
      } else {
        onProfileIncomplete && onProfileIncomplete();
      }
    }
  }, [userProfile, onProfileComplete, onProfileIncomplete]);

  const handleUpdateProfile = () => {
    onProfileIncomplete();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        Kiểm tra thông tin cá nhân
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
        Trước khi tìm đối thủ, chúng tôi cần xác nhận thông tin cá nhân của bạn
        đã đầy đủ
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <StyledPaper>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={userProfile?.avatarUrl}
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              <UserOutlined style={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {userProfile?.firstName}{" "}
                {userProfile?.lastName || "(Chưa cập nhật)"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userProfile?.email}
              </Typography>
            </Box>
          </Box>

          <Alert
            severity={profileStatus.isComplete ? "success" : "warning"}
            sx={{ mb: 3 }}
          >
            {profileStatus.isComplete
              ? "Thông tin cá nhân của bạn đã đầy đủ, bạn có thể tiếp tục tìm đối thủ."
              : "Thông tin cá nhân của bạn chưa đầy đủ. Vui lòng cập nhật trước khi tiếp tục."}
          </Alert>

          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Trạng thái hồ sơ:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ProfileItem isComplete={profileStatus.hasBasicInfo}>
              <ListItemIcon>
                {profileStatus.hasBasicInfo ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Thông tin cơ bản"
                secondary={
                  profileStatus.hasBasicInfo
                    ? "Đã cập nhật họ tên và giới tính"
                    : "Thông tin cơ bản còn thiếu"
                }
              />
            </ProfileItem>

            <ProfileItem isComplete={profileStatus.hasSelfIntroduction}>
              <ListItemIcon>
                {profileStatus.hasSelfIntroduction ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Giới thiệu bản thân"
                secondary={
                  profileStatus.hasSelfIntroduction
                    ? "Đã có thông tin giới thiệu"
                    : "Chưa có thông tin giới thiệu"
                }
              />
            </ProfileItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {profileStatus.isComplete ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<RightOutlined />}
                onClick={onProfileComplete}
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
                Tiếp tục tìm đối thủ
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<EditOutlined />}
                onClick={handleUpdateProfile}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Cập nhật thông tin
              </Button>
            )}
          </Box>
        </StyledPaper>
      </motion.div>
    </Box>
  );
}
ProfileCheckStep.propTypes = {
  userProfile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    selfIntroduction: PropTypes.string,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
  }),
  onProfileComplete: PropTypes.func,
  onProfileIncomplete: PropTypes.func,
};
export default ProfileCheckStep;
