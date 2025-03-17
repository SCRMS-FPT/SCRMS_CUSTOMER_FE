"use client"

import { useState, useEffect } from "react"
import { Save, X, Calendar, Tag, Percent, DollarSign, AlignLeft, Info, MapPin } from "lucide-react"
import { courtsData } from "../data/courtsData1"

const PromotionForm = ({ promotion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    promotionId: "",
    courtId: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    valid_from: "",
    valid_to: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState(null)

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        valid_from: formatDateForInput(promotion.valid_from),
        valid_to: formatDateForInput(promotion.valid_to),
      })

      // Find the selected court
      const court = courtsData.find((c) => c.courtId === promotion.courtId)
      setSelectedCourt(court)
    }
  }, [promotion])

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }

    // Update selected court when courtId changes
    if (name === "courtId") {
      const court = courtsData.find((c) => c.courtId === value)
      setSelectedCourt(court)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.promotionId.trim()) {
      newErrors.promotionId = "Vui lòng nhập mã khuyến mãi"
    }

    if (!formData.courtId) {
      newErrors.courtId = "Vui lòng chọn sân áp dụng"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả khuyến mãi"
    }

    if (!formData.discount_value || formData.discount_value <= 0) {
      newErrors.discount_value = "Vui lòng nhập giá trị giảm giá hợp lệ"
    }

    if (!formData.valid_from) {
      newErrors.valid_from = "Vui lòng chọn ngày bắt đầu"
    }

    if (!formData.valid_to) {
      newErrors.valid_to = "Vui lòng chọn ngày kết thúc"
    } else if (
      formData.valid_from &&
      formData.valid_to &&
      new Date(formData.valid_to) <= new Date(formData.valid_from)
    ) {
      newErrors.valid_to = "Ngày kết thúc phải sau ngày bắt đầu"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(formData)
    } catch (error) {
      console.error("Error saving promotion:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDiscountPreview = () => {
    if (!formData.discount_value) return "Chưa có giá trị"

    if (formData.discount_type === "percentage") {
      return `${formData.discount_value}%`
    } else {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(formData.discount_value)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promotionId">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-gray-500" />
                    Mã khuyến mãi
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="promotionId"
                    name="promotionId"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.promotionId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    value={formData.promotionId}
                    onChange={handleChange}
                    disabled={!!promotion}
                    placeholder="Nhập mã khuyến mãi"
                  />
                  {errors.promotionId && <p className="mt-1 text-sm text-red-600">{errors.promotionId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courtId">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    Sân áp dụng
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="courtId"
                    name="courtId"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.courtId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    value={formData.courtId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn sân --</option>
                    {courtsData.map((court) => (
                      <option key={court.courtId} value={court.courtId}>
                        {court.name} - {court.court_type}
                      </option>
                    ))}
                  </select>
                  {errors.courtId && <p className="mt-1 text-sm text-red-600">{errors.courtId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount_type">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1 text-gray-500" />
                    Loại giảm giá
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="discount_type"
                    name="discount_type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10"
                    value={formData.discount_type}
                    onChange={handleChange}
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {formData.discount_type === "percentage" ? (
                      <Percent className="h-4 w-4 text-gray-500" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount_value">
                  <div className="flex items-center">
                    {formData.discount_type === "percentage" ? (
                      <Percent className="h-4 w-4 mr-1 text-gray-500" />
                    ) : (
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    )}
                    Giá trị giảm giá
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="discount_value"
                    name="discount_value"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.discount_value
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    value={formData.discount_value}
                    onChange={handleChange}
                    placeholder={formData.discount_type === "percentage" ? "Nhập % giảm giá" : "Nhập số tiền giảm giá"}
                    min="0"
                  />
                  {errors.discount_value && <p className="mt-1 text-sm text-red-600">{errors.discount_value}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="valid_from">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      Hiệu lực từ
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="valid_from"
                      name="valid_from"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.valid_from
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      value={formData.valid_from}
                      onChange={handleChange}
                    />
                    {errors.valid_from && <p className="mt-1 text-sm text-red-600">{errors.valid_from}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="valid_to">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      Hiệu lực đến
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="valid_to"
                      name="valid_to"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.valid_to
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      value={formData.valid_to}
                      onChange={handleChange}
                    />
                    {errors.valid_to && <p className="mt-1 text-sm text-red-600">{errors.valid_to}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  <div className="flex items-center">
                    <AlignLeft className="h-4 w-4 mr-1 text-gray-500" />
                    Mô tả
                  </div>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.description
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả chi tiết về khuyến mãi"
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>

              {/* Court Preview */}
              {selectedCourt && (
                <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin sân áp dụng</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Tên sân:</span>
                      <span className="text-sm font-medium">{selectedCourt.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Loại sân:</span>
                      <span className="text-sm font-medium">{selectedCourt.court_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${selectedCourt.status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedCourt.status === "open" ? "Đang mở" : "Đã đóng"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      <p className="text-xs italic">{selectedCourt.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Promotion Preview */}
              <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Xem trước khuyến mãi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mã khuyến mãi:</span>
                    <span className="text-sm font-medium">{formData.promotionId || "Chưa có mã"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Loại giảm giá:</span>
                    <span className="text-sm font-medium">
                      {formData.discount_type === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Giá trị giảm giá:</span>
                    <span className="text-sm font-medium">{formatDiscountPreview()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Thời gian hiệu lực:</span>
                    <span className="text-sm font-medium">
                      {formData.valid_from && formData.valid_to
                        ? `${new Date(formData.valid_from).toLocaleDateString("vi-VN")} - ${new Date(formData.valid_to).toLocaleDateString("vi-VN")}`
                        : "Chưa thiết lập"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 flex items-center gap-2"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {promotion ? "Cập nhật" : "Thêm mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PromotionForm

