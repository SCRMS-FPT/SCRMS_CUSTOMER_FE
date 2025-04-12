import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DatePicker,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Spin,
  Alert,
} from "antd";
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  TextField,
  FormControl,
  FormHelperText,
  Chip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import moment from "moment";

// Icons
import { Iconify } from "@/components/iconify";

const CoachPromotionForm = ({ promotion, onSave, onCancel, coachPackages }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [promotionType, setPromotionType] = useState("package");

  // Setup form initial values
  useEffect(() => {
    if (promotion) {
      // Populate form with existing promotion data
      form.setFieldsValue({
        packageId: promotion.packageId,
        description: promotion.description,
        discountType: promotion.discountType || "percentage",
        discountValue: promotion.discountValue,
        validDateRange: [
          promotion.validFrom ? moment(promotion.validFrom) : null,
          promotion.validTo ? moment(promotion.validTo) : null,
        ],
      });

      // Set selected package
      if (promotion.packageId) {
        const pkg = coachPackages.find((p) => p.id === promotion.packageId);
        setSelectedPackage(pkg);
        setPromotionType("package");
      } else {
        setPromotionType("schedule");
      }
    } else {
      // Initialize with default values for new promotion
      form.resetFields();
      form.setFieldsValue({
        discountType: "percentage",
      });
    }
  }, [promotion, form, coachPackages]);

  // Handle package selection change
  const handlePackageChange = (packageId) => {
    const selectedPkg = coachPackages.find((p) => p.id === packageId);
    setSelectedPackage(selectedPkg);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (!selectedPackage) return null;

    const values = form.getFieldsValue();
    const { discountType, discountValue } = values;

    if (!discountValue || isNaN(discountValue)) return selectedPackage.price;

    if (discountType === "percentage") {
      const discount = (selectedPackage.price * discountValue) / 100;
      return Math.max(0, selectedPackage.price - discount);
    } else {
      return Math.max(0, selectedPackage.price - discountValue);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);

      const [validFrom, validTo] = values.validDateRange || [];

      const promotionData = {
        packageId: values.packageId,
        description: values.description,
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        validFrom: validFrom ? validFrom.format("YYYY-MM-DD") : null,
        validTo: validTo ? validTo.format("YYYY-MM-DD") : null,
      };

      await onSave(promotionData);
    } catch (err) {
      console.error("Error saving promotion:", err);
      setError("Có lỗi xảy ra khi lưu khuyến mãi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!selectedPackage) return null;

    const values = form.getFieldsValue();
    const { discountType, discountValue } = values;

    if (!discountValue || isNaN(discountValue)) return 0;

    if (discountType === "percentage") {
      return (selectedPackage.price * discountValue) / 100;
    } else {
      return Math.min(discountValue, selectedPackage.price);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Iconify icon="solar:close-circle-linear" />}
          onClick={onCancel}
        >
          Đóng
        </Button>
      </Box>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mx: 3, mt: 2 }}
        >
          {error}
        </Alert>
      )}
      <Box sx={{ p: 3 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          validateTrigger={["onChange", "onBlur"]}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: "1 1 400px" }}>
              {/* Package Selection */}
              <Form.Item
                name="packageId"
                label="Gói huấn luyện"
                rules={[
                  { required: true, message: "Vui lòng chọn gói huấn luyện" },
                ]}
              >
                <Select
                  placeholder="Chọn gói huấn luyện"
                  onChange={handlePackageChange}
                  disabled={loading}
                  size="large"
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      ?.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {coachPackages?.map((pkg) => (
                    <Select.Option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {formatCurrency(pkg.price)} (
                      {pkg.sessionCount} buổi)
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Discount Type */}
              <Form.Item
                name="discountType"
                label="Loại giảm giá"
                rules={[
                  { required: true, message: "Vui lòng chọn loại giảm giá" },
                ]}
              >
                <Radio.Group size="large" disabled={loading}>
                  <Radio.Button
                    value="percentage"
                    style={{ width: 150, textAlign: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="solar:percent-round-bold-duotone" />
                      Phần trăm (%)
                    </Box>
                  </Radio.Button>
                  <Radio.Button
                    value="fixed"
                    style={{ width: 150, textAlign: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="solar:dollar-minimalistic-bold-duotone" />
                      Số tiền cố định
                    </Box>
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              {/* Discount Value */}
              <Form.Item
                name="discountValue"
                label="Giá trị giảm giá"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị giảm giá" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá trị phải lớn hơn hoặc bằng 0",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        getFieldValue("discountType") === "percentage" &&
                        value > 100
                      ) {
                        return Promise.reject(
                          "Phần trăm giảm giá không thể lớn hơn 100%"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  min={0}
                  max={
                    form.getFieldValue("discountType") === "percentage"
                      ? 100
                      : undefined
                  }
                  formatter={(value) =>
                    form.getFieldValue("discountType") === "percentage"
                      ? `${value}%`
                      : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/[%,]/g, "")}
                  disabled={loading}
                  addonAfter={
                    form.getFieldValue("discountType") === "percentage"
                      ? "%"
                      : "VND"
                  }
                />
              </Form.Item>

              {/* Validity Period */}
              <Form.Item
                name="validDateRange"
                label="Thời gian hiệu lực"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian hiệu lực",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="DD/MM/YYYY"
                  disabled={loading}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                name="description"
                label="Mô tả khuyến mãi"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả khuyến mãi" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi"
                  disabled={loading}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Box>

            {/* Preview and Information Section */}
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "#f8fafc",
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Xem trước khuyến mãi
                </Typography>

                {selectedPackage ? (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {selectedPackage.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        size="small"
                        label={`${selectedPackage.sessionCount} buổi tập`}
                        sx={{
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        {formatCurrency(selectedPackage.price)}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="span"
                        color="error.main"
                        fontWeight={700}
                      >
                        {formatCurrency(calculateDiscountedPrice())}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                        border: "1px dashed rgba(25, 118, 210, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Iconify
                        icon="solar:tag-price-bold-duotone"
                        width={18}
                        sx={{ color: "primary.main" }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        Tiết kiệm {formatCurrency(calculateSavings())}
                        {form.getFieldValue("discountType") ===
                          "percentage" && (
                          <span>
                            {" "}
                            ({form.getFieldValue("discountValue") || 0}%)
                          </span>
                        )}
                      </Typography>
                    </Box>

                    {form.getFieldValue("validDateRange") &&
                      form.getFieldValue("validDateRange")[0] && (
                        <Box
                          sx={{
                            mt: 2,
                            fontSize: "0.75rem",
                            color: "text.secondary",
                          }}
                        >
                          <Typography variant="caption" display="block">
                            Hiệu lực từ:{" "}
                            {form
                              .getFieldValue("validDateRange")[0]
                              .format("DD/MM/YYYY")}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Hiệu lực đến:{" "}
                            {form
                              .getFieldValue("validDateRange")[1]
                              ?.format("DD/MM/YYYY")}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "text.secondary",
                      gap: 1,
                    }}
                  >
                    <Iconify
                      icon="solar:document-bold-duotone"
                      width={32}
                      sx={{ opacity: 0.6 }}
                    />
                    <Typography variant="body2">
                      Vui lòng chọn gói huấn luyện để xem trước
                    </Typography>
                  </Box>
                )}
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "rgba(255, 244, 229, 0.4)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Iconify
                    icon="solar:info-circle-bold-duotone"
                    color="#ed6c02"
                    width={22}
                  />
                  <Typography variant="subtitle2" color="warning.dark">
                    Lưu ý
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  • Khuyến mãi có hiệu lực dựa trên thời gian bạn đã chọn.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Khuyến mãi sẽ được áp dụng tự động cho khách hàng khi họ đặt
                  gói huấn luyện.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Bạn có thể chỉnh sửa hoặc hủy khuyến mãi bất kỳ lúc nào.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Form Actions */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Hủy bỏ
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              startIcon={
                <Iconify
                  icon={
                    promotion
                      ? "solar:pen-bold-duotone"
                      : "solar:add-circle-bold-duotone"
                  }
                />
              }
            >
              {promotion ? "Cập nhật" : "Thêm mới"}
            </LoadingButton>
          </Box>
        </Form>
      </Box>
    </motion.div>
  );
};

export default CoachPromotionForm;
