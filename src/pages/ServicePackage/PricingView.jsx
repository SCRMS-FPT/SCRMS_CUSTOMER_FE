import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { Client } from "@/API/IdentityApi";

const PricingView = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const client = new Client();
        const response = await client.servicePackages();

        // Parse the response
        if (response) {
          setPackages(response);
        } else {
          setPackages([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load service packages. Please try again later.");
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Generate features based on package type
  const getFeatures = (pkg) => {
    const baseFeatures = [pkg.description];

    if (pkg.associatedRole === "Coach") {
      return [
        ...baseFeatures,
        "Create and manage coaching sessions",
        "Access to premium coaching tools",
        "Connect with potential clients",
        "Built-in scheduling system",
      ];
    } else if (pkg.associatedRole === "Venue") {
      return [
        ...baseFeatures,
        "List and promote your venue",
        "Court management system",
        "Online booking capabilities",
        "Analytics and reporting tools",
      ];
    } else {
      return [
        ...baseFeatures,
        "Access to premium content",
        "Priority booking options",
        "Advanced search features",
        "Ad-free experience",
      ];
    }
  };

  // Determine if a package should be highlighted
  const isPopular = (pkg) => {
    return (
      pkg.name.toLowerCase().includes("premium") ||
      pkg.price > 50 ||
      pkg.associatedRole === "Coach"
    );
  };

  // Handle subscription button click
  const handleSubscribe = (packageId) => {
    console.log(`Subscribing to package: ${packageId}`);
    // Would redirect to login or payment flow
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header section */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 2,
          }}
        >
          Upgrade Your Experience
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: "800px", mx: "auto" }}
        >
          Choose the perfect plan to enhance your sports journey with premium
          features and exclusive benefits
        </Typography>
      </Box>

      {/* Package cards */}
      {packages.length === 0 ? (
        <Alert severity="info">
          No packages available at this time. Please check back later.
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {packages.map((pkg) => {
            const popular = isPopular(pkg);
            return (
              <Grid item key={pkg.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 30px rgba(0,0,0,0.1)",
                    },
                    position: "relative",
                    borderRadius: 3,
                    overflow: "visible",
                    border: popular
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  }}
                >
                  {popular && (
                    <Chip
                      label="RECOMMENDED"
                      color="primary"
                      icon={<StarIcon />}
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 20,
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box mb={1}>
                      <Chip
                        label={pkg.associatedRole}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {pkg.name}
                    </Typography>

                    <Box sx={{ my: 3, textAlign: "center", py: 2 }}>
                      <Typography
                        variant="h3"
                        component="div"
                        fontWeight="bold"
                      >
                        {formatPrice(pkg.price)}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        for {pkg.durationDays} days
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List sx={{ py: 2 }}>
                      {getFeatures(pkg).map((feature, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.75 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: index === 0 ? "medium" : "regular",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={popular ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      onClick={() => handleSubscribe(pkg.id)}
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: 2,
                        boxShadow: popular ? 4 : 0,
                      }}
                    >
                      {popular ? "Get Started" : "Subscribe Now"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* FAQ/Support section */}
      <Box
        sx={{
          textAlign: "center",
          mt: 12,
          p: 5,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Need help choosing the right plan?
        </Typography>
        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}
        >
          Our team is available to help you select the best option for your
          needs. Contact us for personalized assistance.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          color="primary"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Contact Support
        </Button>
      </Box>
    </Container>
  );
};

export default PricingView;
