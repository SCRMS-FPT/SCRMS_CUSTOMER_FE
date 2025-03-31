import React, { useState } from "react";
import { Box } from "@mui/material";
import SportCardsSelection from "@/components/UserFindMatchView/SportCardsSelection";
import SkillPresetSelection from "@/components/UserFindMatchView/SkillPresetSelection";
import CustomSportSkillForm from "@/components/UserFindMatchView/CustomSportSkillForm";

// Import Matching API client từ MatchingApi.ts
import { Client as MatchingClient } from "@/API/MatchingApi";

// Khởi tạo client (có thể cấu hình baseUrl nếu cần)
const matchingClient = new MatchingClient();

/**
 * Component StepSelectSportSkill được chia thành 3 màn hình nội bộ:
 * - Màn hình 0: SportCardsSelection
 * - Màn hình 1: SkillPresetSelection
 * - Màn hình 2: CustomSportSkillForm
 *
 * Sau khi hoàn tất màn hình CustomSportSkillForm, gọi API getSuggestionsAdvanced với giá trị
 * môn thể thao và mức kỹ năng. Dù API trả về lỗi hay không, flow vẫn chuyển sang bước tiếp theo
 * (tức là trang StepSwipeMatches) thông qua callback onSelectSportSkill.
 */
function StepSelectSportSkill({ selectedSport, skillLevel, onSelectSportSkill }) {
  const [internalStep, setInternalStep] = useState(0);
  // Lưu tạm thông tin chọn môn và mức kỹ năng
  const [tempSport, setTempSport] = useState(selectedSport || "");
  const [tempSkill, setTempSkill] = useState(skillLevel || 5);

  // Khi chọn môn từ SportCardsSelection, lưu giá trị và chuyển sang màn hình preset (bước 1)
  const handleSportSelect = (sportId) => {
    setTempSport(sportId);
    setInternalStep(1);
  };

  // Nếu người dùng bấm "Tôi sẽ tự tìm môn thể thao" ở màn hình SportCardsSelection, chuyển thẳng sang màn hình tùy chỉnh (bước 2)
  const handleChooseCustomFromSport = () => {
    setInternalStep(2);
  };

  // Khi chọn preset từ SkillPresetSelection, lưu giá trị và chuyển sang màn hình tùy chỉnh (bước 2)
  const handlePresetSelect = (presetSkill) => {
    setTempSkill(presetSkill);
    setInternalStep(2);
  };

  // Nếu người dùng bấm "Tự tùy chỉnh" ở màn hình SkillPresetSelection, chuyển sang màn hình tùy chỉnh (bước 2)
  const handleChooseCustomFromPreset = () => {
    setInternalStep(2);
  };

  // Khi người dùng hoàn tất form tùy chỉnh, gọi API getSuggestionsAdvanced và chuyển bước
  const handleCustomFormSubmit = (sport, skill) => {
    matchingClient
      .getSuggestionsAdvanced(sport, String(skill), 1, 10)
      .then((responseData) => {
        // Giả sử responseData chứa mảng dữ liệu suggestion
        onSelectSportSkill(sport, skill, responseData);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        // Nếu lỗi, truyền mảng rỗng
        onSelectSportSkill(sport, skill, []);
      });
  };

  const renderInternalStep = () => {
    switch (internalStep) {
      case 0:
        return (
          <SportCardsSelection
            onSelectSport={handleSportSelect}
            onChooseCustom={handleChooseCustomFromSport}
          />
        );
      case 1:
        return (
          <SkillPresetSelection
            onSelectPreset={handlePresetSelect}
            onChooseCustom={handleChooseCustomFromPreset}
          />
        );
      case 2:
        return (
          <CustomSportSkillForm
            selectedSport={tempSport}
            initialSkill={tempSkill}
            onSubmit={handleCustomFormSubmit}
          />
        );
      default:
        return null;
    }
  };

  return <Box>{renderInternalStep()}</Box>;
}

export default StepSelectSportSkill;
