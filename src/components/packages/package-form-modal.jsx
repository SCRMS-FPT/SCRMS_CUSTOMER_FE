"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { coachData } from "../../data/coachData.js";
import { userData } from "../../data/userData.js";

const PackageFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    coach_id: "",
    coach_name: "",
    package_name: "",
    description: "",
    price: 0,
    session_count: 0,
    category: "",
    duration: "",
    image: "/placeholder.svg?height=200&width=300",
  })

  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Get coach full name from userData
  const getCoachFullName = (coachId) => {
    const coach = userData.find((user) => user.id === coachId)
    if (coach) {
      return `${coach.firstName} ${coach.lastName}`
    }
    return `HLV ${coachId.split("-").pop()}`
  }

  useEffect(() => {
    if (initialData) {
      // Use existing data or default values for optional fields
      const coachName = initialData.coach_name || getCoachFullName(initialData.coach_id)

      // Extract just the number from duration if it exists
      let durationValue = ""
      if (initialData.duration) {
        const match = initialData.duration.match(/(\d+)/)
        if (match) {
          durationValue = match[1]
        }
      }

      setFormData({
        ...initialData,
        coach_name: coachName,
        category: initialData.category || "",
        duration: durationValue,
        image: initialData.image || "/placeholder.svg?height=200&width=300",
      })

      setImagePreview(initialData.image)
    } else {
      // Reset form for new package
      const defaultCoachId = coachData.length > 0 ? coachData[0].id : ""
      const defaultCoachName = defaultCoachId ? getCoachFullName(defaultCoachId) : ""

      setFormData({
        id: `uuid-package-${Date.now()}`,
        coach_id: defaultCoachId,
        coach_name: defaultCoachName,
        package_name: "",
        description: "",
        price: 0,
        session_count: 0,
        category: "",
        duration: "",
        image: "/placeholder.svg?height=200&width=300",
        created_at: new Date().toISOString(),
      })

      setImagePreview(null)
    }
    setErrors({})
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Convert numeric fields
    if (name === "price" || name === "session_count") {
      processedValue = value === "" ? 0 : Number(value)
    }

    // If coach_id is changed, update coach_name
    if (name === "coach_id") {
      const coachName = getCoachFullName(value)
      setFormData({
        ...formData,
        [name]: processedValue,
        coach_name: coachName,
      })
    } else {
      setFormData({
        ...formData,
        [name]: processedValue,
      })
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({
          ...formData,
          image: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUploadClick = () => {
    fileInputRef.current.click()
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.package_name.trim()) {
      newErrors.package_name = "Tên gói đào tạo không được để trống"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống"
    }

    if (formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }

    if (formData.session_count <= 0) {
      newErrors.session_count = "Số buổi tập phải lớn hơn 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Format duration to include "phút/buổi"
      const formattedData = {
        ...formData,
        duration: formData.duration ? `${formData.duration} phút/buổi` : "",
      }

      onSubmit(formattedData)
      onClose()
    }
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-emerald-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">{initialData ? "Chỉnh sửa gói đào tạo" : "Thêm gói đào tạo mới"}</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <label className="block text-slate-700 font-medium mb-2">Hình ảnh gói đào tạo</label>
                      <div
                        className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={handleImageUploadClick}
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg mx-auto"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-white font-medium">Thay đổi ảnh</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mx-auto text-slate-400 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-slate-600">Nhấn để tải ảnh lên</p>
                            <p className="text-slate-500 text-sm mt-1">PNG, JPG, GIF</p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 space-y-4">
                      <div>
                        <label className="block text-slate-700 font-medium mb-2">
                          Tên gói đào tạo <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="package_name"
                          value={formData.package_name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.package_name ? "border-rose-500" : "border-slate-300"
                            }`}
                        />
                        {errors.package_name && <p className="text-rose-500 text-sm mt-1">{errors.package_name}</p>}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-2">Huấn luyện viên</label>
                        <select
                          name="coach_id"
                          value={formData.coach_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {userData
                            .filter((user) => user.roles === "coach")
                            .map((coach) => (
                              <option key={coach.id} value={coach.id}>
                                HLV {coach.firstName} {coach.lastName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-2">Danh mục</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Chọn danh mục</option>
                          <option value="Cơ bản">Cơ bản</option>
                          <option value="Nâng cao">Nâng cao</option>
                          <option value="Chuyên sâu">Chuyên sâu</option>
                          <option value="Giảm cân">Giảm cân</option>
                          <option value="Phục hồi">Phục hồi</option>
                          <option value="Cường độ cao">Cường độ cao</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-700 font-medium mb-2">
                    Mô tả <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? "border-rose-500" : "border-slate-300"
                      }`}
                  ></textarea>
                  {errors.description && <p className="text-rose-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-slate-700 font-medium mb-2">
                    Giá (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.price ? "border-rose-500" : "border-slate-300"
                      }`}
                  />
                  {errors.price && <p className="text-rose-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-slate-700 font-medium mb-2">
                    Số buổi tập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="session_count"
                    value={formData.session_count}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.session_count ? "border-rose-500" : "border-slate-300"
                      }`}
                  />
                  {errors.session_count && <p className="text-rose-500 text-sm mt-1">{errors.session_count}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-slate-700 font-medium mb-2">Thời lượng (phút/buổi)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="60"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      phút/buổi
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {initialData ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PackageFormModal

