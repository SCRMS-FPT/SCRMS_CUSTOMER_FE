import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import soccerImg from "@/assets/soccer_03.jpg";

// Dữ liệu mẫu môn thể thao
const sportsDataMock = [
  { id: "sport-001", name: "Bóng đá", icon: "⚽" },
  { id: "sport-002", name: "Cầu lông", icon: "🏸" },
  { id: "sport-003", name: "Bóng rổ", icon: "🏀" },
];

function CustomSportSkillForm({ selectedSport, initialSkill, onSubmit }) {
  const [tempSport, setTempSport] = useState(selectedSport || "");
  const [tempSkill, setTempSkill] = useState(initialSkill || 5);
  const [customSkill, setCustomSkill] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // Đồng bộ giá trị nhập tay customSkill với slider
  useEffect(() => {
    if (customSkill !== "") {
      const value = Number(customSkill);
      if (!isNaN(value) && value >= 1 && value <= 10) {
        setTempSkill(value);
      }
    }
  }, [customSkill]);

  const handleChangeSport = (e) => {
    setTempSport(e.target.value);
  };

  const handleSliderChange = (e, newValue) => {
    setTempSkill(newValue);
    setCustomSkill(newValue.toString());
  };

  const handleCustomSkillChange = (e) => {
    setCustomSkill(e.target.value);
  };

  const handleNext = () => {
    if (!tempSport) {
      alert("Vui lòng chọn môn thể thao!");
      return;
    }
    // Mở modal xác nhận
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = () => {
    setOpenModal(false);
    // Sau khi xác nhận, gọi callback onSubmit
    onSubmit(tempSport, tempSkill);
  };

  return (
    <>
      <Grid container spacing={4} alignItems="center">
        {/* Cột minh họa */}
        <Grid
          size={{
            xs: 12,
            md: 5
          }}>
          <Box
            component="img"
            src={soccerImg}
            alt="Sports Illustration"
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 2,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Grid>

        {/* Cột form chọn môn & kỹ năng */}
        <Grid
          size={{
            xs: 12,
            md: 7
          }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Chọn Môn Thể Thao & Mức Kỹ Năng
          </Typography>

          {/* Form chọn môn thể thao */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="sport-select-label">Môn thể thao</InputLabel>
            <Select
              labelId="sport-select-label"
              value={tempSport}
              label="Môn thể thao"
              onChange={handleChangeSport}
            >
              {sportsDataMock.map((sport) => (
                <MenuItem key={sport.id} value={sport.id}>
                  {sport.icon} {sport.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Form cài đặt kỹ năng */}
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom variant="subtitle1">
              Mức kỹ năng: {tempSkill}
            </Typography>
            <Slider
              value={tempSkill}
              onChange={handleSliderChange}
              step={1}
              marks
              min={1}
              max={10}
              valueLabelDisplay="auto"
              sx={{ mx: "auto", maxWidth: 300 }}
            />
            <TextField
              label="Nhập tay mức kỹ năng (1-10)"
              value={customSkill}
              onChange={handleCustomSkillChange}
              variant="outlined"
              size="small"
              sx={{ mt: 2, width: "50%" }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            size="large"
            sx={{
              mt: 2,
              textTransform: "none",
              boxShadow: 2,
              transition: "background-color 0.3s ease",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Tiếp tục
          </Button>
        </Grid>
      </Grid>
      {/* Modal xác nhận */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Xác nhận tìm trận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn tìm trận với môn thể thao đã chọn và mức kỹ năng {tempSkill} không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CustomSportSkillForm;
