import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCheckStep from "@/components/UserFindMatchView/ProfileCheckStep";
import ProfileUpdateStep from "@/components/UserFindMatchView/ProfileUpdateStep";
import SkillSetupStep from "@/components/UserFindMatchView/SkillSetupStep";
import FindOpponentsTab from "@/components/UserFindMatchView/FindOpponentsTab";
import PendingMatchesTab from "@/components/UserFindMatchView/PendingMatchesTab";
import MatchedPlayersTab from "@/components/UserFindMatchView/MatchedPlayersTab";
import {
  Client as IdentityClient,
  UpdateProfileRequest,
} from "@/API/IdentityApi";
import { Client as CourtClient } from "@/API/CourtApi";
import { Client as MatchingClient } from "@/API/MatchingApi";
import { UserOutlined, TeamOutlined, CheckOutlined } from "@ant-design/icons";

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 64px)",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  padding: theme.spacing(3),
}));

const ContentWrapper = styled(motion.div)(({ theme }) => ({
  maxWidth: 1000,
  margin: "0 auto",
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  background: "#fff",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "#fff",
  "& .MuiTab-root": {
    color: "rgba(255,255,255,0.7)",
    fontWeight: 500,
    fontSize: "0.95rem",
    textTransform: "none",
    minHeight: 64,
    transition: "all 0.3s",
    "&:hover": {
      color: "#fff",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#fff",
    },
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#fff",
    height: 3,
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: 500,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 400,
  padding: theme.spacing(4),
  textAlign: "center",
}));

function FindMatchContainer() {
  // State for flow control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [sports, setSports] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [flowState, setFlowState] = useState("initial"); // initial, profile-update, skill-setup, matching

  // State for tabs
  const [activeTab, setActiveTab] = useState(0);

  // API clients
  const identityClient = new IdentityClient();
  const courtClient = new CourtClient();
  const matchingClient = new MatchingClient();

  // Load user profile and sports on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // 1. Fetch user profile
        const profile = await identityClient.getProfile();
        console.log("Profile data:", profile); // Debug log

        // Add null check to avoid the error
        if (!profile) {
          throw new Error("Profile data is empty");
        }

        setUserProfile(profile);

        // 2. Fetch sports list
        const sportsData = await courtClient.getSports();
        setSports(sportsData?.sports || []);

        // 3. Fetch user skills if available
        let skills = [];
        try {
          skills = await matchingClient.getUserSkills();
          setUserSkills(skills || []);
        } catch (skillsError) {
          console.log("No skills found or error fetching skills:", skillsError);
          setUserSkills([]);
        }

        // 4. Determine the flow state - FIX HERE
        // Safely access selfIntroduction with optional chaining
        if (
          !profile ||
          profile.selfIntroduction === null ||
          profile.selfIntroduction === undefined
        ) {
          setFlowState("profile-update");
        } else if (!skills || skills.length === 0) {
          setFlowState("skill-setup");
        } else {
          setFlowState("matching");
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(
          "Failed to load your profile information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Update the handleProfileUpdate function to support multiple images

  const handleProfileUpdate = async (profileData) => {
    try {
      setLoading(true);

      // Create a complete UpdateProfileRequest object with all required fields
      const updateRequest = new UpdateProfileRequest({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        phone: profileData.phone,
        birthDate: userProfile?.birthDate, // Keep the existing date
        selfIntroduction: profileData.selfIntroduction,

        // Support for avatar and images
        newAvatarFile: profileData.avatarFile || undefined,
        newImageFiles: profileData.imageFiles || undefined,
        existingImageUrls: profileData.existingImageUrls || undefined,
        imagesToDelete: profileData.imagesToDelete || undefined,
      });

      // Call API to update profile
      await identityClient.updateProfile(updateRequest);

      // Reload user profile
      const updatedProfile = await identityClient.getProfile();
      setUserProfile(updatedProfile);

      // Move to skill setup step
      setFlowState("skill-setup");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle skills setup
  const handleSkillsSetup = async (skillsData) => {
    try {
      setLoading(true);

      // Create skills for each sport selected
      for (const skill of skillsData) {
        await matchingClient.createUserSkill({
          sportId: skill.sportId,
          skillLevel: skill.skillLevel,
        });
      }

      // Reload user skills
      const updatedSkills = await matchingClient.getUserSkills();
      setUserSkills(updatedSkills || []);

      setFlowState("matching");
    } catch (err) {
      console.error("Error setting up skills:", err);
      setError("Failed to setup your skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Render the appropriate component based on flow state
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile data...
          </Typography>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      );
    }

    switch (flowState) {
      case "initial":
        return (
          <ProfileCheckStep
            userProfile={userProfile}
            onProfileComplete={() => {
              // If profile is complete, check if skills are set up
              if (userSkills && userSkills.length > 0) {
                setFlowState("matching");
              } else {
                setFlowState("skill-setup");
              }
            }}
            onProfileIncomplete={() => {
              setFlowState("profile-update");
            }}
          />
        );

      case "profile-update":
        return (
          <ProfileUpdateStep
            userProfile={userProfile}
            onComplete={handleProfileUpdate}
          />
        );

      case "skill-setup":
        return (
          <SkillSetupStep sports={sports} onComplete={handleSkillsSetup} />
        );

      case "matching":
        return (
          <Box sx={{ width: "100%" }}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="Match finding tabs"
            >
              <Tab
                icon={<UserOutlined />}
                label="Tìm người chơi"
                iconPosition="start"
              />
              <Tab
                icon={<TeamOutlined />}
                label="Chờ ghép trận"
                iconPosition="start"
              />
              <Tab
                icon={<CheckOutlined />}
                label="Đã ghép"
                iconPosition="start"
              />
            </StyledTabs>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 0 && (
                  <TabPanel>
                    <FindOpponentsTab
                      userSkills={userSkills}
                      sports={sports}
                      matchingClient={matchingClient}
                    />
                  </TabPanel>
                )}

                {activeTab === 1 && (
                  <TabPanel>
                    <PendingMatchesTab matchingClient={matchingClient} />
                  </TabPanel>
                )}

                {activeTab === 2 && (
                  <TabPanel>
                    <MatchedPlayersTab matchingClient={matchingClient} />
                  </TabPanel>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        );

      default:
        return (
          <LoadingContainer>
            <Typography variant="h6" color="text.secondary">
              Something went wrong. Please refresh the page.
            </Typography>
          </LoadingContainer>
        );
    }
  };

  return (
    <PageContainer>
      <ContentWrapper
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </ContentWrapper>
    </PageContainer>
  );
}

export default FindMatchContainer;
