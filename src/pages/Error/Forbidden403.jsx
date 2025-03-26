import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";

const Forbidden403 = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          py: 8,
        }}
      >
        <Result
          status="403"
          title={
            <Typography variant="h2" color="error" gutterBottom>
              403
            </Typography>
          }
          subTitle={
            <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
              Sorry, you are not authorized to access this page.
            </Typography>
          }
          icon={<BlockIcon sx={{ fontSize: 80, color: "error.main" }} />}
          extra={
            <Box sx={{ mt: 4 }}>
              <Button type="primary" size="large">
                <Link
                  to="/"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Back to Home
                </Link>
              </Button>
            </Box>
          }
        />
      </Box>
    </Container>
  );
};

export default Forbidden403;
