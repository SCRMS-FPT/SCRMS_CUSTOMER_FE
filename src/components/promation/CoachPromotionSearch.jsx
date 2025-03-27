"use client"

import { useState } from "react"
import { Search, Filter, X, User, Package, Calendar } from "lucide-react"
import { coachData } from "../../data/coachData"
import { coachPackages } from "../../data/coachPackageData"
import { coachSchedulesData } from "../../data/coachSchedulesData"
import { userData } from "../../data/userData.js"

const CoachPromotionSearch = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchType, setSearchType] = useState("all")
    const [activeFilters, setActiveFilters] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCoach, setSelectedCoach] = useState("")
    const [selectedPackage, setSelectedPackage] = useState("")
    const [selectedSchedule, setSelectedSchedule] = useState("")
    const [filteredPackages, setFilteredPackages] = useState(coachPackages)
    const [filteredSchedules, setFilteredSchedules] = useState(coachSchedulesData)

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(searchTerm, searchType)
    }

    const addFilter = (type, value, label) => {
        const newFilter = { type, value, label }
        const updatedFilters = [...activeFilters, newFilter]
        setActiveFilters(updatedFilters)
        if (onFilter) onFilter(updatedFilters)
        setShowFilters(false)
    }

    const removeFilter = (index) => {
        const updatedFilters = activeFilters.filter((_, i) => i !== index)
        setActiveFilters(updatedFilters)
        if (onFilter) onFilter(updatedFilters)
    }

    const clearAllFilters = () => {
        setActiveFilters([])
        if (onFilter) onFilter([])
    }

    const handleCoachFilter = () => {
        if (selectedCoach) {
            const coach = coachData.find((c) => c.id === selectedCoach)
            if (coach) {
                const user = userData.find((u) => u.id === coach.id)
                const fullName = user ? `${user.lastName} ${user.firstName}` : `HLV ${coach.id.split("-").pop()}`
                addFilter("coach_id", selectedCoach, `HLV: ${fullName}`)
                setSelectedCoach("")

                // Filter packages and schedules by selected coach
                const packages = coachPackages.filter((p) => p.coach_id === selectedCoach)
                setFilteredPackages(packages)

                const schedules = coachSchedulesData.filter((s) => s.coach_id === selectedCoach)
                setFilteredSchedules(schedules)
            }
        }
    }

    const handlePackageFilter = () => {
        if (selectedPackage) {
            const pkg = coachPackages.find((p) => p.id === selectedPackage)
            if (pkg) {
                addFilter("packageId", selectedPackage, `Gói tập: ${pkg.package_name}`)
                setSelectedPackage("")
            }
        }
    }

    const handleScheduleFilter = () => {
        if (selectedSchedule) {
            const schedule = coachSchedulesData.find((s) => s.id === selectedSchedule)
            if (schedule) {
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
                const timeInfo = `${schedule.start_time.substring(0, 5)} - ${schedule.end_time.substring(0, 5)}`

                addFilter("scheduleId", selectedSchedule, `Lịch: ${days} (${timeInfo})`)
                setSelectedSchedule("")
            }
        }
    }

    const handleCoachChange = (e) => {
        const coachId = e.target.value
        setSelectedCoach(coachId)

        if (coachId) {
            // Filter packages by selected coach
            const packages = coachPackages.filter((p) => p.coach_id === coachId)
            setFilteredPackages(packages)

            // Filter schedules by selected coach
            const schedules = coachSchedulesData.filter((s) => s.coach_id === coachId)
            setFilteredSchedules(schedules)

            // Reset package and schedule selections
            setSelectedPackage("")
            setSelectedSchedule("")
        } else {
            setFilteredPackages(coachPackages)
            setFilteredSchedules(coachSchedulesData)
        }
    }

    const formatScheduleOption = (schedule) => {
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
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm khuyến mãi..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:w-48">
                    <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="id">Mã khuyến mãi</option>
                        <option value="description">Mô tả</option>
                        <option value="discount_type">Loại giảm giá</option>
                        <option value="coach_id">Huấn luyện viên</option>
                        <option value="packageId">Gói tập</option>
                        <option value="scheduleId">Lịch tập</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                    >
                        <Search className="h-4 w-4" />
                        <span>Tìm kiếm</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center"
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </form>

            {/* Active filters */}
            {activeFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
                    {activeFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                            <span>{filter.label}</span>
                            <button onClick={() => removeFilter(index)} className="ml-1 rounded-full hover:bg-blue-100 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <button onClick={clearAllFilters} className="text-sm text-red-600 hover:text-red-800 ml-2">
                        Xóa tất cả
                    </button>
                </div>
            )}

            {/* Filter panel */}
            {showFilters && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-3">Lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Trạng thái</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => addFilter("status", "active", "Đang hoạt động")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Đang hoạt động
                                </button>
                                <button
                                    onClick={() => addFilter("status", "expired", "Đã hết hạn")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Đã hết hạn
                                </button>
                                <button
                                    onClick={() => addFilter("status", "upcoming", "Sắp diễn ra")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Sắp diễn ra
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Loại khuyến mãi</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => addFilter("promotion_type", "package", "Khuyến mãi gói tập")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Khuyến mãi gói tập
                                </button>
                                <button
                                    onClick={() => addFilter("promotion_type", "schedule", "Khuyến mãi lịch tập")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Khuyến mãi lịch tập
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Loại giảm giá</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => addFilter("discount_type", "percentage", "Giảm theo %")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Giảm theo %
                                </button>
                                <button
                                    onClick={() => addFilter("discount_type", "fixed", "Giảm số tiền cố định")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Giảm số tiền cố định
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Coach filter */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Lọc theo huấn luyện viên</h4>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedCoach}
                                    onChange={handleCoachChange}
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
                            </div>
                            <button
                                type="button"
                                onClick={handleCoachFilter}
                                disabled={!selectedCoach}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>

                    {/* Package filter */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Lọc theo gói tập</h4>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedPackage}
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                    disabled={filteredPackages.length === 0}
                                >
                                    <option value="">-- Chọn gói tập --</option>
                                    {filteredPackages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.package_name} - {pkg.session_count} buổi
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handlePackageFilter}
                                disabled={!selectedPackage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Thêm
                            </button>
                        </div>
                        {filteredPackages.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Vui lòng chọn huấn luyện viên trước</p>
                        )}
                    </div>

                    {/* Schedule filter */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Lọc theo lịch tập</h4>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedSchedule}
                                    onChange={(e) => setSelectedSchedule(e.target.value)}
                                    disabled={filteredSchedules.length === 0}
                                >
                                    <option value="">-- Chọn lịch tập --</option>
                                    {filteredSchedules.map((schedule) => (
                                        <option key={schedule.id} value={schedule.id}>
                                            {formatScheduleOption(schedule)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleScheduleFilter}
                                disabled={!selectedSchedule}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Thêm
                            </button>
                        </div>
                        {filteredSchedules.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Vui lòng chọn huấn luyện viên trước</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CoachPromotionSearch

