"use client"

import { useState, useEffect } from "react"
import { Save, X, Calendar, Tag, Percent, DollarSign, AlignLeft, Info, User, Package } from "lucide-react"
import { coachData } from "../../data/coachData"
import { coachPackages } from "../../data/coachPackageData"
import { coachSchedulesData } from "../../data/coachSchedulesData"
import { userData } from "../../data/userData.js"

const CoachPromotionForm = ({ promotion, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: "",
        coach_id: "",
        packageId: "",
        scheduleId: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        valid_from: "",
        valid_to: "",
        created_at: new Date().toISOString(),
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCoach, setSelectedCoach] = useState(null)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [promotionType, setPromotionType] = useState("package") // "package" or "schedule"
    const [filteredPackages, setFilteredPackages] = useState([])
    const [filteredSchedules, setFilteredSchedules] = useState([])

    useEffect(() => {
        if (promotion) {
            setFormData({
                ...promotion,
                valid_from: formatDateForInput(promotion.valid_from),
                valid_to: formatDateForInput(promotion.valid_to),
            })

            // Determine promotion type
            if (promotion.packageId) {
                setPromotionType("package")
            } else if (promotion.scheduleId) {
                setPromotionType("schedule")
            }

            // Find the selected coach, package, and schedule
            const coach = coachData.find((c) => c.id === promotion.coach_id)
            setSelectedCoach(coach)

            if (promotion.packageId) {
                const pkg = coachPackages.find((p) => p.id === promotion.packageId)
                setSelectedPackage(pkg)
            }

            if (promotion.scheduleId) {
                const schedule = coachSchedulesData.find((s) => s.id === promotion.scheduleId)
                setSelectedSchedule(schedule)
            }

            // Filter packages and schedules by selected coach
            if (promotion.coach_id) {
                const packages = coachPackages.filter((p) => p.coach_id === promotion.coach_id)
                setFilteredPackages(packages)

                const schedules = coachSchedulesData.filter((s) => s.coach_id === promotion.coach_id)
                setFilteredSchedules(schedules)
            }
        } else {
            // Generate a new ID for new promotions
            setFormData((prev) => ({
                ...prev,
                id: `uuid-promotion-${Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, "0")}`,
            }))
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

        // Handle coach selection
        if (name === "coach_id") {
            const coach = coachData.find((c) => c.id === value)
            setSelectedCoach(coach)

            // Filter packages and schedules by selected coach
            if (value) {
                const packages = coachPackages.filter((p) => p.coach_id === value)
                setFilteredPackages(packages)

                const schedules = coachSchedulesData.filter((s) => s.coach_id === value)
                setFilteredSchedules(schedules)

                // Reset package and schedule selections
                setFormData((prev) => ({
                    ...prev,
                    packageId: "",
                    scheduleId: "",
                }))
                setSelectedPackage(null)
                setSelectedSchedule(null)
            } else {
                setFilteredPackages([])
                setFilteredSchedules([])
            }
        }

        // Update selected package when packageId changes
        if (name === "packageId") {
            const pkg = coachPackages.find((p) => p.id === value)
            setSelectedPackage(pkg)

            // Clear scheduleId if packageId is selected
            if (value) {
                setFormData((prev) => ({
                    ...prev,
                    scheduleId: "",
                }))
                setSelectedSchedule(null)
            }
        }

        // Update selected schedule when scheduleId changes
        if (name === "scheduleId") {
            const schedule = coachSchedulesData.find((s) => s.id === value)
            setSelectedSchedule(schedule)

            // Clear packageId if scheduleId is selected
            if (value) {
                setFormData((prev) => ({
                    ...prev,
                    packageId: "",
                }))
                setSelectedPackage(null)
            }
        }
    }

    const handlePromotionTypeChange = (type) => {
        setPromotionType(type)

        // Clear the other type's selection
        if (type === "package") {
            setFormData((prev) => ({
                ...prev,
                scheduleId: "",
            }))
            setSelectedSchedule(null)
        } else {
            setFormData((prev) => ({
                ...prev,
                packageId: "",
            }))
            setSelectedPackage(null)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.id.trim()) {
            newErrors.id = "Vui lòng nhập mã khuyến mãi"
        }

        if (!formData.coach_id) {
            newErrors.coach_id = "Vui lòng chọn huấn luyện viên"
        }

        if (promotionType === "package" && !formData.packageId) {
            newErrors.packageId = "Vui lòng chọn gói tập"
        }

        if (promotionType === "schedule" && !formData.scheduleId) {
            newErrors.scheduleId = "Vui lòng chọn lịch tập"
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

    const formatScheduleInfo = (schedule) => {
        if (!schedule) return null

        const daysOfWeek = {
            1: "Thứ 2",
            2: "Thứ 3",
            3: "Thứ 4",
            4: "Thứ 5",
            5: "Thứ 6",
            6: "Thứ 7",
            7: "Chủ nhật",
        }

        const days = schedule.day_of_week.map((d) => daysOfWeek[d]).join(", ")
        return `${days} (${schedule.start_time.substring(0, 5)} - ${schedule.end_time.substring(0, 5)})`
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
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="id">
                                    <div className="flex items-center">
                                        <Tag className="h-4 w-4 mr-1 text-gray-500" />
                                        Mã khuyến mãi
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="id"
                                        name="id"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.id
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            }`}
                                        value={formData.id}
                                        onChange={handleChange}
                                        disabled={!!promotion}
                                        placeholder="Nhập mã khuyến mãi"
                                    />
                                    {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="coach_id">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1 text-gray-500" />
                                        Huấn luyện viên
                                    </div>
                                </label>
                                <div className="relative">
                                    <select
                                        id="coach_id"
                                        name="coach_id"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.coach_id
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            }`}
                                        value={formData.coach_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Chọn huấn luyện viên --</option>
                                        {coachData.map((coach) => {
                                            const user = userData.find((u) => u.id === coach.id)
                                            const fullName = user ? `${user.lastName} ${user.firstName}` : `HLV ${coach.id.split("-").pop()}`
                                            return (
                                                <option key={coach.id} value={coach.id}>
                                                    {fullName} - {coach.rate_per_hour.toLocaleString("vi-VN")}đ/giờ
                                                </option>
                                            )
                                        })}
                                    </select>
                                    {errors.coach_id && <p className="mt-1 text-sm text-red-600">{errors.coach_id}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Info className="h-4 w-4 mr-1 text-gray-500" />
                                        Loại khuyến mãi
                                    </div>
                                </label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="type_package"
                                            name="promotion_type"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            checked={promotionType === "package"}
                                            onChange={() => handlePromotionTypeChange("package")}
                                        />
                                        <label htmlFor="type_package" className="ml-2 block text-sm text-gray-700">
                                            Khuyến mãi gói tập
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="type_schedule"
                                            name="promotion_type"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            checked={promotionType === "schedule"}
                                            onChange={() => handlePromotionTypeChange("schedule")}
                                        />
                                        <label htmlFor="type_schedule" className="ml-2 block text-sm text-gray-700">
                                            Khuyến mãi lịch tập
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {promotionType === "package" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="packageId">
                                        <div className="flex items-center">
                                            <Package className="h-4 w-4 mr-1 text-gray-500" />
                                            Gói tập
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="packageId"
                                            name="packageId"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.packageId
                                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                }`}
                                            value={formData.packageId}
                                            onChange={handleChange}
                                            disabled={!formData.coach_id || filteredPackages.length === 0}
                                        >
                                            <option value="">-- Chọn gói tập --</option>
                                            {filteredPackages.map((pkg) => (
                                                <option key={pkg.id} value={pkg.id}>
                                                    {pkg.package_name} - {pkg.session_count} buổi
                                                </option>
                                            ))}
                                        </select>
                                        {errors.packageId && <p className="mt-1 text-sm text-red-600">{errors.packageId}</p>}
                                        {!formData.coach_id && !errors.packageId && (
                                            <p className="mt-1 text-sm text-gray-500">Vui lòng chọn huấn luyện viên trước</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {promotionType === "schedule" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="scheduleId">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                            Lịch tập
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="scheduleId"
                                            name="scheduleId"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.scheduleId
                                                ? "border-red-300 focus:ring-red-500 focus:borderr-red-500"
                                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                }`}
                                            value={formData.scheduleId}
                                            onChange={handleChange}
                                            disabled={!formData.coach_id || filteredSchedules.length === 0}
                                        >
                                            <option value="">-- Chọn lịch tập --</option>
                                            {filteredSchedules.map((schedule) => (
                                                <option key={schedule.id} value={schedule.id}>
                                                    {formatScheduleInfo(schedule)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.scheduleId && <p className="mt-1 text-sm text-red-600">{errors.scheduleId}</p>}
                                        {!formData.coach_id && !errors.scheduleId && (
                                            <p className="mt-1 text-sm text-gray-500">Vui lòng chọn huấn luyện viên trước</p>
                                        )}
                                    </div>
                                </div>
                            )}

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

                            {/* Coach Preview */}
                            {selectedCoach && (
                                <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin huấn luyện viên</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Tên HLV:</span>
                                            <span className="text-sm font-medium">
                                                {(() => {
                                                    const user = userData.find((u) => u.id === selectedCoach.id)
                                                    return user
                                                        ? `${user.lastName} ${user.firstName}`
                                                        : `HLV ${selectedCoach.id.split("-").pop()}`
                                                })()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Giá/giờ:</span>
                                            <span className="text-sm font-medium">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                    selectedCoach.rate_per_hour,
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-2">
                                            <p className="text-xs italic">{selectedCoach.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Package Preview */}
                            {selectedPackage && (
                                <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin gói tập</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Tên gói:</span>
                                            <span className="text-sm font-medium">{selectedPackage.package_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Số buổi tập:</span>
                                            <span className="text-sm font-medium">{selectedPackage.session_count} buổi</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Giá gói tập:</span>
                                            <span className="text-sm font-medium">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                    selectedPackage.price,
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-2">
                                            <p className="text-xs italic">{selectedPackage.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Preview */}
                            {selectedSchedule && (
                                <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Thông tin lịch tập</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Mã lịch:</span>
                                            <span className="text-sm font-medium">{selectedSchedule.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Lịch tập:</span>
                                            <span className="text-sm font-medium">{formatScheduleInfo(selectedSchedule)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Trạng thái:</span>
                                            <span
                                                className={`text-sm font-medium px-2 py-1 rounded-full ${selectedSchedule.status === "available"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {selectedSchedule.status === "available" ? "Còn trống" : "Đã đặt"}
                                            </span>
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
                                        <span className="text-sm font-medium">{formData.id || "Chưa có mã"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Loại khuyến mãi:</span>
                                        <span className="text-sm font-medium">
                                            {promotionType === "package" ? "Khuyến mãi gói tập" : "Khuyến mãi lịch tập"}
                                        </span>
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

export default CoachPromotionForm

