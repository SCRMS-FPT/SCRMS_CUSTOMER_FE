import React, { useState, useEffect } from "react";
import { Box, Paper, Stepper, Step, StepLabel, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import StepSelectSportSkill from "@/components/UserFindMatchView/StepSelectSportSkill";
import StepSwipeMatches from "@/components/UserFindMatchView/StepSwipeMatches";
import StepComplete from "@/components/UserFindMatchView/StepComplete";

/**
 * Component cha quản lý luồng 3 bước.
 * Sử dụng MUI Stepper hiển thị:
 *  1. Chọn môn & skill
 *  2. Tìm trận (swipe)
 *  3. Hoàn tất & xem danh sách
 */

// Styled component cho background toàn trang
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
  padding: theme.spacing(2),
}));

// Styled component cho khung nội dung (chiếm 70% chiều rộng)
// Thêm chiều cao cố định và thiết lập flex để các thành phần bên trong tự điều chỉnh
const ContentWrapper = styled(Paper)(({ theme }) => ({
  width: "70%",
  margin: "auto",
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  [theme.breakpoints.down("md")]: {
    width: "90%",
  },
  transition: "all 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
}));

const steps = ["Chọn Môn Thể Thao & Kỹ Năng", "Tìm Trận (Swipe)", "Hoàn Tất"];

function FindMatchContainer() {
  const [activeStep, setActiveStep] = useState(0);

  // Dữ liệu chọn ở bước 1
  const [selectedSport, setSelectedSport] = useState(null);
  const [skillLevel, setSkillLevel] = useState(5);

  // Danh sách đề xuất (bước 2) - sau khi gọi API
  const [suggestedMatches, setSuggestedMatches] = useState([]);

  // Danh sách trận user đã like
  const [likedMatches, setLikedMatches] = useState([]);

  // Khi chuyển sang bước 2, gọi API lấy danh sách (mock)
  useEffect(() => {
    if (activeStep === 1) {
      // Giả sử gọi API GET /api/matches/suggestions?sport_id=&skill_level=
      // Tạm mock data theo định dạng yêu cầu:
      const mockData = [
        {
          user_id: "uuid-user-001",
          full_name: "Nguyễn Văn A",
          avatar: "https://example.com/avatar1.jpg",
          skill_level: "intermediate",
          sport_id: "uuid-sport-001",
        },
        {
          user_id: "uuid-user-002",
          full_name: "Trần Thị B",
          avatar: "https://example.com/avatar2.jpg",
          skill_level: "advanced",
          sport_id: "uuid-sport-001",
        },
      ];
      setSuggestedMatches(mockData);
    }
  }, [activeStep]);

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Bước 1: Lưu sport + skill
  // Callback từ StepSelectSportSkill
  const handleSelectSportSkill = (sport, skill, suggestionData) => {
    // Lưu thông tin sport, skill (nếu cần)
    setSelectedSport(sport);
    setSkillLevel(skill);
    // Cập nhật danh sách suggestion từ API (nếu có dữ liệu, nếu không thì có thể dùng mock)
    if (suggestionData && suggestionData.length > 0) {
      setSuggestedMatches(suggestionData);
    } else {
      // Nếu API trả về rỗng, bạn có thể fallback dữ liệu mock hoặc xử lý theo logic của bạn
      const mockData = [
        {
          user_id: "uuid-user-001",
          full_name: "Nguyễn Văn A",
          avatar: "https://example.com/avatar1.jpg",
          skill_level: "intermediate",
          sport_id: "uuid-sport-001",
        },
        {
          user_id: "uuid-user-002",
          full_name: "Trần Thị B",
          avatar: "https://example.com/avatar2.jpg",
          skill_level: "advanced",
          sport_id: "uuid-sport-001",
        },
      ];
      setSuggestedMatches(mockData);
    }
    // Chuyển sang bước tiếp theo (StepSwipeMatches)
    setActiveStep(1);
  };

  // Bước 2: Xử lý Like
  const handleLikeMatch = (matchItem) => {
    console.log("LIKE match", matchItem);
    // Loại bỏ matchItem khỏi suggestedMatches
    setSuggestedMatches((prev) => prev.filter((m) => m.id !== matchItem.id));
    // Thêm vào likedMatches
    setLikedMatches((prev) => [...prev, matchItem]);
  };

  // Bước 2: Xử lý Reject
  const handleRejectMatch = (matchItem) => {
    console.log("REJECT match", matchItem);
    setSuggestedMatches((prev) => prev.filter((m) => m.id !== matchItem.id));
  };

  // Render nội dung theo step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepSelectSportSkill
            selectedSport={selectedSport}
            skillLevel={skillLevel}
            onSelectSportSkill={handleSelectSportSkill}
          />
        );
      case 1:
        return (
          <StepSwipeMatches
            suggestedMatches={suggestedMatches}
            onLike={handleLikeMatch}
            onReject={handleRejectMatch}
            onNextStep={handleNextStep}
          />
        );
      case 2:
        return <StepComplete likedMatches={likedMatches} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
    <ContentWrapper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, flexGrow: 1 }}>
        {activeStep === 0 && (
          <StepSelectSportSkill onSelectSportSkill={handleSelectSportSkill} 
                                  selectedSport={selectedSport} 
                                  skillLevel={skillLevel} />
        )}
        {activeStep === 1 && (
          <StepSwipeMatches
            suggestedMatches={suggestedMatches}
            onLike={handleLikeMatch}
            onReject={handleRejectMatch}
            onNextStep={handleNextStep}
          />
        )}
        {activeStep === 2 && <StepComplete likedMatches={likedMatches} />}
      </Box>
      {/* Nút Quay Lại nếu cần */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        {activeStep > 0 && activeStep < 2 && (
          <Button variant="outlined" onClick={handleBackStep}>
            Quay lại
          </Button>
        )}
      </Box>
    </ContentWrapper>
  </PageContainer>
  );
}

export default FindMatchContainer;
// Note: Đoạn code này là một ví dụ đơn giản để mô phỏng luồng tìm trận.