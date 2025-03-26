"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { PlusCircle, Tag, Percent, Calendar, BarChart3, RefreshCw, User, Package } from "lucide-react"
import CoachPromotionSearch from "../components/promation/CoachPromotionSearch"
import CoachPromotionTable from "../components/promation/CoachPromotionTable"
import CoachPromotionForm from "../components/promation/CoachPromotionForm"
import { coachPromotionsData } from "../data/coachPromotionsData"
import { coachData } from "../data/coachData"
import { coachPackages } from "../data/coachPackageData"
import { coachSchedulesData } from "../data/coachSchedulesData"

const CoachPromotionManagementPage = () => {
    const { coachId, packageId, scheduleId } = useParams()
    const [promotions, setPromotions] = useState([])
    const [filteredPromotions, setFilteredPromotions] = useState([])
    const [selectedPromotion, setSelectedPromotion] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [paginatedPromotions, setPaginatedPromotions] = useState([])
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        // Simulate API fetch
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 800))

                let filtered = [...coachPromotionsData]

                // Filter by coachId if provided
                if (coachId) {
                    filtered = filtered.filter((promotion) => promotion.coach_id === coachId)
                }

                // Filter by packageId if provided
                if (packageId) {
                    filtered = filtered.filter((promotion) => promotion.packageId === packageId)
                }

                // Filter by scheduleId if provided
                if (scheduleId) {
                    filtered = filtered.filter((promotion) => promotion.scheduleId === scheduleId)
                }

                setPromotions(coachPromotionsData)
                setFilteredPromotions(filtered)
            } catch (error) {
                console.error("Error fetching promotions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [coachId, packageId, scheduleId])

    useEffect(() => {
        // Calculate total pages
        const total = Math.ceil(filteredPromotions.length / itemsPerPage)
        setTotalPages(total || 1)

        // Adjust current page if needed
        if (currentPage > total && total > 0) {
            setCurrentPage(total)
        }

        // Get paginated data
        const startIndex = (currentPage - 1) * itemsPerPage
        const paginatedData = filteredPromotions.slice(startIndex, startIndex + itemsPerPage)
        setPaginatedPromotions(paginatedData)
    }, [filteredPromotions, currentPage, itemsPerPage])

    const handleSearch = (searchTerm, searchType) => {
        if (!searchTerm.trim()) {
            setFilteredPromotions(promotions)
            return
        }

        const filtered = promotions.filter((promotion) => {
            if (searchType === "all") {
                return Object.values(promotion).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
            } else if (searchType === "coach_id") {
                // Search by coach name
                const coach = coachData.find((c) => c.id === promotion.coach_id)
                return coach && coach.bio.toLowerCase().includes(searchTerm.toLowerCase())
            } else if (searchType === "packageId") {
                // Search by package name
                const pkg = coachPackages.find((p) => p.id === promotion.packageId)
                return pkg && pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase())
            } else if (searchType === "scheduleId") {
                // Search by schedule
                const schedule = coachSchedulesData.find((s) => s.id === promotion.scheduleId)
                return schedule && schedule.id.toLowerCase().includes(searchTerm.toLowerCase())
            } else {
                return String(promotion[searchType]).toLowerCase().includes(searchTerm.toLowerCase())
            }
        })

        setFilteredPromotions(filtered)
        setCurrentPage(1) // Reset to first page on new search
    }

    const handleFilter = (filters) => {
        if (!filters || filters.length === 0) {
            setFilteredPromotions(promotions)
            return
        }

        const filtered = promotions.filter((promotion) => {
            return filters.every((filter) => {
                if (filter.type === "status") {
                    const now = new Date()
                    const startDate = new Date(promotion.valid_from)
                    const endDate = new Date(promotion.valid_to)

                    if (filter.value === "active") {
                        return now >= startDate && now <= endDate
                    } else if (filter.value === "expired") {
                        return now > endDate
                    } else if (filter.value === "upcoming") {
                        return now < startDate
                    }
                }

                if (filter.type === "discount_type") {
                    return promotion.discount_type === filter.value
                }

                if (filter.type === "coach_id") {
                    return promotion.coach_id === filter.value
                }

                if (filter.type === "packageId") {
                    return promotion.packageId === filter.value
                }

                if (filter.type === "scheduleId") {
                    return promotion.scheduleId === filter.value
                }

                if (filter.type === "promotion_type") {
                    if (filter.value === "package") {
                        return promotion.packageId !== undefined
                    } else if (filter.value === "schedule") {
                        return promotion.scheduleId !== undefined
                    }
                }

                if (filter.type === "discount_value") {
                    if (promotion.discount_type === "percentage") {
                        if (filter.value === "low") {
                            return promotion.discount_value < 10
                        } else if (filter.value === "medium") {
                            return promotion.discount_value >= 10 && promotion.discount_value <= 20
                        } else if (filter.value === "high") {
                            return promotion.discount_value > 20
                        }
                    }
                }

                return true
            })
        })

        setFilteredPromotions(filtered)
        setCurrentPage(1) // Reset to first page on new filter
    }

    const handleEdit = (promotion) => {
        setSelectedPromotion(promotion)
        setShowForm(true)
    }

    const handleDelete = (promotionId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            const updatedPromotions = promotions.filter((p) => p.id !== promotionId)
            setPromotions(updatedPromotions)
            setFilteredPromotions(updatedPromotions)
        }
    }

    const handleSave = (formData) => {
        if (selectedPromotion) {
            // Update existing promotion
            const updatedPromotions = promotions.map((p) => (p.id === formData.id ? formData : p))
            setPromotions(updatedPromotions)
            setFilteredPromotions(updatedPromotions)
        } else {
            // Add new promotion
            const newPromotions = [...promotions, formData]
            setPromotions(newPromotions)
            setFilteredPromotions(newPromotions)
        }

        setShowForm(false)
        setSelectedPromotion(null)
    }

    const handleCancel = () => {
        setShowForm(false)
        setSelectedPromotion(null)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 800))
            // In a real app, you would re-fetch data from the API
            setPromotions(coachPromotionsData)
            setFilteredPromotions(coachPromotionsData)
            setCurrentPage(1)
        } catch (error) {
            console.error("Error refreshing data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate stats
    const getStats = () => {
        const now = new Date()

        const active = promotions.filter((p) => {
            const startDate = new Date(p.valid_from)
            const endDate = new Date(p.valid_to)
            return now >= startDate && now <= endDate
        }).length

        const expired = promotions.filter((p) => {
            const endDate = new Date(p.valid_to)
            return now > endDate
        }).length

        const upcoming = promotions.filter((p) => {
            const startDate = new Date(p.valid_from)
            return now < startDate
        }).length

        // Count unique coaches with promotions
        const uniqueCoaches = new Set(promotions.map((p) => p.coach_id)).size

        // Count package promotions
        const packagePromotions = promotions.filter((p) => p.packageId).length

        // Count schedule promotions
        const schedulePromotions = promotions.filter((p) => p.scheduleId).length

        return {
            active,
            expired,
            upcoming,
            total: promotions.length,
            uniqueCoaches,
            packagePromotions,
            schedulePromotions,
        }
    }

    // Tính toán thông tin phân trang
    const getPaginationInfo = () => {
        const totalItems = filteredPromotions.length
        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
        const endItem = Math.min(startItem + itemsPerPage - 1, totalItems)

        return {
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            startItem,
            endItem,
        }
    }

    const stats = getStats()
    const paginationInfo = getPaginationInfo()

    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Khuyến Mãi Cho HLV</h1>
                    <p className="text-gray-500 mt-1">Qu��n lý tất cả các chương trình khuyến mãi của huấn luyện viên</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-1"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">Làm mới</span>
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Thêm khuyến mãi</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tổng khuyến mãi</p>
                        <p className="text-2xl font-semibold">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <Percent className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Đang hoạt động</p>
                        <p className="text-2xl font-semibold">{stats.active}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sắp diễn ra</p>
                        <p className="text-2xl font-semibold">{stats.upcoming}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                        <BarChart3 className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Đã hết hạn</p>
                        <p className="text-2xl font-semibold">{stats.expired}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                        <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">HLV có KM</p>
                        <p className="text-2xl font-semibold">{stats.uniqueCoaches}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-purple-100 p-3 mr-4">
                        <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">KM gói tập</p>
                        <p className="text-2xl font-semibold">{stats.packagePromotions}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <div className="rounded-full bg-pink-100 p-3 mr-4">
                        <Calendar className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">KM lịch tập</p>
                        <p className="text-2xl font-semibold">{stats.schedulePromotions}</p>
                    </div>
                </div>
            </div>

            {showForm ? (
                <CoachPromotionForm promotion={selectedPromotion} onSave={handleSave} onCancel={handleCancel} />
            ) : (
                <>
                    <CoachPromotionSearch onSearch={handleSearch} onFilter={handleFilter} />

                    {isLoading ? (
                        <div className="bg-white rounded-lg shadow-md p-8 flex justify-center items-center">
                            <div className="flex flex-col items-center">
                                <svg
                                    className="animate-spin h-10 w-10 text-blue-600 mb-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    ) : (
                        <CoachPromotionTable
                            promotions={paginatedPromotions}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            pagination={paginationInfo}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default CoachPromotionManagementPage

