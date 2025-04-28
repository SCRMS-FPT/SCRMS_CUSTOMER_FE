import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Fade,
  Backdrop,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

// Styling with Tailwind and inline styles for MUI components
const LoginModal = ({ isOpen, onClose, redirectPath }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login", {
      state: {
        from: redirectPath,
        message: "Vui lòng đăng nhập để sử dụng tính năng này",
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      className="rounded-lg"
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "12px",
          maxWidth: "450px",
          width: "100%",
        },
      }}
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 500,
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <DialogTitle className="text-center pb-0">
        <Typography
          variant="h5"
          component="div"
          className="font-bold text-blue-600"
          sx={{ fontWeight: 600 }}
        >
          Xác thực tài khoản
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box className="flex flex-col items-center justify-center py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Icon
              icon="carbon:security"
              className="text-blue-500"
              width="100"
              height="100"
            />
          </motion.div>

          <Typography
            variant="body1"
            className="text-center mb-6 text-gray-700"
          >
            Bạn cần đăng nhập để sử dụng tính năng này.
            <br />
            Vui lòng đăng nhập để tiếp tục.
          </Typography>

          <Box className="flex gap-4 mt-2 w-full justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                color="primary"
                className="px-6 py-2 rounded-full shadow-sm transition-all duration-300"
                sx={{
                  borderRadius: "50px",
                  padding: "8px 24px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    borderColor: "#1976d2",
                  },
                }}
              >
                Huỷ bỏ
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogin}
                variant="contained"
                color="primary"
                className="px-6 py-2 rounded-full shadow-sm transition-all duration-300"
                endIcon={<Icon icon="material-symbols:login" />}
                sx={{
                  borderRadius: "50px",
                  padding: "8px 24px",
                  textTransform: "none",
                  fontSize: "1rem",
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 4px 6px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 10px rgba(33, 150, 243, 0.4)",
                  },
                }}
              >
                Đăng nhập
              </Button>
            </motion.div>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
