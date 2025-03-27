import React, { useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/store/userSlice";
import signoutImage from "@/assets/signout.png";

const SignoutView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    const timer = setTimeout(() => {
    //   navigate("/login");
    }, 1000);
    navigate("/login");
    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Box sx={{ mb: 4 }}>
        <img
          src={signoutImage}
          alt="Sign Out"
          style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
        />
      </Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Sign out successfully, redirecting you to our Login page...
      </Typography>
      <Button variant="outlined" onClick={handleReturnHome}>
        Return to Homepage
      </Button>
    </Container>
  );
};

export default SignoutView;
